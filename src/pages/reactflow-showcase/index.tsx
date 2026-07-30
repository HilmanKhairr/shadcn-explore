import { ArrowLeft, ArrowRight, Network, RefreshCw, Zap } from "lucide-react";
import { Link } from "react-router";
import { ThemeToggle } from "@/components/PlaygroundCommon";

export default function ReactflowShowcaseIndex() {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-4 antialiased">
      {/* Top Banner Grid background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-[600px] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

      {/* Header */}
      <header className="border-border/40 relative z-10 flex w-full max-w-6xl items-center justify-between border-b py-6">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Hub
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-bold tracking-tight">
            React Flow Showcase
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 my-auto flex w-full max-w-5xl flex-col items-center py-12 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-semibold text-fuchsia-600 dark:bg-fuchsia-400/10 dark:text-fuchsia-400">
          <Network className="size-3.5" />
          Architecture Paradigm Comparison
        </div>

        <h1 className="text-foreground mt-2 block max-w-3xl text-4xl leading-[1.15] font-extrabold tracking-tight md:text-5xl">
          Choose a{" "}
          <span className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            Flow Architecture
          </span>
        </h1>

        <p className="text-muted-foreground mt-4 max-w-xl text-base md:text-lg">
          Explore two distinct state propagation models in node-based canvas graphs: Pull-based Graph Traversal vs Push-based Reactive Dataflow.
        </p>

        {/* Showcase Cards Grid */}
        <div className="mt-12 grid w-full grid-cols-1 gap-8 text-left sm:grid-cols-2">
          {/* Graph Traversal Card */}
          <Link
            to="/reactflow-showcase/graph-traversal"
            className="group border-border bg-card relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-[0_15px_30px_-10px_rgba(217,70,239,0.15)]"
          >
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-fuchsia-500/10 blur-3xl transition-all duration-500 group-hover:scale-125" />

            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 transition-all duration-300 group-hover:scale-110 dark:text-fuchsia-400">
                <RefreshCw className="size-6" />
              </div>
              <h2 className="text-foreground mt-6 text-2xl font-bold tracking-tight transition-colors group-hover:text-fuchsia-500">
                Graph Traversal (Pull Model)
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Nodes pull data dynamically from upstream connections on-demand. Uses graph traversal functions and memoized store selectors.
              </p>

              {/* Tag Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "On-Demand Pull",
                  "Graph Traversal",
                  "Zustand Selector",
                  "useShallow / Cache",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="border-border bg-muted/50 text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center text-sm font-semibold text-fuchsia-500 group-hover:text-fuchsia-600">
              Open Graph Traversal
              <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Push Dataflow Card */}
          <Link
            to="/reactflow-showcase/push-dataflow"
            className="group border-border bg-card relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_15px_30px_-10px_rgba(99,102,241,0.15)]"
          >
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-500 group-hover:scale-125" />

            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 transition-all duration-300 group-hover:scale-110 dark:text-indigo-400">
                <Zap className="size-6" />
              </div>
              <h2 className="text-foreground mt-6 text-2xl font-bold tracking-tight transition-colors group-hover:text-indigo-500">
                Push Dataflow (Reactive Model)
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Nodes automatically push state updates downstream whenever their values change. Real-time event propagation across node edges.
              </p>

              {/* Tag Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Reactive Push",
                  "Event Driven",
                  "Real-Time Stream",
                  "Direct Handle Connections",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="border-border bg-muted/50 text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center text-sm font-semibold text-indigo-500 group-hover:text-indigo-600">
              Open Push Dataflow
              <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border/40 text-muted-foreground relative z-10 w-full max-w-6xl border-t py-8 text-center text-xs">
        <p>© 2026 React Flow Architecture Showcase</p>
      </footer>
    </div>
  );
}
