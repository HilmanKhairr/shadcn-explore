import type { Button } from "@/components/ui/button";
import type {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  OnReconnect,
  ReactFlowProps,
} from "@xyflow/react";

export type OutputFormat = "json" | "csv";

export type InputFileNodeData = {
  title?: string;
  description?: string;
  accept?: string;
  maxSize?: number;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  fileInfo?: {
    file: File;
    fileName: string;
    fileSize: string;
    fileType: string;
    status?: string;
    error?: string;
  } | null;
};

export type ModifFileNodeData = {
  title?: string;
  description?: string;
  headers?: string[];

  filterColumn?: string;
  filterOperation?: string;
  filterValue?: string;
  limitRows?: number;
  removeEmptyRows?: boolean;
  trimWhitespace?: boolean;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
};

export type OutputFileNodeData = {
  title?: string;
  description?: string;
  outputFormat?: OutputFormat;
  mergeOutput?: boolean;
  filename?: string;
  status?: "idle" | "running" | "completed" | "error";
  payload?: PipelinePayload;
};

// prettier-ignore
export type CustomNodeData = 
  InputFileNodeData &
  ModifFileNodeData &
  OutputFileNodeData;

export type PipelineFile = {
  nodeId: string;
} & InputFileNodeData["fileInfo"];

export type PipelineConfig = {
  nodeId: string;
  [key: string]: unknown;
};

export type PipelineDataItem = {
  fileData?: PipelineFile;
  configData?: PipelineConfig;
};

export type PipelinePayload = {
  isValid: boolean;
  data: PipelineDataItem[];
};

export type PipelineState = {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  reconnectEdgeId: string | null;

  onNodesChange: OnNodesChange<Node<CustomNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onReconnect: OnReconnect;
  onReconnectStart: ReactFlowProps["onReconnectStart"];
  onReconnectEnd: ReactFlowProps["onReconnectEnd"];

  setNodes: (nodes: Node<CustomNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void;
  addNode: (
    type: "inputNode" | "modifNode" | "outputNode",
    variant?: string
  ) => void;

  getNodePayload: (targetNodeId: string) => PipelinePayload;
};
