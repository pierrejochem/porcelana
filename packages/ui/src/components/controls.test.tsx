import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { setup, expectAccessible } from "../test/utils";
import { Checkbox, RadioGroup, RadioGroupItem, Switch } from "./Choice";
import { Slider } from "./Slider";
import { Progress, Tabs, TabsContent, TabsList, TabsTrigger, ToggleGroup, ToggleGroupItem } from "./Segmented";
import { NumberStepper } from "./NumberStepper";

describe("Checkbox", () => {
  it("toggles by clicking the label row and by Space", async () => {
    const onChange = vi.fn();
    const { user } = setup(<Checkbox label="Morning briefing" onCheckedChange={onChange} />);
    const cb = screen.getByRole("checkbox", { name: "Morning briefing" });
    await user.click(screen.getByText("Morning briefing"));
    expect(cb).toHaveAttribute("aria-checked", "true");
    cb.focus();
    await user.keyboard(" ");
    expect(cb).toHaveAttribute("aria-checked", "false");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("supports indeterminate and standalone usage", async () => {
    const { container } = render(<Checkbox aria-label="Select all" checked="indeterminate" />);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute("aria-checked", "mixed");
    await expectAccessible(container);
  });
});

describe("RadioGroup", () => {
  it("selects with click and arrow keys (roving focus)", async () => {
    const { user, container } = setup(
      <RadioGroup aria-label="Wake-up time" defaultValue="06:00">
        <RadioGroupItem value="05:30" label="05:30" />
        <RadioGroupItem value="06:00" label="06:00" />
        <RadioGroupItem value="07:15" label="07:15" />
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "06:00" })).toBeChecked();
    await user.click(screen.getByText("07:15"));
    expect(screen.getByRole("radio", { name: "07:15" })).toBeChecked();
    screen.getByRole("radio", { name: "07:15" }).focus();
    await user.keyboard("{ArrowUp}");
    // Roving focus moves to the previous option; Space selects it.
    expect(screen.getByRole("radio", { name: "06:00" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "06:00" })).toBeChecked();
    await expectAccessible(container);
  });
});

describe("Switch", () => {
  it("toggles from the whole labelled row and exposes the description", async () => {
    const { user, container } = setup(<Switch label="Alarm" description="Weekdays" size="lg" />);
    const sw = screen.getByRole("switch", { name: /Alarm/ });
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toHaveAccessibleDescription("Weekdays");
    expect(sw).toHaveClass("pl-switch--lg");
    await user.click(screen.getByText("Weekdays"));
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(sw).toHaveAttribute("data-state", "checked");
    await expectAccessible(container);
  });

  it("works with keyboard and standalone aria-label", async () => {
    const { user } = setup(<Switch aria-label="Night mode" />);
    const sw = screen.getByRole("switch", { name: "Night mode" });
    sw.focus();
    await user.keyboard(" ");
    expect(sw).toBeChecked();
  });
});

