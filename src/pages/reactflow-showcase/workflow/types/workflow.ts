import type { Button } from "@/components/ui/button";
import type { DeserializedJson } from "@trigger.dev/core";
import type {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  OnReconnect,
  ReactFlowProps,
} from "@xyflow/react";
import type {
  LOG_TYPE,
  NODE_STATUS,
  NODE_TYPE,
  OUTPUT_TYPE,
} from "../constants/workflow";

export type NodeType = (typeof NODE_TYPE)[keyof typeof NODE_TYPE];
export type NodeStatus = (typeof NODE_STATUS)[keyof typeof NODE_STATUS];
export type OutputType = (typeof OUTPUT_TYPE)[keyof typeof OUTPUT_TYPE];
export type LogType = (typeof LOG_TYPE)[keyof typeof LOG_TYPE];

export type InputFileNodeData = {
  title?: string;
  description?: string;
  accept?: string;
  maxSize?: number;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  value?: {
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    content?: string;
    status?: string;
    error?: string;
  } | null;
  isValid?: boolean;
  status?: NodeStatus;
  progress?: number;
  previews?: Record<string, DeserializedJson>[];
};

export type ModifFileNodeData = {
  title?: string;
  description?: string;
  value?: {
    mergeSources?: boolean;
    filterColumn?: string;
    filterOperation?: string;
    filterValue?: string;
    limitRows?: number;
    removeEmptyRows?: boolean;
    trimWhitespace?: boolean;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
  };
  isValid?: boolean;
  status?: NodeStatus;
  progress?: number;
  previews?: Record<string, DeserializedJson>[];
};

export type OutputFileItem = {
  fileName: string;
  resultContent: string;
  rowCount: number;
  downloadUrl?: string;
};

export type OutputFileNodeData = {
  title?: string;
  description?: string;
  value?: {
    outputType?: OutputType;
  };
  isValid?: boolean;
  status?: NodeStatus;
  progress?: number;
  results?: OutputFileItem[];
};

export type WorkflowNodeData = InputFileNodeData &
  ModifFileNodeData &
  OutputFileNodeData;

export type WorkflowState = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  reconnectEdgeId: string | null;

  isExecuting: boolean;
  activeRunId: string | null;
  logs: ExecutionLogEntry[];
  // Serialized graph set by queuePrompt, consumed by useWorkflowRunner to trigger the task
  triggerPayload: WorkflowPayload | null;

  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onReconnect: OnReconnect;
  onReconnectStart: ReactFlowProps["onReconnectStart"];
  onReconnectEnd: ReactFlowProps["onReconnectEnd"];

  setWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void;
  addNode: (type: NodeType, variant?: string) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (
    id: string,
    dataUpdate:
      | Partial<WorkflowNodeData>
      | ((node: Node<WorkflowNodeData>) => Partial<WorkflowNodeData>),
    options?: { replace: boolean }
  ) => void;

  addLog: (
    log: Omit<ExecutionLogEntry, "id" | "timestamp"> & {
      id?: string;
      timestamp?: string;
    }
  ) => void;

  setIsExecuting: (v: boolean) => void;
  setActiveRunId: (id: string | null) => void;
  clearTriggerPayload: () => void;

  queuePrompt: () => void;
  cancelExecution: () => void;
  clearLogs: () => void;
};

export type ExecutionLogEntry = {
  id: string;
  timestamp: string;
  level: LogType;
  nodeId?: string;
  nodeTitle?: string;
  message: string;
};

export type WorkflowPayload = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
};

export type NodeRunMetadata = {
  status: NodeStatus;
  progress: number;
  previewRows?: Record<string, DeserializedJson>[];
};

export type NodeResult = {
  nodeId: string;
  nodeType: NodeType;
  outputType: OutputType;
  rowCount: number;
  fileName?: string;
  files?: OutputFileItem[];
};

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  updatedAt: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}
