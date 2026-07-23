import type { Edge, Node } from "@xyflow/react";
import type { InputFileNodeData } from "../components/node/input/FileNode";
import type { PipelineConfig, PipelineFile, PipelinePayload } from "../types";

export function getPipelinePayload(
  currentNodeId: string,
  nodes: Node[],
  edges: Edge[],
  currentPath = new Set<string>()
): PipelinePayload {
  if (currentPath.has(currentNodeId)) {
    return { isValid: false, files: [], configs: [] };
  }

  const nextPath = new Set(currentPath);
  nextPath.add(currentNodeId);

  const incomingEdges = edges.filter((e) => e.target === currentNodeId);
  if (incomingEdges.length === 0) {
    return { isValid: false, files: [], configs: [] };
  }

  const filesMap = new Map<string, PipelineFile>();
  const configsMap = new Map<string, PipelineConfig>();
  let isValid = true;

  for (const edge of incomingEdges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    if (!sourceNode) {
      isValid = false;
      continue;
    }

    if (sourceNode.type === "inputFile") {
      console.log("masuk1");
      const fileData = sourceNode.data as InputFileNodeData;
      if (!fileData?.fileInfo || fileData.fileInfo.status === "error") {
        isValid = false;
      } else {
        filesMap.set(sourceNode.id, {
          nodeId: sourceNode.id,
          fileName: fileData.fileInfo.fileName,
          fileSize: fileData.fileInfo.fileSize,
          fileType: fileData.fileInfo.fileType,
        });
      }
    } else if (sourceNode.type === "transformConfig") {
      console.log("masuk2");

      const upstream = getPipelinePayload(
        sourceNode.id,
        nodes,
        edges,
        nextPath
      );
      if (!upstream.isValid) isValid = false;

      upstream.files.forEach((f) => filesMap.set(f.nodeId, f));
      upstream.configs.forEach((c) => configsMap.set(c.nodeId, c));
    }
  }

  const resultFiles = Array.from(filesMap.values());
  const resultConfigs = Array.from(configsMap.values());

  return {
    isValid: isValid && (resultFiles.length > 0 || resultConfigs.length > 0),
    files: resultFiles,
    configs: resultConfigs,
  };
}

