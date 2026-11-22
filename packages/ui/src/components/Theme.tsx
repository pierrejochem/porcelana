import { createContext, useContext, useEffect, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { useMediaQuery } from "../lib/useMediaQuery";

export type ThemeName = "light" | "night" | "system";
/** "porcelain" is the default grey-on-grey look; "white" adapts surfaces for pure white pages. */
export type SurfaceName = "porcelain" | "white";
type Resolved = "light" | "night";

const ThemeContext = createContext<Resolved>("light");
const SurfaceContext = createContext<SurfaceName>("porcelain");

/** The active theme ("light" | "night") after resolving "system". */
export function useTheme(): Resolved {
  return useContext(ThemeContext);
}

/** The active surface ("porcelain" | "white"). */
export function useSurface(): SurfaceName {
  return useContext(SurfaceContext);
}

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** "light", "night", or "system" to follow the OS dark mode. */
  theme?: ThemeName;
  /** "white" for apps on pure white pages: hairline borders and soft shadows instead of neumorphic depth. Light theme only. */
  surface?: SurfaceName;
  /** Also set data-theme on <html>, so portalled overlays pick up the theme. Default true. */
  global?: boolean;
}

/** Wraps content in the porcelana root with the chosen theme. */
export function ThemeProvider({ theme = "light", surface = "porcelain", global = true, className, children, ...props }: ThemeProviderProps) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const resolved: Resolved = theme === "system" ? (prefersDark ? "night" : "light") : theme;

  useEffect(() => {
    if (!global || typeof document === "undefined") return;
    const root = document.documentElement;
    const previous = root.getAttribute("data-theme");
    const previousSurface = root.getAttribute("data-surface");
    root.setAttribute("data-theme", resolved);
    if (surface === "white") root.setAttribute("data-surface", "white");
    else root.removeAttribute("data-surface");
    return () => {
      if (previous === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previous);
      if (previousSurface === null) root.removeAttribute("data-surface");
      else root.setAttribute("data-surface", previousSurface);
    };
  }, [resolved, surface, global]);

  return (
    <ThemeContext.Provider value={resolved}>
      <SurfaceContext.Provider value={surface}>
        <div data-theme={resolved} data-surface={surface === "white" ? "white" : undefined} className={cn("pl-root", className)} {...props}>
          {children}
        </div>
      </SurfaceContext.Provider>
    </ThemeContext.Provider>
  );
}
