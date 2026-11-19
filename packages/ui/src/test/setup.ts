import "@testing-library/jest-dom/vitest";
import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
afterEach(() => cleanup());

// jsdom gaps that Radix, cmdk and the responsive helpers rely on.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

/** Width the matchMedia mock reports; tests set it through `setViewport`. */
export const viewport = { width: 1280, coarse: false };

function evaluate(query: string): boolean {
  const max = /max-width:\s*(\d+)px/.exec(query);
  const min = /min-width:\s*(\d+)px/.exec(query);
  if (/pointer:\s*coarse/.test(query)) return viewport.coarse;
  if (/prefers-color-scheme:\s*dark/.test(query)) return false;
  if (max && viewport.width > Number(max[1])) return false;
  if (min && viewport.width < Number(min[1])) return false;
  return Boolean(max || min);
}

window.matchMedia = vi.fn((query: string) => ({
  matches: evaluate(query),
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn()
})) as unknown as typeof window.matchMedia;

Element.prototype.scrollIntoView ??= vi.fn();
Element.prototype.hasPointerCapture ??= vi.fn(() => false);
Element.prototype.releasePointerCapture ??= vi.fn();
Element.prototype.setPointerCapture ??= vi.fn();
