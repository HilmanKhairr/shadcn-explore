import {
  NODE_STATUS,
  OUTPUT_TYPE,
} from "@/pages/reactflow-showcase/workflow/constants/workflow";
import type {
  NodeResult,
  NodeRunMetadata,
  NodeType,
  OutputFileItem,
  WorkflowNodeData,
  WorkflowPayload,
} from "@/pages/reactflow-showcase/workflow/types/workflow";
import {
  calculateWaves,
  findAllWorkflowPaths,
  getAbortSignal,
} from "@/pages/reactflow-showcase/workflow/utils/workflow";
import type { DeserializedJson } from "@trigger.dev/core";
import { metadata, task } from "@trigger.dev/sdk";
import type { Node } from "@xyflow/react";
import {
  applyDataTransformations,
  convertRowsToCsv,
  processInputData,
  type TransformOptions,
} from "../lib/csvConverter";

async function animateNodeProgress(
  nodesStatus: Record<string, NodeRunMetadata>,
  nodeId: string,
  startProgress: number,
  endProgress: number,
  baseDurationMs: number = 700,
  signal?: AbortSignal
) {
  const steps = 4 + Math.floor(Math.random() * 4);
  const speedVariation = 0.7 + Math.random() * 0.8;
  const totalDuration = baseDurationMs * speedVariation;
  const avgStepTime = totalDuration / steps;

  let currentP;
  const remainingTotal = endProgress - startProgress;

  for (let i = 1; i <= steps; i++) {
    if (signal?.aborted) return;

    if (i === steps) {
      currentP = endProgress;
    } else {
      const expectedRatio = i / steps;
      const jitter = (Math.random() - 0.5) * 0.15;
      const ratio = Math.max(0, Math.min(1, expectedRatio + jitter));
      currentP = Math.round(startProgress + remainingTotal * ratio);
    }

    nodesStatus[nodeId] = {
      ...nodesStatus[nodeId],
      status: NODE_STATUS.RUNNING,
      progress: currentP,
    };
    metadata.set("nodes", { ...nodesStatus });

    const stepDelay = Math.round(avgStepTime * (0.7 + Math.random() * 0.6));
    await new Promise((r) => setTimeout(r, stepDelay));
  }
}

function getBalancedPreviewRows(
  rows: Record<string, DeserializedJson>[],
  limit: number = 50
): Record<string, DeserializedJson>[] {
  if (rows.length <= limit) return rows;

  const sourceGroups = new Map<string, Record<string, DeserializedJson>[]>();
  for (const row of rows) {
    const src = typeof row._source === "string" ? row._source : "__default__";
    if (!sourceGroups.has(src)) sourceGroups.set(src, []);
    sourceGroups.get(src)!.push(row);
  }

  if (sourceGroups.size > 1) {
    const perSourceLimit = Math.ceil(limit / sourceGroups.size);
    const sampled: Record<string, DeserializedJson>[] = [];

    for (const groupRows of sourceGroups.values()) {
      sampled.push(...groupRows.slice(0, perSourceLimit));
    }

    return sampled.slice(0, limit);
  }

  return rows.slice(0, limit);
}

export const extractNodeTask = task({
  id: "extract-node-task",
  run: async (payload: { node: Node<WorkflowNodeData> }) => {
    const content = payload.node.data.value?.content ?? "";
    const accept = payload.node.data.accept ?? "csv";
    const isJson =
      accept === OUTPUT_TYPE.JSON || content.trim().startsWith("[");

    const rows = processInputData(content, { isJsonInput: isJson }) as Record<
      string,
      DeserializedJson
    >[];
    return { rows, rowCount: rows.length };
  },
});

export const transformNodeTask = task({
  id: "transform-node-task",
  run: async (payload: {
    node: Node<WorkflowNodeData>;
    sources: {
      sourceId: string;
      sourceTitle?: string;
      rows: Record<string, DeserializedJson>[];
    }[];
  }) => {
    const { node, sources } = payload;
    const mergeSources = node.data.value?.mergeSources ?? false;
    const options: TransformOptions = {
      filterColumn: node.data.value?.filterColumn,
      filterOperation: node.data.value?.filterOperation,
      filterValue: node.data.value?.filterValue,
      sortColumn: node.data.value?.sortColumn,
      sortDirection: node.data.value?.sortDirection as
        | "asc"
        | "desc"
        | undefined,
      limitRows: node.data.value?.limitRows,
      removeEmptyRows: node.data.value?.removeEmptyRows,
      trimWhitespace: node.data.value?.trimWhitespace,
    };

    let transformed: Record<string, DeserializedJson>[];

    if (mergeSources && sources.length > 1) {
      const allRows = sources.flatMap((s) => s.rows);
      transformed = applyDataTransformations(allRows, options) as Record<
        string,
        DeserializedJson
      >[];
    } else {
      transformed = sources.flatMap((s) => {
        const res = applyDataTransformations(s.rows, options) as Record<
          string,
          DeserializedJson
        >[];
        return res.map((row) => ({
          _source: s.sourceTitle || s.sourceId,
          ...row,
        }));
      });
    }

    return { rows: transformed, rowCount: transformed.length };
  },
});

