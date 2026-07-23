import { cn } from "@/lib/utils";
import type { PipelinePayload } from "@/pages/reactflow-showcase/types";
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import DashedCircleHandle from "../../handle/DashedCircleHadle";

export type FilterConfigNodeData = {
  title?: string;
  description?: string;
  filterColumn?: string;
  filterOperation?: "equals" | "contains" | "greater_than";
  filterValue?: string;
  textTransform?: "none" | "uppercase" | "lowercase";
  limitRows?: number;
  pdfOrientation?: "portrait" | "landscape";
  payload?: PipelinePayload;
};

export type FilterConfigNodeProps = Node<FilterConfigNodeData, "filterConfig">;

const ConfigNode = memo(
  (props: NodeProps<FilterConfigNodeProps>) => {
    return (
      <div
        className={cn(
          "bg-card border-border max-w-80 min-w-72 rounded-2xl border p-4.5 shadow-md transition-all hover:border-purple-500/60 focus:border-purple-500",
          !!props.selected &&
            "border-purple-500! shadow-lg ring-2 ring-purple-500/20"
        )}
      >
        {/* Top Handle */}
        <DashedCircleHandle
          type="target"
          position={Position.Top}
          fillClassName="fill-purple-600 group-hover:fill-purple-500"
        />
        TEST
        {/* Bottom Handle */}
        <DashedCircleHandle
          type="source"
          position={Position.Bottom}
          fillClassName="fill-purple-600 group-hover:fill-purple-500"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.selected === nextProps.selected
    );
  }
);

export default ConfigNode;

