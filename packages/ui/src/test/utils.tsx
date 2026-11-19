import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { viewport } from "./setup";

/** Render with a userEvent instance attached. */
export function setup(ui: ReactElement, options?: RenderOptions) {
  return { user: userEvent.setup(), ...render(ui, options) };
}

/** Switch the mocked viewport. Call before rendering. */
export function setViewport(width: number, coarse = width < 640) {
  viewport.width = width;
  viewport.coarse = coarse;
}

export function resetViewport() {
  setViewport(1280, false);
}

/** Run axe on a container (or the whole document for portalled content). */
export async function expectAccessible(container: Element = document.body) {
  expect(await axe(container)).toHaveNoViolations();
}
