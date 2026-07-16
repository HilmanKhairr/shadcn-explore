import { ArrowRight, Blocks, GitFork, Sparkles } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { ThemeToggle } from "./components/PlaygroundCommon";
import { ThemeProvider } from "./providers/ThemeProvider";

function WelcomeHub() {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-4 antialiased">
      {/* Top Banner Grid background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-[600px] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

      {/* Header */}
      <header className="border-border/40 relative z-10 flex w-full max-w-6xl items-center justify-between border-b py-6">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-sm">
            <Sparkles className="size-5" />
          </div>
          <div>
            <span className="text-foreground text-base font-bold tracking-tight">
              Showcase Hub
            </span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 my-auto flex w-full max-w-5xl flex-col items-center py-12 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
          <Sparkles className="size-3.5 animate-pulse" />
          Interactive Exploration Center
        </div>
        <h1 className="text-foreground mt-2 block max-w-3xl text-4xl leading-[1.15] font-extrabold tracking-tight md:text-6xl">
          Explore the Power of{" "}
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Modern UIs
          </span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-base md:text-lg">
          Select a showcase below to experience premium custom component
          sandboxes or interactive node-based workflows.
        </p>

        {/* Showcase Cards Grid */}
        <div className="mt-12 grid w-full grid-cols-1 gap-8 text-left sm:grid-cols-2">
          {/* Shadcn UI Card */}
          <Link
            to="/shadcn-showcase"
            className="group border-border bg-card relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_15px_30px_-10px_rgba(124,58,237,0.15)]"
          >
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-violet-500/10 blur-3xl transition-all duration-500 group-hover:scale-125" />

            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 transition-all duration-300 group-hover:scale-110 dark:text-violet-400">
                <Blocks className="size-6" />
              </div>
              <h2 className="text-foreground mt-6 text-2xl font-bold tracking-tight transition-colors group-hover:text-violet-500">
                Custom Component Playground
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Dive into a polished playground showcasing custom shadcn
                components.
              </p>

              {/* Tag Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Base UI", "Tailwind v4", "Custom Variants", "Registry"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="border-border bg-muted/50 text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center text-sm font-semibold text-violet-500 group-hover:text-violet-600">
              Explore Components
              <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>

          {/* React Flow Card */}
          <Link
            to="/reactflow-showcase"
            className="group border-border bg-card relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-[0_15px_30px_-10px_rgba(217,70,239,0.15)]"
          >
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-fuchsia-500/10 blur-3xl transition-all duration-500 group-hover:scale-125" />

            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 transition-all duration-300 group-hover:scale-110 dark:text-fuchsia-400">
                <GitFork className="size-6 rotate-90" />
              </div>
              <h2 className="text-foreground mt-6 text-2xl font-bold tracking-tight transition-colors group-hover:text-fuchsia-500">
                React Flow Workspace
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Interact with node-based diagrams, custom node rendering, flow
                lines, dynamic connections, and canvas viewport controls.
              </p>

              {/* Tag Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "XYFlow",
                  "Canvas Graph",
                  "Interactive Nodes",
                  "Zoom & Pan",
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
              Launch Graph Canvas
              <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border/40 text-muted-foreground relative z-10 w-full max-w-6xl border-t py-8 text-center text-xs">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>
            © 2026 Interactive Showcase Hub. Built with Tailwind CSS v4 & Vite.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-foreground">React 19</span>
            <span className="hover:text-foreground">React Router v8</span>
            <span className="hover:text-foreground">XYFlow v12</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <ThemeProvider defaultTheme="system" storageKey="shadcn-explore-theme">
      {isHome ? <WelcomeHub /> : <Outlet />}
    </ThemeProvider>
  );
}

export default App;

