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

const initialNodes: Node[] = [];
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

  addNode: (type, variant) => {
    const currentNodes = get().nodes;
    const id = `node_${Date.now()}`;
    const offset = (currentNodes.length % 5) * 40;

    let defaultPosition = { x: 100 + offset, y: 100 + offset };
    if (type === "inputNode") {
      defaultPosition = { x: 50, y: 100 + offset };
    } else if (type === "modifNode") {
      defaultPosition = { x: 450, y: 100 + offset };
    } else if (type === "outputNode") {
      defaultPosition = { x: 1150, y: 100 + offset };
    }

    let newNode: Node;
    if (type === "inputNode") {
      const tempVar = variant || "csv";
      newNode = {
        id,
        position: defaultPosition,
        type: "inputNode",
        data: {
          title: `Upload ${tempVar.toUpperCase()}`,
          description: `Node untuk input file ${tempVar.toUpperCase()}`,
          accept: tempVar.toLowerCase(),
          buttonProps: {
            children: `Upload File ${tempVar.toUpperCase()}`,
          },
        },
      };
    } else if (type === "modifNode") {
      newNode = {
        id,
        position: defaultPosition,
        type: "modifNode",
        data: {
          title: "Transform Config Node",
          description: "Node untuk konfigurasi filter dan sort",
        },
      };
    } else {
      newNode = {
        id,
        position: defaultPosition,
        type: "outputNode",
        data: {
          title: "Output File Node",
          description: "Node untuk download file hasil konversi",
          outputFormat: "json",
          filename: "converted_result.json",
          status: "idle",
        },
      };
    }

    set({
      nodes: [...currentNodes, newNode],
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
                fileData: {
                  nodeId: sourceNode.id,
                  ...fileData.fileInfo,
                },
              });
            }
            break;
          }
          case "modifNode": {
            const configObj: PipelineConfig = {
              nodeId: sourceNode.id,
              ...sourceNode.data,
            };

            const upstream = traverseUpstream(sourceNode.id, nextVisited);
            if (!upstream.isValid) isValid = false;

            if (upstream.data.length === 0) {
              data.push({ configData: configObj });
            } else {
              upstream.data.forEach((uItem) => {
                data.push({
                  ...uItem,
                  configData: uItem.configData
                    ? { ...uItem.configData, ...configObj }
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
