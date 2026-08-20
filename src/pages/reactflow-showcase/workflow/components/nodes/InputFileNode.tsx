import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getFileName, getFileSize, getTypesFromExtensions } from "@/lib/files";
import { cn, formatBytes } from "@/lib/utils";
import type { Node, NodeProps } from "@xyflow/react";
import { Position, useReactFlow } from "@xyflow/react";
import {
  FileCode,
  FileIcon,
  FileSpreadsheet,
  FileText,
  LoaderIcon,
  Upload,
  XIcon,
} from "lucide-react";
import { memo, useRef } from "react";
import { EDGE_TYPE, NODE_STATUS } from "../../constants/workflow";
import { type InputFileNodeData } from "../../types/workflow";
import DashedCircleHandle from "../handle/DashedCircleHandle";

export type InputFileNodeProps = Node<InputFileNodeData, "extractNode">;

const InputFileNode = memo(
  ({ id, data, selected }: NodeProps<InputFileNodeProps>) => {
    const isValid = data.isValid || false;
    const acceptType = data.accept || "";
    const buttonProps = data.buttonProps || {};
    const nodeValue = data.value;
    const nodeStatus = data.status || NODE_STATUS.IDLE;

    const statusIdle = nodeStatus === NODE_STATUS.IDLE;
    const statusQueued = nodeStatus === NODE_STATUS.QUEUED;
    const statusRunning = nodeStatus === NODE_STATUS.RUNNING;
    const statusCompleted = nodeStatus === NODE_STATUS.COMPLETED;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { updateNodeData } = useReactFlow<InputFileNodeProps>();
    const { files, addFiles, removeFile } = useFileUpload({ mode: "deferred" });

    const activeFile = files[0];

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      const addedFiles = await addFiles(selectedFiles, {
        maxSize: data.maxSize,
        allowedTypes: getTypesFromExtensions(acceptType),
        onValidationError: (errors) => {
          console.warn("Validation Error:", errors[0]?.message);
        },
      });

      const added = addedFiles?.[0];
      if (added && added.file) {
        let content = "";
        try {
          content = await added.file.text();
        } catch (err) {
          console.error("Error reading file text:", err);
        }

        updateNodeData(id, {
          value: {
            fileName: getFileName(added),
            fileSize: formatBytes(getFileSize(added)),
            fileType: added.file?.type || "file",
            content,
            status: added.status,
            error: added.error,
          },
          isValid:
            Boolean(added.file) && !added.error && added.status !== "error",
          status: NODE_STATUS.IDLE,
        });
      }
    };

    const handleClearFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (activeFile) removeFile(activeFile.id);
      if (fileInputRef.current) fileInputRef.current.value = "";
      updateNodeData(id, {
        value: null,
        isValid: false,
        status: NODE_STATUS.IDLE,
      });
    };

    return (
      <div
        className={cn(
          "bg-card border-border hover:border-primary/60 focus:border-primary max-w-72 min-w-64 rounded-2xl border p-4.5 shadow-md transition-all",
          !!selected && "border-primary! ring-primary/20 shadow-lg ring-2",
          statusQueued && "border-amber-500/50 bg-amber-500/5",
          statusRunning &&
            "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.5)] ring-4 ring-emerald-500",
          statusCompleted &&
            "border-emerald-500/80 bg-emerald-500/5 dark:bg-emerald-950/10"
        )}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileIcon className="size-4 text-emerald-500" />
            <span className="text-foreground text-xs font-bold tracking-tight">
              {data.title || "Input File Node"}
            </span>
          </div>
          {statusIdle && !!acceptType && (
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] text-emerald-400 uppercase"
            >
              {`.${acceptType}`}
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
              className="animate-pulse border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] text-emerald-400"
            >
              <LoaderIcon className="size-3 animate-spin" />
              Extracting
            </Badge>
          )}
          {statusCompleted && (
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] text-emerald-400"
            >
              Ready
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground mb-3! text-left text-[10px] leading-relaxed">
          {data.description ||
            "Upload a file to preview and supply to pipeline."}
        </p>

        {(statusRunning || statusQueued) && (
          <div className="mb-3 space-y-1 text-left">
            <div className="flex justify-between font-mono text-[15px] font-semibold text-emerald-400">
              <span>
                {statusRunning ? "Extracting..." : NODE_STATUS.QUEUED}
              </span>
              <span>{data.progress || 0}%</span>
            </div>
            <div className="h-3.5 w-full overflow-hidden rounded-full border border-emerald-500/20 bg-emerald-950/40">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-200 ease-out"
                style={{ width: `${data.progress || 0}%` }}
              />
            </div>
          </div>
        )}

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept={getTypesFromExtensions(acceptType).join(",") || "*"}
          onChange={handleFileChange}
        />

        <div className="nodrag">
          <Button
            fullWidth
            size="sm"
            startIcon={<Upload className="size-4" />}
            variant={nodeValue?.content ? "outline" : "default"}
            disabled={statusRunning || statusQueued}
            onClick={handleButtonClick}
            {...buttonProps}
          >
            {nodeValue?.content
              ? "Replace File"
              : buttonProps.children || "Choose File to Upload"}
          </Button>
        </div>

        {activeFile?.status === "error" && (
          <div className="text-destructive mt-2 text-[10px] font-semibold">
            {activeFile.error}
          </div>
        )}

        {isValid && (
          <div className="bg-muted/40 border-border/70 nodrag group relative mt-3 rounded-xl border p-2.5">
            <Button
              size="icon-xs"
              title="Remove File"
              className="bg-destructive/10 hover:bg-destructive/20 text-destructive absolute top-2 right-2 rounded-full p-1 transition-colors"
              disabled={statusRunning || statusQueued}
              onClick={handleClearFile}
            >
              <XIcon className="size-3" />
            </Button>

            <div className="mb-2 flex items-center gap-1 pr-6">
              {nodeValue?.fileName?.endsWith(".csv") ? (
                <FileSpreadsheet className="size-4 shrink-0 text-emerald-500" />
              ) : nodeValue?.fileName?.endsWith(".json") ? (
                <FileCode className="size-4 shrink-0 text-amber-500" />
              ) : (
                <FileText className="size-4 shrink-0 text-purple-500" />
              )}

              <div className="flex flex-col overflow-hidden text-left">
                <p
                  title={nodeValue?.fileName}
                  className="text-foreground truncate text-[11px] leading-relaxed font-bold"
                >
                  {nodeValue?.fileName}
                </p>
                <span className="text-muted-foreground font-mono text-[9px] leading-relaxed">
                  {nodeValue?.fileSize}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 -mb-2 text-[10px] font-bold text-gray-500">
          {id}
        </div>

        <DashedCircleHandle
          type="source"
          position={Position.Right}
          id={EDGE_TYPE.INPUT}
          accepts={[EDGE_TYPE.INPUT]}
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />
      </div>
    );
  }
);

export default InputFileNode;
