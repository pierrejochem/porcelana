---
"@porcelana/ui": patch
---

- `SelectTrigger` now picks up the label, description and error from a surrounding `Field`. Before, a Select inside a Field had no accessible name.
- `Calendar` day buttons are named starting with their visible number ("23 November 2026, Monday"), so voice-control users can say what they see.
- `Breadcrumb` items without `href` render as plain text instead of looking like the current page.
- Every prop now has a doc comment, so editors show descriptions on hover.
