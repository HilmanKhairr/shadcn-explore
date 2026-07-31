import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { processInputData } from "@/triggers/csvConverter";
import { useReactFlow } from "@xyflow/react";
import { ChevronDownIcon, Eye, Files, Maximize2, Table } from "lucide-react";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import usePipelineStore from "../hooks/usePipelineStore";
import type {
  InputFileNodeData,
  ModifFileNodeData,
  ProcessedFileItem,
} from "../types/pipeline";
import DataPreviewModal from "./DataPreviewModal";

const SettingbarNode = () => {
  const { updateNodeData } = useReactFlow();
  const selectedNode = usePipelineStore(
    useShallow((state) => {
      const node = state.nodes.find((n) => n.selected);
      return node || null;
    })
  );
  const [openSettingbar, setOpenSettingbar] = useState(false);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(-1); // -1 = All combined

  const previewData = useMemo(() => {
    if (!selectedNode) {
      return {
        rows: [],
        headers: [],
        fileName: "",
        rawContent: "",
        items: [] as ProcessedFileItem[],
      };
    }

    const type = selectedNode.type;
    const data = selectedNode.data;

    if (type === "inputNode") {
      const val = (data as InputFileNodeData)?.processedValue;
      const content = val?.content || "";
      const fileName = val?.fileName || "input_dataset.csv";
      let rows: Record<string, unknown>[] = [];
      if (content) {
        rows = processInputData(content, {
          isJsonInput: fileName.endsWith(".json"),
        });
      }
      const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        rows,
        headers,
        fileName,
        rawContent: content,
        items: [],
      };
    }

    if (type === "modifNode") {
      const items = (data as ModifFileNodeData)?.processedValue || [];
      const allRows = items.flatMap((item) => item.rows);
      const allHeaders = items.length > 0 ? items[0].headers : [];
      const fileName = items[0]?.fileName || "modified_data.csv";
      return {
        rows: allRows,
        headers: allHeaders,
        fileName,
        rawContent: "",
        items,
      };
    }

    return {
      rows: [],
      headers: [],
      fileName: "",
      rawContent: "",
      items: [],
    };
  }, [selectedNode]);

  const activeDataset = useMemo(() => {
    if (previewData.items.length > 0 && selectedFileIdx >= 0) {
      const item = previewData.items[selectedFileIdx];
      if (item) {
        return {
          rows: item.rows,
          headers: item.headers,
          fileName: item.fileName,
        };
      }
    }
    return {
      rows: previewData.rows,
      headers: previewData.headers,
      fileName: previewData.fileName,
    };
  }, [previewData, selectedFileIdx]);

  const previewRows = useMemo(() => {
    return activeDataset.rows.slice(0, 10);
  }, [activeDataset.rows]);

  return (
    <>
      <div
        className={cn(
          "border-border bg-card/40 flex shrink-0 flex-col overflow-y-auto border-t text-left transition-all duration-300 md:border-t-0 md:border-l",
          selectedNode ? "w-full md:w-80" : "h-0 w-0"
        )}
      >
        <Button
          fullWidth
          variant="ghost"
          endIcon={
            <ChevronDownIcon
              className={`size-4 shrink-0 transition-transform duration-300 md:hidden ${openSettingbar ? "rotate-180" : ""}`}
            />
          }
          className="h-auto! rounded-none! px-6 py-4 active:scale-100! md:pointer-events-none md:cursor-default"
          onClick={() => setOpenSettingbar((prev) => !prev)}
        >
          <h2>Node Configuration</h2>
        </Button>
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:grid-rows-[1fr]! ${openSettingbar ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            {selectedNode ? (
              <div className="animate-in fade-in flex flex-col gap-4 px-6 pb-6 duration-200">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium">Node Label</label>
                  <input
                    type="text"
                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                    value={String(selectedNode?.data.title || "")}
                    onChange={(e) => {
                      updateNodeData(selectedNode?.id, {
                        title: e.target.value,
                      });
                    }}
                  />
                  <label className="text-xs font-medium">
                    Node Description
                  </label>
                  <input
                    type="text"
                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                    value={String(selectedNode?.data.description || "")}
                    onChange={(e) => {
                      updateNodeData(selectedNode?.id, {
                        description: e.target.value,
                      });
                    }}
                  />
                </div>

                {selectedNode.type !== "outputNode" && (
                  <div className="border-border/60 mt-2 flex flex-col gap-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Eye className="size-4 text-purple-500" />
                        <span className="text-xs font-bold">
                          Output Data Preview
                        </span>
                      </div>
                      {activeDataset.rows.length > 0 && (
                        <Badge
                          variant="outline"
                          className="font-mono text-[9px]"
                        >
                          {activeDataset.rows.length} rows
                        </Badge>
                      )}
                    </div>

                    {previewData.items.length > 1 && (
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-semibold">
                          <Files className="size-3" /> Select Input Source:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedFileIdx(-1)}
                            className={cn(
                              "rounded-md px-2 py-0.5 font-mono text-[9px] transition-colors",
                              selectedFileIdx === -1
                                ? "bg-primary text-primary-foreground font-bold"
                                : "bg-muted hover:bg-muted/80 text-muted-foreground"
                            )}
                          >
                            All ({previewData.rows.length})
                          </button>
                          {previewData.items.map((it, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedFileIdx(idx)}
                              className={cn(
                                "rounded-md px-2 py-0.5 font-mono text-[9px] transition-colors",
                                selectedFileIdx === idx
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
                              )}
                            >
                              {it.fileName} ({it.rows.length})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeDataset.rows.length > 0 ? (
                      <div className="flex flex-col gap-2.5">
                        <p className="text-muted-foreground text-[10px]">
                          Showing top {previewRows.length} of{" "}
                          {activeDataset.rows.length} rows
                        </p>

                        <div className="border-border overflow-hidden rounded-xl border">
                          <div className="max-h-48 overflow-auto">
                            <table className="w-full border-collapse text-left font-mono text-[10px]">
                              <thead className="bg-muted/70 text-muted-foreground sticky top-0 font-semibold backdrop-blur-xs">
                                <tr>
                                  <th className="border-border/50 border-b px-2 py-1.5">
                                    #
                                  </th>
                                  {activeDataset.headers
                                    .slice(0, 3)
                                    .map((h) => (
                                      <th
                                        key={h}
                                        className="border-border/50 border-b px-2 py-1.5 whitespace-nowrap uppercase"
                                      >
                                        {h}
                                      </th>
                                    ))}
                                </tr>
                              </thead>
                              <tbody className="divide-border/30 divide-y">
                                {previewRows.map((row, idx) => (
                                  <tr
                                    key={idx}
                                    className="hover:bg-muted/40 transition-colors"
                                  >
                                    <td className="text-muted-foreground border-border/30 border-r px-2 py-1">
                                      {idx + 1}
                                    </td>
                                    {activeDataset.headers
                                      .slice(0, 3)
                                      .map((h) => (
                                        <td
                                          key={h}
                                          className="max-w-[70px] truncate px-2 py-1"
                                          title={String(row[h] ?? "")}
                                        >
                                          {String(row[h] ?? "-")}
                                        </td>
                                      ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <Button
                          fullWidth
                          variant="outline"
                          size="sm"
                          startIcon={<Maximize2 className="size-3.5" />}
                          onClick={() => setIsFullPreviewOpen(true)}
                          className="mt-1"
                        >
                          View Full Data Inspector
                        </Button>
                      </div>
                    ) : (
                      <div className="border-muted bg-muted/20 flex flex-col items-center justify-center rounded-xl border border-dashed py-6 text-center">
                        <Table className="text-muted-foreground/60 size-5" />
                        <p className="text-muted-foreground mt-2 px-2 text-[11px]">
                          No processed output data yet. Upload a file or connect
                          node pipeline.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-muted flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
                <p className="text-muted-foreground px-4 text-sm">
                  No node selected. Click a node on the canvas to configure its
                  properties.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Page Data Inspector Modal */}
      {selectedNode && (
        <DataPreviewModal
          isOpen={isFullPreviewOpen}
          onClose={() => setIsFullPreviewOpen(false)}
          title={String(selectedNode.data.title || "Node Data Inspector")}
          fileName={activeDataset.fileName}
          rows={previewData.rows}
          headers={previewData.headers}
          items={previewData.items}
          rawContent={previewData.rawContent}
        />
      )}
    </>
  );
};

export default SettingbarNode;

