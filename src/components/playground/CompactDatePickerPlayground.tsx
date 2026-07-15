import { useState } from "react";
import CompactDatePicker from "@/components/ui/compact/CompactDatePicker";
import CompactSelect from "@/components/ui/compact/CompactSelect";
import { PlaygroundCard, CustomToggle } from "./PlaygroundCommon";
import { type DateRange } from "react-day-picker";
import { CalendarDays, CalendarRange, Clock, Terminal } from "lucide-react";
import { format as formatDate } from "date-fns";

export default function CompactDatePickerPlayground() {
  // Static showcase state
  const [singleVal, setSingleVal] = useState<Date | undefined>(new Date());
  const [multiVal, setMultiVal] = useState<Date[] | undefined>([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 2)),
  ]);
  const [rangeVal, setRangeVal] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  // Builder state
  const [bMode, setBMode] = useState<"single" | "multiple" | "range">("single");
  const [bFormat, setBFormat] = useState("PPP");
  const [bFullWidth, setBFullWidth] = useState(false);
  const [bPlaceholder, setBPlaceholder] = useState("Pick dates...");
  
  const [bSingleVal, setBSingleVal] = useState<Date | undefined>();
  const [bMultiVal, setBMultiVal] = useState<Date[] | undefined>();
  const [bRangeVal, setBRangeVal] = useState<DateRange | undefined>();

  const getActiveBuilderValString = () => {
    if (bMode === "single") {
      return bSingleVal ? formatDate(bSingleVal, bFormat) : "undefined";
    }
    if (bMode === "multiple") {
      return bMultiVal?.length
        ? bMultiVal.map((d) => formatDate(d, bFormat)).join(", ")
        : "[]";
    }
    return bRangeVal?.from
      ? `${formatDate(bRangeVal.from, bFormat)} ~ ${
          bRangeVal.to ? formatDate(bRangeVal.to, bFormat) : "none"
        }`
      : "undefined";
  };

  const interactiveCode = `import CompactDatePicker from "@/components/ui/compact/CompactDatePicker";
import { useState } from "react";
${bMode === "range" ? 'import { type DateRange } from "react-day-picker";' : ""}

const [value, setValue] = useState<any>();

<CompactDatePicker
  mode="${bMode}"
  value={value}
  onChange={setValue}
  format="${bFormat}"
  placeholder="${bPlaceholder}"${bFullWidth ? "\n  fullWidth" : ""}
/>`;

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Show off different Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Single Date */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base mb-1 text-foreground flex items-center gap-1.5">
              <CalendarDays className="size-4 text-emerald-500" /> Single Date Mode
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Select one single day. Generates a standard popover Calendar picker.
            </p>
            <CompactDatePicker mode="single" value={singleVal} onChange={setSingleVal} fullWidth />
          </div>
          <div className="mt-4 p-2.5 rounded-lg bg-muted/40 border border-border text-[11px] font-mono">
            Selected: <span className="font-bold text-primary">{singleVal ? formatDate(singleVal, "PPP") : "None"}</span>
          </div>
        </div>

        {/* Multiple Dates */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base mb-1 text-foreground flex items-center gap-1.5">
              <Clock className="size-4 text-violet-500" /> Multiple Dates Mode
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Select multiple distinct dates. Displays a badge counter and customizable item badges.
            </p>
            <CompactDatePicker mode="multiple" value={multiVal} onChange={setMultiVal} fullWidth />
          </div>
          <div className="mt-4 p-2.5 rounded-lg bg-muted/40 border border-border text-[11px] font-mono">
            Count: <span className="font-bold text-primary">{multiVal?.length || 0} date(s)</span>
          </div>
        </div>

        {/* Range Dates */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base mb-1 text-foreground flex items-center gap-1.5">
              <CalendarRange className="size-4 text-amber-500" /> Range Selector
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Pick a start and end date range. Displays dates connected by a separator.
            </p>
            <CompactDatePicker mode="range" value={rangeVal} onChange={setRangeVal} fullWidth />
          </div>
          <div className="mt-4 p-2.5 rounded-lg bg-muted/40 border border-border text-[11px] font-mono truncate">
            Range:{" "}
            <span className="font-bold text-primary">
              {rangeVal?.from ? formatDate(rangeVal.from, "PP") : "None"} ~{" "}
              {rangeVal?.to ? formatDate(rangeVal.to, "PP") : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Format custom patterns */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-base mb-1 text-foreground">Custom Formatting & Width Options</h3>
        <p className="text-xs text-muted-foreground mb-6">Demonstrates custom formatting patterns (using date-fns syntax).</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Format "d MMM yyyy"</span>
            <CompactDatePicker mode="single" value={singleVal} onChange={setSingleVal} format="d MMM yyyy" fullWidth />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Format "yyyy-MM-dd"</span>
            <CompactDatePicker mode="single" value={singleVal} onChange={setSingleVal} format="yyyy-MM-dd" fullWidth />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Format "EEEE, MMMM d"</span>
            <CompactDatePicker mode="single" value={singleVal} onChange={setSingleVal} format="EEEE, MMMM d" fullWidth />
          </div>
        </div>
      </div>

      {/* 3. Interactive Builder */}
      <PlaygroundCard
        title="Interactive Builder"
        badge="ui/compact/CompactDatePicker"
        description="Configure calendar modes, custom date formatters, full width layouts, and select actions."
        code={interactiveCode}
        controls={
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Selection Mode</label>
              <div className="flex rounded-lg border border-border p-0.5 bg-background">
                {(["single", "multiple", "range"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setBMode(mode)}
                    className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      bMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Date Format Pattern</label>
              <CompactSelect
                items={[
                  { value: "PPP", label: "Readable (PPP)" },
                  { value: "d/MM/y", label: "Slash (d/MM/y)" },
                  { value: "yyyy-MM-dd", label: "Standard ISO (yyyy-MM-dd)" },
                  { value: "dd MMMM yyyy", label: "Full Text (dd MMMM yyyy)" },
                ]}
                value={bFormat}
                onValueChange={(val: unknown) => setBFormat(val as string)}
                placeholder="Select date format"
                fullWidth
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Placeholder text</label>
              <input
                type="text"
                value={bPlaceholder}
                onChange={(e) => setBPlaceholder(e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <CustomToggle checked={bFullWidth} onChange={setBFullWidth} label="Full Width Layout" />
            </div>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4">
          {bMode === "single" && (
            <CompactDatePicker
              mode="single"
              value={bSingleVal}
              onChange={setBSingleVal}
              format={bFormat}
              placeholder={bPlaceholder}
              fullWidth={bFullWidth}
            />
          )}

          {bMode === "multiple" && (
            <CompactDatePicker
              mode="multiple"
              value={bMultiVal}
              onChange={setBMultiVal}
              format={bFormat}
              placeholder={bPlaceholder}
              fullWidth={bFullWidth}
            />
          )}

          {bMode === "range" && (
            <CompactDatePicker
              mode="range"
              value={bRangeVal}
              onChange={setBRangeVal}
              format={bFormat}
              placeholder={bPlaceholder}
              fullWidth={bFullWidth}
            />
          )}

          <div className="w-full p-3.5 rounded-lg border border-border bg-background/50 flex flex-col gap-1 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Terminal className="size-3.5" /> Output State
            </span>
            <p className="text-xs font-mono truncate">
              Value: <span className="font-semibold text-primary">{getActiveBuilderValString()}</span>
            </p>
          </div>
        </div>
      </PlaygroundCard>
    </div>
  );
}
