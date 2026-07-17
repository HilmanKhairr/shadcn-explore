import { Button } from "@/components/ui/button";
import type { Node, NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { HandIcon } from "lucide-react";
import { memo } from "react";
import DashedCircleHandle from "../handle/DashedCircleHadle";

type ButtonNodeData = {
  title?: string;
  description?: string;
  buttopProps: React.ComponentPropsWithoutRef<typeof Button>;
};

type ButtonNodeProps = Node<ButtonNodeData, "button">;

const ButtonNode = memo(
  ({ data }: NodeProps<ButtonNodeProps>) => {
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

        <DashedCircleHandle
          position={Position.Bottom}
          type="source"
          id="a"
          className="left-20!"
        />
        <DashedCircleHandle
          position={Position.Bottom}
          type="source"
          id="b"
          fillClassName="fill-emerald-600 group-hover:fill-emerald-500"
        />
        <DashedCircleHandle
          position={Position.Bottom}
          type="source"
          id="c"
          className="left-30!"
          fillClassName="fill-rose-600 group-hover:fill-rose-500"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
  }
);

export default ButtonNode;
