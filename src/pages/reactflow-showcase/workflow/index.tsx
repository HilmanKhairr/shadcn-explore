import "@xyflow/react/dist/style.css";
import ExecutionConsole from "./components/ExecutionConsole";
import SettingbarNode from "./components/SettingbarNode";
import WorkflowSidebar from "./components/SidebarWorkflow";
import Workflow from "./components/Workflow";
import WorkflowHeader from "./components/WorkflowHeader";

export default function WorkflowShowcase() {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col overflow-hidden antialiased select-none">
      <WorkflowHeader />

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <WorkflowSidebar />
        <Workflow />
        <SettingbarNode />
      </div>

      <ExecutionConsole />
    </div>
  );
}
