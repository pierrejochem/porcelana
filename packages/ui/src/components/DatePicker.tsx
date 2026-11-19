/* eslint-disable jsx-a11y/no-autofocus -- the date picker dialog pattern focuses the selected day on open */
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { DayPicker, type Matcher } from "react-day-picker";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { useControllableState } from "../lib/useControllableState";

export type CalendarProps = ComponentProps<typeof DayPicker>;

function Chevron({ orientation }: { orientation?: "left" | "right" | "up" | "down" }) {
  return orientation === "left" ? <ChevronLeftIcon size={18} strokeWidth={2.6} /> : <ChevronRightIcon size={18} strokeWidth={2.6} />;
}

/** Month grid with 44px day cells, keyboard navigation and today marker. Monday-first by default. */
export function Calendar({ className, components, weekStartsOn = 1, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      weekStartsOn={weekStartsOn}
      showOutsideDays={showOutsideDays}
      className={cn("pl-calendar", className)}
      components={{ Chevron, ...components }}
      {...(props as object)}
    />
  );
}

export interface DatePickerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange"> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  placeholder?: string;
  /** BCP 47 locale for the trigger text. Defaults to the browser locale. */
  locale?: string;
  /** Days that cannot be picked (react-day-picker matchers). */
  disabledDays?: Matcher | Matcher[];
  /** Earliest / latest navigable months. */
  startMonth?: Date;
  endMonth?: Date;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    value: valueProp,
    defaultValue = null,
    onValueChange,
    placeholder = "Pick a date",
    locale,
    disabledDays,
    startMonth,
    endMonth,
    open: openProp,
    onOpenChange,
    className,
    disabled,
    ...triggerProps
  },
  ref
) {
  const [value, setValue] = useControllableState<Date | null>(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = useControllableState(openProp, false, onOpenChange);
  const label = value
    ? new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(value)
    : placeholder;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          aria-haspopup="dialog"
          disabled={disabled}
          data-placeholder={value ? undefined : ""}
          className={cn("pl-select-trigger", className)}
          {...triggerProps}
        >
          <span>{label}</span>
          <CalendarIcon size={18} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content sideOffset={8} collisionPadding={8} align="start" className="pl-popover pl-root">
          <Calendar
            mode="single"
            autoFocus
            selected={value ?? undefined}
            defaultMonth={value ?? undefined}
            disabled={disabledDays}
            startMonth={startMonth}
            endMonth={endMonth}
            onSelect={(d: Date | undefined) => {
              setValue(d ?? null);
              if (d) setOpen(false);
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
