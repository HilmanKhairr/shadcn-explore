import CompactSelect from "@/components/compact/CompactSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/files";
import { cn } from "@/lib/utils";
import usePipelineStore from "@/pages/reactflow-showcase/graph-traversal/hooks/usePipelineStore";
import type {
  OutputFileNodeData,
  OutputFormat,
  PipelineConfig,
} from "@/pages/reactflow-showcase/graph-traversal/types/pipeline";
import type { Node, NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { CheckCircle2, FileCheck, Loader2, Zap } from "lucide-react";
import { EDGE_TYPES } from "../../constants/pipeline";
import DashedCircleHandle from "../handle/DashedCircleHadle";

import { ALLOWED_FILE_TYPES } from "@/constants/files";
import {
  convertRowsToCsv,
  processInputData,
  type TransformOptions,
} from "@/triggers/csvConverter";
import { memo, useState } from "react";

export type OutputFileNodeProps = Node<OutputFileNodeData, "outputNode">;

type Results = {
  fileName: string;
  rows: Record<string, unknown>[];
};

const outputFormatOptions = [
  { value: "json", label: "JSON Data Payload (.json)" },
  { value: "csv", label: "Processed CSV (.csv)" },
];

const OutputFileNode = memo(
  ({ id, data, selected }: NodeProps<OutputFileNodeProps>) => {
    const mergeOutput = data?.mergeOutput ?? false;

    const [isRunningTrigger, setIsRunningTrigger] = useState(false);

    const updateNodeData = usePipelineStore((s) => s.updateNodeData);
    const getNodePayload = usePipelineStore((s) => s.getNodePayload);
    const isValidPipeline = usePipelineStore(
      (s) => s.getNodePayload(id).isValid
    );

    const currentFormat: OutputFormat = data.outputFormat || "json";
    const status = isRunningTrigger ? "running" : data.status || "idle";

    const updateFormat = (nextFormat: OutputFormat) => {
      updateNodeData(id, {
        outputFormat: nextFormat,
        filename: `converted_result.${nextFormat}`,
      });
    };

    const handleUpdate = (field: string, val: unknown) => {
      updateNodeData(id, {
        [field]: val,
      });
    };

    const handleTriggerDevRun = async () => {
      setIsRunningTrigger(true);

      try {
        const payload = getNodePayload(id);
        console.log("payload", payload);

        let allResults: Results[] = await Promise.all(
          payload?.data.map(async (item) => {
            let content = "";
            const fileName = item.fileData?.fileName || "";
            const fileType = item.fileData?.fileType || "";
            const configData: PipelineConfig | undefined = item.configData;

            const isJsonInput =
              fileName.toLowerCase().endsWith(".json") ||
              fileType.includes("json");

            const transformOptions: TransformOptions = {
              filterColumn: configData?.filterColumn as string | undefined,
              filterOperation: configData?.filterOperation as
                | string
                | undefined,
              filterValue: configData?.filterValue as string | undefined,
              limitRows: configData?.limitRows
                ? Number(configData?.limitRows)
                : undefined,
              removeEmptyRows: configData?.removeEmptyRows as
                | boolean
                | undefined,
              trimWhitespace: configData?.trimWhitespace as boolean | undefined,
              sortColumn: configData?.sortColumn as string | undefined,
              sortDirection: configData?.sortDirection as string | undefined,
            };

            if (item.fileData?.file instanceof File) {
              content = await item.fileData.file.text();
            }

            const rows = processInputData(content, {
              ...transformOptions,
              isJsonInput,
            });

            return {
              fileName,
              rows,
            };
          })
        );

        const fileNameResults =
          data.filename || `converted_export.${currentFormat}`;

        if (mergeOutput) {
          let mergeResults: Results = {
            fileName: fileNameResults,
            rows: [],
          };
          if (allResults.length) {
            mergeResults = {
              ...mergeResults,
              rows: allResults.flatMap((res) =>
                res.fileName
                  ? res.rows.map((row) => ({
                      _sourceFile: res.fileName,
                      ...row,
                    }))
                  : res.rows
              ),
            };
          }

          allResults = [mergeResults];
        }

        allResults.forEach((ar) => {
          let tempContent;
          let tempMimeType;
          let tempFileName = fileNameResults;

          if (currentFormat === "csv") {
            tempContent = convertRowsToCsv(ar.rows);
            tempMimeType = ALLOWED_FILE_TYPES.CSV;
          } else {
            tempContent = JSON.stringify(ar.rows, null, 2);
            tempMimeType = ALLOWED_FILE_TYPES.JSON;
          }

          if (currentFormat === "csv" && ar.fileName.endsWith(".json")) {
            tempFileName = ar.fileName.replace(/\.json$/i, ".csv");
          } else if (currentFormat === "json" && ar.fileName.endsWith(".csv")) {
            tempFileName = ar.fileName.replace(/\.csv$/i, ".json");
          }

          downloadFile(tempContent, tempFileName, tempMimeType);
          updateNodeData(id, { status: "completed" });
        });
      } catch (error) {
        console.error("Error executing Trigger.dev run:", error);
        updateNodeData(id, { status: "error" });
      } finally {
        setIsRunningTrigger(false);
      }
    };

    return (
      <div
        className={cn(
          "bg-card border-border hover:border-primary/60 focus:border-primary max-w-80 min-w-72 rounded-2xl border p-4.5 shadow-md transition-all",
          !!selected && "border-primary! ring-primary/20 shadow-lg ring-2"
        )}
      >
        <DashedCircleHandle
          type="target"
          position={Position.Left}
          style={{ top: "30%" }}
          id={EDGE_TYPES.INPUT}
          accepts={[EDGE_TYPES.INPUT]}
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />
        <DashedCircleHandle
          type="target"
          position={Position.Left}
          style={{ top: "70%" }}
          id={EDGE_TYPES.MODIF}
          accepts={[EDGE_TYPES.MODIF]}
          fillClassName="fill-purple-500 group-hover:fill-purple-400"
        />

        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <FileCheck className="size-4 text-rose-500" />
            <span className="text-foreground text-xs font-bold tracking-tight">
              {data.title || "Output File Node"}
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-rose-500/40 bg-rose-500/10 font-mono text-[9px] text-rose-400 uppercase"
          >
            .{currentFormat}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-3! text-left text-[10px] leading-relaxed">
          {data.description || "Select format for generated file."}
        </p>

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
            onValueChange={(val) =>
              updateFormat((val as OutputFormat) || "json")
            }
          />
        </div>

        <div className="border-border/50 space-y-1.5 border-t py-2 text-[10px]">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-muted-foreground">Merge Output</span>
            <input
              type="checkbox"
              checked={mergeOutput}
              onChange={(e) => handleUpdate("mergeOutput", e.target.checked)}
              className="rounded accent-purple-500"
            />
          </label>
        </div>

        <div className="bg-muted/40 border-border/50 mb-3 flex items-center justify-between rounded-xl border p-2 text-[10px]">
          <span className="text-muted-foreground font-medium">
            Task Status:
          </span>
          {status === "running" && (
            <span className="flex animate-pulse items-center gap-1 font-bold text-amber-500">
              <Loader2 className="size-3 animate-spin" />
              Converting...
            </span>
          )}
          {status === "completed" && (
            <span className="flex items-center gap-1 font-bold text-emerald-500">
              <CheckCircle2 className="size-3" />
              Converted & Downloaded
            </span>
          )}
          {status === "idle" && (
            <span className="text-muted-foreground font-mono">
              Ready to Run
            </span>
          )}
        </div>

        <div className="nodrag">
          <Button
            fullWidth
            size="sm"
            disabled={status === "running" || !isValidPipeline}
            className="bg-linear-to-r from-blue-600 to-rose-600 font-bold text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleTriggerDevRun}
          >
            {status === "running" ? (
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
        </div>
      </div>
    );
  }
);

export default OutputFileNode;
