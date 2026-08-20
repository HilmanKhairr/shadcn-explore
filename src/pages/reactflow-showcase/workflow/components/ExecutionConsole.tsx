import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Terminal,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { LOG_TYPE } from "../constants/workflow";
import useWorkflowStore from "../hooks/useWorkflowStore";

export default function ExecutionConsole() {
  const [isOpen, setIsOpen] = useState(false);

  const logs = useWorkflowStore((s) => s.logs);
  const clearLogs = useWorkflowStore((s) => s.clearLogs);

  return (
    <div
      className={cn(
        "border-border bg-card/95 fixed right-0 bottom-0 left-0 z-40 border-t shadow-2xl backdrop-blur-md transition-all duration-300",
        isOpen ? "h-56" : "h-10"
      )}
    >
      <div className="border-border/60 bg-muted/40 flex h-10 items-center justify-between border-b px-4 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-bold transition-colors hover:text-emerald-500"
          >
            <Terminal className="size-4 text-emerald-500" />
            <span className="hidden sm:inline">
              Execution Console & ETL Logs
            </span>
            {isOpen ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronUp className="size-3.5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono text-[10px]">
            {logs.length} events
          </span>
          {isOpen && (
            <button
              onClick={clearLogs}
              className="text-muted-foreground hover:text-foreground cursor-pointer p-1 transition-colors"
              title="Clear Console Logs"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="h-[calc(100%-2.5rem)] space-y-1.5 overflow-y-auto bg-zinc-950 p-3 font-mono text-xs text-zinc-300">
          {logs.length === 0 ? (
            <p className="py-6 text-center text-xs text-zinc-600">
              No execution logs recorded yet.
            </p>
          ) : (
            logs.map((log) => {
              const Icon =
                log.level === LOG_TYPE.SUCCESS
                  ? CheckCircle2
                  : log.level === LOG_TYPE.ERROR
                    ? XCircle
                    : log.level === LOG_TYPE.WARN
                      ? AlertTriangle
                      : Info;

              return (
                <div
                  key={log.id}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded border-b-2 px-2 py-0.5 font-mono text-[11px] leading-relaxed sm:flex-row sm:border-none",
                    log.level === LOG_TYPE.SUCCESS &&
                      "bg-emerald-950/20 text-emerald-400",
                    log.level === LOG_TYPE.ERROR &&
                      "bg-red-950/20 text-red-400",
                    log.level === LOG_TYPE.WARN &&
                      "bg-amber-950/20 text-amber-400",
                    log.level === LOG_TYPE.INFO && "text-zinc-300"
                  )}
                >
                  <span className="shrink-0 text-[10px] text-zinc-500 select-none">
                    {log.timestamp}
                  </span>
                  <div className="flex flex-row gap-2">
                    <Icon className="mt-0.5 size-3.5 shrink-0" />
                    <span className="break-normal">{log.message}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