describe("Slider", () => {
  it("exposes name, range and spoken value on the thumb", async () => {
    const { container } = render(<Slider label="Volume" defaultValue={[62]} formatValue={(v) => `${v} percent`} showValue />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "62");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
    expect(thumb).toHaveAttribute("aria-valuetext", "62 percent");
    expect(screen.getByText("62 percent")).toBeInTheDocument();
    await expectAccessible(container);
  });

  it("moves with arrow, Page and Home/End keys and never leaves min..max", async () => {
    const onChange = vi.fn();
    const { user } = setup(<Slider label="Volume" defaultValue={[50]} onValueChange={onChange} />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "51");
    await user.keyboard("{PageDown}");
    expect(thumb).toHaveAttribute("aria-valuenow", "41");
    await user.keyboard("{End}");
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
    await user.keyboard("{Home}");
    expect(thumb).toHaveAttribute("aria-valuenow", "0");
    expect(onChange).toHaveBeenLastCalledWith([0]);
  });

  it("steppers change the value and disable at the limits", async () => {
    const { user } = setup(<Slider label="Volume" defaultValue={[95]} showSteppers stepperStep={5} />);
    const plus = screen.getByRole("button", { name: "Increase Volume" });
    const minus = screen.getByRole("button", { name: "Decrease Volume" });
    await user.click(plus);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "100");
    expect(plus).toBeDisabled();
    await user.click(minus);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "95");
  });

  it("range sliders label each thumb; hideLabel keeps the name", () => {
    render(<Slider label="Price" hideLabel defaultValue={[10, 80]} thumbLabels={["Minimum", "Maximum"]} />);
    expect(screen.getByRole("slider", { name: "Minimum" })).toHaveAttribute("aria-valuenow", "10");
    expect(screen.getByRole("slider", { name: "Maximum" })).toHaveAttribute("aria-valuenow", "80");
    expect(screen.getByText("Price").parentElement).toHaveClass("pl-visually-hidden");
  });

  it("falls back to numbered thumb labels and supports controlled value", () => {
    function Controlled() {
      const [v, setV] = useState([20, 30]);
      return (
        <>
          <Slider label="Span" value={v} onValueChange={setV} />
          <output data-testid="out">{v.join(",")}</output>
        </>
      );
    }
    render(<Controlled />);
    const thumb = screen.getByRole("slider", { name: "Span 1" });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(screen.getByTestId("out")).toHaveTextContent("21,30");
  });

  it("disabled slider disables steppers", () => {
    render(<Slider label="Volume" disabled showSteppers defaultValue={[50]} />);
    expect(screen.getByRole("button", { name: "Increase Volume" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decrease Volume" })).toBeDisabled();
  });
});

describe("ToggleGroup & Tabs", () => {
  it("single toggle group switches with click and arrows", async () => {
    const { user, container } = setup(
      <ToggleGroup type="single" defaultValue="week" aria-label="Range" block>
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(container.firstChild).toHaveClass("pl-toggle-group--block");
    await user.click(screen.getByRole("radio", { name: "Month" }));
    expect(screen.getByRole("radio", { name: "Month" })).toHaveAttribute("data-state", "on");
    await expectAccessible(container);
  });

  it("tabs switch panels with arrow keys", async () => {
    const { user, container } = setup(
      <Tabs defaultValue="alarm">
        <TabsList aria-label="Schedule" block>
          <TabsTrigger value="alarm">Alarm</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
        </TabsList>
        <TabsContent value="alarm">06:00</TabsContent>
        <TabsContent value="timer">12:40</TabsContent>
      </Tabs>
    );
    screen.getByRole("tab", { name: "Alarm" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Timer" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("12:40");
    await expectAccessible(container);
  });
});

describe("Progress", () => {
  it("reports value and label; supports tones and indeterminate", async () => {
    const { container } = render(
      <>
        <Progress label="Upload" value={40} tone="success" />
        <Progress label="Sync" value={null} />
      </>
    );
    const [upload, sync] = screen.getAllByRole("progressbar");
    expect(upload).toHaveAccessibleName("Upload");
    expect(upload).toHaveAttribute("aria-valuenow", "40");
    expect(upload).toHaveClass("pl-progress--success");
    expect(upload?.firstChild).toHaveStyle({ transform: "translateX(-60%)" });
    expect(sync).toHaveAttribute("data-state", "indeterminate");
    await expectAccessible(container);
  });
});

describe("NumberStepper", () => {
  it("is a labelled spinbutton with suffix in valuetext", async () => {
    const { container } = render(<NumberStepper label="Snooze" defaultValue={9} min={1} max={30} suffix="min" />);
    const spin = screen.getByRole("spinbutton", { name: "Snooze" });
    expect(spin).toHaveAttribute("aria-valuenow", "9");
    expect(spin).toHaveAttribute("aria-valuetext", "9 min");
    await expectAccessible(container);
  });

  it("handles keyboard, buttons, typing and clamping", async () => {
    const onChange = vi.fn();
    const { user } = setup(<NumberStepper label="Snooze" defaultValue={9} min={1} max={30} onValueChange={onChange} />);
    const spin = screen.getByRole("spinbutton");
    spin.focus();
    await user.keyboard("{ArrowUp}");
    expect(spin).toHaveValue("10");
    await user.keyboard("{PageUp}");
    expect(spin).toHaveValue("20");
    await user.keyboard("{End}");
    expect(spin).toHaveValue("30");
    expect(screen.getByRole("button", { name: "Increase Snooze" })).toBeDisabled();
    await user.keyboard("{Home}");
    expect(spin).toHaveValue("1");
    await user.keyboard("{PageDown}{ArrowDown}");
    expect(spin).toHaveValue("1");
    await user.click(screen.getByRole("button", { name: "Increase Snooze" }));
    expect(spin).toHaveValue("2");
    await user.click(screen.getByRole("button", { name: "Decrease Snooze" }));
    expect(spin).toHaveValue("1");

    await user.clear(spin);
    await user.type(spin, "99x{Enter}");
    expect(spin).toHaveValue("30");
    await user.clear(spin);
    await user.type(spin, "5");
    spin.blur();
    expect(spin).toHaveValue("5");
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it("disabled disables everything", () => {
    render(<NumberStepper label="Snooze" disabled />);
    expect(screen.getByRole("spinbutton")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increase Snooze" })).toBeDisabled();
  });
});
