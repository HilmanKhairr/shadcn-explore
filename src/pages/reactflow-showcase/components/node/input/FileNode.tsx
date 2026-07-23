import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAcceptAttribute,
  useFileUpload,
  type AllowedFileType,
} from "@/hooks/useFileUpload";
import { cn, formatBytes } from "@/lib/utils";
import type { Node, NodeProps } from "@xyflow/react";
import { Position, useReactFlow } from "@xyflow/react";
import {
  FileCode,
  FileIcon,
  FileSpreadsheet,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { memo, useCallback, useRef } from "react";
import DashedCircleHandle from "../../handle/DashedCircleHadle";

export type InputFileNodeData = {
  title?: string;
  description?: string;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  multiple?: boolean;
  accept?: AllowedFileType[];
  maxSize?: number;
  allowedTypes?: AllowedFileType[];
  fileInfo?: {
    fileName: string;
    fileSize: number | string;
    fileType: string;
    status?: string;
    error?: string;
  } | null;
};

export type InputFileNodeProps = Node<InputFileNodeData, "inputFile">;

const InputFileNode = memo(
  ({ id, data, selected }: NodeProps<InputFileNodeProps>) => {
    const buttonProps = data.buttonProps || {};

    const { setNodes } = useReactFlow();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { files, addFiles, removeFile, getFileName, getFileSize } =
      useFileUpload({
        mode: "deferred",
        multiple: !!data?.multiple,
      });

    const activeFile = files[0];

    const updateNodeData = useCallback(
      (newData?: InputFileNodeData) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, ...newData } }
              : node
          )
        );
      },
      [id, setNodes]
    );

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      const addedFiles = await addFiles(selectedFiles, {
        maxSize: data.maxSize,
        allowedTypes: data.accept,
        onValidationError: (errors) => {
          console.warn("Validation Error:", errors[0]?.message);
        },
      });

      const added = addedFiles?.[0];
      if (added) {
        updateNodeData({
          fileInfo: {
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
      if (activeFile) {
        removeFile(activeFile.id);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";

      updateNodeData({ fileInfo: null });
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
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] text-emerald-400 uppercase"
          >
            .csv
          </Badge>
        </div>

        <p className="text-muted-foreground mb-3! text-left text-[10px] leading-relaxed">
          {data.description ||
            "Upload a file to preview and supply to pipeline."}
        </p>

        <input
          multiple={!!data?.multiple}
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept={getAcceptAttribute(data.accept || []) || "*"}
          onChange={handleFileChange}
        />

        <div className="nodrag">
          <Button
            fullWidth
            size="sm"
            startIcon={<Upload className="size-4" />}
            variant={data.fileInfo ? "outline" : "default"}
            onClick={handleButtonClick}
            {...buttonProps}
          >
            {data.fileInfo
              ? "Replace File"
              : buttonProps.children || "Choose File to Upload"}
          </Button>
        </div>

        {activeFile?.status === "error" && (
          <div className="text-destructive mt-2 text-[10px] font-semibold">
            {activeFile.error}
          </div>
        )}

        {data.fileInfo && activeFile?.status !== "error" && (
          <div className="bg-muted/40 border-border/70 nodrag group relative mt-3 rounded-xl border p-2.5">
            <Button
              size="icon-xs"
              title="Remove File"
              className="bg-destructive/10 hover:bg-destructive/20 text-destructive absolute top-2 right-2 rounded-full p-1 transition-colors"
              onClick={handleClearFile}
            >
              <X className="size-3" />
            </Button>

            <div className="mb-2 flex items-center gap-1 pr-6">
              {data.fileInfo.fileName.endsWith(".csv") ? (
                <FileSpreadsheet className="size-4 shrink-0 text-emerald-500" />
              ) : data.fileInfo.fileName.endsWith(".json") ? (
                <FileCode className="size-4 shrink-0 text-amber-500" />
              ) : (
                <FileText className="size-4 shrink-0 text-purple-500" />
              )}

              <div className="flex flex-col overflow-hidden text-left">
                <p
                  title={data.fileInfo.fileName}
                  className="text-foreground truncate text-[11px] leading-relaxed font-bold"
                >
                  {data.fileInfo.fileName}
                </p>
                <span className="text-muted-foreground font-mono text-[9px] leading-relaxed">
                  {data.fileInfo.fileSize}
                </span>
              </div>
            </div>
          </div>
        )}

        <DashedCircleHandle
          type="source"
          position={Position.Bottom}
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />
      </div>
    );
  }
);

export default InputFileNode;

