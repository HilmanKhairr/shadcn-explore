import CompactSelect from "@/components/compact/CompactSelect";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { AlertCircle, LoaderIcon, SlidersHorizontal } from "lucide-react";
import { memo, useEffect } from "react";
import { EDGE_TYPE, NODE_STATUS } from "../../constants/workflow";
import {
  type InputFileNodeData,
  type ModifFileNodeData,
} from "../../types/workflow";
import DashedCircleHandle from "../handle/DashedCircleHandle";

export type ModifFileNodeProps = Node<ModifFileNodeData, "transformNode">;

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
    const { updateNodeData } = useReactFlow<ModifFileNodeProps, Edge>();

    const targetConnections = useNodeConnections({ id, handleType: "target" });
    const sourceIds = targetConnections.map((c) => c.source);
    const nodesData = useNodesData(sourceIds);

    const hasSourceNode = !!sourceIds.length;
    const mergeSources = data?.value?.mergeSources ?? false;
    const filterColumn = data?.value?.filterColumn || "";
    const filterOperation = data?.value?.filterOperation || "";
    const filterValue = data?.value?.filterValue || "";
    const limitRows =
      data?.value?.limitRows !== undefined
        ? String(data?.value?.limitRows)
        : "";
    const removeEmptyRows = data?.value?.removeEmptyRows ?? false;
    const trimWhitespace = data?.value?.trimWhitespace ?? false;
    const sortColumn = data?.value?.sortColumn || "";
    const sortDirection = data?.value?.sortDirection || "";

    const nodeStatus = data.status || NODE_STATUS.IDLE;
    const statusIdle = nodeStatus === NODE_STATUS.IDLE;
    const statusQueued = nodeStatus === NODE_STATUS.QUEUED;
    const statusRunning = nodeStatus === NODE_STATUS.RUNNING;
    const statusCompleted = nodeStatus === NODE_STATUS.COMPLETED;

    const handleUpdate = (field: string, val: unknown) => {
      updateNodeData(id, (node) => {
        return {
          value: { ...node?.data?.value, [field]: val },
          status: NODE_STATUS.IDLE,
        };
      });
    };

    useEffect(() => {
      const hasConnectedNodes = nodesData.length > 0;
      const isAllInputsValid =
        hasConnectedNodes &&
        nodesData.every((nd) => {
          return Boolean((nd?.data as InputFileNodeData)?.isValid);
        });

      updateNodeData(id, {
        isValid: isAllInputsValid,
      });
    }, [id, nodesData, updateNodeData]);

    return (
      <div
        className={cn(
          "bg-card border-border hover:border-primary/60 focus:border-primary max-w-160 min-w-72 rounded-2xl border p-4.5 shadow-md transition-all",
          !!selected && "border-primary! ring-primary/20 shadow-lg ring-2",
          statusQueued && "border-amber-500/50 bg-amber-500/5",
          statusRunning &&
            "border-purple-500 shadow-[0_0_25px_rgba(16,185,129,0.5)] ring-4 ring-purple-500",
          statusCompleted &&
            "border-purple-500/80 bg-purple-500/5 dark:bg-purple-950/10"
        )}
      >
        <DashedCircleHandle
          type="target"
          position={Position.Left}
          id={EDGE_TYPE.INPUT}
          accepts={[EDGE_TYPE.INPUT]}
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />

        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-4 text-purple-500" />
            <span className="text-foreground text-xs font-bold tracking-tight">
              {data.title || "Transform Config Node"}
            </span>
          </div>
          {statusIdle && (
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-[9px] uppercase",
                hasSourceNode
                  ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-400"
              )}
            >
              {hasSourceNode ? "READY" : "AWAITING DATA"}
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
              className="animate-pulse border-purple-500/40 bg-purple-500/10 font-mono text-[9px] text-purple-400"
            >
              <LoaderIcon className="size-3 animate-spin" />
              Transforming
            </Badge>
          )}
          {statusCompleted && (
            <Badge
              variant="outline"
              className="border-purple-500/40 bg-purple-500/10 font-mono text-[9px] text-purple-400"
            >
              Ready
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground mb-3! text-left text-[10px] leading-relaxed">
          {data.description ||
            "Konfigurasi kriteria filter baris dan transformasi data secara dinamis."}
        </p>

        {(statusRunning || statusQueued) && (
          <div className="mb-3 space-y-1 text-left">
            <div className="flex justify-between font-mono text-[15px] font-semibold text-purple-400">
              <span>{statusRunning ? "Transforming..." : "Queued"}</span>
              <span>{data.progress || 0}%</span>
            </div>
            <div className="h-3.5 w-full overflow-hidden rounded-full border border-purple-500/20 bg-purple-950/40">
              <div
                className="h-full bg-linear-to-r from-purple-500 to-indigo-400 transition-all duration-200 ease-out"
                style={{ width: `${data.progress || 0}%` }}
              />
            </div>
          </div>
        )}

        {!hasSourceNode ? (
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
                    disabled={statusRunning || statusQueued}
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
                    disabled={statusRunning || statusQueued}
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
                    disabled={statusRunning || statusQueued}
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
                  disabled={statusRunning || statusQueued}
                  onValueChange={(val) =>
                    handleUpdate("limitRows", Number(val))
                  }
                />
              </div>

              <div className="border-border/50 space-y-1.5 border-t pt-2 text-[10px]">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-muted-foreground">
                    Merge Incoming Sources
                  </span>
                  <input
                    type="checkbox"
                    checked={mergeSources}
                    disabled={statusRunning || statusQueued}
                    onChange={(e) =>
                      handleUpdate("mergeSources", e.target.checked)
                    }
                    className="rounded accent-purple-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-muted-foreground">
                    Remove Empty Rows
                  </span>
                  <input
                    type="checkbox"
                    checked={removeEmptyRows}
                    disabled={statusRunning || statusQueued}
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
                    disabled={statusRunning || statusQueued}
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
                    disabled={statusRunning || statusQueued}
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
                    disabled={statusRunning || statusQueued}
                    onValueChange={(val) => handleUpdate("sortDirection", val)}
                  />
                </div>
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
          id={EDGE_TYPE.MODIF}
          accepts={[EDGE_TYPE.MODIF]}
          fillClassName="fill-purple-600 group-hover:fill-purple-500"
        />
      </div>
    );
  }
);

export default ModifFileNode;
