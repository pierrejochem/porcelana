import { useState } from "react";
import { render, screen, waitFor, within, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { setup, expectAccessible, setViewport, resetViewport } from "../test/utils";
import { Combobox } from "./Combobox";
import { Calendar, DatePicker } from "./DatePicker";
import { Breadcrumb, Pagination, getPageTokens } from "./Navigation";
import { DataTable, type ColumnDef } from "./DataTable";
import { ThemeProvider, useSurface, useTheme } from "./Theme";
import { Field } from "./Field";
import { Badge } from "./Display";
import { useMediaQuery, useIsMobile } from "../lib/useMediaQuery";
import { cn } from "../lib/cn";

afterEach(() => resetViewport());

const rooms = [
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen", keywords: ["cook"] },
  { value: "office", label: "Office" },
  { value: "attic", label: "Attic", disabled: true }
];

describe("Combobox", () => {
  it("is labelled through Field, filters by typing and selects with Enter", async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <Field label="Room">
        <Combobox options={rooms} onValueChange={onChange} placeholder="Pick a room" />
      </Field>
    );
    const trigger = screen.getByRole("combobox", { name: "Room" });
    expect(trigger).toHaveTextContent("Pick a room");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const search = await screen.findByRole("combobox", { name: "Search options" });
    await waitFor(() => expect(search).toHaveFocus());
    await user.type(search, "cook");
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getAllByRole("option")).toHaveLength(1);
    await expectAccessible(listbox);
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("kitchen");
    await waitFor(() => expect(trigger).toHaveTextContent("Kitchen"));
  });

  it("shows the empty state, marks the selection and deselects on re-pick", async () => {
    function Controlled() {
      const [v, setV] = useState<string | null>("office");
      return (
        <>
          <Combobox aria-label="Room" options={rooms} value={v} onValueChange={setV} emptyText="No room matches" />
          <output data-testid="v">{String(v)}</output>
        </>
      );
    }
    const { user } = setup(<Controlled />);
    await user.click(screen.getByRole("combobox", { name: "Room" }));
    expect(screen.getByRole("option", { name: "Office" })).toHaveAttribute("aria-selected");
    expect(screen.getByRole("option", { name: "Attic" })).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("option", { name: "Office" }));
    expect(screen.getByTestId("v")).toHaveTextContent("null");
    await user.click(screen.getByRole("combobox", { name: "Room" }));
    await user.type(await screen.findByRole("combobox", { name: "Search options" }), "zzz");
    expect(screen.getByText("No room matches")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });
});

describe("DatePicker & Calendar", () => {
  const nov18 = new Date(2026, 10, 18);

  it("opens a dialog calendar, picks a day by click and closes", async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <Field label="Start date">
        <DatePicker defaultValue={nov18} onValueChange={onChange} locale="en-GB" />
      </Field>
    );
    const trigger = screen.getByRole("button", { name: "Start date" });
    expect(trigger).toHaveTextContent("Wed, 18 Nov 2026");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await user.click(trigger);
    const grid = await screen.findByRole("grid");
    await expectAccessible(grid);
    await user.click(screen.getByRole("button", { name: /^23 November 2026/ }));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 23));
    await waitFor(() => expect(screen.queryByRole("grid")).toBeNull());
    expect(trigger).toHaveTextContent("Mon, 23 Nov 2026");
  });

  it("shows the placeholder, respects disabled days and keyboard navigation", async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <DatePicker aria-label="Date" placeholder="Pick a date" onValueChange={onChange} disabledDays={{ dayOfWeek: [0, 6] }} startMonth={nov18} endMonth={nov18} />
    );
    const trigger = screen.getByRole("button", { name: "Date" });
    expect(trigger).toHaveTextContent("Pick a date");
    await user.click(trigger);
    await screen.findByRole("grid");
    const sunday = screen.getByRole("button", { name: /^22 November 2026/ });
    expect(sunday.closest("td")).toHaveAttribute("data-disabled", "true");
    await user.click(sunday);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /next month/i })).toHaveAttribute("aria-disabled", "true");
    // Arrow keys move between days; Enter picks the focused day.
    const monday = screen.getByRole("button", { name: /^23 November 2026/ });
    monday.focus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 24));
  });

  it("day buttons are named starting with their visible number", () => {
    render(<Calendar mode="single" defaultMonth={nov18} selected={new Date(2026, 10, 20)} />);
    expect(screen.getByRole("button", { name: /^20 November 2026, Friday, selected$/ })).toHaveTextContent("20");
  });

  it("Calendar renders standalone, Monday first", () => {
    render(<Calendar mode="single" defaultMonth={nov18} />);
    const { container } = { container: document.body };
    expect(container.querySelector(".rdp-weekday")).toHaveAttribute("aria-label", "Monday");
    expect(screen.getByRole("grid", { name: "November 2026" })).toBeInTheDocument();
  });
});

