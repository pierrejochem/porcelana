import { useSyncExternalStore, type ReactNode } from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { CloseIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: "primary" | "danger" | "neutral";
  /** ms before auto-dismiss. Default 5000. Use Infinity for sticky toasts. */
  duration?: number;
  action?: {
    label: string;
    /** Required by screen readers: how to do the same thing without the toast. */
    altText: string;
    onClick: () => void;
  };
}

interface ToastRecord extends ToastOptions {
  id: number;
  open: boolean;
}

/* A tiny store so toasts can be raised from anywhere: toast({ title: "Saved" }). */
let records: ToastRecord[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(options: ToastOptions): { id: number; dismiss: () => void } {
  const id = nextId++;
  records = [...records, { ...options, id, open: true }];
  emit();
  return { id, dismiss: () => dismissToast(id) };
}

export function dismissToast(id: number) {
  records = records.map((r) => (r.id === id ? { ...r, open: false } : r));
  emit();
}

/** Clears every toast immediately. Mostly for tests. */
export function clearToasts() {
  records = [];
  emit();
}

function remove(id: number) {
  records = records.filter((r) => r.id !== id);
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export interface ToasterProps {
  /** Label for the region landmark announced to screen readers. */
  label?: string;
  /** Keyboard shortcut that moves focus to the toasts. Default F8. */
  hotkey?: string[];
  /** Direction a toast can be swiped to dismiss it. */
  swipeDirection?: "right" | "left" | "up" | "down";
  /** Accessible name of each toast's close button. */
  closeLabel?: string;
}

/** Mount once near the root. Toasts are announced politely and can be swiped away. */
export function Toaster({ label = "Notifications", hotkey, swipeDirection = "right", closeLabel = "Dismiss" }: ToasterProps) {
  const items = useSyncExternalStore(subscribe, () => records, () => records);
  return (
    <ToastPrimitive.Provider label={label} swipeDirection={swipeDirection}>
      {items.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          open={t.open}
          duration={t.duration ?? 5000}
          type={t.tone === "danger" ? "foreground" : "background"}
          onOpenChange={(open) => {
            if (!open) {
              dismissToast(t.id);
              setTimeout(() => remove(t.id), 200);
            }
          }}
          className={cn("pl-toast", t.tone && t.tone !== "primary" && `pl-toast--${t.tone}`)}
        >
          <div className="pl-toast-body">
            <ToastPrimitive.Title className="pl-toast-title">{t.title}</ToastPrimitive.Title>
            {t.description ? <ToastPrimitive.Description className="pl-toast-description">{t.description}</ToastPrimitive.Description> : null}
          </div>
          {t.action ? (
            <ToastPrimitive.Action className="pl-toast-action" altText={t.action.altText} onClick={t.action.onClick}>
              {t.action.label}
            </ToastPrimitive.Action>
          ) : null}
          <ToastPrimitive.Close className="pl-icon-btn" aria-label={closeLabel}>
            <CloseIcon size={18} strokeWidth={2.6} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="pl-toast-viewport pl-root" hotkey={hotkey} />
    </ToastPrimitive.Provider>
  );
}
