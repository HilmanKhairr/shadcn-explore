import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function PushDataflowShowcase() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground flex h-screen flex-col antialiased">
      <header className="border-border bg-card/80 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            startIcon={<ArrowLeft className="size-3.5" />}
            onClick={() => navigate("/reactflow-showcase")}
          >
            Back to React Flow Showcase
          </Button>
          <span className="ml-2 text-sm font-bold">
            Data Processing Pipeline
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row"></div>
    </div>
  );
}

