import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const iconButtonVariants = cva("pl-icon-btn", {
  variants: {
    variant: { soft: "", ghost: "pl-icon-btn--ghost", primary: "pl-icon-btn--primary" },
    size: { md: "", lg: "pl-icon-btn--lg" }
  },
  defaultVariants: { variant: "soft", size: "md" }
});

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    VariantProps<typeof iconButtonVariants> {
  /** Required: icon-only buttons need an accessible name. */
  "aria-label": string;
}

/** A 44px circular button for a single icon. Always 44px or larger for touch. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant, size, type, ...props },
  ref
) {
  return (
    <button ref={ref} type={type ?? "button"} className={cn(iconButtonVariants({ variant, size }), className)} {...props} />
  );
});
