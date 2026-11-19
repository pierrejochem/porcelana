/* eslint-disable jsx-a11y/no-autofocus -- focusing the search field on open is the expected combobox behaviour */
/* eslint-disable jsx-a11y/role-has-required-aria-props -- Radix sets aria-controls on the trigger */
import { forwardRef, useState, type ButtonHTMLAttributes } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Command } from "cmdk";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { useControllableState } from "../lib/useControllableState";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Extra search terms. */
  keywords?: string[];
}

export interface ComboboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange"> {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Accessible name of the search field inside the popup. */
  searchLabel?: string;
  emptyText?: string;
  /** Selecting the active option again clears it. Default true. */
  allowDeselect?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Searchable select. Trigger is a button (works with Field for labelling);
 * the popup is a cmdk listbox with arrow-key navigation and type-to-filter.
 */
export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  {
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    searchLabel = "Search options",
    emptyText = "No results",
    allowDeselect = true,
    open: openProp,
    onOpenChange,
    className,
    disabled,
    ...triggerProps
  },
  ref
) {
  const [value, setValue] = useControllableState<string | null>(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = useControllableState(openProp, false, onOpenChange);
  const [query, setQuery] = useState("");
  const selected = options.find((o) => o.value === value);

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          data-placeholder={selected ? undefined : ""}
          className={cn("pl-select-trigger", className)}
          {...triggerProps}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronDownIcon size={18} strokeWidth={2.4} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          collisionPadding={8}
          align="start"
          className="pl-combobox-content pl-root"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command label={searchLabel} shouldFilter>
            <div className="pl-combobox-input-wrap">
              <div className="pl-input-wrap">
                <SearchIcon size={18} />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder={searchPlaceholder}
                  aria-label={searchLabel}
                  className="pl-input"
                />
              </div>
            </div>
            <Command.List className="pl-combobox-list">
              <Command.Empty className="pl-combobox-empty">{emptyText}</Command.Empty>
              {options.map((o) => (
                <Command.Item
                  key={o.value}
                  value={o.value}
                  keywords={[o.label, ...(o.keywords ?? [])]}
                  disabled={o.disabled}
                  onSelect={() => {
                    setValue(allowDeselect && o.value === value ? null : o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="pl-combobox-item"
                >
                  <span>{o.label}</span>
                  {o.value === value ? <CheckIcon size={16} strokeWidth={3} aria-hidden /> : null}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
