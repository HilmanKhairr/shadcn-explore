import { useState } from "react";
import { ThemeToggle } from "./PlaygroundCommon";
import ButtonPlayground from "./ButtonPlayground";
import CompactSelectPlayground from "./CompactSelectPlayground";
import CompactDatePickerPlayground from "./CompactDatePickerPlayground";
import {
  MousePointerClick,
  ListFilter,
  CalendarRange,
  Layers,
  Terminal,
  BookOpen,
  Sparkles,
  Blocks,
  Cpu,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentEntry {
  id: string;
  name: string;
  badge: string;
  description: string;
  component: React.ComponentType;
  icon: React.ComponentType<{ className?: string }>;
}

// Config-driven Registry of Playgrounds (Extremely scalable!)
const componentRegistry: ComponentEntry[] = [
  {
    id: "button",
    name: "Custom Button",
    badge: "ui/button",
    description:
      "Extends @base-ui/react/button with custom variants, sizes, and built-in loader spinner support.",
    component: ButtonPlayground,
    icon: MousePointerClick,
  },
  {
    id: "select",
    name: "Compact Select",
    badge: "ui/compact/CompactSelect",
    description:
      "Wraps Select primitive with auto-support for flat arrays, grouped object structures, loading triggers, and custom property mappings.",
    component: CompactSelectPlayground,
    icon: ListFilter,
  },
  {
    id: "datepicker",
    name: "Compact Date Picker",
    badge: "ui/compact/CompactDatePicker",
    description:
      "Custom date picker supporting single, multiple, or range date selections, multiple date badge counts, custom formatting, and clean clean popover alignments.",
    component: CompactDatePickerPlayground,
    icon: CalendarRange,
  },
];

export default function PlaygroundShell() {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col antialiased">
      {/* Top Banner Grid background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-[400px] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

      {/* Sticky Header */}
      <header className="border-border bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-sm">
              <Blocks className="size-5" />
            </div>
            <div>
              <span className="text-foreground flex items-center gap-1.5 text-base font-bold tracking-tight">
                Shadcn Explore
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500">
                  Active
                </span>
              </span>
              <p className="text-muted-foreground hidden text-[10px] sm:block">
                Kustom Component Showcase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-12 pb-6 text-left">
        <div className="mb-4 inline-flex animate-pulse items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
          <Sparkles className="size-3.5" />
          Interactive Component Registry
        </div>
        <h1 className="text-foreground mt-0 text-4xl leading-tight font-extrabold tracking-tight md:text-5xl">
          Custom Component Playground
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed md:text-lg">
          Interactive sandboxed interface for testing custom styles, variants,
          sizes, and states. Scalable registry for shared component ecosystems.
        </p>
      </section>

      {/* Main Grid Content */}
      <main className="relative z-10 mx-auto mt-6 grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 px-4 pb-16 md:grid-cols-12">
        {/* Navigation Sidebar */}
        <aside className="flex flex-col gap-6 md:col-span-3">
          <div className="sticky top-24 flex flex-col gap-5">
            {/* Sidebar Tab Selector */}
            <div className="border-border bg-card flex flex-col gap-1 rounded-2xl border p-2.5 shadow-xs">
              <span className="text-muted-foreground px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase select-none">
                Navigation
              </span>

              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2 text-left text-sm transition-all",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Layers className="size-4" />
                  <span>All Components</span>
                </div>
                <span className="bg-muted text-muted-foreground border-border rounded-full border px-1.5 py-0.5 text-[10px] dark:bg-zinc-800">
                  {componentRegistry.length}
                </span>
              </button>

              <div className="bg-border my-1.5 h-px" />

              {/* Dynamic Items from Registry */}
              {componentRegistry.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-left text-sm transition-all",
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              <div className="bg-border my-1.5 h-px" />

              <button
                onClick={() => setActiveTab("guide")}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-left text-sm transition-all",
                  activeTab === "guide"
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <BookOpen className="size-4" />
                <span>Developer Guide</span>
              </button>
            </div>

            {/* Sidebar Context Widget */}
            <div className="border-border bg-card rounded-2xl border p-4 text-left shadow-xs">
              <h4 className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                <Terminal className="text-primary size-3.5" />
                Registry Metadata
              </h4>
              <div className="text-muted-foreground mt-3 flex flex-col gap-2.5 text-xs">
                <div className="border-border/50 flex justify-between border-b pb-1.5">
                  <span>Style Engine</span>
                  <span className="text-foreground font-mono font-semibold">
                    Base-Nova
                  </span>
                </div>
                <div className="border-border/50 flex justify-between border-b pb-1.5">
                  <span>Tailwind</span>
                  <span className="text-foreground font-mono font-semibold">
                    v4.0
                  </span>
                </div>
                <div className="border-border/50 flex justify-between border-b pb-1.5">
                  <span>Components</span>
                  <span className="text-foreground font-mono font-semibold">
                    {componentRegistry.length} Items
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <section className="flex flex-col gap-10 text-left md:col-span-9">
          {/* TAB 1: ALL COMPONENTS (GRID VIEW) */}
          {activeTab === "all" && (
            <div className="flex flex-col gap-10">
              {/* Informative Alert */}
              <div className="text-foreground flex gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 text-sm">
                <Info className="mt-0.5 size-5 shrink-0 text-violet-500" />
                <div>
                  <h4 className="font-semibold text-violet-900 dark:text-violet-200">
                    Scalable Architecture Enabled
                  </h4>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    Components are split across separate files inside{" "}
                    <code className="bg-muted rounded px-1.5 py-0.5 text-[11px]">
                      src/components/playground/
                    </code>
                    . To add a new component, simply code its playground and add
                    it to the shell's config registry.
                  </p>
                </div>
              </div>

              {/* Loop and render all registered playgrounds */}
              {componentRegistry.map((entry) => {
                const Component = entry.component;
                return (
                  <div key={entry.id} className="space-y-4">
                    <div className="border-border border-b pb-2">
                      <h2 className="text-foreground text-xl font-bold tracking-tight">
                        {entry.name}
                      </h2>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {entry.description}
                      </p>
                    </div>
                    <Component />
                  </div>
                );
              })}
            </div>
          )}

          {/* DYNAMIC REGISTRY TABS */}
          {componentRegistry.map((entry) => {
            if (activeTab === entry.id) {
              const Component = entry.component;
              return (
                <div key={entry.id} className="space-y-4">
                  <div className="border-border border-b pb-2">
                    <h2 className="text-foreground text-xl font-bold tracking-tight">
                      {entry.name}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {entry.description}
                    </p>
                  </div>
                  <Component />
                </div>
              );
            }
            return null;
          })}

          {/* TAB: DEVELOPER GUIDE */}
          {activeTab === "guide" && <DeveloperGuide />}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border bg-card text-muted-foreground mt-auto border-t py-8 text-center text-xs">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p>© 2026 Component Hub. Built with shadcn, Base UI & Vite.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground hover:underline">
              API Docs
            </a>
            <a href="#" className="hover:text-foreground hover:underline">
              Registry JSON
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Developer Guide Subcomponent
function DeveloperGuide() {
  return (
    <div className="border-border bg-card flex flex-col gap-6 rounded-2xl border p-6 shadow-xs md:p-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Cpu className="size-3.5 animate-spin" />
          Scalable Development
        </div>
        <h2 className="text-foreground text-2xl font-bold">
          Scaling the Component Hub
        </h2>
        <p className="text-muted-foreground mt-1 max-w-xl text-sm">
          Follow this 3-step workflow to add a new custom component to the
          playground.
        </p>
      </div>

      <div className="bg-border h-px w-full" />

      {/* Grid of Steps */}
      <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="border-border bg-muted/20 flex flex-col gap-2 rounded-xl border p-4">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-xs font-bold">
            1
          </div>
          <h3 className="text-foreground mt-2 text-sm font-semibold">
            Create Component
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Write your new `.tsx` component inside{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-[11px]">
              src/components/ui/
            </code>
            .
          </p>
        </div>

        <div className="border-border bg-muted/20 flex flex-col gap-2 rounded-xl border p-4">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-xs font-bold">
            2
          </div>
          <h3 className="text-foreground mt-2 text-sm font-semibold">
            Write Playground
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Create a custom playground file under{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-[11px]">
              src/components/playground/
            </code>{" "}
            to display combinations and code output.
          </p>
        </div>

        <div className="border-border bg-muted/20 flex flex-col gap-2 rounded-xl border p-4">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-xs font-bold">
            3
          </div>
          <h3 className="text-foreground mt-2 text-sm font-semibold">
            Register Playground
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Import and add the entry into the{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-[11px]">
              componentRegistry
            </code>{" "}
            array in{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-[11px]">
              PlaygroundShell.tsx
            </code>
            .
          </p>
        </div>
      </div>

      <div className="border-border bg-secondary/30 mt-4 flex items-start gap-3 rounded-xl border p-4">
        <Info className="text-primary mt-0.5 size-5 shrink-0" />
        <div className="text-xs leading-relaxed">
          <span className="text-foreground font-semibold">Best Practice:</span>{" "}
          Keep all playground state localized inside the specific playground
          component. Use the shared{" "}
          <code className="bg-muted rounded px-1 text-[11px]">
            PlaygroundCard
          </code>
          ,{" "}
          <code className="bg-muted rounded px-1 text-[11px]">
            CustomToggle
          </code>
          , and helper inputs from{" "}
          <code className="bg-muted rounded px-1 text-[11px]">
            PlaygroundCommon.tsx
          </code>{" "}
          to maintain visual consistency.
        </div>
      </div>
    </div>
  );
}

