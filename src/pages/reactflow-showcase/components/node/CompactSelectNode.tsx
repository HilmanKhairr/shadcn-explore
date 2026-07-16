import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { ListChecksIcon } from "lucide-react";
import { memo } from "react";
import CompactSelect from "../../../../components/ui/compact/CompactSelect";

type CompactSelectNodeData = {
  title?: string;
  description?: string;
  selectProps: React.ComponentPropsWithoutRef<typeof CompactSelect>;
};

type CompactSelectNodeProps = Node<CompactSelectNodeData, "compactSelect">;

const CompactSelectNode = memo(
  ({ data }: NodeProps<CompactSelectNodeProps>) => {
    console.log("CompactSelectNode rendering! Data:", data);
    return (
      <div className="bg-card border-border hover:border-primary/60 min-w-50 rounded-xl border p-4 shadow-md">
        <div className="flex items-center gap-1.5">
          <ListChecksIcon className="size-4 text-emerald-500" />
          <span className="text-xs font-bold tracking-tight">
            {data.title || "Select Picker"}
          </span>
        </div>
        <p className="text-muted-foreground mb-4! text-[10px] leading-relaxed">
          {data.description || "Custom select picker component."}
        </p>

        <div className="nodrag">
          <CompactSelect fullWidth {...data.selectProps} />
        </div>

        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }
);

export default CompactSelectNode;
