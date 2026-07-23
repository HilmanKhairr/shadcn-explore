import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  reconnectEdge,
} from "@xyflow/react";
import { create } from "zustand";
import { EDGE_COLOR_MAP } from "../constants/pipeline";
import type {
  InputFileNodeData,
  PipelineConfig,
  PipelineDataItem,
  PipelinePayload,
  PipelineState,
} from "../types/pipeline";

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 0, y: 50 },
    type: "inputNode",
    data: {
      accept: "csv",
      buttonProps: {
        children: "Upload File CSV",
      },
    },
  },
  {
    id: "n11",
    position: { x: -150, y: 300 },
    type: "inputNode",
    data: {
      accept: "csv",
      buttonProps: {
        children: "Upload File CSV",
      },
    },
  },
  {
    id: "n2",
    position: { x: 400, y: 50 },
    type: "filterNode",
    data: {
      title: "Transform Config Node",
      description: "Konfigurasi filter baris, kolom, dan layout PDF.",
      filterColumn: "status",
      filterValue: "Active",
      textTransform: "none",
      limitRows: 100,
      pdfOrientation: "portrait",
    },
  },
  {
    id: "n22",
    position: { x: 200, y: 500 },
    type: "filterNode",
    data: {
      title: "Transform Config Node",
      description: "Konfigurasi filter baris, kolom, dan layout PDF.",
      filterColumn: "status",
      filterValue: "Active",
      textTransform: "none",
      limitRows: 100,
      pdfOrientation: "portrait",
    },
  },
  {
    id: "n3",
    position: { x: 900, y: 350 },
    type: "outputFile",
    data: {
      title: "Output File Node",
      description:
        "Pilih format hasil konversi (JSON / PDF) dan proses via Trigger.dev.",
      outputFormat: "json",
      filename: "converted_result.json",
      status: "idle",
    },
  },
];

const initialEdges: Edge[] = [];

const usePipelineStore = create<PipelineState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  reconnectEdgeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const edgeClassName =
      (connection.sourceHandle && EDGE_COLOR_MAP[connection.sourceHandle]) ||
      "";

    const newEdge = {
      ...connection,
      type: "dashedBezier",
      data: {
        className: edgeClassName,
      },
    };

    set({
      edges: addEdge(newEdge, get().edges),
    });
  },

  onReconnect: (oldEdge, newConnection) => {
    set({
      reconnectEdgeId: null,
      edges: reconnectEdge(oldEdge, newConnection, get().edges),
    });
  },

  onReconnectStart: (_, edge: Edge) => {
    set({
      reconnectEdgeId: edge.id,
    });
  },

  onReconnectEnd: () => {
    set({
      reconnectEdgeId: null,
    });
  },

  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => {
    set({
      nodes: typeof payload === "function" ? payload(get().nodes) : payload,
    });
  },

  setEdges: (payload: Edge[] | ((nodes: Edge[]) => Edge[])) => {
    set({
      edges: typeof payload === "function" ? payload(get().edges) : payload,
    });
  },

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    });
  },

  getNodePayload: (targetNodeId: string) => {
    const { nodes, edges } = get();

    const traverseUpstream = (
      currentNodeId: string,
      visited = new Set<string>()
    ): PipelinePayload => {
      if (visited.has(currentNodeId)) {
        return { isValid: false, data: [] };
      }

      const nextVisited = new Set(visited).add(currentNodeId);
      const incomingEdges = edges.filter((e) => e.target === currentNodeId);

      if (incomingEdges.length === 0) {
        return { isValid: false, data: [] };
      }

      const data: PipelineDataItem[] = [];
      let isValid = true;

      for (const edge of incomingEdges) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (!sourceNode) {
          isValid = false;
          continue;
        }

        switch (sourceNode.type) {
          case "inputNode": {
            const fileData = sourceNode.data as InputFileNodeData;
            if (!fileData?.fileInfo || fileData.fileInfo.status === "error") {
              isValid = false;
            } else {
              data.push({
                file: {
                  nodeId: sourceNode.id,
                  ...fileData.fileInfo,
                },
              });
            }
            break;
          }
          case "filterNode": {
            const configObj: PipelineConfig = {
              nodeId: sourceNode.id,
              ...sourceNode.data,
            };

            const upstream = traverseUpstream(sourceNode.id, nextVisited);
            if (!upstream.isValid) isValid = false;

            if (upstream.data.length === 0) {
              data.push({ config: configObj });
            } else {
              upstream.data.forEach((uItem) => {
                data.push({
                  ...uItem,
                  config: uItem.config
                    ? { ...uItem.config, ...configObj }
                    : configObj,
                });
              });
            }
            break;
          }
          default:
            break;
        }
      }

      return {
        isValid: isValid && data.length > 0,
        data,
      };
    };

    return traverseUpstream(targetNodeId);
  },
}));

export default usePipelineStore;
