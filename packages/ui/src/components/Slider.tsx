import { forwardRef, useId, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { MinusIcon, PlusIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { useControllableState } from "../lib/useControllableState";
import { IconButton } from "./IconButton";

type RootProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export interface SliderProps extends Omit<RootProps, "value" | "defaultValue" | "onValueChange"> {
  /** Accessible name. Shown above the slider unless `hideLabel` is set. */
  label: string;
  /** Keep the label for screen readers but hide it visually. */
  hideLabel?: boolean;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  /** Spoken value, e.g. (v) => `${v} percent`. Also used for the visible readout. */
  formatValue?: (value: number) => string;
  /** Show the current value next to the label. */
  showValue?: boolean;
  /** Adds − / + buttons (single-thumb sliders). They step by `stepperStep`. */
  showSteppers?: boolean;
  /** How far one − / + press moves. Defaults to step. */
  stepperStep?: number;
  /** Labels for each thumb in a range slider, e.g. ["Minimum", "Maximum"]. */
  thumbLabels?: string[];
}

/**
 * Radix slider with a 32px thumb inside a 44px touch target.
 * Radix keeps thumbs in bounds, so they never overhang the track ends.
 * Keyboard: arrows ±step, PageUp/PageDown ±10 steps, Home/End min/max.
 */
export const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(function Slider(
  {
    className,
    label,
    hideLabel,
    value: valueProp,
    defaultValue,
    onValueChange,
    formatValue = String,
    showValue,
    showSteppers,
    stepperStep,
    thumbLabels,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    id,
    ...props
  },
  ref
) {
  const autoId = useId();
  const labelId = `${id ?? `pl-slider-${autoId}`}-label`;
  const [value, setValue] = useControllableState(valueProp, defaultValue ?? [min], onValueChange);
  const first = value[0] ?? min;
  const jump = stepperStep ?? step;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const slider = (
    <SliderPrimitive.Root
      ref={ref}
      id={id}
      className={cn("pl-slider", className)}
      value={value}
      onValueChange={setValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-labelledby={labelId}
      {...props}
    >
      <SliderPrimitive.Track className="pl-slider-track">
        <SliderPrimitive.Range className="pl-slider-range" />
      </SliderPrimitive.Track>
      {value.map((v, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="pl-slider-thumb"
          aria-label={value.length > 1 ? (thumbLabels?.[i] ?? `${label} ${i + 1}`) : label}
          aria-valuetext={formatValue(v)}
        />
      ))}
    </SliderPrimitive.Root>
  );

  return (
    <div className="pl-field">
      <div className={cn("pl-slider-header", hideLabel && "pl-visually-hidden")}>
        <span id={labelId} className="pl-label">
          {label}
        </span>
        {showValue ? (
          <output className="pl-slider-value" aria-hidden="true">
            {value.map(formatValue).join(" – ")}
          </output>
        ) : null}
      </div>
      {showSteppers && value.length === 1 ? (
        <div className="pl-slider-field">
          <IconButton
            aria-label={`Decrease ${label}`}
            disabled={disabled || first <= min}
            onClick={() => setValue([clamp(first - jump)])}
          >
            <MinusIcon size={20} strokeWidth={2.6} />
          </IconButton>
          {slider}
          <IconButton
            aria-label={`Increase ${label}`}
            disabled={disabled || first >= max}
            onClick={() => setValue([clamp(first + jump)])}
          >
            <PlusIcon size={20} strokeWidth={2.6} />
          </IconButton>
        </div>
      ) : (
        slider
      )}
    </div>
  );
});
