import { cn } from "@/lib/utils";
import type { Connection, Edge, HandleProps } from "@xyflow/react";
import { Handle, useNodeConnections } from "@xyflow/react";

type DashedCircleHandleProps = {
  id: string;
  accepts?: string[];
  className?: string;
  fillClassName?: string;
  strokeClassName?: string;
} & HandleProps;

const DashedCircleHandle = (props: DashedCircleHandleProps) => {
  const {
    id,
    accepts,
    className,
    fillClassName,
    strokeClassName,
    isConnectable = true,
    ...restProps
  } = props ?? {};
  const connections = useNodeConnections({
    handleId: id,
    handleType: restProps.type,
  });

  const checkValidConnection = (connection: Connection | Edge) => {
    if (!accepts || accepts.length === 0) return true;

    let oppositeHandleId = connection.targetHandle ?? connection.sourceHandle;

    if (restProps.type === "source") oppositeHandleId = connection.targetHandle;
    if (restProps.type === "target") oppositeHandleId = connection.sourceHandle;

    return (
      typeof oppositeHandleId === "string" && accepts.includes(oppositeHandleId)
    );
  };

  const disabled = !isConnectable && connections.length < 1;

  return (
    <Handle
      id={id}
      className={cn("group h-3! w-3! border-none bg-none", className)}
      isValidConnection={checkValidConnection}
      isConnectable={isConnectable}
      {...restProps}
    >
      <svg
        className="group pointer-events-none absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="6"
          cy="6"
          r="11"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="5 2"
          className={cn(
            "transition-colors",
            strokeClassName ?? "text-border group-hover:text-primary/50",
            disabled && "group-hover:text-muted/50"
          )}
        />
        <circle
          cx="6"
          cy="6"
          r="7"
          className={cn(
            "transition-colors",
            fillClassName ?? "fill-amber-600 group-hover:fill-amber-500",
            disabled && "fill-muted group-hover:fill-muted-500"
          )}
        />
      </svg>
    </Handle>
  );
};

export default DashedCircleHandle;
