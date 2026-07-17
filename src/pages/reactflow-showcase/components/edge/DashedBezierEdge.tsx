import { cn } from "@/lib/utils";
import {
  BaseEdge,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

type DashedBezierEdgeProps = Edge<{ className: string }, "dashedBezier">;

const DashedBezierEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<DashedBezierEdgeProps>) => {
  // const { deleteElements } = useReactFlow();
  // const [edgePath, labelX, labelY] = getBezierPath({
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn(
          "stroke-border stroke-2! [stroke-dasharray:10,5]",
          data?.className
        )}
      />
      {/* <EdgeLabelRenderer>
        <Button
          className="nodrag nopan pointer-events-auto absolute top-0 left-0 -translate-1/2"
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