export const loadNodeTask = task({
  id: "load-node-task",
  run: async (payload: {
    node: Node<WorkflowNodeData>;
    sources: {
      sourceId: string;
      sourceTitle?: string;
      rows: Record<string, DeserializedJson>[];
    }[];
  }) => {
    const { node, sources } = payload;
    const outputType = node.data.value?.outputType ?? OUTPUT_TYPE.JSON;

    const allRows = sources.flatMap((s) => s.rows);
    const files: OutputFileItem[] = [];

    sources.forEach((src) => {
      const internalSources = new Set(
        src.rows
          .map((r) => (typeof r._source === "string" ? r._source : ""))
          .filter(Boolean)
      );

      if (internalSources.size > 1) {
        internalSources.forEach((intSrc) => {
          const intRows = src.rows
            .filter((r) => r._source === intSrc)
            .map((r) => {
              const clean = { ...r };
              delete clean._source;
              return clean;
            });
          const safeName = intSrc.replace(/[^a-zA-Z0-9_-]/g, "_");
          files.push({
            fileName: `${safeName}_result.${outputType}`,
            resultContent:
              outputType === "csv"
                ? convertRowsToCsv(intRows)
                : JSON.stringify(intRows, null, 2),
            rowCount: intRows.length,
          });
        });
      } else {
        const cleanRows = src.rows.map((r) => {
          const clean = { ...r };
          delete clean._source;
          return clean;
        });
        const safeName = (src.sourceTitle || src.sourceId).replace(
          /[^a-zA-Z0-9_-]/g,
          "_"
        );
        files.push({
          fileName: `${safeName}_result.${outputType}`,
          resultContent:
            outputType === "csv"
              ? convertRowsToCsv(cleanRows)
              : JSON.stringify(cleanRows, null, 2),
          rowCount: cleanRows.length,
        });
      }
    });

    return {
      nodeId: node.id,
      outputType,
      rowCount: allRows.length,
      files: files ?? undefined,
    };
  },
});

