import CompactDatePicker from "@/components/ui/compact/CompactDatePicker";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { CalendarIcon } from "lucide-react";
import { memo } from "react";

type CompactDatePickerNodeData = {
  title?: string;
  description?: string;
  datePickerProps: React.ComponentPropsWithoutRef<typeof CompactDatePicker>;
};

type CompactDatePickerNodeProps = Node<
  CompactDatePickerNodeData,
  "compactDatePicker"
>;

const CompactDatePickerNode = memo(
  ({ data }: NodeProps<CompactDatePickerNodeProps>) => {
    return (
      <div className="bg-card border-border hover:border-primary/60 min-w-50 rounded-xl border p-4 shadow-md">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="size-4 text-fuchsia-500" />
          <span className="text-xs font-bold tracking-tight">
            {data.title || "Date Picker"}
          </span>
        </div>
        <p className="text-muted-foreground mb-4! text-[10px] leading-relaxed">
          {data.description || "Custom date picker component."}
        </p>

        <div className="nodrag">
          <CompactDatePicker fullWidth {...data.datePickerProps} />
        </div>

        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
  }
);

export default CompactDatePickerNode;
