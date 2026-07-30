import { cn } from "@/lib/utils";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import { useMemo } from "react";
import usePipelineStore from "../hooks/usePipelineStore";
import DashedBezierEdge from "./edge/DashedBezierEdge";
import InputFileNode from "./node/InputFileNode";
import ModifFileNode from "./node/ModifFileNode";
import OutputFileNode from "./node/OutputFileNode";

const nodeTypes = {
  inputNode: InputFileNode,
  modifNode: ModifFileNode,
  outputNode: OutputFileNode,
};

const edgeTypes = {
  dashedBezier: DashedBezierEdge,
};

const WorkflowConverter = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    onReconnectStart,
    onReconnectEnd,
  } = usePipelineStore();

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.selected);
  }, [nodes]);

  return (
    <div
      className={cn(
        "relative flex flex-1",
        selectedNode
          ? "w-full md:w-[calc(100vw-31rem)]"
          : "w-full md:w-[calc(100vw-13rem)]"
      )}
    >
      <ReactFlow
        fitView
        defaultEdgeOptions={{ type: "dashedBezier" }}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Controls
          fitViewOptions={{
            duration: 2000,
          }}
        />
        <MiniMap
          pannable
          zoomable
          nodeBorderRadius={20}
          nodeStrokeWidth={3}
          nodeStrokeColor="var(--foreground)"
        />
        <Background
          id="1"
          gap={50}
          size={8}
          variant={BackgroundVariant.Cross}
        />
        <Background
          id="2"
          gap={25}
          size={3}
          offset={15}
          color="#ccc"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowConverter;
