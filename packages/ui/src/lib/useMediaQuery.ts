import { useCallback, useSyncExternalStore } from "react";

/** Breakpoint under which overlays become bottom sheets and tables become cards. */
export const MOBILE_QUERY = "(max-width: 639px)";

/** Subscribes to a CSS media query. Returns `false` during SSR. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );
  const getSnapshot = () =>
    typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(query).matches;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** `true` below 640px: the library's mobile layout. */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
