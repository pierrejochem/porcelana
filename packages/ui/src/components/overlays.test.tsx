import { render, screen, waitFor, act } from "@testing-library/react";
import { setup, expectAccessible, setViewport, resetViewport } from "../test/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from "./Dialog";
import { InfoTip, Popover, PopoverContent, PopoverTrigger, Tooltip } from "./Popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./DropdownMenu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./Select";
import { Toaster, clearToasts, dismissToast, toast } from "./Toast";
import { Button } from "./Button";
import { Field } from "./Field";

afterEach(() => resetViewport());

describe("Accordion", () => {
  it("expands with click and Enter, inside a heading", async () => {
    const { user, container } = setup(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger level={2}>Repeat on weekdays</AccordionTrigger>
          <AccordionContent>Mon–Fri at 06:00</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByRole("button", { name: "Repeat on weekdays" });
    expect(screen.getByRole("heading", { level: 2 })).toContainElement(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region")).toHaveTextContent("Mon–Fri at 06:00");
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expectAccessible(container);
  });
});

function DeleteDialog({ centered }: { centered?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent centered={centered}>
        <DialogTitle>Edit alarm</DialogTitle>
        <DialogDescription>Change the time</DialogDescription>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens as a labelled modal, traps focus, closes with Escape and restores focus", async () => {
    const { user } = setup(<DeleteDialog />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Edit alarm" });
    expect(dialog).toHaveAccessibleDescription("Change the time");
    expect(dialog).toHaveClass("pl-dialog");
    expect(dialog).not.toHaveClass("pl-dialog--centered");
    expect(dialog.contains(document.activeElement)).toBe(true);
    await expectAccessible(dialog);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it("has a labelled close button and a centered option", async () => {
    const { user } = setup(<DeleteDialog centered />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toHaveClass("pl-dialog--centered");
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

describe("AlertDialog", () => {
  it("requires an explicit choice and focuses Cancel first", async () => {
    const onDelete = vi.fn();
    const { user } = setup(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="danger">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this alarm?</AlertDialogTitle>
          <AlertDialogDescription>This can’t be undone.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="danger" onClick={onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("alertdialog", { name: "Delete this alarm?" });
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await expectAccessible(dialog);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalled();
  });
});

describe("Popover, Tooltip, InfoTip", () => {
  it("popover opens from its trigger and closes with Escape", async () => {
    const { user } = setup(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Label</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Alarm label">
          <input aria-label="Name" />
        </PopoverContent>
      </Popover>
    );
    const trigger = screen.getByRole("button", { name: "Label" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Alarm label" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  });

  it("tooltip appears on keyboard focus and describes the trigger", async () => {
    const { user } = setup(
      <Tooltip content="Ring at sunrise" delayDuration={0}>
        <Button>Sunrise</Button>
      </Tooltip>
    );
    await user.tab();
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Ring at sunrise");
    expect(screen.getByRole("button", { name: "Sunrise" })).toHaveAccessibleDescription("Ring at sunrise");
  });

  it("InfoTip opens on tap for touch users", async () => {
    const { user } = setup(<InfoTip label="About snooze">Snooze repeats every 9 minutes.</InfoTip>);
    await user.click(screen.getByRole("button", { name: "About snooze" }));
    expect(await screen.findByText("Snooze repeats every 9 minutes.")).toBeVisible();
  });
});

function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Alarm</DropdownMenuLabel>
        <DropdownMenuItem shortcut="⌘E">Edit</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Snooze enabled</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="chime">
          <DropdownMenuRadioItem value="chime">Chime</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="birds">Birds</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem danger>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("opens with keyboard, navigates items and exposes item roles", async () => {
    const { user } = setup(<Menu />);
    screen.getByRole("button", { name: "Options" }).focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(menu).not.toHaveClass("pl-menu--sheet");
    expect(screen.getByRole("menuitemcheckbox", { name: "Snooze enabled" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: "Chime" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveClass("pl-menu-item--danger");
    // Opening with Enter focuses the first item; arrows move through the rest.
    await waitFor(() => expect(screen.getByRole("menuitem", { name: /Edit/ })).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitemcheckbox", { name: "Snooze enabled" })).toHaveFocus();
    await expectAccessible(menu);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("becomes a bottom action sheet on phones", async () => {
    setViewport(390);
    const { user } = setup(<Menu />);
    await user.click(screen.getByRole("button", { name: "Options" }));
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveClass("pl-menu--sheet");
    expect(menu).toHaveAttribute("data-sheet");
  });
});

describe("Select", () => {
  it("opens, picks an option and shows it in the trigger", async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <Select onValueChange={onChange}>
        <SelectTrigger aria-label="Sound">
          <SelectValue placeholder="Choose a sound" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sounds</SelectLabel>
            <SelectItem value="chime">Morning chime</SelectItem>
            <SelectSeparator />
            <SelectItem value="birds">Birdsong</SelectItem>
            <SelectItem value="radio" disabled>
              Radio
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: "Sound" });
    expect(trigger).toHaveTextContent("Choose a sound");
    await user.click(trigger);
    const listbox = await screen.findByRole("listbox");
    expect(screen.getByRole("option", { name: "Radio" })).toHaveAttribute("aria-disabled", "true");
    await expectAccessible(listbox);
    await user.click(screen.getByRole("option", { name: "Birdsong" }));
    expect(onChange).toHaveBeenCalledWith("birds");
    expect(trigger).toHaveTextContent("Birdsong");
  });
});

describe("Select inside Field", () => {
  it("labels and describes the trigger button", async () => {
    const { container } = render(
      <Field label="Sound" description="Plays at 06:00" error="Pick a sound" required>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chime">Chime</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    );
    const trigger = screen.getByRole("combobox", { name: /Sound/ });
    expect(trigger).toHaveAccessibleDescription("Plays at 06:00 Pick a sound");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("aria-required", "true");
    await expectAccessible(container);
  });
});

describe("Toast", () => {
  afterEach(() => act(() => clearToasts()));

  it("announces toasts in a labelled region and runs the action", async () => {
    const onUndo = vi.fn();
    const { user } = setup(<Toaster />);
    act(() => {
      toast({ title: "Alarm saved", description: "06:00 weekdays", action: { label: "Undo", altText: "Undo saving the alarm", onClick: onUndo } });
    });
    expect(await screen.findByText("Alarm saved")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Notifications/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalled();
  });

  it("dismisses via the close button and programmatically; supports tones", async () => {
    const { user } = setup(<Toaster closeLabel="Close notification" />);
    let handle!: ReturnType<typeof toast>;
    act(() => {
      toast({ title: "Failed to sync", tone: "danger", duration: Infinity });
      handle = toast({ title: "Heads up", tone: "neutral", duration: Infinity });
    });
    const failed = await screen.findByText("Failed to sync");
    expect(failed.closest(".pl-toast")).toHaveClass("pl-toast--danger");
    expect(screen.getByText("Heads up").closest(".pl-toast")).toHaveClass("pl-toast--neutral");
    act(() => handle.dismiss());
    await waitFor(() => expect(screen.queryByText("Heads up")).toBeNull());
    await user.click(screen.getAllByRole("button", { name: "Close notification" })[0]!);
    await waitFor(() => expect(screen.queryByText("Failed to sync")).toBeNull());
    act(() => dismissToast(999));
  });
});

describe("Toaster without toasts", () => {
  it("mounts an empty viewport list", () => {
    render(<Toaster label="Alerts" hotkey={["F8"]} />);
    const viewport = document.querySelector(".pl-toast-viewport");
    expect(viewport?.tagName).toBe("OL");
    expect(viewport?.children).toHaveLength(0);
  });
});