describe("Breadcrumb", () => {
  it("marks the last item as the current page", async () => {
    const { container } = render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Alarms", href: "/alarms" }, { label: "New alarm" }]}
      />
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alarms" })).toHaveAttribute("href", "/alarms");
    expect(screen.getByText("New alarm")).toHaveAttribute("aria-current", "page");
    await expectAccessible(container);
  });

  it("uses a custom link renderer and plain text for href-less items", () => {
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Section" }, { label: "Page" }]}
        renderLink={(item, className) => (
          <a className={className} href={`#${item.href}`} data-router>
            {item.label}
          </a>
        )}
      />
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-router");
    expect(screen.getByText("Section")).not.toHaveAttribute("aria-current");
  });
});

describe("Pagination", () => {
  it("getPageTokens adds ellipses only when needed", () => {
    expect(getPageTokens(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageTokens(5, 10)).toEqual([1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]);
    expect(getPageTokens(1, 10)).toEqual([1, 2, "ellipsis-end", 10]);
    expect(getPageTokens(10, 10)).toEqual([1, "ellipsis-start", 9, 10]);
    expect(getPageTokens(3, 10)).toEqual([1, 2, 3, 4, "ellipsis-end", 10]);
    expect(getPageTokens(8, 10)).toEqual([1, "ellipsis-start", 7, 8, 9, 10]);
  });

  it("marks the current page and disables edges", async () => {
    const onPage = vi.fn();
    const { user, container } = setup(<Pagination page={1} pageCount={3} onPageChange={onPage} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPage).toHaveBeenCalledWith(2);
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPage).toHaveBeenCalledWith(3);
    await expectAccessible(container);
  });

  it("goes back from the last page", async () => {
    const onPage = vi.fn();
    const { user } = setup(<Pagination page={3} pageCount={3} onPageChange={onPage} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPage).toHaveBeenCalledWith(2);
  });
});

interface Device {
  id: string;
  name: string;
  room: string;
  battery: number;
  status: "Online" | "Offline";
}

const devices: Device[] = [
  { id: "d1", name: "Bedside dial", room: "Bedroom", battery: 86, status: "Online" },
  { id: "d2", name: "Kitchen puck", room: "Kitchen", battery: 54, status: "Online" },
  { id: "d3", name: "Hall panel", room: "Hallway", battery: 100, status: "Online" },
  { id: "d4", name: "Kids lamp", room: "Kids room", battery: 12, status: "Offline" },
  { id: "d5", name: "Desk pebble", room: "Office", battery: 71, status: "Online" },
  { id: "d6", name: "Garden chime", room: "Terrace", battery: 39, status: "Offline" }
];

const columns: ColumnDef<Device, unknown>[] = [
  { accessorKey: "name", header: "Device" },
  { accessorKey: "room", header: "Room" },
  { accessorKey: "battery", header: "Battery", cell: (c) => `${c.getValue<number>()}%` },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: (c) => <Badge tone={c.getValue() === "Online" ? "success" : "danger"}>{c.getValue<string>()}</Badge>
  }
];

