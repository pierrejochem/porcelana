import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { AlarmIcon } from "@porcelana/icons";
import { setup, expectAccessible } from "../test/utils";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { Avatar, AvatarGroup, Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Skeleton, initials } from "./Display";
import { Field, Input, Label, Textarea } from "./Field";

describe("Button", () => {
  it("renders a type=button with variant classes and forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} variant="danger" size="lg" block>
        Delete
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toBe(ref.current);
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveClass("pl-btn", "pl-btn--danger", "pl-btn--lg", "pl-btn--block");
  });

  it("fires onClick and supports start/end icons", async () => {
    const onClick = vi.fn();
    const { user } = setup(
      <Button onClick={onClick} startIcon={<AlarmIcon data-testid="s" />} endIcon={<AlarmIcon data-testid="e" />}>
        Save
      </Button>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("s")).toBeInTheDocument();
    expect(screen.getByTestId("e")).toBeInTheDocument();
  });

  it("loading: busy, stays focusable, blocks clicks, hides end icon", async () => {
    const onClick = vi.fn();
    const { user } = setup(
      <Button loading onClick={onClick} endIcon={<AlarmIcon data-testid="e" />}>
        Saving
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Saving" });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn).not.toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByTestId("e")).toBeNull();
  });

  it("asChild renders the child element with button classes", () => {
    render(
      <Button asChild variant="outline">
        <a href="/docs">Docs</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveClass("pl-btn", "pl-btn--outline");
  });

  it("is accessible across variants", async () => {
    const { container } = render(
      <div>
        {(["primary", "soft", "outline", "ghost", "danger"] as const).map((v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ))}
        <Button disabled>Disabled</Button>
      </div>
    );
    await expectAccessible(container);
  });
});

describe("IconButton", () => {
  it("requires and exposes an accessible name", async () => {
    const { container } = render(
      <IconButton aria-label="Add alarm" variant="primary" size="lg">
        <AlarmIcon />
      </IconButton>
    );
    const btn = screen.getByRole("button", { name: "Add alarm" });
    expect(btn).toHaveClass("pl-icon-btn--primary", "pl-icon-btn--lg");
    expect(btn).toHaveAttribute("type", "button");
    await expectAccessible(container);
  });
});

describe("Display", () => {
  it("Badge renders tone and optional dot", () => {
    render(
      <Badge tone="success" dot>
        Online
      </Badge>
    );
    const badge = screen.getByText("Online");
    expect(badge).toHaveClass("pl-badge--success");
    expect(badge.querySelector(".pl-badge-dot")).toHaveAttribute("aria-hidden", "true");
  });

  it("Card composes with a configurable heading level", async () => {
    const { container } = render(
      <Card inset>
        <CardHeader>
          <CardTitle level={2}>Alarm</CardTitle>
          <CardDescription>Weekdays</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByRole("heading", { level: 2, name: "Alarm" })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("pl-card--inset");
    await expectAccessible(container);
  });

  it("Skeleton is hidden from assistive tech and supports circles", () => {
    const { container } = render(
      <>
        <Skeleton width={120} />
        <Skeleton circle height={44} />
      </>
    );
    const [line, circle] = container.querySelectorAll(".pl-skeleton");
    expect(line).toHaveAttribute("aria-hidden", "true");
    expect(line).toHaveStyle({ width: "120px" });
    expect(circle).toHaveStyle({ width: "44px", borderRadius: "50%" });
  });

  it("initials() handles one, two and many names", () => {
    expect(initials("Pierre")).toBe("P");
    expect(initials("pierre jochem")).toBe("PJ");
    expect(initials("  Ana  Maria  Lopez ")).toBe("AL");
    expect(initials("")).toBe("");
  });

  it("Avatar fallback is announced with the person's name", async () => {
    const { container } = render(
      <AvatarGroup aria-label="Sharing with">
        <Avatar name="Pierre Jochem" color="#f6c519" size={40} />
        <Avatar name="Ana Maria" src="https://example.com/a.png" />
      </AvatarGroup>
    );
    expect(screen.getByRole("img", { name: "Pierre Jochem" })).toHaveTextContent("PJ");
    expect(screen.getByRole("group", { name: "Sharing with" })).toBeInTheDocument();
    await expectAccessible(container);
  });
});

describe("Field, Input, Textarea", () => {
  it("wires label, description and error to the control", async () => {
    const { container } = render(
      <Field label="Email" description="We'll send the briefing here" error="Enter a complete email" required>
        <Input defaultValue="pierre@" />
      </Field>
    );
    const input = screen.getByRole("textbox", { name: /Email/ });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("We'll send the briefing here Enter a complete email");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a complete email");
    await expectAccessible(container);
  });

  it("keeps the child's own describedby and disables through Field", () => {
    render(
      <>
        <p id="extra">Extra help</p>
        <Field label="Note" disabled id="note">
          <Textarea aria-describedby="extra" />
        </Field>
      </>
    );
    const textarea = screen.getByRole("textbox", { name: "Note" });
    expect(textarea).toHaveAttribute("id", "note");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAccessibleDescription("Extra help");
    expect(textarea).not.toHaveAttribute("aria-invalid");
  });

  it("Input with icon and invalid flag; Textarea invalid flag", () => {
    render(
      <>
        <Label htmlFor="q">Search</Label>
        <Input id="q" icon={<AlarmIcon data-testid="icon" />} invalid />
        <Textarea aria-label="Notes" invalid />
      </>
    );
    expect(screen.getByTestId("icon").parentElement).toHaveClass("pl-input-wrap");
    expect(screen.getByRole("textbox", { name: "Search" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAttribute("aria-invalid", "true");
  });

  it("uses a 16px input font to avoid iOS focus zoom (class contract)", () => {
    render(<Input aria-label="x" />);
    expect(screen.getByRole("textbox")).toHaveClass("pl-input");
  });
});
