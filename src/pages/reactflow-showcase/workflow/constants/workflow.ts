import type { WorkflowDefinition } from "../types/workflow";

export const NODE_TYPE = {
  EXTRACT: "extractNode",
  TRANSFORM: "transformNode",
  LOAD: "loadNode",
} as const;

export const NODE_STATUS = {
  IDLE: "idle",
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETED: "completed",
  ERROR: "error",
} as const;

export const EDGE_TYPE = {
  INPUT: "input-node-handle",
  MODIF: "filter-node-handle",
} as const;

export const OUTPUT_TYPE = {
  JSON: "json",
  CSV: "csv",
} as const;

export const LOG_TYPE = {
  INFO: "info",
  SUCCESS: "success",
  WARN: "warn",
  ERROR: "error",
} as const;

export const EDGE_COLOR_MAP: Record<string, string> = {
  [EDGE_TYPE.INPUT]: "stroke-emerald-500!",
  [EDGE_TYPE.MODIF]: "stroke-purple-500!",
};

export const WORKFLOW_ID = "workflow-default";
export const STORAGE_PREFIx = "shadcn_workflow_db_";

export const DEFAULT_WORKFLOW: WorkflowDefinition = {
  id: WORKFLOW_ID,
  name: "Pipeline",
  version: "1.0.0",
  updatedAt: new Date().toISOString(),
  nodes: [
    {
      id: "node_extract_1",
      type: NODE_TYPE.EXTRACT,
      position: { x: 60, y: 160 },
      data: {
        title: "Extract Node (CSV)",
        description: "Membaca file data input mentah",
        accept: OUTPUT_TYPE.CSV,
        status: NODE_STATUS.IDLE,
        progress: 0,
        isValid: true,
        value: {
          fileName: "products.csv",
          fileSize: "1.2 KB",
          fileType: "text/csv",
          status: "ready",
          content: [
            "id,name,category,price,stock",
            "P-101,Wireless Ergonomic Mouse,Electronics,49.99,120",
            "P-102,Mechanical Gaming Keyboard,Electronics,129.99,45",
            "P-103,Noise Cancelling Headphones,Audio,199.99,30",
            "P-104,Desk Mat Extended,Accessories,24.50,200",
            "P-105,USB-C Multiport Dock,Electronics,79.00,15",
          ].join("\n"),
        },
      },
    },
    {
      id: "node_transform_1",
      type: NODE_TYPE.TRANSFORM,
      position: { x: 480, y: 160 },
      data: {
        title: "Transform Node",
        description: "Aturan filter & sort data",
        status: NODE_STATUS.IDLE,
        progress: 0,
        isValid: true,
        value: {
          mergeSources: true,
          filterColumn: "category",
          filterOperation: "equals",
          filterValue: "Electronics",
          sortColumn: "price",
          sortDirection: "desc",
          trimWhitespace: true,
          removeEmptyRows: true,
        },
      },
    },
    {
      id: "node_load_1",
      type: NODE_TYPE.LOAD,
      position: { x: 1220, y: 160 },
      data: {
        title: "Load Node (Output)",
        description: "Simpan & Download File Final",
        status: NODE_STATUS.IDLE,
        progress: 0,
        isValid: true,
        value: {
          outputType: OUTPUT_TYPE.JSON,
        },
      },
    },
  ],
  edges: [
    {
      id: "edge_extract_to_transform",
      source: "node_extract_1",
      target: "node_transform_1",
      sourceHandle: "input-node-handle",
      targetHandle: "input-node-handle",
      type: "dashedBezier",
      data: { className: "stroke-emerald-500!" },
    },
    {
      id: "edge_transform_to_load",
      source: "node_transform_1",
      target: "node_load_1",
      sourceHandle: "filter-node-handle",
      targetHandle: "filter-node-handle",
      type: "dashedBezier",
      data: { className: "stroke-purple-500!" },
    },
  ],
};
