import CompactSelect from "@/components/ui/compact/CompactSelect";
import { Apple, Bookmark, CheckSquare, Terminal, Utensils } from "lucide-react";
import { useState } from "react";
import {
  CustomToggle,
  PlaygroundCard,
} from "../../../components/PlaygroundCommon";

// Mock Data
const fruitOptions = [
  { id: "apple", name: "Apple 🍎" },
  { id: "banana", name: "Banana 🍌" },
  { id: "orange", name: "Orange 🍊" },
  { id: "strawberry", name: "Strawberry 🍓" },
  { id: "grape", name: "Grape 🍇" },
];

const foodOptions = [
  {
    label: "Main Dishes 🍲",
    items: [
      { value: "nasi-goreng", label: "Fried Rice (Nasi Goreng)" },
      { value: "mie-ayam", label: "Chicken Noodle (Mie Ayam)" },
      { value: "bakso", label: "Meatballs (Bakso)" },
    ],
  },
  {
    label: "Drinks & Refreshments 🥤",
    items: [
      { value: "es-teh", label: "Iced Sweet Tea" },
      { value: "kopi-susu", label: "Iced Coffee Milk" },
      { value: "jus-alpukat", label: "Avocado Juice" },
    ],
  },
];

export default function CompactSelectPlayground() {
  // Static showcase state
  const [flatVal, setFlatVal] = useState<string>("");
  const [groupedVal, setGroupedVal] = useState<string>("");
  const [multiVal, setMultiVal] = useState<string[]>(["apple", "orange"]);
  const [preselectedVal, setPreselectedVal] = useState<string>("banana");

  // Builder States
  const [selDataType, setSelDataType] = useState<"flat" | "grouped">("flat");
  const [selMultiple, setSelMultiple] = useState(false);
  const [selLoading, setSelLoading] = useState(false);
  const [selFullWidth, setSelFullWidth] = useState(false);
  const [selPlaceholder, setSelPlaceholder] = useState("Select your choice...");
  const [selLabel, setSelLabel] = useState("Fruit Categories");
  const [builderVal, setBuilderVal] = useState<string>("");
  const [builderMultiVal, setBuilderMultiVal] = useState<string[]>([]);

  const interactiveCode = `import CompactSelect from "@/components/ui/compact/CompactSelect";
import { useState } from "react";

const [value, setValue] = useState<${selMultiple ? "string[]" : "string"}>(${selMultiple ? "[]" : '""'});

const items = ${
    selDataType === "flat"
      ? `[
  { id: "apple", name: "Apple 🍎" },
  { id: "banana", name: "Banana 🍌" }
]`
      : `[
  {
    label: "Main Dishes 🍲",
    items: [
      { value: "nasi-goreng", label: "Fried Rice (Nasi Goreng)" }
    ]
  }
]`
  };

<CompactSelect
  items={items}${selMultiple ? "\n  multiple" : ""}
  placeholder="${selPlaceholder}"
  label="${selLabel}"${selLoading ? "\n  loading" : ""}${selFullWidth ? "\n  fullWidth" : ""}${selDataType === "flat" ? '\n  valueKey="id"\n  labelKey="name"' : ""}
  value={value}
  onValueChange={setValue}
/>`;

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Static Showcase Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Flat list */}
        <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
          <div>
            <h3 className="text-foreground mb-1 flex items-center gap-1.5 text-base font-semibold">
              <Apple className="size-4 text-amber-500" /> Flat List & Custom
              Keys
            </h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Demonstrates items mapped using custom property keys
              (`valueKey="id"`, `labelKey="name"`).
            </p>
            <CompactSelect
              items={fruitOptions}
              value={flatVal}
              onValueChange={(val) => setFlatVal(val as string)}
              placeholder="Select a fruit"
              valueKey="id"
              labelKey="name"
              label="Available Fruits"
            />
          </div>
          <div className="bg-muted/40 border-border mt-4 rounded-lg border p-2.5 font-mono text-[11px]">
            Selected Fruit:{" "}
            <span className="text-primary font-bold">{flatVal || "None"}</span>
          </div>
        </div>

        {/* Grouped list */}
        <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
          <div>
            <h3 className="text-foreground mb-1 flex items-center gap-1.5 text-base font-semibold">
              <Utensils className="size-4 text-violet-500" /> Categorized Groups
            </h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Supports groups automatically when children arrays are nested
              inside objects.
            </p>
            <CompactSelect
              items={foodOptions}
              value={groupedVal}
              onValueChange={(val) => setGroupedVal(val as string)}
              placeholder="Order food/drink..."
              label="Menu Options"
            />
          </div>
          <div className="bg-muted/40 border-border mt-4 rounded-lg border p-2.5 font-mono text-[11px]">
            Ordered Item:{" "}
            <span className="text-primary font-bold">
              {groupedVal || "None"}
            </span>
          </div>
        </div>

        {/* Multiple Selection (New Cleanup) */}
        <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
          <div>
            <h3 className="text-foreground mb-1 flex items-center gap-1.5 text-base font-semibold">
              <CheckSquare className="size-4 text-blue-500" /> Multiple
              Selection
            </h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Enables multiple value selection. Triggers selection checkmarks
              and show removal buttons.
            </p>
            <CompactSelect
              multiple
              items={fruitOptions}
              value={multiVal}
              onValueChange={(val) => setMultiVal(val as string[])}
              valueKey="id"
              labelKey="name"
              placeholder="Choose multiple fruits..."
              label="Multi Selection"
            />
          </div>
          <div className="bg-muted/40 border-border mt-4 truncate rounded-lg border p-2.5 font-mono text-[11px]">
            Selected Array:{" "}
            <span className="text-primary font-bold">
              {multiVal.length ? `[${multiVal.join(", ")}]` : "[]"}
            </span>
          </div>
        </div>

        {/* Pre-selected / Controlled State Case (New Case) */}
        <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
          <div>
            <h3 className="text-foreground mb-1 flex items-center gap-1.5 text-base font-semibold">
              <Bookmark className="size-4 text-emerald-500" /> Pre-selected
              State
            </h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Demonstrates initializing the component with a default
              pre-selected controlled value.
            </p>
            <CompactSelect
              items={fruitOptions}
              value={preselectedVal}
              onValueChange={(val) => setPreselectedVal(val as string)}
              valueKey="id"
              labelKey="name"
              placeholder="Choose fruit"
              label="Controlled State"
            />
          </div>
          <div className="bg-muted/40 border-border mt-4 rounded-lg border p-2.5 font-mono text-[11px]">
            Active Value:{" "}
            <span className="text-primary font-bold">
              {preselectedVal || "None"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. States Showcase */}
      <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
        <h3 className="text-foreground mb-1 text-base font-semibold">
          States & Layouts
        </h3>
        <p className="text-muted-foreground mb-6 text-xs">
          Demonstrates loading, disabled, and fullWidth selects.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              Loading Trigger
            </span>
            <CompactSelect
              items={[]}
              loading
              placeholder="Preparing registry..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              Disabled Trigger
            </span>
            <CompactSelect items={[]} disabled placeholder="Unavailable" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              Full Width Option
            </span>
            <CompactSelect
              items={fruitOptions}
              valueKey="id"
              labelKey="name"
              fullWidth
              placeholder="Fits container width"
            />
          </div>
        </div>
      </div>

      {/* 3. Interactive Playground */}
      <PlaygroundCard
        title="Interactive Builder"
        badge="ui/compact/CompactSelect"
        description="Toggle data structures, single vs multiple modes, loading triggers, placeholder text, and full width layouts."
        code={interactiveCode}
        controls={
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Data Structure
              </label>
              <div className="border-border bg-background flex rounded-lg border p-0.5">
                {(["flat", "grouped"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelDataType(type);
                      setBuilderVal("");
                      setBuilderMultiVal([]);
                    }}
                    className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all ${selDataType === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {type === "flat" ? "Flat List" : "Grouped List"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Selection Mode
              </label>
              <div className="border-border bg-background flex rounded-lg border p-0.5">
                {([false, true] as const).map((multi) => (
                  <button
                    key={multi ? "multi" : "single"}
                    onClick={() => {
                      setSelMultiple(multi);
                      setBuilderVal("");
                      setBuilderMultiVal([]);
                    }}
                    className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all ${selMultiple === multi ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {multi ? "Multiple" : "Single"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Placeholder
              </label>
              <input
                type="text"
                value={selPlaceholder}
                onChange={(e) => setSelPlaceholder(e.target.value)}
                className="border-input bg-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Group Header Label
              </label>
              <input
                type="text"
                value={selLabel}
                onChange={(e) => setSelLabel(e.target.value)}
                className="border-input bg-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
              />
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <CustomToggle
                checked={selLoading}
                onChange={setSelLoading}
                label="Loading State"
              />
              <CustomToggle
                checked={selFullWidth}
                onChange={setSelFullWidth}
                label="Full Width"
              />
            </div>
          </>
        }
      >
        <div className="flex w-full max-w-sm flex-col items-center gap-4 px-4">
          {/* Builder Dropdown renderer based on modes */}
          {selMultiple ? (
            selDataType === "flat" ? (
              <CompactSelect
                multiple
                items={fruitOptions}
                placeholder={selPlaceholder}
                label={selLabel}
                loading={selLoading}
                fullWidth={selFullWidth}
                valueKey="id"
                labelKey="name"
                value={builderMultiVal}
                onValueChange={(val: unknown) =>
                  setBuilderMultiVal(val as string[])
                }
              />
            ) : (
              <CompactSelect
                multiple
                items={foodOptions}
                placeholder={selPlaceholder}
                label={selLabel}
                loading={selLoading}
                fullWidth={selFullWidth}
                value={builderMultiVal}
                onValueChange={(val: unknown) =>
                  setBuilderMultiVal(val as string[])
                }
              />
            )
          ) : selDataType === "flat" ? (
            <CompactSelect
              items={fruitOptions}
              placeholder={selPlaceholder}
              label={selLabel}
              loading={selLoading}
              fullWidth={selFullWidth}
              valueKey="id"
              labelKey="name"
              value={builderVal}
              onValueChange={(val: unknown) => setBuilderVal(val as string)}
            />
          ) : (
            <CompactSelect
              items={foodOptions}
              placeholder={selPlaceholder}
              label={selLabel}
              loading={selLoading}
              fullWidth={selFullWidth}
              value={builderVal}
              onValueChange={(val: unknown) => setBuilderVal(val as string)}
            />
          )}

          <div className="border-border bg-background/50 mt-2 flex w-full flex-col gap-1 rounded-lg border p-3.5">
            <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
              <Terminal className="size-3.5" /> Selection Log
            </span>
            <p className="truncate font-mono text-xs">
              Selected:{" "}
              <span className="text-primary font-semibold">
                {selMultiple
                  ? builderMultiVal.length
                    ? `[${builderMultiVal.join(", ")}]`
                    : "[]"
                  : builderVal || "none"}
              </span>
            </p>
          </div>
        </div>
      </PlaygroundCard>
    </div>
  );
}

