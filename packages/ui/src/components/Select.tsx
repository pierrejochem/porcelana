import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { useField } from "./Field";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
  // Inside a Field, the label/description/error belong to the trigger button, not the Select root.
  const field = useField();
  const describedBy = [props["aria-describedby"], field?.descriptionId, field?.errorId].filter(Boolean).join(" ") || undefined;
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      id={props.id ?? field?.id}
      aria-describedby={describedBy}
      aria-invalid={props["aria-invalid"] ?? (field?.invalid || undefined)}
      aria-required={props["aria-required"] ?? (field?.required || undefined)}
      className={cn("pl-select-trigger", className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon size={18} strokeWidth={2.4} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = "popper", sideOffset = 8, ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn("pl-select-content", "pl-root", className)}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="pl-select-scroll">
          <ChevronUpIcon size={16} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="pl-select-viewport">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="pl-select-scroll">
          <ChevronDownIcon size={16} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectItem = forwardRef<ElementRef<typeof SelectPrimitive.Item>, ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  function SelectItem({ className, children, ...props }, ref) {
    return (
      <SelectPrimitive.Item ref={ref} className={cn("pl-select-item", className)} {...props}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon size={16} strokeWidth={3} />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  }
);

export const SelectLabel = forwardRef<ElementRef<typeof SelectPrimitive.Label>, ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(
  function SelectLabel({ className, ...props }, ref) {
    return <SelectPrimitive.Label ref={ref} className={cn("pl-menu-label", className)} {...props} />;
  }
);

export const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
  return <SelectPrimitive.Separator ref={ref} className={cn("pl-menu-separator", className)} {...props} />;
});