export const workflowExecutionTask = task({
  id: "workflow-execution",
  run: async (payload: WorkflowPayload, { ctx }) => {
    const { nodes, edges } = payload;
    const signal = getAbortSignal(ctx);

    const activeNodeIds = new Set(
      (findAllWorkflowPaths(nodes, edges) || []).flatMap((p) => p)
    );

    if (activeNodeIds.size === 0) {
      return { nodesStatus: {}, nodeResults: [] };
    }

    const loadResults: NodeResult[] = [];
    const nodesStatus: Record<string, NodeRunMetadata> = {};
    const intermediateResults: Record<
      string,
      Record<string, DeserializedJson>[]
    > = {};

    activeNodeIds.forEach((nodeId) => {
      nodesStatus[nodeId] = { status: NODE_STATUS.QUEUED, progress: 0 };
    });
    metadata.set("nodes", { ...nodesStatus });

    const waves = calculateWaves(activeNodeIds, edges, nodes);

    for (const wave of waves) {
      if (signal?.aborted) break;
      await Promise.all(
        wave.map((n) =>
          animateNodeProgress(nodesStatus, n.id, 0, 85, 6000, signal)
        )
      );
      if (signal?.aborted) break;

      const extractNodes = wave.filter((n) => n.type === "extractNode");
      const transformNodes = wave.filter((n) => n.type === "transformNode");
      const loadNodes = wave.filter((n) => n.type === "loadNode");

      if (extractNodes.length > 0) {
        if (signal?.aborted) break;
        const batch = await extractNodeTask.batchTriggerAndWait(
          extractNodes.map((n) => ({
            payload: { node: n },
            options: { tags: [`node-id:${n.id}`] },
          }))
        );
        if (signal?.aborted) break;
        batch.runs.forEach((r, idx) => {
          const nodeId = extractNodes[idx].id;
          if (r.ok) {
            intermediateResults[nodeId] = r.output.rows;
          } else {
            nodesStatus[nodeId] = { status: NODE_STATUS.ERROR, progress: 0 };
            throw new Error(
              `Extract node ${nodeId} failed: ${String(r.error)}`
            );
          }
        });
      }

      if (transformNodes.length > 0) {
        if (signal?.aborted) break;
        const batch = await transformNodeTask.batchTriggerAndWait(
          transformNodes.map((n) => {
            const upstreamSources = edges
              .filter((e) => e.target === n.id && activeNodeIds.has(e.source))
              .map((e) => {
                const srcNode = nodes.find((node) => node.id === e.source);
                return {
                  sourceId: e.source,
                  sourceTitle: srcNode?.data?.value?.fileName,
                  rows: intermediateResults[e.source] ?? [],
                };
              });

            return {
              payload: { node: n, sources: upstreamSources },
              options: { tags: [`node-id:${n.id}`] },
            };
          })
        );
        if (signal?.aborted) break;
        batch.runs.forEach((r, idx) => {
          const nodeId = transformNodes[idx].id;
          if (r.ok) {
            intermediateResults[nodeId] = r.output.rows;
          } else {
            nodesStatus[nodeId] = { status: NODE_STATUS.ERROR, progress: 0 };
            throw new Error(
              `Transform node ${nodeId} failed: ${String(r.error)}`
            );
          }
        });
      }

      if (loadNodes.length > 0) {
        if (signal?.aborted) break;
        const batch = await loadNodeTask.batchTriggerAndWait(
          loadNodes.map((n) => {
            const upstreamSources = edges
              .filter((e) => e.target === n.id && activeNodeIds.has(e.source))
              .map((e) => {
                const srcNode = nodes.find((node) => node.id === e.source);
                return {
                  sourceId: e.source,
                  sourceTitle: String(
                    srcNode?.data?.value?.fileName ||
                      intermediateResults[e.source]?.[0]?._source ||
                      ""
                  ),
                  rows: intermediateResults[e.source] ?? [],
                };
              });

            return {
              payload: { node: n, sources: upstreamSources },
              options: { tags: [`node-id:${n.id}`] },
            };
          })
        );
        if (signal?.aborted) break;
        batch.runs.forEach((r, idx) => {
          const nodeId = loadNodes[idx].id;
          if (r.ok) {
            loadResults.push({
              ...r.output,
              nodeType: "loadNode",
            });
            intermediateResults[nodeId] = edges
              .filter((e) => e.target === nodeId && activeNodeIds.has(e.source))
              .flatMap((e) => intermediateResults[e.source] ?? []);
          } else {
            nodesStatus[nodeId] = { status: NODE_STATUS.ERROR, progress: 0 };
            throw new Error(`Load node ${nodeId} failed: ${String(r.error)}`);
          }
        });
      }

      if (signal?.aborted) break;
      await Promise.all(
        wave.map((n) =>
          animateNodeProgress(nodesStatus, n.id, 85, 100, 300, signal)
        )
      );
      if (signal?.aborted) break;

      wave.forEach((n) => {
        const rows = intermediateResults[n.id] ?? [];
        nodesStatus[n.id] = {
          status: NODE_STATUS.COMPLETED,
          progress: 100,
          previewRows: getBalancedPreviewRows(rows, 50),
        };
      });

      metadata.set("nodes", { ...nodesStatus });
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const nodeResults: NodeResult[] = nodes
      .filter((n) => activeNodeIds.has(n.id))
      .map((n) => {
        const rows = intermediateResults[n.id] ?? [];
        const isLoad = n.type === "loadNode";
        const loadRes = loadResults.find((lr) => lr.nodeId === n.id);

        if (isLoad && loadRes) {
          return {
            nodeId: n.id,
            nodeType: n.type as NodeType,
            outputType: loadRes.outputType,
            rowCount: loadRes.rowCount,
            fileName: `result.${loadRes.outputType}`,
            files: loadRes.files,
          };
        }

        return {
          nodeId: n.id,
          nodeType: n.type as NodeType,
          outputType: "csv" as const,
          rowCount: rows.length,
          fileName: `${n.type}_output.csv`,
        };
      });

    return { nodesStatus, nodeResults };
  },
});
