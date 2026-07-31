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
  processedValue?: {
    fileName: string;
    fileSize: string;
    fileType: string;
    content?: string;
    status?: string;
    error?: string;
  } | null;
  isValid?: boolean;
};

export type ProcessedFileItem = {
  fileName: string;
  rows: Record<string, unknown>[];
  headers: string[];
};

export type ModifFileNodeData = {
  title?: string;
  description?: string;
  value?: {
    filterColumn?: string;
    filterOperation?: string;
    filterValue?: string;
    limitRows?: number;
    removeEmptyRows?: boolean;
    trimWhitespace?: boolean;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
  };
  processedValue?: ProcessedFileItem[] | null;
  isValid?: boolean;
};

export type OutputFileNodeData = {
  title?: string;
  filename?: string;
  description?: string;
  outputFormat?: OutputFormat;
  status?: "idle" | "running" | "completed" | "error";
  value?: {
    mergeOutput?: boolean;
  };
  isValid?: boolean;
};

export type CustomNodeData = InputFileNodeData &
  ModifFileNodeData &
  OutputFileNodeData;

export type PipelineDataItem = {
  inputProcessed?: InputFileNodeData["processedValue"];
  modifProcessed?: ProcessedFileItem;
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

  addNode: (
    type: "inputNode" | "modifNode" | "outputNode",
    variant?: string
  ) => void;
};
