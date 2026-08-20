import type { Edge, Node } from "@xyflow/react";
import {
  DEFAULT_WORKFLOW,
  STORAGE_PREFIx,
  WORKFLOW_ID,
} from "../constants/workflow";
import type { WorkflowDefinition, WorkflowNodeData } from "../types/workflow";
import { delay } from "../utils/workflow";

export async function fetchWorkflowDefinition(
  workflowId: string = WORKFLOW_ID
): Promise<WorkflowDefinition> {
  await delay(500);

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIx}${workflowId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as WorkflowDefinition;
      return parsed;
    }
  } catch (err) {
    console.error("Failed to parse workflow definition from localStorage", err);
  }

  const fallback = {
    ...DEFAULT_WORKFLOW,
    id: workflowId,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(
      `${STORAGE_PREFIx}${workflowId}`,
      JSON.stringify(fallback)
    );
  } catch (err) {
    console.error(
      "Failed to seed initial staging workflow to localStorage",
      err
    );
  }

  return fallback;
}

export async function saveWorkflowDefinition(
  workflowId: string,
  payload: {
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
    name?: string;
  }
): Promise<WorkflowDefinition> {
  await delay(500);

  let existing: WorkflowDefinition = DEFAULT_WORKFLOW;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIx}${workflowId}`);
    if (raw) {
      existing = JSON.parse(raw);
    }
  } catch {
    // none
  }

  const updated: WorkflowDefinition = {
    ...existing,
    id: workflowId,
    name: payload.name || existing.name,
    updatedAt: new Date().toISOString(),
    nodes: payload.nodes,
    edges: payload.edges,
  };

  localStorage.setItem(
    `${STORAGE_PREFIx}${workflowId}`,
    JSON.stringify(updated)
  );

  return updated;
}

export async function resetWorkflowDefinition(
  workflowId: string = WORKFLOW_ID
): Promise<WorkflowDefinition> {
  await delay(300);

  const resetData: WorkflowDefinition = {
    ...DEFAULT_WORKFLOW,
    id: workflowId,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    `${STORAGE_PREFIx}${workflowId}`,
    JSON.stringify(resetData)
  );

  return resetData;
}

