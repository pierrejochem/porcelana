# @porcelana/ui

## 0.2.0

### Minor Changes

- [`0c80849`](https://github.com/pierrejochem/porcelana/commit/0c80849b0ed022adf77688d70d9fcec18983f53e) Thanks [@pierrejochem](https://github.com/pierrejochem)! - New white surface for apps on pure white pages: `<ThemeProvider surface="white">` (or `data-surface="white"` on any element). Raised elements get a hairline edge and a soft drop shadow instead of neumorphic highlights, recessed elements become light grey wells, and off switches and unchecked boxes keep a visible edge. Applies to the light theme. Adds the `useSurface()` hook and the `SurfaceName` type.

## 0.1.2

### Patch Changes

- [`699979c`](https://github.com/pierrejochem/porcelana/commit/699979c6c83ca9df0155dc470e81c7b7904978b6) Thanks [@pierrejochem](https://github.com/pierrejochem)! - - `SelectTrigger` now picks up the label, description and error from a surrounding `Field`. Before, a Select inside a Field had no accessible name.
  - `Calendar` day buttons are named starting with their visible number ("23 November 2026, Monday"), so voice-control users can say what they see.
  - `Breadcrumb` items without `href` render as plain text instead of looking like the current page.
  - Every prop now has a doc comment, so editors show descriptions on hover.

## 0.1.1

### Patch Changes

- [`a1a163b`](https://github.com/pierrejochem/porcelana/commit/a1a163bf474161caaa959df45a3f294f18c6f174) Thanks [@pierrejochem](https://github.com/pierrejochem)! - Publish through npm trusted publishing (OIDC) with provenance. No code changes.

- Updated dependencies [[`a1a163b`](https://github.com/pierrejochem/porcelana/commit/a1a163bf474161caaa959df45a3f294f18c6f174)]:
  - @porcelana/icons@0.1.1

## 0.1.0

### Minor Changes

- [`15de667`](https://github.com/pierrejochem/porcelana/commit/15de667c5503c80293aa354f2363b45c95018449) Thanks [@pierrejochem](https://github.com/pierrejochem)! - Initial release: tactile Radix-based components, light/night themes, mobile sheets, and the 48-glyph icon set.

### Patch Changes

- Updated dependencies [[`15de667`](https://github.com/pierrejochem/porcelana/commit/15de667c5503c80293aa354f2363b45c95018449)]:
  - @porcelana/icons@0.1.0
