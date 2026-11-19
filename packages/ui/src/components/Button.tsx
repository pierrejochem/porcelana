import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const buttonVariants = cva("pl-btn", {
  variants: {
    variant: {
      primary: "pl-btn--primary",
      soft: "pl-btn--soft",
      outline: "pl-btn--outline",
      ghost: "pl-btn--ghost",
      danger: "pl-btn--danger"
    },
    size: { sm: "pl-btn--sm", md: "", lg: "pl-btn--lg" },
    block: { true: "pl-btn--block", false: "" }
  },
  defaultVariants: { variant: "primary", size: "md", block: false }
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a link) with button styling. */
  asChild?: boolean;
  /** Shows a spinner, sets aria-busy and blocks clicks while keeping focus. */
  loading?: boolean;
  /** Icon before the label. */
  startIcon?: ReactNode;
  /** Icon after the label. */
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, asChild = false, loading = false, startIcon, endIcon, children, type, onClick, ...props },
  ref
) {
  const classes = cn(buttonVariants({ variant, size, block }), className);
  if (asChild) {
    return (
      <Slot.Root ref={ref} className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...props}
    >
      {loading ? <span className="pl-spinner" aria-hidden="true" /> : startIcon}
      {children}
      {!loading && endIcon}
    </button>
  );
});
