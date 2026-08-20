import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  FileCheckIcon,
  FileSpreadsheetIcon,
  PlusIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useState } from "react";
import { NODE_TYPE, OUTPUT_TYPE } from "../constants/workflow";
import useWorkflowStore from "../hooks/useWorkflowStore";

export default function WorkflowSidebar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const [open, setOpen] = useState(false);

  const EXTRACT_NODES = [
    {
      key: "csv-input_button",
      icon: FileSpreadsheetIcon,
      title: "CSV Input",
      description: "CSV File Uploader",
      onAdd: () => addNode(NODE_TYPE.EXTRACT, OUTPUT_TYPE.CSV),
    },
    {
      key: "json-input_button",
      icon: FileSpreadsheetIcon,
      title: "JSON Input",
      description: "JSON File Uploader",
      onAdd: () => addNode(NODE_TYPE.EXTRACT, OUTPUT_TYPE.JSON),
    },
  ];

  const TRANSFORM_NODES = [
    {
      key: "csv-modif_button",
      icon: SlidersHorizontalIcon,
      title: "CSV Modificator",
      description: "Row & Column Filter",
      onAdd: () => addNode(NODE_TYPE.TRANSFORM),
    },
  ];

  const LOAD_NODES = [
    {
      key: "output_button",
      icon: FileCheckIcon,
      title: "Download Output",
      description: "Download converted data",
      onAdd: () => addNode(NODE_TYPE.LOAD),
    },
  ];

  return (
    <div className="border-border bg-card/40 flex max-h-40 w-full shrink-0 flex-col overflow-y-auto border-b text-left md:max-h-full md:w-60 md:border-r md:border-b-0">
      <Button
        fullWidth
        variant="ghost"
        endIcon={
          <ChevronDownIcon
            className={`size-4 shrink-0 transition-transform duration-300 md:hidden ${open ? "rotate-180" : ""}`}
          />
        }
        className="h-auto! rounded-none! px-6 py-4 active:scale-100! md:pointer-events-none md:cursor-default"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2>Converter Builder</h2>
      </Button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:grid-rows-[1fr]! ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 md:px-4 md:pb-4 ${open ? "px-4 pb-4" : "px-4 pb-0"}`}
        >
          <p className="text-card-foreground/50 mt-2.5! px-1 text-[11px] font-bold tracking-wider uppercase">
            Input Nodes
          </p>

          <div className="flex flex-row flex-wrap gap-2">
            {EXTRACT_NODES.map((n) => (
              <Button
                key={n.key}
                variant="outline"
                startIcon={
                  <div className="hidden size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 transition-colors group-hover/button:bg-emerald-500 group-hover/button:text-white md:flex">
                    <n.icon className="size-4" />
                  </div>
                }
                endIcon={
                  <PlusIcon className="text-muted-foreground hidden size-3.5 transition-colors group-hover/button:text-emerald-500 md:block" />
                }
                className="border-border/80 bg-card h-auto! justify-between rounded-xl! p-2.5! text-left shadow-xs transition-all hover:border-emerald-500/60 hover:bg-emerald-500/5 md:w-full"
                slotProps={{ span: { className: "justify-start" } }}
                onClick={n.onAdd}
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-emerald-500">
                    {n.title}
                  </span>
                  <span className="text-muted-foreground hidden text-[10px] font-normal md:block">
                    {n.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          <p className="text-card-foreground/50 mt-2.5! px-1 text-[11px] font-bold tracking-wider uppercase">
            Filter Nodes
          </p>

          <div className="flex flex-row flex-wrap gap-2">
            {TRANSFORM_NODES.map((n) => (
              <Button
                key={n.key}
                variant="outline"
                startIcon={
                  <div className="hidden size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 transition-colors group-hover/button:bg-purple-500 group-hover/button:text-white md:flex">
                    <n.icon className="size-4" />
                  </div>
                }
                endIcon={
                  <PlusIcon className="text-muted-foreground hidden size-3.5 transition-colors group-hover/button:text-purple-500 md:block" />
                }
                onClick={n.onAdd}
                className="border-border/80 bg-card h-auto! justify-between rounded-xl! p-2.5! text-left shadow-xs transition-all hover:border-purple-500/60 hover:bg-purple-500/5 md:w-full"
                slotProps={{ span: { className: "justify-start" } }}
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-purple-500">
                    {n.title}
                  </span>
                  <span className="text-muted-foreground hidden text-[10px] font-normal md:block">
                    {n.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          <p className="text-card-foreground/50 mt-2.5! px-1 text-[11px] font-bold tracking-wider uppercase">
            Ouput Nodes
          </p>

          <div className="flex flex-row flex-wrap gap-2">
            {LOAD_NODES.map((n) => (
              <Button
                key={n.key}
                variant="outline"
                startIcon={
                  <div className="hidden size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 transition-colors group-hover/button:bg-rose-500 group-hover/button:text-white md:flex">
                    <n.icon className="size-4" />
                  </div>
                }
                endIcon={
                  <PlusIcon className="text-muted-foreground hidden size-3.5 transition-colors group-hover/button:text-rose-500 md:block" />
                }
                onClick={n.onAdd}
                className="border-border/80 bg-card h-auto! justify-between rounded-xl! p-2.5! text-left shadow-xs transition-all hover:border-rose-500/60 hover:bg-rose-500/5 md:w-full"
                slotProps={{ span: { className: "justify-start" } }}
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-rose-500">
                    {n.title}
                  </span>
                  <span className="text-muted-foreground hidden text-[10px] font-normal md:block">
                    {n.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