describe("DataTable (desktop)", () => {
  it("renders a captioned table with sortable headers (aria-sort)", async () => {
    const { user, container } = setup(
      <DataTable data={devices} columns={columns} caption="Alarm devices" getRowId={(d) => d.id} pageSize={10} />
    );
    const table = screen.getByRole("table", { name: "Alarm devices" });
    const deviceHeader = within(table).getByRole("columnheader", { name: /Device/ });
    expect(deviceHeader).toHaveAttribute("aria-sort", "none");
    expect(within(table).getByRole("columnheader", { name: "Status" })).not.toHaveAttribute("aria-sort");
    await user.click(within(deviceHeader).getByRole("button"));
    expect(deviceHeader).toHaveAttribute("aria-sort", "ascending");
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Bedside dial");
    await user.click(within(deviceHeader).getByRole("button"));
    expect(deviceHeader).toHaveAttribute("aria-sort", "descending");
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Kitchen puck");
    expect(screen.getByRole("region", { name: "Alarm devices" })).toHaveAttribute("tabindex", "0");
    await expectAccessible(container);
  });

  it("searches, announces the result count and shows the empty state", async () => {
    const { user } = setup(<DataTable data={devices} columns={columns} caption="Devices" searchable searchLabel="Search devices" emptyText="Nothing found" />);
    expect(screen.getByRole("status")).toHaveTextContent("Showing 1–6 of 6");
    await user.type(screen.getByRole("searchbox", { name: "Search devices" }), "kitchen");
    expect(screen.getByRole("status")).toHaveTextContent("Showing 1–1 of 1");
    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByText("Nothing found")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("0 results");
  });

  it("selects rows and pages (select-all is page-scoped and tri-state)", async () => {
    const onSel = vi.fn();
    const { user } = setup(
      <DataTable
        data={devices}
        columns={columns}
        caption="Devices"
        selectable
        pageSize={4}
        getRowId={(d) => d.id}
        getRowLabel={(d) => d.name}
        onRowSelectionChange={onSel}
        initialSorting={[{ id: "battery", desc: false }]}
        toolbar={(t) => <span data-testid="sel">{t.getSelectedRowModel().rows.length} chosen</span>}
      />
    );
    const all = screen.getByRole("checkbox", { name: "Select all rows on this page" });
    await user.click(screen.getByRole("checkbox", { name: "Select Kids lamp" }));
    expect(all).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByTestId("sel")).toHaveTextContent("1 chosen");
    expect(screen.getByRole("status")).toHaveTextContent("1 selected");
    await user.click(all);
    expect(all).toHaveAttribute("aria-checked", "true");
    expect(onSel).toHaveBeenLastCalledWith({ d4: true, d6: true, d2: true, d5: true });
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getByRole("status")).toHaveTextContent("Showing 5–6 of 6");
    expect(screen.getByRole("checkbox", { name: "Select all rows on this page" })).toHaveAttribute("aria-checked", "false");
  });

  it("respects controlled selection and hidden captions", () => {
    render(
      <DataTable data={devices.slice(0, 2)} columns={columns} caption="Devices" hideCaption selectable rowSelection={{ d1: true }} getRowId={(d) => d.id} />
    );
    expect(screen.getByRole("checkbox", { name: "Select Bedside dial" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Devices", { selector: "caption" })).toHaveClass("pl-visually-hidden");
  });
});

describe("DataTable (mobile)", () => {
  it("renders tap-to-select cards with sort chips under 640px", async () => {
    setViewport(390);
    const { user, container } = setup(
      <DataTable data={devices} columns={columns} caption="Devices" selectable getRowId={(d) => d.id} getRowLabel={(d) => d.name} />
    );
    expect(screen.queryByRole("table")).toBeNull();
    const card = screen.getByRole("checkbox", { name: "Select Kids lamp" });
    expect(card).toHaveClass("pl-card-row");
    await user.click(card);
    expect(card).toHaveAttribute("aria-checked", "true");
    const chip = screen.getByRole("button", { name: "Sort by Battery" });
    await user.click(chip);
    expect(screen.getByRole("button", { name: "Sort by Battery, ascending" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Kids lamp");
    await user.click(screen.getByRole("button", { name: "Sort by Battery, ascending" }));
    expect(screen.getByRole("button", { name: "Sort by Battery, descending" })).toBeInTheDocument();
    await expectAccessible(container);
  });

  it("supports forced card layout, custom cards, non-selectable rows and empty state", () => {
    const { rerender } = render(
      <DataTable data={devices.slice(0, 1)} columns={columns} caption="Devices" layout="cards" renderCard={(r) => <span>Custom {r.original.name}</span>} />
    );
    expect(screen.getByText("Custom Bedside dial")).toBeInTheDocument();
    rerender(<DataTable data={[]} columns={columns} caption="Devices" layout="cards" emptyText="Empty" />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
    rerender(<DataTable data={devices.slice(0, 1)} columns={[{ accessorKey: "name", header: () => "Name", enableSorting: false }]} caption="D" layout="cards" />);
    expect(screen.getByText("Bedside dial")).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Sort by" })).toBeNull();
  });

  it("forced table layout wins on phones", () => {
    setViewport(390);
    render(<DataTable data={devices} columns={columns} caption="Devices" layout="table" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("ThemeProvider", () => {
  it("applies data-theme locally and on <html>, restoring on unmount", () => {
    function Probe() {
      return <span>{useTheme()}</span>;
    }
    const { unmount, container } = render(
      <ThemeProvider theme="night">
        <Probe />
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveAttribute("data-theme", "night");
    expect(container.firstChild).toHaveClass("pl-root");
    expect(document.documentElement).toHaveAttribute("data-theme", "night");
    expect(screen.getByText("night")).toBeInTheDocument();
    unmount();
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("resolves system theme and can stay local", () => {
    document.documentElement.setAttribute("data-theme", "light");
    const { container, unmount } = render(<ThemeProvider theme="system" global={false} />);
    expect(container.firstChild).toHaveAttribute("data-theme", "light");
    unmount();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    render(<ThemeProvider theme="night" />).unmount();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    document.documentElement.removeAttribute("data-theme");
  });
});

describe("ThemeProvider surface", () => {
  it("sets data-surface on the wrapper and <html>, exposes it via useSurface and restores on unmount", () => {
    function Probe() {
      return <span>{useSurface()}</span>;
    }
    const { container, unmount } = render(
      <ThemeProvider surface="white">
        <Probe />
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveAttribute("data-surface", "white");
    expect(document.documentElement).toHaveAttribute("data-surface", "white");
    expect(screen.getByText("white")).toBeInTheDocument();
    unmount();
    expect(document.documentElement).not.toHaveAttribute("data-surface");
  });

  it("defaults to porcelain without a data-surface attribute and keeps an outer value", () => {
    document.documentElement.setAttribute("data-surface", "white");
    const { container, unmount } = render(<ThemeProvider />);
    expect(container.firstChild).not.toHaveAttribute("data-surface");
    expect(document.documentElement).not.toHaveAttribute("data-surface");
    unmount();
    expect(document.documentElement).toHaveAttribute("data-surface", "white");
    document.documentElement.removeAttribute("data-surface");
  });
});

describe("helpers", () => {
  it("useMediaQuery / useIsMobile follow the viewport", () => {
    setViewport(390);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
    expect(renderHook(() => useMediaQuery("(pointer: coarse)")).result.current).toBe(true);
    act(() => resetViewport());
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
    expect(renderHook(() => useMediaQuery("(min-width: 1024px)")).result.current).toBe(true);
  });

  it("cn joins truthy classes", () => {
    expect(cn("a", false, null, ["b", { c: true, d: false }])).toBe("a b c");
  });
});
