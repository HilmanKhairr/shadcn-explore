import { Check, Code, Flame, Moon, Sparkles, Sun, Zap } from "lucide-react";
import * as React from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./components/ui/select";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider";

const frameworks = [
  { value: "react", label: "React", description: "A popular JavaScript library for building user interfaces.", icon: Code },
  { value: "vue", label: "Vue.js", description: "An approachable, performant, and versatile framework.", icon: Flame },
  { value: "svelte", label: "Svelte", description: "A compiler that builds fast, tiny, and reactive web apps.", icon: Zap },
  { value: "solid", label: "SolidJS", description: "A declarative, efficient, and flexible library for UIs.", icon: Sparkles },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function AppContent() {
  const [selected, setSelected] = React.useState<string>("react");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const currentFramework = frameworks.find((f) => f.value === selected) || frameworks[0];
  const Icon = currentFramework.icon;

  const handleSubmit = () => {
    setLoading(true);
    setSubmitted(false);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="from-background to-muted flex min-h-svh items-center justify-center bg-radial p-4 md:p-8">
      <div className="border-border bg-card/40 relative w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl backdrop-blur-lg md:p-8">
        {/* Background glow decoration */}
        <div className="bg-primary/10 absolute -top-10 -right-10 -z-10 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute -bottom-10 -left-10 -z-10 h-32 w-32 rounded-full blur-3xl" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 text-left">
              <h1 className="text-foreground my-0 text-2xl font-bold tracking-tight">Tech Selector</h1>
              <p className="text-muted-foreground text-xs">Choose a framework for your template.</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="framework-select" className="text-muted-foreground text-left text-xs font-semibold tracking-wider uppercase">
                Select Framework
              </label>
              <Select
                id="framework-select"
                items={frameworks}
                value={selected}
                onValueChange={(val) => {
                  setSelected(val as string);
                  setSubmitted(false);
                }}
              >
                <SelectTrigger className="border-border bg-input/20 hover:bg-input/40 text-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-lg border px-3 transition focus-visible:ring-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50 rounded-lg border p-1 shadow-xl">
                  <SelectGroup>
                    <SelectLabel className="text-muted-foreground px-2 py-1 text-xs font-semibold tracking-wider uppercase">Frameworks</SelectLabel>
                    <SelectSeparator className="border-border my-1 border-t" />
                    {frameworks.map((framework) => {
                      const FIcon = framework.icon;
                      return (
                        <SelectItem key={framework.value} value={framework.value} className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition outline-none">
                          <FIcon className="size-4 shrink-0" />
                          <span>{framework.label}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Selected detail panel */}
            <div className="border-border bg-input/10 flex flex-col gap-2.5 rounded-xl border p-4 text-left transition duration-200">
              <div className="text-foreground flex items-center gap-2 font-semibold">
                <Icon className="text-primary size-5 animate-pulse" />
                <span>{currentFramework.label} Selected</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{currentFramework.description}</p>
            </div>

            {/* Actions */}
            <Button variant="default" size="lg" loading={loading} fullWidth onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/95 h-10 cursor-pointer font-medium">
              Configure Template
            </Button>

            {submitted && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                <Check className="size-4 shrink-0 text-emerald-400" />
                <span>
                  Project configured with <strong>{currentFramework.label}</strong>! Ready to run.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
