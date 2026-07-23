import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import DashedBezierEdge from "./components/edge/DashedBezierEdge";
import FilterFileNode from "./components/node/FilterFileNode";
import InputFileNode from "./components/node/InputFileNode";
import OutputFileNode from "./components/node/OutputFileNode";
import usePipelineStore from "./hooks/usePipelineStore";

const nodeTypes = {
  inputNode: InputFileNode,
  filterNode: FilterFileNode,
  outputFile: OutputFileNode,
};

const edgeTypes = {
  dashedBezier: DashedBezierEdge,
};

const ReactflowShowcase = () => {
  const navigate = useNavigate();
  const {
    nodes,
    edges,
    // updateNodeData,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    onReconnectStart,
    onReconnectEnd,
  } = usePipelineStore();

  const [openBuilderPanel, setOpenBuilderPanel] = useState(false);
  // const [openConfigPanel, setOpenConfigPanel] = useState(false);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.selected);
  }, [nodes]);

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
          <span className="ml-2 text-sm font-bold">
            Data Processing Pipeline
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <div className="border-border bg-card/40 flex max-h-40 w-full shrink-0 flex-col overflow-y-auto border-b text-left md:max-h-full md:w-52 md:border-r md:border-b-0">
          <Button
            fullWidth
            variant="ghost"
            endIcon={
              <ChevronDown
                className={`size-4 shrink-0 transition-transform duration-300 md:hidden ${openBuilderPanel ? "rotate-180" : ""}`}
              />
            }
            className="h-auto! rounded-none! px-6 py-4 active:scale-100! md:pointer-events-none md:cursor-default"
            onClick={() => setOpenBuilderPanel((prev) => !prev)}
          >
            <h2>Workflow Builder</h2>
          </Button>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:grid-rows-[1fr]! ${openBuilderPanel ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden">
              <p className="text-muted-foreground px-6 pb-6 text-sm">
                Pipeline data processing dari Upload CSV - Transform Config -
                Output Konversi (.json / .pdf) via Trigger.dev.
              </p>
            </div>
          </div>
        </div>

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

        {/* <div
          className={cn(
            "border-border bg-card/40 flex shrink-0 flex-col overflow-y-auto border-t text-left transition-all duration-300 md:border-t-0 md:border-l",
            selectedNode ? "w-full md:w-72" : "h-0 w-0"
          )}
        >
          <Button
            fullWidth
            variant="ghost"
            endIcon={
              <ChevronDown
                className={`size-4 shrink-0 transition-transform duration-300 md:hidden ${openConfigPanel ? "rotate-180" : ""}`}
              />
            }
            className="h-auto! rounded-none! px-6 py-4 active:scale-100! md:pointer-events-none md:cursor-default"
            onClick={() => setOpenConfigPanel((prev) => !prev)}
          >
            <h2>Node Configuration</h2>
          </Button>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:grid-rows-[1fr]! ${openConfigPanel ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden">
              {selectedNode ? (
                <div className="animate-in fade-in flex flex-col gap-4 px-6 pb-6 duration-200">
                  <div className="bg-muted rounded-md p-3">
                    <p className="text-muted-foreground font-mono text-xs">
                      ID: {selectedNode.id}
                    </p>
                    <p className="mt-1 text-sm font-semibold capitalize">
                      Type: {selectedNode.type}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium">Node Label</label>
                    <input
                      type="text"
                      className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none"
                      value={String(selectedNode.data.title || "")}
                      onChange={(e) => {
                        const nextLabel = e.target.value;
                        updateNodeData(selectedNode.id, { title: nextLabel });
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs italic">
                    Modifying this input updates the global node state
                    instantly.
                  </p>
                </div>
              ) : (
                <div className="border-muted flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
                  <p className="text-muted-foreground px-4 text-sm">
                    No node selected. Click a node on the canvas to configure
                    its properties.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ReactflowShowcase;

