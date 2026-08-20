import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ChevronDownIcon, Eye, Files, Table } from "lucide-react";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { NODE_TYPE } from "../constants/workflow";
import useWorkflowStore from "../hooks/useWorkflowStore";

const SettingbarNode = () => {
  const { updateNodeData } = useReactFlow();
  const selectedNode = useWorkflowStore(
    useShallow((state) => {
      const node = state.nodes.find((n) => n.selected);
      return node || null;
    })
  );
  const [openSettingbar, setOpenSettingbar] = useState(false);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(-1); // -1 = All combined

  const previewData = useMemo(() => {
    if (!selectedNode) {
      return {
        rows: [],
        headers: [],
        fileName: "",
        items: [],
      };
    }

    const type = selectedNode.type;
    const data = selectedNode.data;

    if (type === NODE_TYPE.EXTRACT) {
      const fileName = data?.value?.fileName || "input_dataset.csv";
      const rows = data?.previews || [];

      const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        rows,
        headers,
        fileName,
        items: [],
      };
    }

    if (type === NODE_TYPE.TRANSFORM) {
      const fileName = "transformed_data.csv";
      const allRows = data?.previews || [];

      const sourceMap = new Map<string, Record<string, unknown>[]>();
      allRows.forEach((row) => {
        const src = (row._source as string) || fileName;
        if (!sourceMap.has(src)) sourceMap.set(src, []);
        sourceMap.get(src)!.push(row);
      });

      const items =
        sourceMap.size > 1
          ? Array.from(sourceMap.entries()).map(([srcName, srcRows]) => ({
              fileName: srcName,
              rows: srcRows,
              headers:
                srcRows.length > 0
                  ? Object.keys(srcRows[0]).filter((k) => k !== "_source")
                  : [],
            }))
          : [];

      const headers =
        allRows.length > 0
          ? Object.keys(allRows[0]).filter((k) => k !== "_source")
          : [];

      return {
        rows: allRows,
        headers,
        fileName,
        items,
      };
    }

    return {
      rows: [],
      headers: [],
      fileName: "",
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
    return activeDataset.rows;
  }, [activeDataset.rows]);

  return (
    <div
      className={cn(
        "border-border bg-card/40 flex shrink-0 flex-col overflow-y-auto border-t text-left transition-all duration-300 md:border-t-0 md:border-l",
        selectedNode ? "w-full md:w-80" : "h-0 w-0 overflow-hidden md:w-0"
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
                <label className="text-xs font-medium">Node Description</label>
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

              {selectedNode.type !== NODE_TYPE.LOAD && (
                <div className="border-border/60 mt-2 flex flex-col gap-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Eye className="size-4 text-purple-500" />
                      <span className="text-xs font-bold">
                        Output Data Preview
                      </span>
                    </div>
                    {activeDataset.rows.length > 0 && (
                      <Badge variant="outline" className="font-mono text-[9px]">
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
                            "cursor-pointer rounded-md px-2 py-0.5 font-mono text-[9px] transition-colors",
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
                              "cursor-pointer rounded-md px-2 py-0.5 font-mono text-[9px] transition-colors",
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
                                {activeDataset.headers.slice(0, 3).map((h) => (
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
                    </div>
                  ) : (
                    <div className="border-muted bg-muted/20 flex flex-col items-center justify-center rounded-xl border border-dashed py-6 text-center">
                      <Table className="text-muted-foreground/60 size-5" />
                      <p className="text-muted-foreground mt-2 px-2 text-[11px]">
                        No processed output data yet. Upload a file or run the
                        workflow pipeline.
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
  );
};

export default SettingbarNode;

