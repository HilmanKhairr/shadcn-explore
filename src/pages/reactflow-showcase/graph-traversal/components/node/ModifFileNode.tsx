import CompactSelect from "@/components/compact/CompactSelect";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import usePipelineStore from "@/pages/reactflow-showcase/graph-traversal/hooks/usePipelineStore";
import type { ModifFileNodeData } from "@/pages/reactflow-showcase/graph-traversal/types/pipeline";
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { AlertCircle, SlidersHorizontal } from "lucide-react";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { EDGE_TYPES } from "../../constants/pipeline";
import DashedCircleHandle from "../handle/DashedCircleHadle";

export type ModifFileNodeProps = Node<ModifFileNodeData, "modifNode">;

const operationOptions = [
  { value: "equals", label: "Equals (=)" },
  { value: "contains", label: "Contains" },
  { value: "gt", label: "Greater Than (>)" },
  { value: "lt", label: "Less Than (<)" },
  { value: "not_empty", label: "Is Not Empty" },
];

const limitOptions = [
  { value: "10", label: "10 Rows" },
  { value: "50", label: "50 Rows" },
  { value: "100", label: "100 Rows" },
  { value: "500", label: "500 Rows" },
  { value: "0", label: "All Rows (No Limit)" },
];

const sortDirectionOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const ModifFileNode = memo(
  ({ id, data, selected }: NodeProps<ModifFileNodeProps>) => {
    const updateNodeData = usePipelineStore((state) => state.updateNodeData);

    const upstreamFileInfo = usePipelineStore(
      useShallow((state) => {
        const dataPayload = state.getNodePayload(id)?.data;
        if (!dataPayload || dataPayload.length === 0) return null;

        const firstItemWithFile = dataPayload.find(
          (item) => item.fileData && item.fileData.status !== "error"
        );
        return firstItemWithFile?.fileData || null;
      })
    );

    const hasUpstreamData = !!upstreamFileInfo;
    const filterColumn = data?.filterColumn || "";
    const filterOperation = data?.filterOperation || "";
    const filterValue = data?.filterValue || "";
    const limitRows =
      data?.limitRows !== undefined ? String(data?.limitRows) : "";
    const removeEmptyRows = data?.removeEmptyRows ?? false;
    const trimWhitespace = data?.trimWhitespace ?? false;
    const sortColumn = data?.sortColumn || "";
    const sortDirection = data?.sortDirection || "";

    const handleUpdate = (field: string, val: unknown) => {
      updateNodeData(id, {
        [field]: val,
      });
    };

    return (
      <div
        className={cn(
          "bg-card border-border hover:border-primary/60 focus:border-primary max-w-160 min-w-72 rounded-2xl border p-4.5 shadow-md transition-all",
          !!selected && "border-primary! ring-primary/20 shadow-lg ring-2"
        )}
      >
        <DashedCircleHandle
          type="target"
          position={Position.Left}
          id={EDGE_TYPES.INPUT}
          accepts={[EDGE_TYPES.INPUT]}
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />

        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-4 text-purple-500" />
            <span className="text-foreground text-xs font-bold tracking-tight">
              {data.title || "Transform Config Node"}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "font-mono text-[9px] uppercase",
              hasUpstreamData
                ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                : "border-amber-500/40 bg-amber-500/10 text-amber-400"
            )}
          >
            {hasUpstreamData ? "READY" : "AWAITING DATA"}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-3! text-left text-[10px] leading-relaxed">
          {data.description ||
            "Konfigurasi kriteria filter baris dan transformasi data secara dinamis."}
        </p>

        {!hasUpstreamData ? (
          <div className="my-2 flex flex-col items-center rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
            <AlertCircle className="mb-1 size-5 shrink-0 text-amber-500" />
            <p className="text-foreground text-[11px] font-bold">
              Data input belum tersedia
            </p>
            <p className="text-muted-foreground mt-0.5 text-[10px] leading-relaxed">
              Hubungkan garis & upload file CSV/JSON pada Input Node terlebih
              dahulu untuk mengaktifkan opsi konfigurasi.
            </p>
          </div>
        ) : (
          <div className="nodrag space-y-2.5 text-left">
            <div className="bg-foreground/5 rounded-md p-2">
              <p className="text-1xl font-mono font-semibold uppercase">
                Filter
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-muted-foreground mb-1 block text-[10px] font-semibold">
                    Target Column:
                  </label>
                  <input
                    type="text"
                    value={filterColumn}
                    onChange={(e) =>
                      handleUpdate("filterColumn", e.target.value)
                    }
                    placeholder="e.g. status, user_id, price..."
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-8 w-full rounded-lg border px-2 font-mono text-xs transition-colors focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-[10px] font-semibold">
                    Operation:
                  </label>
                  <CompactSelect
                    fullWidth
                    clearable={false}
                    placeholder="Condition"
                    value={filterOperation}
                    items={operationOptions}
                    onValueChange={(val) =>
                      handleUpdate("filterOperation", val)
                    }
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-[10px] font-semibold">
                    Filter Value:
                  </label>
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) =>
                      handleUpdate("filterValue", e.target.value)
                    }
                    placeholder="Value..."
                    className="bg-background border-border text-foreground h-8 w-full rounded-lg border px-2 text-xs transition-colors focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-[10px] font-semibold">
                  Row Limit:
                </label>
                <CompactSelect
                  fullWidth
                  clearable={false}
                  placeholder="Select Limit"
                  value={limitRows}
                  items={limitOptions}
                  onValueChange={(val) =>
                    handleUpdate("limitRows", Number(val))
                  }
                />
              </div>

              <div className="border-border/50 space-y-1.5 border-t pt-2 text-[10px]">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-muted-foreground">
                    Remove Empty Rows
                  </span>
                  <input
                    type="checkbox"
                    checked={removeEmptyRows}
                    onChange={(e) =>
                      handleUpdate("removeEmptyRows", e.target.checked)
                    }
                    className="rounded accent-purple-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-muted-foreground">Trim Whitespace</span>
                  <input
                    type="checkbox"
                    checked={trimWhitespace}
                    onChange={(e) =>
                      handleUpdate("trimWhitespace", e.target.checked)
                    }
                    className="rounded accent-purple-500"
                  />
                </label>
              </div>
            </div>

            <div className="bg-foreground/5 rounded-md p-2">
              <p className="text-1xl font-mono font-semibold uppercase">Sort</p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-muted-foreground mb-1 block text-[10px] font-semibold">
                    Sort By:
                  </label>
                  <input
                    type="text"
                    value={sortColumn}
                    onChange={(e) => handleUpdate("sortColumn", e.target.value)}
                    placeholder="e.g. status, user_id, price..."
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/60 h-8 w-full rounded-lg border px-2 font-mono text-xs transition-colors focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-[10px] font-semibold">
                    Sort Direction:
                  </label>
                  <CompactSelect
                    fullWidth
                    clearable={false}
                    placeholder="Asc / Desc"
                    value={sortDirection}
                    items={sortDirectionOptions}
                    onValueChange={(val) => handleUpdate("sortDirection", val)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DashedCircleHandle
          type="source"
          position={Position.Right}
          id={EDGE_TYPES.MODIF}
          accepts={[EDGE_TYPES.MODIF]}
          fillClassName="fill-purple-600 group-hover:fill-purple-500"
        />
      </div>
    );
  }
);

export default ModifFileNode;
