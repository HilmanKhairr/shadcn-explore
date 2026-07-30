import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import usePipelineStore from "../hooks/usePipelineStore";

const SettingbarNode = () => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);
  const selectedNode = usePipelineStore(
    useShallow((state) => {
      const node = state.nodes.find((n) => n.selected);
      return node || null;
    })
  );
  const [openSettingbar, setOpenSettingbar] = useState(false);

  return (
    <div
      className={cn(
        "border-border bg-card/40 flex shrink-0 flex-col overflow-y-auto border-t text-left transition-all duration-300 md:border-t-0 md:border-l",
        selectedNode ? "w-full md:w-72" : "h-0 w-0"
      )}
    >
      <Button
        fullWidth
        variant="ghost"
        endIcon={
          <ChevronDownIcon
            className={`size-4 shrink-0 transition-transform duration-300 md:hidden ${openSettingbar ? "rotate-180" : ""}`}
          />
        }
        className="h-auto! rounded-none! px-6 py-4 active:scale-100! md:pointer-events-none md:cursor-default"
        onClick={() => setOpenSettingbar((prev) => !prev)}
      >
        <h2>Node Configuration</h2>
      </Button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:grid-rows-[1fr]! ${openSettingbar ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          {selectedNode ? (
            <div className="animate-in fade-in flex flex-col gap-4 px-6 pb-6 duration-200">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium">Node Label</label>
                <input
                  type="text"
                  className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none"
                  value={String(selectedNode?.data.title || "")}
                  onChange={(e) => {
                    updateNodeData(selectedNode?.id, { title: e.target.value });
                  }}
                />
                <label className="text-xs font-medium">Node Description</label>
                <input
                  type="text"
                  className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none"
                  value={String(selectedNode?.data.description || "")}
                  onChange={(e) => {
                    updateNodeData(selectedNode?.id, {
                      description: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="border-muted flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
              <p className="text-muted-foreground px-4 text-sm">
                No node selected. Click a node on the canvas to configure its
                properties.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingbarNode;
