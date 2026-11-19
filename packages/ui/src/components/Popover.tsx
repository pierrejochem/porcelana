import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import { Popover as PopoverPrimitive, Tooltip as TooltipPrimitive } from "radix-ui";
import { InfoIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";

/* ───── Popover ───── */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent({ className, sideOffset = 8, collisionPadding = 8, ...props }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("pl-popover", "pl-root", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});

/* ───── Tooltip ───── */
export const TooltipProvider = TooltipPrimitive.Provider;

export interface TooltipProps {
  /** Tooltip text. Supplements the trigger's name; never the only label. */
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Hover/focus tooltip. Touch screens have no hover: for information people
 * must be able to reach on a phone, use `InfoTip` (tap to open) instead.
 */
export function Tooltip({ content, children, side = "top", delayDuration = 300, open, defaultOpen, onOpenChange }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content side={side} sideOffset={8} collisionPadding={8} className="pl-tooltip">
            {content}
            <TooltipPrimitive.Arrow className="pl-tooltip-arrow" width={12} height={6} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* ───── InfoTip: tap-to-open help that works on touch ───── */
export interface InfoTipProps {
  /** Accessible name of the trigger, e.g. "About snooze". */
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function InfoTip({ label, children, side = "top" }: InfoTipProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger className="pl-icon-btn pl-icon-btn--ghost" aria-label={label}>
        <InfoIcon size={20} />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content side={side} sideOffset={6} collisionPadding={8} className="pl-tooltip" style={{ maxWidth: 280 }}>
          {children}
          <PopoverPrimitive.Arrow className="pl-tooltip-arrow" width={12} height={6} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
