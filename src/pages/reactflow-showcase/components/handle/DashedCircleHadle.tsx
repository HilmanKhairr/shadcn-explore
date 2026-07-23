import { cn } from "@/lib/utils";
import type { HandleProps } from "@xyflow/react";
import { Handle } from "@xyflow/react";

type DashedCircleHandleProps = {
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
} & HandleProps;

const DashedCircleHandle = (props: DashedCircleHandleProps) => {
  const { className, strokeClassName, fillClassName, ...restProps } =
    props ?? {};

  return (
    <Handle className={cn("border-none bg-none", className)} {...restProps}>
      <svg
        className="group absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="6"
          cy="6"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 1"
          className={cn(
            "transition-colors",
            strokeClassName ?? "text-border group-hover:text-primary/50"
          )}
        />
        <circle
          cx="6"
          cy="6"
          r="3.5"
          className={cn(
            "transition-colors",
            fillClassName ?? "fill-amber-600 group-hover:fill-amber-500"
          )}
        />
      </svg>
    </Handle>
  );
};

export default DashedCircleHandle;
