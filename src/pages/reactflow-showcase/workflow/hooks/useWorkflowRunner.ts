import type { workflowExecutionTask } from "@/triggers/index";
import { useRealtimeRun, useTaskTrigger } from "@trigger.dev/react-hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { LOG_TYPE, NODE_STATUS, OUTPUT_TYPE } from "../constants/workflow";
import type { NodeResult, NodeRunMetadata } from "../types/workflow";
import useWorkflowStore from "./useWorkflowStore";

export function useWorkflowRunner() {
  const addLog = useWorkflowStore((s) => s.addLog);
  const triggerPayload = useWorkflowStore((s) => s.triggerPayload);
  const setIsExecuting = useWorkflowStore((s) => s.setIsExecuting);
  const setActiveRunId = useWorkflowStore((s) => s.setActiveRunId);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const clearTriggerPayload = useWorkflowStore((s) => s.clearTriggerPayload);

  const [liveToken, setLiveToken] = useState("");
  const pendingPayloadRef = useRef<typeof triggerPayload>(null);
  const isFetchingTokenRef = useRef<boolean>(false);
  const workflowCompletedRef = useRef<boolean>(false);

  const {
    submit,
    handle,
    error: triggerError,
  } = useTaskTrigger<typeof workflowExecutionTask>("workflow-execution", {
    accessToken: liveToken,
    enabled: !!liveToken,
  });

  const { run, error: realtimeError } = useRealtimeRun<
    typeof workflowExecutionTask
  >(handle?.id, {
    accessToken: handle?.publicAccessToken,
    enabled: !!handle?.id,
  });

  const handleStopExecuting = useCallback(() => {
    setIsExecuting(false);
    setActiveRunId(null);
  }, [setIsExecuting, setActiveRunId]);

  async function fetchTriggerToken(taskId: string): Promise<string> {
    const res = await fetch(`/api/trigger-token?task=${taskId}`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    if (!data.publicAccessToken)
      throw new Error(`No triggerToken in response: ${JSON.stringify(data)}`);
    return data.publicAccessToken;
  }

  const processRunUpdate = useCallback(
    (currentRun: {
      status?: string;
      metadata?: Record<string, unknown>;
      output?: unknown;
    }) => {
      if (!currentRun || workflowCompletedRef.current) return;

      const isExecutingCurrent = useWorkflowStore.getState().isExecuting;
      const nodesMetadata = currentRun.metadata?.nodes as
        | Record<string, NodeRunMetadata>
        | undefined;
      if (nodesMetadata && isExecutingCurrent) {
        Object.entries(nodesMetadata).forEach(([nodeId, info]) => {
          updateNodeData(nodeId, {
            status: info.status,
            progress: info.progress,
            previews: info.previewRows,
          });
        });
      }

      if (currentRun.status === "COMPLETED") {
        workflowCompletedRef.current = true;
        const output = currentRun.output as {
          nodeResults?: NodeResult[];
        } | null;
        const nodeResults = output?.nodeResults ?? [];

        nodeResults.forEach((result) => {
          const mimeType =
            result.outputType === OUTPUT_TYPE.CSV
              ? "text/csv"
              : "application/json";
          const results = result.files?.map((f) => {
            const fileBlob = new Blob([f.resultContent], { type: mimeType });
            return {
              ...f,
              downloadUrl: URL.createObjectURL(fileBlob),
            };
          });

          updateNodeData(result.nodeId, (node) => ({
            status: NODE_STATUS.COMPLETED,
            progress: 100,
            value: {
              ...node.data.value,
              outputType: result.outputType,
            },
            results,
          }));
        });

        addLog({
          level: LOG_TYPE.SUCCESS,
          message: "🎉 Workflow completed successfully!",
        });

        handleStopExecuting();
      } else if (
        currentRun.status === "FAILED" ||
        currentRun.status === "CRASHED" ||
        currentRun.status === "CANCELED"
      ) {
        workflowCompletedRef.current = true;
        const isCanceled = currentRun.status === "CANCELED";
        addLog({
          level: isCanceled ? LOG_TYPE.WARN : LOG_TYPE.ERROR,
          message: `${isCanceled ? "⚠️" : "❌"} Workflow ${currentRun.status.toLowerCase()} on Trigger.dev.`,
        });

        if (isCanceled) {
          useWorkflowStore.getState().nodes.forEach((n) => {
            updateNodeData(n.id, {
              status: NODE_STATUS.IDLE,
              progress: 0,
            });
          });
        }

        handleStopExecuting();
      }
    },
    [updateNodeData, addLog, handleStopExecuting]
  );

  const syncRunStatus = useCallback(async () => {
    const currentRunId = useWorkflowStore.getState().activeRunId;
    const isExecutingCurrent = useWorkflowStore.getState().isExecuting;
    if (!currentRunId || !isExecutingCurrent || workflowCompletedRef.current)
      return;

    try {
      const res = await fetch(`/api/run-status?runId=${currentRunId}`);
      if (res.ok) {
        const data = await res.json();
        processRunUpdate(data);
      }
    } catch {
      // Ignore network errors in background
    }
  }, [processRunUpdate]);

  // Effect dapatkan token setelah triggerPayload diperbarui
  useEffect(() => {
    if (!triggerPayload || isFetchingTokenRef.current) return;

    isFetchingTokenRef.current = true;
    workflowCompletedRef.current = false;
    pendingPayloadRef.current = triggerPayload;
    clearTriggerPayload();

    addLog({
      level: LOG_TYPE.INFO,
      message: "Fetching trigger token for workflow-execution...",
    });

    fetchTriggerToken("workflow-execution")
      .then((token) => setLiveToken(token))
      .catch((err) => {
        isFetchingTokenRef.current = false;
        pendingPayloadRef.current = null;
        handleStopExecuting();
        addLog({
          level: LOG_TYPE.ERROR,
          message: `Token fetch failed: ${err.message}`,
        });
      });
  }, [triggerPayload, addLog, handleStopExecuting, clearTriggerPayload]);

  // Effect mulai trigger setelah mendapatkan token
  useEffect(() => {
    if (!liveToken || !pendingPayloadRef.current || !isFetchingTokenRef.current)
      return;
    const payload = pendingPayloadRef.current;
    pendingPayloadRef.current = null;
    isFetchingTokenRef.current = false;

    addLog({
      level: LOG_TYPE.INFO,
      message: "Submitting workflow-execution to Trigger.dev...",
    });

    submit(payload);
  }, [liveToken, addLog, submit, updateNodeData]);

  // Sinkronisasi handle.id
  useEffect(() => {
    if (handle?.id) {
      setActiveRunId(handle.id);
    }
  }, [handle?.id, setActiveRunId]);

  // Effect update UI berdasarkan subscribe trigger
  useEffect(() => {
    if (run) {
      processRunUpdate(run);
    }
  }, [run, processRunUpdate]);

  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        syncRunStatus();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    const interval = setInterval(() => {
      const isExecutingCurrent = useWorkflowStore.getState().isExecuting;
      if (isExecutingCurrent && !workflowCompletedRef.current) {
        syncRunStatus();
      }
    }, 2500);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      clearInterval(interval);
    };
  }, [syncRunStatus]);

  // Effect untuk handle error
  const currentError = triggerError || realtimeError;
  useEffect(() => {
    if (!currentError) return;
    addLog({
      level: LOG_TYPE.ERROR,
      message: `Error: ${currentError.message}`,
    });
    handleStopExecuting();
  }, [currentError, addLog, handleStopExecuting]);

  return { run, error: currentError };
}
