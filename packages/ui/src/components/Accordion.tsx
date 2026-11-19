import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";

export const Accordion = forwardRef<
  ElementRef<typeof AccordionPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(function Accordion({ className, ...props }, ref) {
  return <AccordionPrimitive.Root ref={ref} className={cn("pl-accordion", className)} {...props} />;
});

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return <AccordionPrimitive.Item ref={ref} className={cn("pl-accordion-item", className)} {...props} />;
});

export interface AccordionTriggerProps extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  /** Heading level of the wrapping header element. Defaults to 3. */
  level?: 2 | 3 | 4 | 5 | 6;
}

export const AccordionTrigger = forwardRef<ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, level = 3, ...props }, ref) {
    const Tag = `h${level}` as const;
    return (
      <AccordionPrimitive.Header className="pl-accordion-header" asChild>
        <Tag>
          <AccordionPrimitive.Trigger ref={ref} className={cn("pl-accordion-trigger", className)} {...props}>
            {children}
            <ChevronDownIcon className="pl-accordion-chevron" size={18} strokeWidth={2.4} />
          </AccordionPrimitive.Trigger>
        </Tag>
      </AccordionPrimitive.Header>
    );
  }
);

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content ref={ref} className={cn("pl-accordion-content", className)} {...props}>
      <div className="pl-accordion-content-inner">{children}</div>
    </AccordionPrimitive.Content>
  );
});
