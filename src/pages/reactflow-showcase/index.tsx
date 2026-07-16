import { Button } from "@/components/ui/button";
import CompactSelectNode from "@/pages/reactflow-showcase/components/node/CompactSelectNode";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import ButtonNode from "./components/node/Button";
import CompactDatePickerNode from "./components/node/CompactDatePicker";

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    type: "button",
    data: {},
  },
  {
    id: "n2",
    position: { x: 250, y: 250 },
    type: "compactSelect",
    data: {},
  },
  {
    id: "n3",
    position: { x: 500, y: 500 },
    type: "compactDatePicker",
    data: {},
  },
];
const initialEdges: Edge[] = [
  {
    id: "n1-n2",
    source: "n1",
    target: "n2",
  },
  {
    id: "n2-n3",
    source: "n2",
    target: "n3",
  },
];

const nodeTypes = {
  button: ButtonNode,
  compactSelect: CompactSelectNode,
  compactDatePicker: CompactDatePickerNode,
};

const ReactflowShowcase = () => {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  //   const selectedNode = useMemo(() => {
  //     return nodes.find((n) => n.selected);
  //   }, [nodes]);

  return (
    <div className="bg-background text-foreground flex h-screen flex-col antialiased">
      <header className="border-border bg-card/80 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            startIcon={<ArrowLeft className="size-3.5" />}
            onClick={() => navigate("/")}
          >
            Back to Hub
          </Button>
          <span className="ml-2 text-sm font-bold">React Flow Canvas</span>
        </div>
      </header>

      <div className="relative flex flex-1">
        <ReactFlow
          fitView
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ReactflowShowcase;
