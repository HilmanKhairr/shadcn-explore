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
import type { PipelineState } from "../types/pipeline";

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
}));

export default usePipelineStore;
