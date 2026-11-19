import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes
} from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { AlertIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";

/* ───── Label ───── */
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(function Label({ className, ...props }, ref) {
  return <LabelPrimitive.Root ref={ref} className={cn("pl-label", className)} {...props} />;
});

/* ───── Field: wires label, description and error to the control ───── */
interface FieldContextValue {
  id: string;
  descriptionId?: string;
  errorId?: string;
  invalid: boolean;
  required?: boolean;
  disabled?: boolean;
}
const FieldContext = createContext<FieldContextValue | null>(null);

/** Read the surrounding Field's ids. Custom controls use this to wire up aria attributes. */
export function useField() {
  return useContext(FieldContext);
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  description?: ReactNode;
  /** Error message. Sets aria-invalid on the control and is announced. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Overrides the generated id passed to the control. */
  id?: string;
  /** A single control element (Input, Textarea, Select trigger…). */
  children: ReactElement<Record<string, unknown>>;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, error, required, disabled, id, className, children, ...props },
  ref
) {
  const autoId = useId();
  const controlId = id ?? `pl-field-${autoId}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);

  const childProps = (isValidElement(children) ? children.props : {}) as Record<string, unknown>;
  const injected: Record<string, unknown> = { id: controlId };
  const mergedDescribedBy = [childProps["aria-describedby"], describedBy].filter(Boolean).join(" ");
  if (mergedDescribedBy) injected["aria-describedby"] = mergedDescribedBy;
  if (invalid) injected["aria-invalid"] = true;
  if (required) {
    injected.required = true;
    injected["aria-required"] = true;
  }
  if (disabled) injected.disabled = true;
  const control = isValidElement(children) ? cloneElement(children, injected) : children;

  return (
    <FieldContext.Provider value={{ id: controlId, descriptionId, errorId, invalid, required, disabled }}>
      <div ref={ref} className={cn("pl-field", className)} {...props}>
        <Label htmlFor={controlId} data-disabled={disabled ? "" : undefined}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </Label>
        {control}
        {description ? (
          <p id={descriptionId} className="pl-field-description">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="pl-field-error" role="alert">
            <AlertIcon size={14} strokeWidth={2.4} />
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
});

/* ───── Input & Textarea ───── */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Leading icon, e.g. a search glyph. Decorative. */
  icon?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, icon, invalid, ...props }, ref) {
  const input = (
    <input
      ref={ref}
      className={cn("pl-input", className)}
      aria-invalid={invalid || props["aria-invalid"] || undefined}
      {...props}
    />
  );
  if (!icon) return input;
  return (
    <div className="pl-input-wrap">
      {icon}
      {input}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn("pl-textarea", className)}
      aria-invalid={invalid || props["aria-invalid"] || undefined}
      {...props}
    />
  );
});
