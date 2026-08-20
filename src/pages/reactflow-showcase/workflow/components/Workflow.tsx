import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { LOG_TYPE } from "../constants/workflow";
import { useWorkflowDefinition } from "../hooks/useWorkflowQuery";
import { useWorkflowRunner } from "../hooks/useWorkflowRunner";
import useWorkflowStore from "../hooks/useWorkflowStore";
import DashedBezierEdge from "./edge/DashedBezierEdge";
import InputFileNode from "./nodes/InputFileNode";
import ModifFileNode from "./nodes/ModifFileNode";
import OutputFileNode from "./nodes/OutputFileNode";

const nodeTypes = {
  extractNode: InputFileNode,
  transformNode: ModifFileNode,
  loadNode: OutputFileNode,
};

const edgeTypes = {
  dashedBezier: DashedBezierEdge,
};

const Workflow = () => {
  useWorkflowRunner();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    setWorkflow,
    addLog,
  } = useWorkflowStore();

  const { data: workflowData, isLoading } = useWorkflowDefinition();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (workflowData && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setWorkflow(workflowData.nodes, workflowData.edges);
      addLog({
        level: LOG_TYPE.INFO,
        message: `📥 Loaded workflow definition "${workflowData.name}" (${workflowData.version}) via TanStack Query.`,
      });
    }
  }, [workflowData, setWorkflow, addLog]);

  return (
    <main className="bg-background relative h-full flex-1">
      {isLoading && (
        <div className="bg-background/80 absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 backdrop-blur-xs">
          <Loader2 className="text-primary size-8 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium">
              Loading Workflow via TanStack Query...
            </p>
            <p className="text-muted-foreground text-xs">
              Fetching staging definition from local database
            </p>
          </div>
        </div>
      )}

      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { strokeWidth: 2, stroke: "var(--primary)" },
        }}
      >
        <Controls fitViewOptions={{ duration: 1000 }} />
        <MiniMap pannable zoomable nodeBorderRadius={12} nodeStrokeWidth={2} />
        <Background
          id="bg-cross"
          gap={40}
          size={6}
          variant={BackgroundVariant.Cross}
        />
        <Background
          id="bg-dots"
          gap={20}
          size={2}
          color="var(--muted-foreground)"
          style={{ opacity: 0.2 }}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </main>
  );
};

export default Workflow;
