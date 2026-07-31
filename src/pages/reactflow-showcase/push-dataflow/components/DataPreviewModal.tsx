import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Download,
  FileCode,
  FileSpreadsheet,
  Files,
  Search,
  Table,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ProcessedFileItem } from "../types/pipeline";

interface DataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileName?: string;
  rows: Record<string, unknown>[];
  headers: string[];
  items?: ProcessedFileItem[];
  rawContent?: string;
}

export default function DataPreviewModal({
  isOpen,
  onClose,
  title,
  fileName,
  rows: defaultRows,
  headers: defaultHeaders,
  items,
  rawContent,
}: DataPreviewModalProps) {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(-1); // -1 = All files combined
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "json">("table");

  // Determine active dataset based on selected tab
  const activeData = useMemo(() => {
    if (items && items.length > 0 && selectedFileIdx >= 0) {
      const activeItem = items[selectedFileIdx];
      if (activeItem) {
        return {
          rows: activeItem.rows,
          headers: activeItem.headers,
          fileName: activeItem.fileName,
        };
      }
    }
    return {
      rows: defaultRows,
      headers: defaultHeaders,
      fileName: fileName || "data.csv",
    };
  }, [items, selectedFileIdx, defaultRows, defaultHeaders, fileName]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return activeData.rows;
    const q = searchQuery.toLowerCase();
    return activeData.rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [activeData.rows, searchQuery]);

  if (!isOpen) return null;

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(activeData.rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeData.fileName
      ? `${activeData.fileName.split(".")[0]}.json`
      : "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="bg-card text-card-foreground border-border relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border shadow-2xl">
        {/* Header */}
        <div className="border-border/60 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-2xl">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-foreground text-base font-bold tracking-tight">
                  {title}
                </h3>
                {activeData.fileName && (
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {activeData.fileName}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-start text-xs">
                Full Data Inspector • {activeData.rows.length} total rows
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              startIcon={<Download className="size-3.5" />}
              onClick={handleDownloadJSON}
            >
              Export JSON
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Multiple Files Tab Selector (if items > 1) */}
        {items && items.length > 1 && (
          <div className="bg-muted/40 border-border/40 flex items-center gap-1.5 overflow-x-auto border-b px-6 py-2.5">
            <span className="text-muted-foreground mr-1.5 flex items-center gap-1 text-[11px] font-semibold">
              <Files className="size-3.5" />
              Source Files:
            </span>
            <button
              type="button"
              onClick={() => setSelectedFileIdx(-1)}
              className={cn(
                "rounded-lg px-3 py-1 font-mono text-xs transition-colors",
                selectedFileIdx === -1
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "bg-background hover:bg-muted text-muted-foreground"
              )}
            >
              All Combined ({defaultRows.length} rows)
            </button>
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedFileIdx(idx)}
                className={cn(
                  "rounded-lg px-3 py-1 font-mono text-xs transition-colors",
                  selectedFileIdx === idx
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "bg-background hover:bg-muted text-muted-foreground"
                )}
              >
                {item.fileName} ({item.rows.length} rows)
              </button>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-muted/20 border-border/40 flex flex-col gap-3 border-b px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className={cn(
              "relative max-w-md flex-1",
              viewMode !== "table" && "invisible"
            )}
          >
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in all columns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-xl border pr-4 pl-9 text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-background border-border flex items-center rounded-xl border p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-colors",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Table className="size-3.5" />
                Table ({filteredRows.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode("json")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-colors",
                  viewMode === "json"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileCode className="size-3.5" />
                Raw Data
              </button>
            </div>
          </div>
        </div>

        {/* Body View */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-6">
          {viewMode === "table" ? (
            filteredRows.length > 0 ? (
              <div className="border-border w-full overflow-hidden rounded-2xl border shadow-xs">
                <div className="max-h-[48vh] overflow-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-muted/80 text-muted-foreground sticky top-0 z-10 font-semibold backdrop-blur-xs">
                      <tr>
                        <th className="border-border border-b px-4 py-3 font-mono text-[10px] uppercase">
                          #
                        </th>
                        {activeData.headers.map((h) => (
                          <th
                            key={h}
                            className="border-border border-b px-4 py-3 font-mono text-[10px] tracking-wider whitespace-nowrap uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-border/40 divide-y font-mono">
                      {filteredRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="text-muted-foreground border-border/40 border-r px-4 py-2 text-[10px]">
                            {idx + 1}
                          </td>
                          {activeData.headers.map((h) => (
                            <td
                              key={h}
                              className="text-foreground max-w-xs truncate px-4 py-2"
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
            ) : (
              <div className="border-muted flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  No matching rows found for "{searchQuery}"
                </p>
              </div>
            )
          ) : (
            <pre className="bg-muted/40 border-border text-foreground h-full w-full overflow-auto rounded-2xl border p-4 text-start font-mono text-xs leading-relaxed">
              {rawContent || JSON.stringify(activeData.rows, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t px-6 py-3 text-xs">
          <span>
            Showing {filteredRows.length} of {activeData.rows.length} records
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}

