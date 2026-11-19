import { forwardRef, useId, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import { Checkbox as CheckboxPrimitive, RadioGroup as RadioPrimitive, Switch as SwitchPrimitive } from "radix-ui";
import { CheckIcon, MinusIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";

/* ───── Checkbox ───── */
export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Visible label. The whole row (box + label) is the 44px touch target. */
  label?: ReactNode;
}

export const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(function Checkbox(
  { className, label, id, ...props },
  ref
) {
  const autoId = useId();
  const checkboxId = id ?? `pl-cb-${autoId}`;
  const box = (
    <CheckboxPrimitive.Root ref={ref} id={checkboxId} className={cn("pl-checkbox", "pl-hit", className)} {...props}>
      <CheckboxPrimitive.Indicator>
        {props.checked === "indeterminate" ? <MinusIcon size={16} strokeWidth={3.2} /> : <CheckIcon size={16} strokeWidth={3.2} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!label) return box;
  return (
    <label className="pl-check-row" htmlFor={checkboxId}>
      {box}
      <span>{label}</span>
    </label>
  );
});

/* ───── Radio group ───── */
export const RadioGroup = forwardRef<
  ElementRef<typeof RadioPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return <RadioPrimitive.Root ref={ref} className={cn("pl-radio-group", className)} {...props} />;
});

export interface RadioGroupItemProps extends ComponentPropsWithoutRef<typeof RadioPrimitive.Item> {
  /** Visible label; the whole row is the touch target. */
  label: ReactNode;
}

export const RadioGroupItem = forwardRef<ElementRef<typeof RadioPrimitive.Item>, RadioGroupItemProps>(function RadioGroupItem(
  { className, label, id, ...props },
  ref
) {
  const autoId = useId();
  const itemId = id ?? `pl-radio-${autoId}`;
  return (
    <label className="pl-check-row" htmlFor={itemId}>
      <RadioPrimitive.Item ref={ref} id={itemId} className={cn("pl-radio", "pl-hit", className)} {...props}>
        <RadioPrimitive.Indicator className="pl-radio-dot" />
      </RadioPrimitive.Item>
      <span>{label}</span>
    </label>
  );
});

/* ───── Switch ───── */
export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** md is 64 × 36px, lg is 96 × 48px. */
  size?: "md" | "lg";
  /** Visible label rendered as a full-width row; tapping the row toggles. */
  label?: ReactNode;
  /** Secondary text under the label; becomes the accessible description. */
  description?: ReactNode;
}

export const Switch = forwardRef<ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(function Switch(
  { className, size = "md", label, description, id, ...props },
  ref
) {
  const autoId = useId();
  const switchId = id ?? `pl-switch-${autoId}`;
  const descId = description ? `${switchId}-desc` : undefined;
  const control = (
    <SwitchPrimitive.Root
      ref={ref}
      id={switchId}
      aria-describedby={descId}
      className={cn("pl-switch", size === "lg" && "pl-switch--lg", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pl-switch-thumb" />
    </SwitchPrimitive.Root>
  );
  if (!label) return control;
  return (
    <label className="pl-switch-row" htmlFor={switchId}>
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        {description ? (
          <span id={descId} className="pl-field-description">
            {description}
          </span>
        ) : null}
      </span>
      {control}
    </label>
  );
});
