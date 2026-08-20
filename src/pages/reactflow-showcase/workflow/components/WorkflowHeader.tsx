import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Play,
  RotateCcw,
  Save,
  Square,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useResetWorkflow,
  useSaveWorkflow,
  useWorkflowDefinition,
} from "../hooks/useWorkflowQuery";
import useWorkflowStore from "../hooks/useWorkflowStore";

export default function WorkflowHeader() {
  const navigate = useNavigate();

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const isExecuting = useWorkflowStore((s) => s.isExecuting);
  const queuePrompt = useWorkflowStore((s) => s.queuePrompt);
  const cancelExecution = useWorkflowStore((s) => s.cancelExecution);

  const saveMutation = useSaveWorkflow();
  const resetMutation = useResetWorkflow();
  const { data: workflowData, isFetching } = useWorkflowDefinition();

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    saveMutation.mutate(
      {
        nodes,
        edges,
        name: workflowData?.name,
      },
      {
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 1500);
        },
      }
    );
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset canvas to the default staging workflow?"
      )
    ) {
      resetMutation.mutate();
    }
  };

  return (
    <header className="border-border bg-card/90 sticky top-0 z-50 flex items-center justify-between border-b px-4 py-2.5 backdrop-blur-md sm:px-6 sm:py-3">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          startIcon={<ArrowLeft className="size-3.5" />}
          onClick={() => navigate("/reactflow-showcase")}
        >
          <span className="hidden sm:inline">Overview</span>
        </Button>

        {isFetching && (
          <>
            <div className="bg-border hidden h-4 w-px sm:block" />
            <span className="text-muted-foreground hidden items-center gap-1 text-[11px] md:flex">
              <Loader2 className="size-3 animate-spin" />
              Syncing...
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={resetMutation.isPending || isExecuting}
          startIcon={
            resetMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RotateCcw className="size-3.5" />
            )
          }
          className="text-xs"
        >
          <span className="hidden sm:inline">Reset Preset</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saveMutation.isPending || isExecuting}
          startIcon={
            saveMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : isSaved ? (
              <CheckCircle2 className="size-3.5 text-emerald-500" />
            ) : (
              <Save className="text-primary size-3.5" />
            )
          }
          className="text-xs font-medium"
        >
          <span className="hidden sm:inline">
            {saveMutation.isPending ? "Saving..." : "Save Workflow"}
          </span>
        </Button>

        <div className="bg-border h-4 w-px" />

        {isExecuting ? (
          <Button
            onClick={cancelExecution}
            variant="destructive"
            size="sm"
            startIcon={<Square className="size-3.5 fill-current" />}
            className="cursor-pointer text-xs font-semibold shadow-sm"
          >
            <span className="hidden sm:inline">Cancel Run</span>
          </Button>
        ) : (
          <Button
            onClick={queuePrompt}
            size="sm"
            className="cursor-pointer bg-emerald-600 text-xs font-semibold text-white shadow-sm ring-2 ring-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95"
            startIcon={<Play className="size-3.5 fill-current" />}
          >
            <span className="hidden sm:inline">Queue Prompt</span>
          </Button>
        )}
      </div>
    </header>
  );
}

