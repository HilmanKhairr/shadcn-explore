import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select";

export type SelectGroupOption<T> = { label?: string; items: T[] };

interface CompactSelectProps<T> extends Omit<React.ComponentPropsWithoutRef<typeof Select>, "items"> {
  items: T[] | SelectGroupOption<T>[];
  label?: React.ReactNode;
  placeholder?: string;
  loading?: boolean;
  fullWidth?: boolean;
  labelKey?: keyof T;
  valueKey?: keyof T;
}

interface SelectContentGroupProps<T> {
  label?: React.ReactNode;
  items?: T[] | SelectGroupOption<T>[];
  labelKey: keyof T;
  valueKey: keyof T;
}

function SelectContentGroup<T extends Record<string, unknown>>({ label, items, labelKey, valueKey }: SelectContentGroupProps<T>) {
  if (!items || items.length === 0) return null;

  const isGroup = items.some((item) => item && "items" in item);

  if (isGroup) {
    const groupItems = items as SelectGroupOption<T>[];

    return (
      <>
        {groupItems.map((group, index) => {
          if (!group || !group.items) return null;

          return (
            <React.Fragment key={`group-${group.label || index}`}>
              <SelectGroup>
                {!!group.label && <SelectLabel>{group.label}</SelectLabel>}

                {group.items.map((item: T) => {
                  if (!item) return null;

                  const itemValue = String(item[valueKey]);
                  const itemLabel = String(item[labelKey]);

                  return (
                    <SelectItem key={itemValue} value={itemValue}>
                      {itemLabel}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
              {index < groupItems.length - 1 && <SelectSeparator />}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  const flatItems = items as T[];

  return (
    <SelectGroup>
      {!!label && <SelectLabel>{label}</SelectLabel>}

      {flatItems.map((item) => {
        if (!item) return null;

        const itemValue = String(item[valueKey]);
        const itemLabel = String(item[labelKey]);

        return (
          <SelectItem key={itemValue} value={itemValue}>
            {itemLabel}
          </SelectItem>
        );
      })}
    </SelectGroup>
  );
}

function CompactSelect<T extends Record<string, unknown>>({ items, label, placeholder, loading = false, fullWidth = false, labelKey = "label", valueKey = "value", ...props }: CompactSelectProps<T>) {
  return (
    <Select disabled={loading} {...props}>
      <SelectTrigger Icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined} className={cn(fullWidth ? "w-full" : "")}>
        <SelectValue placeholder={loading ? "Loading..." : placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectContentGroup label={label} items={items} labelKey={labelKey} valueKey={valueKey} />
      </SelectContent>
    </Select>
  );
}

export default CompactSelect;