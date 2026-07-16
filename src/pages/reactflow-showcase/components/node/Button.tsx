import { Button } from "@/components/ui/button";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { HandIcon } from "lucide-react";
import { memo } from "react";

type ButtonNodeData = {
  title?: string;
  description?: string;
  buttopProps: React.ComponentPropsWithoutRef<typeof Button>;
};

type ButtonNodeProps = Node<ButtonNodeData, "button">;

const ButtonNode = memo(({ data }: NodeProps<ButtonNodeProps>) => {
  console.log("ButtonNode rendering! Data:", data);
  return (
    <div className="bg-card border-border hover:border-primary/60 min-w-50 rounded-xl border p-4 shadow-md">
      <div className="flex items-center gap-1.5">
        <HandIcon className="size-4 text-rose-500" />
        <span className="text-xs font-bold tracking-tight">
          {data.title || "Button"}
        </span>
      </div>
      <p className="text-muted-foreground mb-4! text-[10px] leading-relaxed">
        {data.description || "Custom button component."}
      </p>

      <div className="nodrag">
        <Button fullWidth {...data.buttopProps} />
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export default ButtonNode;
