import { cn } from "@/lib/utils";
import { Loader2, XIcon } from "lucide-react";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../select";

export type SelectGroupOption<T> = { label?: string; items: T[] };

type CompactSelectBaseProps<T> = Omit<
  React.ComponentPropsWithoutRef<typeof Select>,
  "items" | "value" | "onValueChange" | "multiple" | "defaultValue"
> & {
  items: T[] | SelectGroupOption<T>[];
  label?: React.ReactNode;
  placeholder?: string;
  loading?: boolean;
  fullWidth?: boolean;
  labelKey?: keyof T;
  valueKey?: keyof T;
  clearable?: boolean;
};

type CompactSelectProps<T> = CompactSelectBaseProps<T> &
  (
    | {
        multiple?: false;
        value?: string;
        defaultValue?: string;
        onValueChange?: (val: string | undefined) => void;
      }
    | {
        multiple: true;
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (val: string[] | undefined) => void;
      }
  );

interface SelectContentGroupProps<T> {
  label?: React.ReactNode;
  items?: T[] | SelectGroupOption<T>[];
  labelKey: keyof T;
  valueKey: keyof T;
}

function SelectContentGroup<T extends Record<string, unknown>>({
  label,
  items,
  labelKey,
  valueKey,
}: SelectContentGroupProps<T>) {
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

function CompactSelectTriggerIcon({
  multiple,
  loading,
  value,
  clearable,
  handleRemoveValue,
}: {
  multiple: boolean;
  loading: boolean;
  value: string | string[] | undefined;
  clearable?: boolean;
  handleRemoveValue: () => void;
}) {
  const hasValue = React.useMemo(() => {
    if (multiple) return Boolean((value as string[] | undefined)?.length);

    return Boolean(value);
  }, [multiple, value]);

  if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
  if (hasValue && !!clearable)
    return (
      <span
        role="button"
        tabIndex={0}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleRemoveValue();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            e.preventDefault();
            handleRemoveValue();
          }
        }}
        className="bg-destructive/10 text-destructive hover:bg-destructive/20 pointer-events-auto invisible z-20 inline-flex size-5 cursor-pointer items-center justify-center rounded-md transition-colors group-hover/select:visible active:scale-95"
        title="Clear Selection"
      >
        <XIcon className="size-3" />
      </span>
    );

  return undefined;
}

function CompactSelect<T extends Record<string, unknown>>(
  props: CompactSelectProps<T>
) {
  const {
    items,
    label,
    placeholder,
    loading = false,
    fullWidth = false,
    labelKey = "label",
    valueKey = "value",
    multiple,
    value,
    defaultValue,
    clearable = true,
    onValueChange,
    ...restProps
  } = props as CompactSelectBaseProps<T> & {
    multiple?: boolean;
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (val: string | string[] | undefined) => void;
  };

  const isMultiple = multiple ?? false;

  const selectedLabel = React.useMemo(() => {
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return undefined;
    }

    const flatItems: T[] = [];
    const isGroup = items?.some(
      (item) => item && typeof item === "object" && "items" in item
    );
    if (isGroup) {
      (items as SelectGroupOption<T>[]).forEach((group) => {
        if (group && group.items) {
          flatItems.push(...group.items);
        }
      });
    } else if (items) {
      flatItems.push(...(items as T[]));
    }

    if (isMultiple) {
      const valueArray = Array.isArray(value) ? value : [value];
      const matchedLabels = flatItems
        .filter((item) =>
          valueArray.map(String).includes(String(item[valueKey]))
        )
        .map((item) => String(item[labelKey]));
      return matchedLabels.length > 0 ? matchedLabels.join(", ") : undefined;
    } else {
      const matched = flatItems.find(
        (item) => String(item[valueKey]) === String(value)
      );
      return matched ? String(matched[labelKey]) : undefined;
    }
  }, [value, items, labelKey, valueKey, isMultiple]);

  const handleRemoveValue = () => {
    if (isMultiple) {
      onValueChange?.([]);
    } else {
      onValueChange?.(undefined);
    }
  };

  const handleSelectValueChange = (val: string | string[] | null) => {
    onValueChange?.(val ?? undefined);
  };

  return (
    <Select
      multiple={isMultiple as boolean}
      value={value as string & string[]}
      defaultValue={defaultValue as string & string[]}
      onValueChange={handleSelectValueChange}
      disabled={loading}
      {...restProps}
    >
      <SelectTrigger
        Icon={
          <CompactSelectTriggerIcon
            multiple={isMultiple}
            loading={loading}
            value={value}
            clearable={clearable}
            handleRemoveValue={handleRemoveValue}
          />
        }
        className={cn("group/select", fullWidth ? "w-full" : "")}
      >
        <SelectValue placeholder={loading ? "Loading..." : placeholder}>
          {selectedLabel}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectContentGroup
          label={label}
          items={items}
          labelKey={labelKey}
          valueKey={valueKey}
        />
      </SelectContent>
    </Select>
  );
}

export default CompactSelect;
