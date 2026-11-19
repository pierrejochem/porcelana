import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@porcelana/icons";
import { cn } from "../lib/cn";
import { IconButton } from "./IconButton";

/* ───── Breadcrumb ───── */
export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Trail from the root to the current page; items without href render as text. */
  items: BreadcrumbItem[];
  /** Custom link renderer for client-side routers. */
  renderLink?: (item: BreadcrumbItem & { href: string }, className: string) => ReactNode;
  /** Separator between items (hidden from screen readers). Defaults to "/". */
  separator?: ReactNode;
}

/** The last item is the current page (aria-current="page"). */
export function Breadcrumb({ items, renderLink, separator = "/", className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className="pl-breadcrumb-list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              <li>
                {last ? (
                  <span className="pl-breadcrumb-page" aria-current="page">
                    {item.label}
                  </span>
                ) : !item.href ? (
                  <span className="pl-breadcrumb-text">{item.label}</span>
                ) : renderLink ? (
                  renderLink({ ...item, href: item.href }, "pl-breadcrumb-link")
                ) : (
                  <a className="pl-breadcrumb-link" href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>
              {!last ? (
                <li className="pl-breadcrumb-separator" aria-hidden="true">
                  {separator}
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/* ───── Pagination ───── */
export type PageToken = number | "ellipsis-start" | "ellipsis-end";

/** 1-based page list with ellipses, e.g. [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]. */
export function getPageTokens(page: number, pageCount: number, siblings = 1): PageToken[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = Math.max(2, page - siblings);
  const end = Math.min(pageCount - 1, page + siblings);
  const tokens: PageToken[] = [1];
  if (start > 2) tokens.push("ellipsis-start");
  else for (let i = 2; i < start; i++) tokens.push(i);
  for (let i = start; i <= end; i++) tokens.push(i);
  if (end < pageCount - 1) tokens.push("ellipsis-end");
  else for (let i = end + 1; i < pageCount; i++) tokens.push(i);
  tokens.push(pageCount);
  return tokens;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the 1-based page to show. */
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one before an ellipsis. */
  siblingCount?: number;
  /** Accessible name of the previous button. */
  previousLabel?: string;
  /** Accessible name of the next button. */
  nextLabel?: string;
  /** Builds each page button's accessible name. */
  pageLabel?: (page: number) => string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  previousLabel = "Previous page",
  nextLabel = "Next page",
  pageLabel = (p) => `Page ${p}`,
  className,
  ...props
}: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cn("pl-pagination", className)} {...props}>
      <IconButton aria-label={previousLabel} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeftIcon size={18} strokeWidth={2.6} />
      </IconButton>
      {getPageTokens(page, pageCount, siblingCount).map((t) =>
        typeof t === "number" ? (
          <button
            key={t}
            type="button"
            className="pl-page-btn"
            aria-label={pageLabel(t)}
            aria-current={t === page ? "page" : undefined}
            onClick={() => onPageChange(t)}
          >
            {t}
          </button>
        ) : (
          <span key={t} className="pl-page-ellipsis" aria-hidden="true">
            …
          </span>
        )
      )}
      <IconButton aria-label={nextLabel} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        <ChevronRightIcon size={18} strokeWidth={2.6} />
      </IconButton>
    </nav>
  );
}
