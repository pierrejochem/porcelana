import { createContext, useContext, useEffect, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { useMediaQuery } from "../lib/useMediaQuery";

export type ThemeName = "light" | "night" | "system";
type Resolved = "light" | "night";

const ThemeContext = createContext<Resolved>("light");

/** The active theme ("light" | "night") after resolving "system". */
export function useTheme(): Resolved {
  return useContext(ThemeContext);
}

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** "light", "night", or "system" to follow the OS dark mode. */
  theme?: ThemeName;
  /** Also set data-theme on <html>, so portalled overlays pick up the theme. Default true. */
  global?: boolean;
}

/** Wraps content in the porcelana root with the chosen theme. */
export function ThemeProvider({ theme = "light", global = true, className, children, ...props }: ThemeProviderProps) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const resolved: Resolved = theme === "system" ? (prefersDark ? "night" : "light") : theme;

  useEffect(() => {
    if (!global || typeof document === "undefined") return;
    const root = document.documentElement;
    const previous = root.getAttribute("data-theme");
    root.setAttribute("data-theme", resolved);
    return () => {
      if (previous === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previous);
    };
  }, [resolved, global]);

  return (
    <ThemeContext.Provider value={resolved}>
      <div data-theme={resolved} className={cn("pl-root", className)} {...props}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
