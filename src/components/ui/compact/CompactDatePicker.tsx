import { format as formatDate } from "date-fns";
import { CalendarIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type CompactDatePicker = {
  popover?: React.ComponentProps<typeof Popover>;
  popoverTrigger?: React.ComponentProps<typeof PopoverTrigger>;
  popoverContent?: React.ComponentProps<typeof PopoverContent>;
  button?: React.ComponentProps<typeof Button>;
  calendar?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelected"
  >;
};

type CompactDatePickerProps = {
  format?: string;
  fullWidth?: boolean;
  placeholder?: string;
  slotProps?: CompactDatePicker;
} & (
  | {
      mode: "single";
      value?: Date;
      onChange?: (date: Date | undefined) => void;
    }
  | {
      mode: "multiple";
      textRemoveAll?: string;
      value?: Date[];
      onChange?: (date: Date[] | undefined) => void;
    }
  | {
      mode: "range";
      value?: DateRange;
      onChange?: (range: DateRange | undefined) => void;
    }
);

function renderCalendar(
  props: CompactDatePickerProps,
  calendarProps?: CompactDatePicker["calendar"]
) {
  const { mode, value, onChange } = props;

  switch (mode) {
    case "single":
      return (
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
          {...calendarProps}
        />
      );
    case "multiple":
      return (
        <Calendar
          mode="multiple"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.[0]}
          {...calendarProps}
        />
      );
    case "range":
      return (
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from}
          {...calendarProps}
        />
      );
  }
}

function SelectedDatesList({
  dates,
  format,
  textRemoveAll = "Hapus Semua",
  onRemove,
  onRemoveAll,
}: {
  dates: Date[];
  format: string;
  textRemoveAll?: string;
  onRemove: (date: Date) => void;
  onRemoveAll: () => void;
}) {
  if (!dates.length) return null;

  return (
    <div className="flex max-h-24 w-full flex-wrap gap-1.5 overflow-y-auto border-t p-2">
      <Button
        fullWidth
        size="xs"
        variant="destructive"
        endIcon={<TrashIcon data-icon="inline-end" />}
        onClick={onRemoveAll}
      >
        {textRemoveAll}
      </Button>
      {dates
        .sort((a, b) => a.getTime() - b.getTime())
        .map((date) => (
          <Badge
            key={date.toISOString()}
            variant="secondary"
            className="gap-1 pr-1 font-normal"
          >
            {formatDate(date, format)}
            <button
              type="button"
              onClick={() => onRemove(date)}
              className="hover:bg-muted-foreground/20 rounded-full"
            >
              <X className="text-destructive size-3" />
            </button>
          </Badge>
        ))}
    </div>
  );
}

function CompactDatePicker(props: CompactDatePickerProps) {
  const {
    mode,
    format = "d/MM/y",
    fullWidth = false,
    placeholder = `Select ${mode === "single" ? "a date" : "dates"}`,
    value,
    slotProps,
    onChange,
  } = props;
  const {
    popover: popoverProps,
    popoverTrigger: popoverTriggerProps,
    popoverContent: popoverContentProps,
    button: buttonProps,
    calendar: calendarProps,
  } = slotProps ?? {};
  const { className: buttonClassName, ...restButtonProps } = buttonProps ?? {};
  const { className: popoverContentClassName, ...restPopoverContentProps } =
    popoverContentProps ?? {};

  const id = React.useId();

  const displayText = React.useMemo(() => {
    if (mode === "single") {
      const date = value as Date | undefined;
      return date ? formatDate(date, format) : placeholder;
    }

    if (mode === "multiple") {
      return placeholder;
    }

    const range = value as DateRange | undefined;
    if (!range?.from) return placeholder;
    if (!range.to) return formatDate(range.from, format);
    return `${formatDate(range.from, format)} ~ ${formatDate(range.to, format)}`;
  }, [mode, value, format, placeholder]);

  const hasValue = React.useMemo(() => {
    if (mode === "single") return Boolean(value);
    if (mode === "multiple") return Boolean(value?.length);
    return Boolean(value?.from);
  }, [mode, value]);

  return (
    <Popover {...popoverProps}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            id={id}
            size="sm"
            fullWidth={fullWidth}
            slotProps={{ span: { className: "block w-full" } }}
            className={cn("relative block font-normal", buttonClassName)}
            {...restButtonProps}
          >
            <CalendarIcon
              data-icon="inline-start"
              className="absolute top-1/2 left-2 -translate-y-1/2"
            />
            <span className="block w-full truncate px-8 text-center">
              {displayText}
            </span>
            {hasValue && mode === "multiple" && (
              <Badge className="absolute top-1/2 right-2 -translate-y-1/2">
                {value?.length}
              </Badge>
            )}
          </Button>
        }
        {...popoverTriggerProps}
      />
      <PopoverContent
        align="center"
        className={cn(
          "w-55 flex-col items-center p-0",
          popoverContentClassName
        )}
        {...restPopoverContentProps}
      >
        {renderCalendar(props, calendarProps)}
        {mode === "multiple" && (
          <SelectedDatesList
            format={format}
            dates={value ?? []}
            textRemoveAll={props?.textRemoveAll}
            onRemove={(date) =>
              onChange?.(value?.filter((d) => d.getTime() !== date.getTime()))
            }
            onRemoveAll={() => onChange?.([])}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export default CompactDatePicker;
