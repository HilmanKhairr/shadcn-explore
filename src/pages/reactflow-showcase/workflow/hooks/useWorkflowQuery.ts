import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Edge, Node } from "@xyflow/react";
import { LOG_TYPE, WORKFLOW_ID } from "../constants/workflow";
import {
  fetchWorkflowDefinition,
  resetWorkflowDefinition,
  saveWorkflowDefinition,
} from "../services/workflowStorage";
import type { WorkflowDefinition, WorkflowNodeData } from "../types/workflow";
import useWorkflowStore from "./useWorkflowStore";

export const WORKFLOW_QUERY_KEYS = {
  detail: (id: string) => ["workflow", id] as const,
  all: ["workflow"] as const,
};

export function useWorkflowDefinition(workflowId: string = WORKFLOW_ID) {
  return useQuery({
    queryKey: WORKFLOW_QUERY_KEYS.detail(workflowId),
    queryFn: () => fetchWorkflowDefinition(workflowId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveWorkflow(workflowId: string = WORKFLOW_ID) {
  const queryClient = useQueryClient();
  const addLog = useWorkflowStore((s) => s.addLog);

  return useMutation({
    mutationFn: (payload: {
      nodes: Node<WorkflowNodeData>[];
      edges: Edge[];
      name?: string;
    }) => saveWorkflowDefinition(workflowId, payload),
    onMutate: () => {
      addLog({
        level: LOG_TYPE.INFO,
        message: `💾 Saving workflow modifications to database (localStorage)...`,
      });
    },
    onSuccess: (savedData: WorkflowDefinition) => {
      queryClient.setQueryData(
        WORKFLOW_QUERY_KEYS.detail(workflowId),
        savedData
      );
      addLog({
        level: LOG_TYPE.SUCCESS,
        message: `✅ Workflow "${savedData.name}" saved successfully!`,
      });
    },
    onError: (err: Error) => {
      addLog({
        level: LOG_TYPE.ERROR,
        message: `❌ Failed to save workflow: ${err.message}`,
      });
    },
  });
}

export function useResetWorkflow(workflowId: string = WORKFLOW_ID) {
  const queryClient = useQueryClient();
  const setWorkflow = useWorkflowStore((s) => s.setWorkflow);
  const addLog = useWorkflowStore((s) => s.addLog);

  return useMutation({
    mutationFn: () => resetWorkflowDefinition(workflowId),
    onMutate: () => {
      addLog({
        level: LOG_TYPE.INFO,
        message: `🔄 Resetting canvas to default staging template...`,
      });
    },
    onSuccess: (resetData: WorkflowDefinition) => {
      queryClient.setQueryData(
        WORKFLOW_QUERY_KEYS.detail(workflowId),
        resetData
      );
      setWorkflow(resetData.nodes, resetData.edges);
      addLog({
        level: LOG_TYPE.SUCCESS,
        message: `✨ Reset complete. Staging template reloaded.`,
      });
    },
    onError: (err: Error) => {
      addLog({
        level: LOG_TYPE.ERROR,
        message: `❌ Failed to reset workflow: ${err.message}`,
      });
    },
  });
}

