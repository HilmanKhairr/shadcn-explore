import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getFileName, getFileSize, getTypesFromExtensions } from "@/lib/files";
import { cn, formatBytes } from "@/lib/utils";
import usePipelineStore from "@/pages/reactflow-showcase/graph-traversal/hooks/usePipelineStore";
import type { InputFileNodeData } from "@/pages/reactflow-showcase/graph-traversal/types/pipeline";
import type { Node, NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import {
  FileCode,
  FileIcon,
  FileSpreadsheet,
  FileText,
  Upload,
  XIcon,
} from "lucide-react";
import { memo, useRef } from "react";
import { EDGE_TYPES } from "../../constants/pipeline";
import DashedCircleHandle from "../handle/DashedCircleHadle";

export type InputFileNodeProps = Node<InputFileNodeData, "inputNode">;

const InputFileNode = memo(
  ({ id, data, selected }: NodeProps<InputFileNodeProps>) => {
    const fileInfo = data.fileInfo;
    const acceptType = data.accept || "";
    const buttonProps = data.buttonProps || {};

    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateNodeData = usePipelineStore((state) => state.updateNodeData);
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
      if (added) {
        updateNodeData(id, {
          fileInfo: {
            file: added.file,
            fileName: getFileName(added),
            fileSize: formatBytes(getFileSize(added)),
            fileType: added.file?.type || "file",
            status: added.status,
            error: added.error,
          },
        });
      }
    };

    const handleClearFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (activeFile) removeFile(activeFile.id);
      if (fileInputRef.current) fileInputRef.current.value = "";
      updateNodeData(id, { fileInfo: null });
    };

    return (
      <div
        className={cn(
          "bg-card border-border hover:border-primary/60 focus:border-primary max-w-72 min-w-64 rounded-2xl border p-4.5 shadow-md transition-all",
          !!selected && "border-primary! ring-primary/20 shadow-lg ring-2"
        )}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileIcon className="size-4 text-emerald-500" />
            <span className="text-foreground text-xs font-bold tracking-tight">
              {data.title || "Input File Node"}
            </span>
          </div>
          {!!acceptType && (
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] text-emerald-400 uppercase"
            >
              {`.${acceptType}`}
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground mb-3! text-left text-[10px] leading-relaxed">
          {data.description ||
            "Upload a file to preview and supply to pipeline."}
        </p>

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
            variant={fileInfo ? "outline" : "default"}
            onClick={handleButtonClick}
            {...buttonProps}
          >
            {fileInfo
              ? "Replace File"
              : buttonProps.children || "Choose File to Upload"}
          </Button>
        </div>

        {activeFile?.status === "error" && (
          <div className="text-destructive mt-2 text-[10px] font-semibold">
            {activeFile.error}
          </div>
        )}

        {fileInfo && activeFile?.status !== "error" && (
          <div className="bg-muted/40 border-border/70 nodrag group relative mt-3 rounded-xl border p-2.5">
            <Button
              size="icon-xs"
              title="Remove File"
              className="bg-destructive/10 hover:bg-destructive/20 text-destructive absolute top-2 right-2 rounded-full p-1 transition-colors"
              onClick={handleClearFile}
            >
              <XIcon className="size-3" />
            </Button>

            <div className="mb-2 flex items-center gap-1 pr-6">
              {fileInfo.fileName.endsWith(".csv") ? (
                <FileSpreadsheet className="size-4 shrink-0 text-emerald-500" />
              ) : fileInfo.fileName.endsWith(".json") ? (
                <FileCode className="size-4 shrink-0 text-amber-500" />
              ) : (
                <FileText className="size-4 shrink-0 text-purple-500" />
              )}

              <div className="flex flex-col overflow-hidden text-left">
                <p
                  title={fileInfo.fileName}
                  className="text-foreground truncate text-[11px] leading-relaxed font-bold"
                >
                  {fileInfo.fileName}
                </p>
                <span className="text-muted-foreground font-mono text-[9px] leading-relaxed">
                  {fileInfo.fileSize}
                </span>
              </div>
            </div>
          </div>
        )}

        <DashedCircleHandle
          type="source"
          position={Position.Right}
          id={EDGE_TYPES.INPUT}
          accepts={[EDGE_TYPES.INPUT]}
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />
      </div>
    );
  }
);

export default InputFileNode;
