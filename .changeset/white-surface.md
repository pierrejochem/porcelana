---
"@porcelana/ui": minor
---

New white surface for apps on pure white pages: `<ThemeProvider surface="white">` (or `data-surface="white"` on any element). Raised elements get a hairline edge and a soft drop shadow instead of neumorphic highlights, recessed elements become light grey wells, and off switches and unchecked boxes keep a visible edge. Applies to the light theme. Adds the `useSurface()` hook and the `SurfaceName` type.
