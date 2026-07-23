import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BaseEdge,
  EdgeToolbar,
  getBezierPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import { TrashIcon } from "lucide-react";

type DashedBezierEdgeProps = Edge<
  { className: string; label: string },
  "dashedBezier"
>;

const DashedBezierEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  ...props
}: EdgeProps<DashedBezierEdgeProps>) => {
  const { deleteElements } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <EdgeToolbar edgeId={id} x={labelX} y={labelY}>
        <Button
          variant="destructive"
          size="xs"
          startIcon={<TrashIcon />}
          onClick={() => deleteElements({ edges: [{ id }] })}
        >
          Delete
        </Button>
      </EdgeToolbar>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn(
          "stroke-border stroke-2! [stroke-dasharray:10,5]",
          data?.className
        )}
        labelX={labelX}
        labelY={labelY}
        {...props}
      />
      {/* <EdgeLabelRenderer>
        <Button
          className="nodrag nopan pointer-events-auto absolute top-0 left-0"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          onClick={() => deleteElements({ edges: [{ id }] })}
        >
          delete
        </Button>
      </EdgeLabelRenderer> */}
    </>
  );
};

export default DashedBezierEdge;
