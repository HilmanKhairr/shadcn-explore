import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  Settings2,
  Eye,
  Code,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

// Shared Code Block Component
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 rounded-xl border border-zinc-200 bg-zinc-950 p-4 font-mono text-[13px] text-zinc-300 shadow-lg dark:border-zinc-800">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="font-sans text-[10px] tracking-wider text-zinc-500 uppercase select-none">
          TypeScript
        </span>
        <button
          onClick={handleCopy}
          className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/50 p-1.5 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-200 active:scale-95"
          title="Copy Code"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <pre className="max-h-[250px] scrollbar-thin scrollbar-thumb-zinc-800 overflow-x-auto pr-16">
        {code}
      </pre>
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="border-border bg-muted/50 inline-flex items-center gap-1 rounded-full border p-1">
      {(["light", "dark", "system"] as const).map((t) => {
        const isActive = theme === t;
        const Icon = t === "light" ? Sun : t === "dark" ? Moon : Monitor;
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              "text-muted-foreground hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-full transition-all active:scale-90",
              isActive &&
                "bg-background text-foreground border-border border shadow-sm"
            )}
            title={`Set ${t} theme`}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}

// Shared Custom Switch Toggle
export function CustomToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="border-border bg-background hover:bg-muted/40 flex w-full cursor-pointer items-center justify-between rounded-lg border p-2.5 text-left transition-colors"
    >
      <span className="text-foreground text-sm font-medium">{label}</span>
      <div
        className={cn(
          "h-5 w-9 rounded-full p-0.5 transition-colors duration-200 ease-in-out",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <div
          className={cn(
            "h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    </button>
  );
}

// Shared Playground Card Container
export function PlaygroundCard({
  title,
  description,
  children,
  controls,
  code,
  badge,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  code?: string;
  badge?: string;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="border-border bg-card text-card-foreground overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="border-border bg-muted/10 border-b p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h3 className="text-foreground text-lg font-semibold tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {badge}
              </span>
            )}
          </div>
          {code && (
            <button
              onClick={() => setShowCode(!showCode)}
              className={cn(
                "border-border inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
                showCode
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              <Code className="size-3.5" />
              {showCode ? "Hide Code" : "Show Code"}
            </button>
          )}
        </div>
        <p className="text-muted-foreground mt-1 max-w-xl text-sm">
          {description}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Demo Display */}
          <div
            className={cn(
              "bg-muted/20 border-border relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-8",
              controls ? "lg:col-span-8" : "lg:col-span-12"
            )}
          >
            <div className="text-muted-foreground bg-background border-border absolute top-2 left-2 flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] select-none">
              <Eye className="size-3" /> Live Preview
            </div>
            <div className="flex w-full justify-center">{children}</div>
          </div>

          {/* Playground Controls */}
          {controls && (
            <div className="bg-muted/40 border-border flex flex-col gap-4 rounded-xl border p-5 lg:col-span-4">
              <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                <Settings2 className="size-3.5" />
                Playground Config
              </h4>
              <div className="flex flex-col gap-3">{controls}</div>
            </div>
          )}
        </div>

        {showCode && code && <CodeBlock code={code} />}
      </div>
    </div>
  );
}
