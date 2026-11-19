import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import * as Icons from "./index";
import { AlarmIcon, Icon, iconPaths, type IconName } from "./index";

const components = Object.entries(Icons).filter(
  ([key]) => key.endsWith("Icon") && key !== "createIcon" && key !== "Icon"
) as [string, typeof AlarmIcon][];

describe("@porcelana/icons", () => {
  it("exports one component per path", () => {
    expect(components.length).toBe(Object.keys(iconPaths).length);
  });

  it.each(components)("%s renders a 24px grid stroke svg", (name, Component) => {
    const { container } = render(<Component />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("stroke-linecap", "round");
    expect(svg.querySelector("path")?.getAttribute("d")).toBeTruthy();
    expect(Component.displayName).toBe(name);
  });

  it("is decorative by default", () => {
    const { container } = render(<AlarmIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("is announced when given a title", async () => {
    const { container } = render(<AlarmIcon title="Alarm set" />);
    expect(screen.getByRole("img", { name: "Alarm set" })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("applies size, stroke width, color and forwards props and ref", () => {
    const ref = createRef<SVGSVGElement>();
    render(<AlarmIcon ref={ref} size={32} strokeWidth={1.5} color="red" className="x" data-testid="i" />);
    const svg = screen.getByTestId("i");
    expect(ref.current).toBe(svg);
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("stroke-width", "1.5");
    expect(svg).toHaveAttribute("stroke", "red");
    expect(svg).toHaveClass("x");
  });

  it.each(Object.keys(iconPaths) as IconName[])("<Icon name=%s> renders its path", (name) => {
    const { container } = render(<Icon name={name} />);
    expect(container.querySelector("path")).toHaveAttribute("d", iconPaths[name]);
    expect(container.querySelector("svg")).toHaveAttribute("data-icon", name);
  });

  it("<Icon> supports a title and ref", () => {
    const ref = createRef<SVGSVGElement>();
    render(<Icon ref={ref} name="bell" title="Notifications" />);
    expect(screen.getByRole("img", { name: "Notifications" })).toBe(ref.current);
  });
});
