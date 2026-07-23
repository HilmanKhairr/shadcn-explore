import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CompactSelect from "@/components/ui/compact/CompactSelect";
import { cn } from "@/lib/utils";
import type { PipelinePayload } from "@/pages/reactflow-showcase/types";
import { getPipelinePayload } from "@/pages/reactflow-showcase/utils/pipeline";
import type { Node, NodeProps } from "@xyflow/react";
import { Position, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { CheckCircle2, FileCheck, Loader2, Zap } from "lucide-react";
import { memo, useMemo, useState } from "react";
import DashedCircleHandle from "../../handle/DashedCircleHadle";

export type OutputFormat = "json" | "pdf" | "csv";

export type OutputFileNodeData = {
  title?: string;
  description?: string;
  outputFormat?: OutputFormat;
  filename?: string;
  status?: "idle" | "running" | "completed" | "error";
  generatedContent?: string;
  payload?: PipelinePayload;
};

export type OutputFileNodeProps = Node<OutputFileNodeData, "outputFile">;

const outputFormatOptions = [
  { value: "json", label: "JSON Data Payload (.json)" },
  { value: "pdf", label: "PDF Document (.pdf)" },
  { value: "csv", label: "Processed CSV (.csv)" },
];

const OutputFileNode = memo(
  ({ id, data, selected }: NodeProps<OutputFileNodeProps>) => {
    const { setNodes } = useReactFlow();
    const nodes = useNodes();
    const edges = useEdges();
    const [isRunningTrigger, setIsRunningTrigger] = useState(false);

    const pipelinePayload = useMemo(() => {
      return getPipelinePayload(id, nodes, edges);
    }, [id, nodes, edges]);

    const isValidPipeline = pipelinePayload.isValid;
    const currentFormat: OutputFormat = data.outputFormat || "json";
    const status = isRunningTrigger ? "running" : data.status || "idle";

    console.log("pipelinePayload", pipelinePayload);
    const updateFormat = (nextFormat: OutputFormat) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  outputFormat: nextFormat,
                  filename: `converted_result.${nextFormat}`,
                },
              }
            : node
        )
      );
    };

    const handleTriggerDevRun = async () => {
      setIsRunningTrigger(true);

      await new Promise((r) => setTimeout(r, 800)); // Step 1: Ingesting CSV
      await new Promise((r) => setTimeout(r, 900)); // Step 2: Applying Config
      await new Promise((r) => setTimeout(r, 700)); // Step 3: Generating PDF / JSON

      const filename = data.filename || `converted_export.${currentFormat}`;
      const mockContent = generateConvertedOutput(currentFormat, filename);

      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  status: "completed",
                  generatedContent: mockContent,
                },
              }
            : node
        )
      );

      setIsRunningTrigger(false);

      // Trigger instant browser download
      triggerDownload(mockContent, filename, currentFormat);
    };

    return (
      <div
        className={cn(
          "bg-card border-border max-w-80 min-w-72 rounded-2xl border p-4.5 shadow-md transition-all hover:border-rose-500/60 focus:border-rose-500",
          !!selected && "border-rose-500! shadow-lg ring-2 ring-rose-500/20"
        )}
      >
        <DashedCircleHandle
          type="target"
          position={Position.Top}
          fillClassName="fill-rose-600 group-hover:fill-rose-500"
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

        <p className="text-muted-foreground mb-3 text-left text-[10px] leading-relaxed">
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

function triggerDownload(
  content: string,
  filename: string,
  format: OutputFormat
) {
  const mimeType =
    format === "json"
      ? "application/json"
      : format === "pdf"
        ? "application/pdf"
        : "text/csv";
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateConvertedOutput(
  format: OutputFormat,
  filename: string
): string {
  if (format === "json") {
    return JSON.stringify(
      {
        pipelineEngine: "Trigger.dev Task v3",
        sourceFormat: "CSV",
        targetFormat: "JSON",
        convertedAt: new Date().toISOString(),
        dataset: [
          {
            id: 101,
            name: "Product Alpha",
            category: "Electronics",
            price: 299.99,
            status: "Active",
          },
          {
            id: 102,
            name: "Product Beta",
            category: "Software",
            price: 149.5,
            status: "Active",
          },
          {
            id: 103,
            name: "Product Gamma",
            category: "Hardware",
            price: 49.0,
            status: "Active",
          },
        ],
      },
      null,
      2
    );
  }

  if (format === "pdf") {
    return `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length 120 >> stream
BT
/F1 18 Tf
50 750 Td
(TRIGGER.DEV CONVERTED CSV TO PDF DOCUMENT) Tj
0 -30 Td
/F1 12 Tf
(Converted File: ${filename}) Tj
ET
endstream endobj
xref
0 6
trailer << /Size 6 /Root 1 0 R >>
%%EOF`;
  }

  return "id,name,category,price,status\n101,Product Alpha,Electronics,299.99,Active";
}

