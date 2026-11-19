import { forwardRef } from "react";
import type { IconProps } from "./createIcon";
import { iconPaths, type IconName } from "./icons";

export interface NamedIconProps extends IconProps {
  /** Icon name, e.g. "alarm" or "chevron-down". */
  name: IconName;
}

/**
 * Renders any icon by name. Convenient for data-driven UIs; it bundles every path,
 * so prefer the named components (e.g. `AlarmIcon`) when bundle size matters.
 */
export const Icon = forwardRef<SVGSVGElement, NamedIconProps>(function Icon(
  { name, size = 24, strokeWidth = 2, title, color = "currentColor", ...rest },
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
      data-icon={name}
      {...(labelled ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      {...rest}
    >
      {labelled ? <title>{title}</title> : null}
      <path d={iconPaths[name]} />
    </svg>
  );
});
