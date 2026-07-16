import { Button } from "@/components/ui/button";
import CompactSelect from "@/components/ui/compact/CompactSelect";
import { ArrowRight, Plus, Search, Send, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  CustomToggle,
  PlaygroundCard,
} from "../../../components/PlaygroundCommon";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";
type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

const buttonVariantOptions = [
  { value: "default", label: "Default" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "destructive", label: "Destructive" },
  { value: "link", label: "Link" },
];

const buttonSizeOptions = [
  { value: "default", label: "Default" },
  { value: "xs", label: "Extra Small (xs)" },
  { value: "sm", label: "Small (sm)" },
  { value: "lg", label: "Large (lg)" },
  { value: "icon", label: "Icon" },
  { value: "icon-xs", label: "Icon XS" },
  { value: "icon-sm", label: "Icon SM" },
  { value: "icon-lg", label: "Icon LG" },
];

export default function ButtonPlayground() {
  // Interactive Builder State
  const [btnText, setBtnText] = useState("Explore Component");
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>("default");
  const [btnSize, setBtnSize] = useState<ButtonSize>("default");
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnFullWidth, setBtnFullWidth] = useState(false);
  const [btnHasIcon, setBtnHasIcon] = useState<"none" | "start" | "end">(
    "none"
  );
  const [clickCount, setClickCount] = useState(0);

  const interactiveCode = `import { Button } from "@/components/ui/button";
import { ${btnHasIcon === "start" ? "Plus" : btnHasIcon === "end" ? "ArrowRight" : ""} } from "lucide-react";

<Button
  variant="${btnVariant}"
  size="${btnSize}"${btnLoading ? "\n  loading" : ""}${btnDisabled ? "\n  disabled" : ""}${btnFullWidth ? "\n  fullWidth" : ""}
  onClick={() => console.log("Clicked!")}
>
  ${btnHasIcon === "start" ? '<Plus className="size-4" />\n  ' : ""}${btnText}${btnHasIcon === "end" ? '\n  <ArrowRight className="size-4" />' : ""}
</Button>`;

  return (
    <div className="flex flex-col gap-10">
      {/* 1. All Combinations Grid */}
      <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
        <h3 className="text-foreground mb-1 text-lg font-semibold tracking-tight">
          Visual Grid & Variants
        </h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Preview all sizes and variants side-by-side.
        </p>

        <div className="space-y-6 overflow-x-auto">
          {(
            [
              "default",
              "outline",
              "secondary",
              "ghost",
              "destructive",
              "link",
            ] as const
          ).map((variant) => (
            <div
              key={variant}
              className="border-border/40 flex min-w-[650px] flex-col gap-2 border-b pb-4 last:border-0 last:pb-0"
            >
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                {variant}
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant={variant} size="xs">
                  xs size
                </Button>
                <Button variant={variant} size="sm">
                  sm size
                </Button>
                <Button variant={variant} size="default">
                  default size
                </Button>
                <Button variant={variant} size="lg">
                  lg size
                </Button>
                <Button variant={variant} size="icon" aria-label="Icon">
                  <Plus className="size-4" />
                </Button>
                <Button variant={variant} size="icon-xs" aria-label="Icon xs">
                  <Settings className="size-3" />
                </Button>
                <Button variant={variant} size="icon-sm" aria-label="Icon sm">
                  <Search className="size-3.5" />
                </Button>
                <Button variant={variant} size="icon-lg" aria-label="Icon lg">
                  <Send className="size-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. States Showcase */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
          <h3 className="text-foreground mb-1 text-base font-semibold">
            Special & Compound States
          </h3>
          <p className="text-muted-foreground mb-4 text-xs">
            Examples of loading, disabled, fullWidth and nested icon states.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Loading Default</Button>
              <Button variant="outline" loading>
                Loading Outline
              </Button>
              <Button variant="destructive" loading size="sm">
                Destructive sm
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Disabled Button</Button>
              <Button variant="ghost" disabled>
                Disabled Ghost
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button fullWidth>Full Width Primary</Button>
              <Button variant="outline" fullWidth>
                Full Width Outline
              </Button>
            </div>
          </div>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
          <h3 className="text-foreground mb-1 text-base font-semibold">
            Content Layouts
          </h3>
          <p className="text-muted-foreground mb-4 text-xs">
            Buttons with icons, custom badges, or complex children.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>
              <Search className="mr-1.5 size-4" /> Search Docs
            </Button>
            <Button variant="secondary">
              Add Item <Plus className="ml-1.5 size-4" />
            </Button>
            <Button variant="outline">
              <Settings className="mr-1.5 size-4" /> Configure
              <span className="bg-primary/10 text-primary ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold">
                PRO
              </span>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-1.5 size-4" /> Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Interactive Playground */}
      <PlaygroundCard
        title="Interactive Builder"
        badge="ui/button"
        description="Configure variants, sizes, state toggles, and label text to instantly test the output and obtain copy-paste code."
        code={interactiveCode}
        controls={
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Button Label
              </label>
              <input
                type="text"
                value={btnText}
                onChange={(e) => setBtnText(e.target.value)}
                className="border-input bg-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Variant
              </label>
              <CompactSelect
                items={buttonVariantOptions}
                value={btnVariant}
                onValueChange={(val) => setBtnVariant(val as ButtonVariant)}
                placeholder="Select variant"
                fullWidth
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Size
              </label>
              <CompactSelect
                items={buttonSizeOptions}
                value={btnSize}
                onValueChange={(val) => setBtnSize(val as ButtonSize)}
                placeholder="Select size"
                fullWidth
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Icon Placement
              </label>
              <div className="border-border bg-background flex rounded-lg border p-0.5">
                {(["none", "start", "end"] as const).map((placement) => (
                  <button
                    key={placement}
                    onClick={() => setBtnHasIcon(placement)}
                    className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all ${btnHasIcon === placement ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {placement}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <CustomToggle
                checked={btnLoading}
                onChange={setBtnLoading}
                label="Loading State"
              />
              <CustomToggle
                checked={btnDisabled}
                onChange={setBtnDisabled}
                label="Disabled State"
              />
              <CustomToggle
                checked={btnFullWidth}
                onChange={setBtnFullWidth}
                label="Full Width"
              />
            </div>
          </>
        }
      >
        <div className="flex w-full max-w-md flex-col items-center gap-4 px-4">
          <Button
            variant={btnVariant}
            size={btnSize}
            loading={btnLoading}
            disabled={btnDisabled}
            fullWidth={btnFullWidth}
            onClick={() => setClickCount((c) => c + 1)}
          >
            {btnHasIcon === "start" && <Plus className="mr-1.5 size-4" />}
            {btnText}
            {btnHasIcon === "end" && <ArrowRight className="ml-1.5 size-4" />}
          </Button>

          <p className="text-muted-foreground bg-muted/60 border-border mt-2 rounded-full border px-3 py-1.5 text-xs">
            Interaction Clicks:{" "}
            <span className="text-foreground font-mono font-bold">
              {clickCount}
            </span>
          </p>
        </div>
      </PlaygroundCard>
    </div>
  );
}

