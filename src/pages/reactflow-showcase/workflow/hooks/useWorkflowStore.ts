import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  reconnectEdge,
  type Edge,
  type Node,
} from "@xyflow/react";
import { create } from "zustand";
import {
  EDGE_COLOR_MAP,
  LOG_TYPE,
  NODE_STATUS,
  NODE_TYPE,
  OUTPUT_TYPE,
} from "../constants/workflow";
import type {
  ExecutionLogEntry,
  WorkflowNodeData,
  WorkflowState,
} from "../types/workflow";

const initialNodes: Node<WorkflowNodeData>[] = [];
const initialEdges: Edge[] = [];

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  reconnectEdgeId: null,
  isExecuting: false,
  activeRunId: null,
  triggerPayload: null,
  logs: [
    {
      id: "log-init",
      timestamp: new Date().toLocaleTimeString(),
      level: LOG_TYPE.INFO,
      message:
        "ETL Workflow Engine initialized. Click 'Queue Prompt' to execute.",
    },
  ],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const edgeClassName =
      (connection.sourceHandle && EDGE_COLOR_MAP[connection.sourceHandle]) ||
      "";
    set({
      edges: addEdge(
        {
          ...connection,
          type: "dashedBezier",
          data: { className: edgeClassName },
        },
        get().edges
      ),
    });
  },

  onReconnect: (oldEdge, newConnection) =>
    set({
      reconnectEdgeId: null,
      edges: reconnectEdge(oldEdge, newConnection, get().edges),
    }),

  onReconnectStart: (_, edge: Edge) => {
    set({ reconnectEdgeId: edge.id });
  },

  onReconnectEnd: () => {
    set({ reconnectEdgeId: null });
  },

  addLog: (logInput) => {
    const newLog: ExecutionLogEntry = {
      id:
        logInput.id ||
        `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: logInput.timestamp || new Date().toLocaleTimeString(),
      level: logInput.level,
      nodeId: logInput.nodeId,
      nodeTitle: logInput.nodeTitle,
      message: logInput.message,
    };
    set((state) => ({ logs: [...state.logs, newLog] }));
  },

  setIsExecuting: (v) => {
    set({ isExecuting: v });
  },

  setActiveRunId: (id) => {
    set({ activeRunId: id });
  },

  clearTriggerPayload: () => {
    set({ triggerPayload: null });
  },

  setWorkflow: (nodes, edges) => {
    set({ nodes, edges });
  },

  addNode: (type, variant) => {
    const currentNodes = get().nodes;
    const id = `node_${Date.now()}`;
    const offset = (currentNodes.length % 5) * 35;
    let newNode: Node<WorkflowNodeData>;

    if (type === NODE_TYPE.EXTRACT) {
      newNode = {
        id,
        type: NODE_TYPE.EXTRACT,
        position: { x: 50, y: 100 + offset },
        data: {
          title: `Extract Node (${(variant || "CSV").toUpperCase()})`,
          description: "Membaca file data input mentah",
          accept: variant || OUTPUT_TYPE.CSV,
          status: NODE_STATUS.IDLE,
          progress: 0,
        },
      };
    } else if (type === NODE_TYPE.TRANSFORM) {
      newNode = {
        id,
        type: NODE_TYPE.TRANSFORM,
        position: { x: 450, y: 100 + offset },
        data: {
          title: "Transform Node",
          description: "Aturan filter & sort data",
          status: NODE_STATUS.IDLE,
          progress: 0,
        },
      };
    } else {
      newNode = {
        id,
        type: NODE_TYPE.LOAD,
        position: { x: 1150, y: 100 + offset },
        data: {
          title: "Load Node (Output)",
          description: "Simpan & Download File Final",
          status: NODE_STATUS.IDLE,
          progress: 0,
        },
      };
    }

    set({ nodes: [...currentNodes, newNode] });
    get().addLog({
      level: LOG_TYPE.INFO,
      message: `Added new ${type} node (${id}).`,
    });
  },

  deleteNode: (nodeId) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    }),

  updateNodeData: (id, dataUpdate, options) =>
    set({
      nodes: get().nodes.map((node) => {
        if (node.id !== id) return node;
        const next =
          typeof dataUpdate === "function" ? dataUpdate(node) : dataUpdate;
        return {
          ...node,
          data: options?.replace
            ? (next as WorkflowNodeData)
            : { ...node.data, ...next },
        };
      }),
    }),

  clearLogs: () => {
    set({ logs: [] });
  },

  cancelExecution: () => {
    const { activeRunId } = get();
    if (activeRunId) {
      get().addLog({
        level: LOG_TYPE.WARN,
        message: `⏳ Cancelling run (${activeRunId}) on Trigger.dev...`,
      });

      fetch("/api/cancel-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: activeRunId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            get().addLog({
              level: LOG_TYPE.WARN,
              message: "⚠️ Execution cancelled on Trigger.dev.",
            });
          } else {
            throw new Error(data.error);
          }
        })
        .catch((err) => {
          get().addLog({
            level: LOG_TYPE.ERROR,
            message: `❌ Cancel request failed: ${err.message}`,
          });
        });
    } else {
      get().addLog({
        level: LOG_TYPE.WARN,
        message: "⚠️ Execution cancelled.",
      });
    }

    const resetNodes = get().nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        status: NODE_STATUS.IDLE,
        progress: 0,
      },
    }));

    set({
      isExecuting: false,
      triggerPayload: null,
      activeRunId: null,
      nodes: resetNodes,
    });
  },

  queuePrompt: () => {
    const { nodes, edges } = get();

    if (get().isExecuting) return;

    if (nodes.length === 0) {
      get().addLog({
        level: LOG_TYPE.WARN,
        message: "⚠️ Canvas is empty. Add nodes first.",
      });
      return;
    }

    const cleanedNodes = nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        status: NODE_STATUS.IDLE,
        progress: 0,
      },
    }));

    set({
      nodes: cleanedNodes,
      isExecuting: true,
      triggerPayload: {
        nodes: cleanedNodes,
        edges: edges,
      },
    });

    get().addLog({
      level: LOG_TYPE.INFO,
      message: `🚀 Queue Prompt triggered. Sending graph to Trigger.dev...`,
    });
  },
}));

export default useWorkflowStore;
