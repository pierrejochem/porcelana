import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from "react";
import { AlertDialog as AlertPrimitive, Dialog as DialogPrimitive } from "radix-ui";
import { CloseIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { buttonVariants, type ButtonProps } from "./Button";

/* ───── Dialog ───── */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Keep the centered modal on phones instead of the bottom sheet. */
  centered?: boolean;
  /** Show the × close button. Defaults to true. */
  showClose?: boolean;
  /** Accessible label for the close button. */
  closeLabel?: string;
}

/** Centered modal on desktop; bottom sheet under 640px. Focus is trapped and restored. */
export const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(function DialogContent(
  { className, children, centered, showClose = true, closeLabel = "Close", ...props },
  ref
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="pl-overlay" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn("pl-dialog", "pl-root", centered && "pl-dialog--centered", className)}
        {...props}
      >
        <span className="pl-sheet-handle" aria-hidden="true" />
        {children}
        {showClose ? (
          <DialogPrimitive.Close className="pl-icon-btn pl-icon-btn--ghost pl-dialog-close" aria-label={closeLabel}>
            <CloseIcon size={20} strokeWidth={2.4} />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DialogTitle = forwardRef<ElementRef<typeof DialogPrimitive.Title>, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  function DialogTitle({ className, ...props }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cn("pl-dialog-title", className)} {...props} />;
  }
);

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return <DialogPrimitive.Description ref={ref} className={cn("pl-dialog-description", className)} {...props} />;
});

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pl-dialog-footer", className)} {...props} />;
}

/* ───── Alert dialog: confirmation that must be answered ───── */
export const AlertDialog = AlertPrimitive.Root;
export const AlertDialogTrigger = AlertPrimitive.Trigger;

export interface AlertDialogContentProps extends ComponentPropsWithoutRef<typeof AlertPrimitive.Content> {
  /** Keep the centered modal on phones instead of the bottom sheet. */
  centered?: boolean;
}

export const AlertDialogContent = forwardRef<ElementRef<typeof AlertPrimitive.Content>, AlertDialogContentProps>(
  function AlertDialogContent({ className, children, centered, ...props }, ref) {
    return (
      <AlertPrimitive.Portal>
        <AlertPrimitive.Overlay className="pl-overlay" />
        <AlertPrimitive.Content
          ref={ref}
          className={cn("pl-dialog", "pl-root", centered && "pl-dialog--centered", className)}
          {...props}
        >
          <span className="pl-sheet-handle" aria-hidden="true" />
          {children}
        </AlertPrimitive.Content>
      </AlertPrimitive.Portal>
    );
  }
);

export const AlertDialogTitle = forwardRef<ElementRef<typeof AlertPrimitive.Title>, ComponentPropsWithoutRef<typeof AlertPrimitive.Title>>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return <AlertPrimitive.Title ref={ref} className={cn("pl-dialog-title", className)} {...props} />;
  }
);

export const AlertDialogDescription = forwardRef<
  ElementRef<typeof AlertPrimitive.Description>,
  ComponentPropsWithoutRef<typeof AlertPrimitive.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return <AlertPrimitive.Description ref={ref} className={cn("pl-dialog-description", className)} {...props} />;
});

export const AlertDialogFooter = DialogFooter;

type ActionProps = ComponentPropsWithoutRef<typeof AlertPrimitive.Action> & Pick<ButtonProps, "variant">;

export const AlertDialogAction = forwardRef<ElementRef<typeof AlertPrimitive.Action>, ActionProps>(function AlertDialogAction(
  { className, variant = "primary", ...props },
  ref
) {
  return <AlertPrimitive.Action ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />;
});

export const AlertDialogCancel = forwardRef<ElementRef<typeof AlertPrimitive.Cancel>, ActionProps>(function AlertDialogCancel(
  { className, variant = "soft", ...props },
  ref
) {
  return <AlertPrimitive.Cancel ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />;
});
