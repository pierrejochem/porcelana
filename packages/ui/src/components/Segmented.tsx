import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { Progress as ProgressPrimitive, Tabs as TabsPrimitive, ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

/* ───── Toggle group ───── */
type ToggleGroupRootProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
export type ToggleGroupProps = ToggleGroupRootProps & {
  /** Stretch items to fill the width (good on phones). */
  block?: boolean;
};

export const ToggleGroup = forwardRef<ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(function ToggleGroup(
  { className, block, ...props },
  ref
) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("pl-toggle-group", block && "pl-toggle-group--block", className)}
      {...(props as ToggleGroupRootProps)}
    />
  );
});

export const ToggleGroupItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(function ToggleGroupItem({ className, ...props }, ref) {
  return <ToggleGroupPrimitive.Item ref={ref} className={cn("pl-toggle-item", className)} {...props} />;
});

/* ───── Tabs ───── */
export const Tabs = forwardRef<ElementRef<typeof TabsPrimitive.Root>, ComponentPropsWithoutRef<typeof TabsPrimitive.Root>>(
  function Tabs({ className, ...props }, ref) {
    return <TabsPrimitive.Root ref={ref} className={cn("pl-tabs", className)} {...props} />;
  }
);

export interface TabsListProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  block?: boolean;
}
export const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(function TabsList(
  { className, block, ...props },
  ref
) {
  return <TabsPrimitive.List ref={ref} className={cn("pl-tabs-list", block && "pl-tabs-list--block", className)} {...props} />;
});

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return <TabsPrimitive.Trigger ref={ref} className={cn("pl-tabs-trigger", className)} {...props} />;
});

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return <TabsPrimitive.Content ref={ref} className={cn("pl-tabs-content", className)} {...props} />;
});

/* ───── Progress ───── */
export interface ProgressProps extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Accessible name, e.g. "Upload progress". */
  label: string;
  tone?: "primary" | "success" | "warning" | "danger";
}

/** Pass `value={null}` for an indeterminate bar. */
export const Progress = forwardRef<ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(function Progress(
  { className, value, max = 100, label, tone = "primary", ...props },
  ref
) {
  const pct = value == null ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <ProgressPrimitive.Root
      ref={ref}
      aria-label={label}
      value={value}
      max={max}
      className={cn("pl-progress", tone !== "primary" && `pl-progress--${tone}`, className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="pl-progress-indicator"
        style={value == null ? undefined : { transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
