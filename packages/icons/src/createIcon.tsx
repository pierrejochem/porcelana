import { forwardRef, type SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /** Width and height in px (or any CSS length). Defaults to 24. */
  size?: number | string;
  /** Stroke width on the 24px grid. Defaults to 2. */
  strokeWidth?: number | string;
  /**
   * Accessible name. When set, the icon is announced as an image with this label;
   * when omitted, the icon is decorative and hidden from assistive technology.
   */
  title?: string;
}

export type IconComponent = ReturnType<typeof createIcon>;

/** Creates a stroke icon component from a single 24×24 path. */
export function createIcon(displayName: string, d: string) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = 24, strokeWidth = 2, title, color = "currentColor", ...rest },
    ref
  ) {
    const labelled = typeof title === "string" && title.length > 0;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        data-icon={displayName}
        {...(labelled ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
        {...rest}
      >
        {labelled ? <title>{title}</title> : null}
        <path d={d} />
      </svg>
    );
  });
  Icon.displayName = `${displayName}Icon`;
  return Icon;
}
