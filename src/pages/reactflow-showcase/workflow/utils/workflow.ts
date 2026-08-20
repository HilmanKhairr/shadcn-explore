import type { Edge, Node } from "@xyflow/react";
import { NODE_TYPE } from "../constants/workflow";
import type { WorkflowNodeData } from "../types/workflow";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function getAbortSignal(context: unknown): AbortSignal | undefined {
  if (
    typeof context === "object" &&
    context !== null &&
    "signal" in context &&
    context.signal instanceof AbortSignal
  ) {
    return context.signal;
  }
  return undefined;
}

export function calculateWaves(
  activeNodeIds: Set<string>,
  edges: Edge[],
  nodes: Node<WorkflowNodeData>[]
): Node<WorkflowNodeData>[][] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  activeNodeIds.forEach((id) => {
    inDegree[id] = 0;
    adj[id] = [];
  });

  edges.forEach((e) => {
    if (activeNodeIds.has(e.source) && activeNodeIds.has(e.target)) {
      adj[e.source]?.push(e.target);
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    }
  });

  const waves: Node<WorkflowNodeData>[][] = [];
  let currentWaveIds = Array.from(activeNodeIds).filter(
    (id) => inDegree[id] === 0
  );

  while (currentWaveIds.length > 0) {
    const currentWaveNodes = currentWaveIds
      .map((id) => nodeMap.get(id))
      .filter((n): n is Node => Boolean(n));
    waves.push(currentWaveNodes);

    const nextWaveIds: string[] = [];
    for (const id of currentWaveIds) {
      for (const neighbor of adj[id] || []) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          nextWaveIds.push(neighbor);
        }
      }
    }
    currentWaveIds = nextWaveIds;
  }

  return waves;
}

export function findAllWorkflowPaths(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): string[][] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  const nodeMap: Record<string, Node> = {};

  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adj[n.id] = [];
    nodeMap[n.id] = n;
  });
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (inDegree[e.target] !== undefined) inDegree[e.target]++;
  });

  const rootIds = nodes
    .filter((n) => {
      const isExtractValid = n.type === NODE_TYPE.EXTRACT && n.data.isValid;
      const hasOutgoingEdge = (adj[n.id]?.length ?? 0) > 0;
      return isExtractValid && hasOutgoingEdge;
    })
    .map((n) => n.id);

  if (!rootIds.length) return [];

  const paths: string[][] = [];
  function dfs(currentId: string, path: string[]) {
    if (nodeMap[currentId]?.type === NODE_TYPE.LOAD) {
      paths.push([...path]);
      return;
    }

    const next = adj[currentId] || [];
    for (const id of next) {
      if (path.includes(id)) continue;
      path.push(id);
      dfs(id, path);
      path.pop();
    }
  }
  rootIds.forEach((id) => dfs(id, [id]));
  return paths;
}
