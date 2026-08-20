import CompactSelect from "@/components/compact/CompactSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Edge, Node, NodeProps } from "@xyflow/react";
import {
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import {
  CheckCircle2Icon,
  FileCheck,
  Loader2,
  LoaderIcon,
  Zap,
} from "lucide-react";
import {
  EDGE_TYPE,
  NODE_STATUS,
  NODE_TYPE,
  OUTPUT_TYPE,
} from "../../constants/workflow";
import DashedCircleHandle from "../handle/DashedCircleHandle";

import { memo, useCallback, useEffect } from "react";
import type {
  InputFileNodeData,
  ModifFileNodeData,
  OutputFileItem,
  OutputFileNodeData,
  OutputType,
} from "../../types/workflow";

export type OutputFileNodeProps = Node<OutputFileNodeData, "loadNode">;

const outputFormatOptions = [
  { value: OUTPUT_TYPE.JSON, label: "JSON Data Payload (.json)" },
  { value: OUTPUT_TYPE.CSV, label: "Processed CSV (.csv)" },
];

const OutputFileNode = memo(
  ({ id, data, selected }: NodeProps<OutputFileNodeProps>) => {
    const { updateNodeData } = useReactFlow<OutputFileNodeProps, Edge>();

    const targetConnections = useNodeConnections({ id, handleType: "target" });
    const sourceIds = targetConnections.map((c) => c.source);
    const nodesData = useNodesData(sourceIds);

    const nodeStatus = data.status || NODE_STATUS.IDLE;
    const statusIdle = nodeStatus === NODE_STATUS.IDLE;
    const statusQueued = nodeStatus === NODE_STATUS.QUEUED;
    const statusRunning = nodeStatus === NODE_STATUS.RUNNING;
    const statusCompleted = nodeStatus === NODE_STATUS.COMPLETED;

    const currentFormat: OutputType =
      data.value?.outputType || OUTPUT_TYPE.JSON;
    const hasResult = Boolean(data.results && data.results.length > 0);

    const updateFormat = (newType: OutputType) => {
      updateNodeData(id, (node) => ({
        value: {
          ...node.data.value,
          outputType: newType,
        },
        status: NODE_STATUS.IDLE,
      }));
    };

    const handleDownloadSingle = (file: OutputFileItem) => {
      const content = file.resultContent;
      const downloadUrl = file.downloadUrl;
      const fileName = file.fileName;

      if (downloadUrl) {
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (content) {
        const mimeType =
          currentFormat === OUTPUT_TYPE.CSV ? "text/csv" : "application/json";
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };

    const handleDownloadAll = () => {
      const results = data.results || [];
      results.forEach((file, index) => {
        setTimeout(() => {
          handleDownloadSingle(file);
        }, index * 250);
      });
    };

    const getSourceValue = useCallback(() => {
      const inputNodes = nodesData.filter(
        (nd) => nd?.type === NODE_TYPE.EXTRACT
      );
      const modifNodes = nodesData.filter(
        (nd) => nd?.type === NODE_TYPE.TRANSFORM
      );

      const inputNodesData = inputNodes
        .map((nd) => (nd?.data as InputFileNodeData) ?? null)
        .filter(Boolean);
      const modifNodesData = modifNodes
        .map((nd) => (nd?.data as ModifFileNodeData) ?? null)
        .filter(Boolean);

      return { inputNodes, modifNodes, inputNodesData, modifNodesData };
    }, [nodesData]);

    useEffect(() => {
      const { inputNodes, modifNodes } = getSourceValue();

      const hasConnectedNodes = nodesData.length > 0;
      const isAllInputsValid = inputNodes.every((nd) => {
        return Boolean((nd?.data as InputFileNodeData)?.isValid);
      });
      const isAllModifsValid = modifNodes.every((nd) => {
        return Boolean((nd?.data as ModifFileNodeData)?.isValid);
      });

      updateNodeData(id, {
        isValid: hasConnectedNodes && isAllInputsValid && isAllModifsValid,
      });
    }, [id, nodesData, updateNodeData, getSourceValue]);

    return (
      <div
        className={cn(
          "bg-card border-border hover:border-primary/60 focus:border-primary max-w-80 min-w-72 rounded-2xl border p-4.5 shadow-md transition-all",
          !!selected && "border-primary! ring-primary/20 shadow-lg ring-2",
          statusQueued && "border-amber-500/50 bg-amber-500/5",
          statusRunning &&
            "border-rose-500 shadow-[0_0_25px_rgba(16,185,129,0.5)] ring-4 ring-rose-500",
          statusCompleted &&
            "border-rose-500/80 bg-rose-500/5 dark:bg-rose-950/10"
        )}
      >
        <DashedCircleHandle
          type="target"
          position={Position.Left}
          style={{ top: "30%" }}
          id={EDGE_TYPE.INPUT}
          accepts={[EDGE_TYPE.INPUT]}
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />
        <DashedCircleHandle
          type="target"
          position={Position.Left}
          style={{ top: "70%" }}
          id={EDGE_TYPE.MODIF}
          accepts={[EDGE_TYPE.MODIF]}
          fillClassName="fill-purple-500 group-hover:fill-purple-400"
        />

        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <FileCheck className="size-4 text-rose-500" />
            <span className="text-foreground text-xs font-bold tracking-tight">
              {data.title || "Output File Node"}
            </span>
          </div>
          {statusIdle && (
            <Badge
              variant="outline"
              className="border-rose-500/40 bg-rose-500/10 font-mono text-[9px] text-rose-400 uppercase"
            >
              .{currentFormat}
            </Badge>
          )}
          {statusQueued && (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 font-mono text-[9px] text-amber-400"
            >
              Queued
            </Badge>
          )}
          {statusRunning && (
            <Badge
              variant="outline"
              className="animate-pulse border-rose-500/40 bg-rose-500/10 font-mono text-[9px] text-rose-400"
            >
              <LoaderIcon className="size-3 animate-spin" />
              Loading
            </Badge>
          )}
          {statusCompleted && (
            <Badge
              variant="outline"
              className="border-rose-500/40 bg-rose-500/10 font-mono text-[9px] text-rose-400"
            >
              Ready
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground mb-3! text-left text-[10px] leading-relaxed">
          {data.description || "Select format for generated file."}
        </p>

        {(statusRunning || statusQueued) && (
          <div className="mb-3 space-y-1 text-left">
            <div className="flex justify-between font-mono text-[15px] font-semibold text-rose-400">
              <span>
                {statusRunning ? "Generating Output..." : NODE_STATUS.QUEUED}
              </span>
              <span>{data.progress || 0}%</span>
            </div>
            <div className="h-3.5 w-full overflow-hidden rounded-full border border-rose-500/20 bg-rose-950/40">
              <div
                className="h-full bg-linear-to-r from-rose-500 to-pink-400 transition-all duration-200 ease-out"
                style={{ width: `${data.progress || 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="nodrag mb-3 space-y-1.5 text-left">
          <label className="text-muted-foreground block text-[10px] font-semibold">
            Target Output Extension:
          </label>
          <CompactSelect
            fullWidth
            clearable={false}
            placeholder="Select Output Format"
            value={currentFormat}
            items={outputFormatOptions}
            disabled={statusRunning || statusQueued}
            onValueChange={(val) =>
              updateFormat((val as OutputType) || OUTPUT_TYPE.JSON)
            }
          />
        </div>

        <div className="bg-muted/40 border-border/50 mb-3 flex items-center justify-between rounded-xl border p-2 text-[10px]">
          <span className="text-muted-foreground font-medium">
            Task Status:
          </span>
          {statusRunning && (
            <span className="flex animate-pulse items-center gap-1 font-bold text-amber-500">
              <LoaderIcon className="size-3 animate-spin" />
              Converting...
            </span>
          )}
          {statusCompleted && (
            <span className="flex items-center gap-1 font-bold text-emerald-500">
              <CheckCircle2Icon className="size-3" />
              Converted
            </span>
          )}
          {statusIdle && (
            <span className="text-muted-foreground font-mono">
              Ready to Run
            </span>
          )}
        </div>

        <div className="nodrag">
          {data.results && data.results.length > 1 && statusCompleted ? (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center justify-between text-[11px] font-semibold">
                <span>Separated Files ({data.results.length})</span>
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="h-5 cursor-pointer rounded border border-rose-500/30 px-2 font-mono text-[9px] text-rose-400 transition-colors hover:bg-rose-500/10"
                >
                  Download All 📥
                </button>
              </div>
              <div className="max-h-36 space-y-1.5 overflow-y-auto pr-0.5">
                {data.results.map((file, idx) => (
                  <Button
                    key={idx}
                    fullWidth
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadSingle(file)}
                    className="text-foreground h-auto w-full min-w-0 cursor-pointer items-center justify-between overflow-hidden border-rose-500/30 bg-rose-500/5 font-mono text-[11px] font-medium transition-all hover:bg-rose-500/15"
                    endIcon={
                      <Badge
                        variant="secondary"
                        className="ml-1.5 shrink-0 bg-rose-500/20 font-mono text-[9px] text-rose-900 dark:text-rose-200"
                      >
                        {file.rowCount} rows 📥
                      </Badge>
                    }
                  >
                    <span
                      className="min-w-0 flex-1 truncate text-left"
                      title={file.fileName}
                    >
                      {file.fileName}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <Button
              fullWidth
              size="sm"
              disabled={!hasResult || !statusCompleted}
              className="cursor-pointer bg-linear-to-r from-blue-600 to-rose-600 font-bold text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleDownloadAll}
            >
              {statusRunning ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" />
                  Trigger.dev Running...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3.5 fill-current" />
                  Convert to .{currentFormat.toUpperCase()}
                </span>
              )}
            </Button>
          )}
        </div>

        <div className="mt-2 -mb-2 text-[10px] font-bold text-gray-500">
          {id}
        </div>
      </div>
    );
  }
);

export default OutputFileNode;

