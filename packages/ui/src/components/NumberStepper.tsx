import { forwardRef, useId, useState, type KeyboardEvent } from "react";
import { MinusIcon, PlusIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { useControllableState } from "../lib/useControllableState";
import { IconButton } from "./IconButton";

export interface NumberStepperProps {
  /** Accessible name. */
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Visible unit after the number, e.g. "min". Also spoken via aria-valuetext. */
  suffix?: string;
  disabled?: boolean;
  /** Class on the outer group. */
  className?: string;
  /** Id of the input. Generated when omitted. */
  id?: string;
}

/**
 * Spinbutton with − / + buttons. Keyboard: ↑/↓ ±step, PageUp/PageDown ±10 steps, Home/End.
 * Typing a number commits on blur or Enter.
 */
export const NumberStepper = forwardRef<HTMLInputElement, NumberStepperProps>(function NumberStepper(
  { label, value: valueProp, defaultValue, onValueChange, min = 0, max = 100, step = 1, suffix, disabled, className, id },
  ref
) {
  const autoId = useId();
  const inputId = id ?? `pl-stepper-${autoId}`;
  const [value, setValue] = useControllableState(valueProp, defaultValue ?? min, onValueChange);
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const commit = (n: number) => {
    setDraft(null);
    if (!Number.isNaN(n)) setValue(clamp(n));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const map: Record<string, number> = {
      ArrowUp: value + step,
      ArrowDown: value - step,
      PageUp: value + step * 10,
      PageDown: value - step * 10,
      Home: min,
      End: max
    };
    if (e.key in map) {
      e.preventDefault();
      commit(map[e.key] as number);
    } else if (e.key === "Enter" && draft !== null) {
      commit(Number(draft));
    }
  };

  return (
    <div className={cn("pl-stepper", className)} role="group" aria-label={label}>
      <IconButton
        aria-label={`Decrease ${label}`}
        tabIndex={-1}
        disabled={disabled || value <= min}
        onClick={() => commit(value - step)}
      >
        <MinusIcon size={20} strokeWidth={2.6} />
      </IconButton>
      <input
        ref={ref}
        id={inputId}
        className="pl-stepper-input"
        role="spinbutton"
        inputMode="numeric"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
        value={draft ?? String(value)}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d-]/g, ""))}
        onBlur={() => draft !== null && commit(Number(draft))}
        onKeyDown={onKeyDown}
      />
      {suffix ? (
        <span className="pl-stepper-suffix" aria-hidden="true">
          {suffix}
        </span>
      ) : null}
      <IconButton
        aria-label={`Increase ${label}`}
        tabIndex={-1}
        disabled={disabled || value >= max}
        onClick={() => commit(value + step)}
      >
        <PlusIcon size={20} strokeWidth={2.6} />
      </IconButton>
    </div>
  );
});
