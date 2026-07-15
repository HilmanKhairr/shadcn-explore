import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Settings2, Eye, Code, Sun, Moon, Monitor } from "lucide-react";
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
    <div className="relative mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-4 font-mono text-[13px] text-zinc-300 shadow-lg">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-sans select-none">TypeScript</span>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-all active:scale-95 cursor-pointer"
          title="Copy Code"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre className="overflow-x-auto pr-16 max-h-[250px] scrollbar-thin scrollbar-thumb-zinc-800">{code}</pre>
    </div>
  );
}

// Shared Theme Toggle Component
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
      {(["light", "dark", "system"] as const).map((t) => {
        const isActive = theme === t;
        const Icon = t === "light" ? Sun : t === "dark" ? Moon : Monitor;
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:text-foreground active:scale-90 cursor-pointer",
              isActive && "bg-background text-foreground shadow-sm border border-border"
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
      className="flex items-center justify-between w-full p-2.5 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors text-left cursor-pointer"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        className={cn(
          "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <div
          className={cn(
            "w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out",
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
    <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-6 border-b border-border bg-muted/10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <h3 className="font-semibold text-lg text-foreground tracking-tight">{title}</h3>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                {badge}
              </span>
            )}
          </div>
          {code && (
            <button
              onClick={() => setShowCode(!showCode)}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all border border-border active:scale-95 cursor-pointer",
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
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">{description}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Demo Display */}
          <div
            className={cn(
              "flex flex-col justify-center items-center p-8 rounded-xl bg-muted/20 border border-dashed border-border min-h-[250px] relative overflow-hidden",
              controls ? "lg:col-span-8" : "lg:col-span-12"
            )}
          >
            <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded border border-border select-none">
              <Eye className="size-3" /> Live Preview
            </div>
            <div className="w-full flex justify-center">{children}</div>
          </div>

          {/* Playground Controls */}
          {controls && (
            <div className="lg:col-span-4 p-5 rounded-xl bg-muted/40 border border-border flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
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
