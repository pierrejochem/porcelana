import { useId, useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table
} from "@tanstack/react-table";
import { ArrowDownIcon, CheckIcon, SearchIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { useIsMobile } from "../lib/useMediaQuery";
import { Checkbox } from "./Choice";
import { Input } from "./Field";
import { Pagination } from "./Navigation";

export type { ColumnDef, Row, SortingState, RowSelectionState } from "@tanstack/react-table";

export interface DataTableProps<TData> {
  /** Rows to display. */
  data: TData[];
  /** TanStack Table column definitions. A string header becomes the sort label. */
  columns: ColumnDef<TData, unknown>[];
  /** Describes the table for screen readers. Visible unless `hideCaption`. */
  caption: string;
  /** Keep the caption for screen readers but hide it visually. */
  hideCaption?: boolean;
  /** Stable id per row; keys selection state. Defaults to the row index. */
  getRowId?: (row: TData, index: number) => string;
  /** Name of a row, used in "Select <name>" labels and mobile card titles. */
  getRowLabel?: (row: TData) => string;
  /** Adds a checkbox column (and tap-to-select cards on mobile). */
  selectable?: boolean;
  /** Controlled selection map. */
  rowSelection?: RowSelectionState;
  /** Called with the selection map ({ [rowId]: true }). */
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Shows a search field filtering every column. */
  searchable?: boolean;
  /** Accessible name and placeholder of the search field. */
  searchLabel?: string;
  /** Rows per page. */
  pageSize?: number;
  /** Sorting on first render, e.g. [{ id: "name", desc: false }]. */
  initialSorting?: SortingState;
  /** Shown when no rows match. */
  emptyText?: ReactNode;
  /** Content for the toolbar, e.g. bulk actions. Receives the table instance. */
  toolbar?: (table: Table<TData>) => ReactNode;
  /** Custom mobile card body. Defaults to "Column: value" lines. */
  renderCard?: (row: Row<TData>) => ReactNode;
  /** Force a layout instead of following the 640px breakpoint. */
  layout?: "auto" | "table" | "cards";
  /** Class on the outer wrapper. */
  className?: string;
}

function headerText<TData>(col: ColumnDef<TData, unknown>, fallback: string): string {
  return typeof col.header === "string" ? col.header : fallback;
}

/**
 * Sortable, filterable, selectable, paginated table on TanStack Table.
 * Under 640px it renders a card list with sort chips; selection becomes tap-to-select.
 */
export function DataTable<TData>({
  data,
  columns,
  caption,
  hideCaption,
  getRowId,
  getRowLabel,
  selectable,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  searchable,
  searchLabel = "Search",
  pageSize = 10,
  initialSorting = [],
  emptyText = "No results",
  toolbar,
  renderCard,
  layout = "auto",
  className
}: DataTableProps<TData>) {
  const mobile = useIsMobile();
  const asCards = layout === "cards" || (layout === "auto" && mobile);
  const statusId = useId();
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState("");
  const [internalSelection, setInternalSelection] = useState<RowSelectionState>({});
  const rowSelection = rowSelectionProp ?? internalSelection;

  const label = (row: Row<TData>) => getRowLabel?.(row.original) ?? String(row.getVisibleCells()[selectable ? 1 : 0]?.getValue() ?? row.id);

  const allColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!selectable) return columns;
    const select: ColumnDef<TData, unknown> = {
      id: "__select",
      enableSorting: false,
      enableGlobalFilter: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows on this page"
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select ${getRowLabel?.(row.original) ?? String(row.getVisibleCells()[1]?.getValue() ?? row.id)}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(v) => row.toggleSelected(v === true)}
        />
      )
    };
    return [select, ...columns];
  }, [columns, selectable, getRowLabel]);

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, globalFilter, rowSelection },
    getRowId,
    enableRowSelection: Boolean(selectable),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      if (rowSelectionProp === undefined) setInternalSelection(next);
      onRowSelectionChange?.(next);
    },
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize, pageIndex: 0 } }
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex } = table.getState().pagination;
  const first = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const last = Math.min(filteredCount, (pageIndex + 1) * pageSize);
  const status = filteredCount === 0 ? "0 results" : `Showing ${first}–${last} of ${filteredCount}`;
  const sortable = table.getAllLeafColumns().filter((c) => c.getCanSort());

  return (
    <div className={cn("pl-field", className)} style={{ gap: 16 }}>
      {searchable || toolbar ? (
        <div className="pl-table-toolbar">
          {searchable ? (
            <div style={{ flex: "1 1 240px", maxWidth: 360 }}>
              <Input
                type="search"
                aria-label={searchLabel}
                placeholder={searchLabel}
                icon={<SearchIcon size={18} />}
                value={globalFilter}
                aria-controls={statusId}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  table.setPageIndex(0);
                }}
              />
            </div>
          ) : null}
          {toolbar?.(table)}
        </div>
      ) : null}

      {asCards ? (
        <>
          <h3 className={cn("pl-card-title", hideCaption && "pl-visually-hidden")} style={{ fontSize: 17 }}>
            {caption}
          </h3>
          {sortable.length ? (
            <div className="pl-chip-row" role="group" aria-label="Sort by">
              {sortable.map((col) => {
                const dir = col.getIsSorted();
                const name = headerText(col.columnDef, col.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    className="pl-chip"
                    aria-pressed={dir ? true : false}
                    aria-label={`Sort by ${name}${dir ? (dir === "asc" ? ", ascending" : ", descending") : ""}`}
                    onClick={() => col.toggleSorting(dir === "asc")}
                  >
                    {name}
                    {dir ? (dir === "asc" ? " ↑" : " ↓") : ""}
                  </button>
                );
              })}
            </div>
          ) : null}
          <ul className="pl-card-list">
            {rows.map((row) => {
              const body = renderCard ? (
                renderCard(row)
              ) : (
                <span className="pl-card-row-body">
                  <span className="pl-card-row-title">{label(row)}</span>
                  {row
                    .getVisibleCells()
                    .slice(selectable ? 2 : 1)
                    .map((cell) => (
                      <span key={cell.id}>
                        {headerText(cell.column.columnDef, cell.column.id)}:{" "}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    ))}
                </span>
              );
              return (
                <li key={row.id}>
                  {selectable ? (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={row.getIsSelected()}
                      aria-label={`Select ${label(row)}`}
                      className="pl-card-row"
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      onClick={() => row.toggleSelected()}
                    >
                      <span className="pl-checkbox" data-state={row.getIsSelected() ? "checked" : "unchecked"} aria-hidden="true">
                        {row.getIsSelected() ? <CheckIcon size={16} strokeWidth={3.2} /> : null}
                      </span>
                      {body}
                    </button>
                  ) : (
                    <div className="pl-card-row">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        // A focusable, labelled region lets keyboard users scroll wide tables (WCAG 2.1.1).
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div className="pl-table-scroll" role="region" aria-label={caption} tabIndex={0}>
          <table className="pl-table">
            <caption className={hideCaption ? "pl-visually-hidden" : "pl-card-title"} style={{ padding: "8px 6px" }}>
              {caption}
            </caption>
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const dir = header.column.getIsSorted();
                    const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        className={header.column.id === "__select" ? "pl-table-select" : undefined}
                        aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : header.column.getCanSort() ? "none" : undefined}
                      >
                        {header.column.getCanSort() ? (
                          <button
                            type="button"
                            className="pl-sort-btn"
                            data-active={dir ? "" : undefined}
                            data-dir={dir || undefined}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {content}
                            <ArrowDownIcon className="pl-sort-icon" size={14} strokeWidth={2.6} />
                          </button>
                        ) : header.column.id === "__select" ? (
                          content
                        ) : (
                          <span className="pl-table-th-label">{content}</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={cell.column.id === "__select" ? "pl-table-select" : undefined}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? <p className="pl-table-empty">{emptyText}</p> : null}
        </div>
      )}

      {asCards && rows.length === 0 ? <p className="pl-table-empty">{emptyText}</p> : null}

      <div className="pl-table-footer">
        <span id={statusId} role="status" aria-live="polite">
          {status}
          {selectable && Object.keys(rowSelection).length ? ` · ${Object.keys(rowSelection).filter((k) => rowSelection[k]).length} selected` : ""}
        </span>
        {table.getPageCount() > 1 ? (
          <Pagination
            page={pageIndex + 1}
            pageCount={table.getPageCount()}
            onPageChange={(p) => table.setPageIndex(p - 1)}
          />
        ) : null}
      </div>
    </div>
  );
}
