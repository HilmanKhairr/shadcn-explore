import { useState } from "react";
import CompactSelect from "@/components/ui/compact/CompactSelect";
import { PlaygroundCard, CustomToggle } from "./PlaygroundCommon";
import { Terminal, Apple, Utensils } from "lucide-react";

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
  const [flatVal, setFlatVal] = useState<string>("");
  const [groupedVal, setGroupedVal] = useState<string>("");

  // Builder States
  const [selDataType, setSelDataType] = useState<"flat" | "grouped">("flat");
  const [selLoading, setSelLoading] = useState(false);
  const [selFullWidth, setSelFullWidth] = useState(false);
  const [selPlaceholder, setSelPlaceholder] = useState("Select your choice...");
  const [selLabel, setSelLabel] = useState("Fruit Categories");
  const [builderVal, setBuilderVal] = useState<string>("");

  const interactiveCode = `import CompactSelect from "@/components/ui/compact/CompactSelect";

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
  items={items}
  placeholder="${selPlaceholder}"
  label="${selLabel}"${selLoading ? "\n  loading" : ""}${selFullWidth ? "\n  fullWidth" : ""}${
    selDataType === "flat" ? '\n  valueKey="id"\n  labelKey="name"' : ""
  }
  value={value}
  onValueChange={(val) => setValue(val as string)}
/>`;

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Static Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flat list */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base mb-1 text-foreground flex items-center gap-1.5">
              <Apple className="size-4 text-amber-500" /> Flat List & Custom Keys
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Demonstrates items mapped using custom property keys (`valueKey="id"`, `labelKey="name"`).
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
          <div className="mt-4 p-2.5 rounded-lg bg-muted/40 border border-border text-[11px] font-mono">
            Selected Fruit: <span className="font-bold text-primary">{flatVal || "None"}</span>
          </div>
        </div>

        {/* Grouped list */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base mb-1 text-foreground flex items-center gap-1.5">
              <Utensils className="size-4 text-violet-500" /> Categorized Groups
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Supports groups automatically when children arrays are nested inside objects.
            </p>
            <CompactSelect
              items={foodOptions}
              value={groupedVal}
              onValueChange={(val) => setGroupedVal(val as string)}
              placeholder="Order food/drink..."
              label="Menu Options"
            />
          </div>
          <div className="mt-4 p-2.5 rounded-lg bg-muted/40 border border-border text-[11px] font-mono">
            Ordered Item: <span className="font-bold text-primary">{groupedVal || "None"}</span>
          </div>
        </div>
      </div>

      {/* 2. States Showcase */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-base mb-1 text-foreground">States & Layouts</h3>
        <p className="text-xs text-muted-foreground mb-6">Demonstrates loading, disabled, and fullWidth selects.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Loading Trigger</span>
            <CompactSelect items={[]} loading placeholder="Preparing registry..." />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Disabled Trigger</span>
            <CompactSelect items={[]} disabled placeholder="Unavailable" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Full Width Option</span>
            <CompactSelect items={fruitOptions} valueKey="id" labelKey="name" fullWidth placeholder="Fits container width" />
          </div>
        </div>
      </div>

      {/* 3. Interactive Playground */}
      <PlaygroundCard
        title="Interactive Builder"
        badge="ui/compact/CompactSelect"
        description="Toggle data types, loading icons, custom placeholder text, group categories, and full width parameters."
        code={interactiveCode}
        controls={
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Data Type</label>
              <div className="flex rounded-lg border border-border p-0.5 bg-background">
                {(["flat", "grouped"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelDataType(type);
                      setBuilderVal(""); // reset selected value
                    }}
                    className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      selDataType === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type === "flat" ? "Flat List" : "Grouped List"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Placeholder</label>
              <input
                type="text"
                value={selPlaceholder}
                onChange={(e) => setSelPlaceholder(e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Group Header Label</label>
              <input
                type="text"
                value={selLabel}
                onChange={(e) => setSelLabel(e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <CustomToggle checked={selLoading} onChange={setSelLoading} label="Loading State" />
              <CustomToggle checked={selFullWidth} onChange={setSelFullWidth} label="Full Width" />
            </div>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4">
          {selDataType === "flat" ? (
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

          <div className="w-full p-3.5 rounded-lg border border-border bg-background/50 flex flex-col gap-1 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Terminal className="size-3.5" /> Selection Log
            </span>
            <p className="text-xs font-mono">
              Selected: <span className="font-semibold text-primary">{builderVal || "none"}</span>
            </p>
          </div>
        </div>
      </PlaygroundCard>
    </div>
  );
}
