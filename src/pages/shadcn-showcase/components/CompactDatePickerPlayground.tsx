import CompactDatePicker from "@/components/ui/compact/CompactDatePicker";
import CompactSelect from "@/components/ui/compact/CompactSelect";
import { format as formatDate } from "date-fns";
import { CalendarDays, CalendarRange, Clock, Terminal } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import {
  CustomToggle,
  PlaygroundCard,
} from "../../../components/PlaygroundCommon";

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
      ? `${formatDate(bRangeVal.from, bFormat)} ~ ${bRangeVal.to ? formatDate(bRangeVal.to, bFormat) : "none"}`
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Single Date */}
        <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
          <div>
            <h3 className="text-foreground mb-1 flex items-center gap-1.5 text-base font-semibold">
              <CalendarDays className="size-4 text-emerald-500" /> Single Date
              Mode
            </h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Select one single day. Generates a standard popover Calendar
              picker.
            </p>
            <CompactDatePicker
              mode="single"
              value={singleVal}
              onChange={setSingleVal}
              fullWidth
            />
          </div>
          <div className="bg-muted/40 border-border mt-4 rounded-lg border p-2.5 font-mono text-[11px]">
            Selected:{" "}
            <span className="text-primary font-bold">
              {singleVal ? formatDate(singleVal, "PPP") : "None"}
            </span>
          </div>
        </div>

        {/* Multiple Dates */}
        <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
          <div>
            <h3 className="text-foreground mb-1 flex items-center gap-1.5 text-base font-semibold">
              <Clock className="size-4 text-violet-500" /> Multiple Dates Mode
            </h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Select multiple distinct dates. Displays a badge counter and
              customizable item badges.
            </p>
            <CompactDatePicker
              mode="multiple"
              value={multiVal}
              onChange={setMultiVal}
              fullWidth
            />
          </div>
          <div className="bg-muted/40 border-border mt-4 rounded-lg border p-2.5 font-mono text-[11px]">
            Count:{" "}
            <span className="text-primary font-bold">
              {multiVal?.length || 0} date(s)
            </span>
          </div>
        </div>

        {/* Range Dates */}
        <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
          <div>
            <h3 className="text-foreground mb-1 flex items-center gap-1.5 text-base font-semibold">
              <CalendarRange className="size-4 text-amber-500" /> Range Selector
            </h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Pick a start and end date range. Displays dates connected by a
              separator.
            </p>
            <CompactDatePicker
              mode="range"
              value={rangeVal}
              onChange={setRangeVal}
              fullWidth
            />
          </div>
          <div className="bg-muted/40 border-border mt-4 truncate rounded-lg border p-2.5 font-mono text-[11px]">
            Range:{" "}
            <span className="text-primary font-bold">
              {rangeVal?.from ? formatDate(rangeVal.from, "PP") : "None"} ~{" "}
              {rangeVal?.to ? formatDate(rangeVal.to, "PP") : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Format custom patterns */}
      <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
        <h3 className="text-foreground mb-1 text-base font-semibold">
          Custom Formatting & Width Options
        </h3>
        <p className="text-muted-foreground mb-6 text-xs">
          Demonstrates custom formatting patterns (using date-fns syntax).
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              Format "d MMM yyyy"
            </span>
            <CompactDatePicker
              mode="single"
              value={singleVal}
              onChange={setSingleVal}
              format="d MMM yyyy"
              fullWidth
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              Format "yyyy-MM-dd"
            </span>
            <CompactDatePicker
              mode="single"
              value={singleVal}
              onChange={setSingleVal}
              format="yyyy-MM-dd"
              fullWidth
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              Format "EEEE, MMMM d"
            </span>
            <CompactDatePicker
              mode="single"
              value={singleVal}
              onChange={setSingleVal}
              format="EEEE, MMMM d"
              fullWidth
            />
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
              <label className="text-muted-foreground text-xs font-semibold">
                Selection Mode
              </label>
              <div className="border-border bg-background flex rounded-lg border p-0.5">
                {(["single", "multiple", "range"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setBMode(mode)}
                    className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all ${bMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Date Format Pattern
              </label>
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
              <label className="text-muted-foreground text-xs font-semibold">
                Placeholder text
              </label>
              <input
                type="text"
                value={bPlaceholder}
                onChange={(e) => setBPlaceholder(e.target.value)}
                className="border-input bg-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
              />
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <CustomToggle
                checked={bFullWidth}
                onChange={setBFullWidth}
                label="Full Width Layout"
              />
            </div>
          </>
        }
      >
        <div className="flex w-full max-w-sm flex-col items-center gap-4 px-4">
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

          <div className="border-border bg-background/50 mt-2 flex w-full flex-col gap-1 rounded-lg border p-3.5">
            <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
              <Terminal className="size-3.5" /> Output State
            </span>
            <p className="truncate font-mono text-xs">
              Value:{" "}
              <span className="text-primary font-semibold">
                {getActiveBuilderValString()}
              </span>
            </p>
          </div>
        </div>
      </PlaygroundCard>
    </div>
  );
}

