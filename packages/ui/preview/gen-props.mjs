// Extracts component props from the TypeScript sources into preview/generated/props.json.
// Keeps props declared in this package and in Radix; drops the hundreds of inherited DOM attributes.
import { withCustomConfig } from "react-docgen-typescript";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const componentsDir = join(root, "src", "components");

const files = readdirSync(componentsDir)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
  .map((f) => join(componentsDir, f));

// A few useful DOM props to keep even though they come from React's types.
const keepFromReact = new Set(["disabled", "type", "placeholder", "aria-label", "id", "required"]);

const parser = withCustomConfig(join(root, "tsconfig.json"), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter(prop) {
    const sources = (prop.declarations ?? []).map((d) => d.fileName);
    if (sources.length === 0) return true;
    return sources.some(
      (file) =>
        !file.includes("node_modules") ||
        file.includes("@radix-ui") ||
        file.includes("react-day-picker") ||
        (keepFromReact.has(prop.name) && file.includes("@types/react"))
    );
  }
});

// Radix and React props ship without doc comments; describe the common ones.
const fallback = {
  asChild: "Render the single child element instead, merging props and behaviour onto it.",
  checked: "Controlled checked state. Use with onCheckedChange.",
  defaultChecked: "Initial checked state when uncontrolled.",
  onCheckedChange: "Called with the new checked state.",
  value: "Controlled value. Use with onValueChange.",
  defaultValue: "Initial value when uncontrolled.",
  onValueChange: "Called with the new value.",
  open: "Controlled open state. Use with onOpenChange.",
  defaultOpen: "Initial open state when uncontrolled.",
  onOpenChange: "Called when the open state changes.",
  disabled: "Prevents interaction and dims the control.",
  required: "Marks the control as required in forms.",
  name: "Field name submitted with a form.",
  form: "Id of the form this control belongs to.",
  id: "Element id. Generated automatically when omitted.",
  type: "Button type (defaults to \"button\").",
  placeholder: "Hint shown when there is no value.",
  dir: "Reading direction for keyboard navigation (\"ltr\" or \"rtl\").",
  orientation: "Layout and arrow-key direction.",
  loop: "Whether keyboard navigation wraps from the last item to the first.",
  forceMount: "Keep the content mounted when closed, e.g. for animation libraries.",
  min: "Lowest allowed value.",
  max: "Highest allowed value.",
  step: "Value change per arrow-key press.",
  minStepsBetweenThumbs: "Minimum gap between thumbs in a range slider, in steps.",
  inverted: "Fill the track from the opposite end.",
  onValueCommit: "Called when the user finishes dragging or presses a key.",
  rovingFocus: "Use arrow keys to move focus between items.",
  collapsible: "Allow closing the open item in a single-type accordion.",
  activationMode: "\"automatic\" switches tabs on focus; \"manual\" waits for Enter or Space.",
  side: "Preferred side of the trigger to render on.",
  sideOffset: "Distance from the trigger in px.",
  align: "Alignment against the trigger.",
  alignOffset: "Offset from the alignment edge in px.",
  collisionPadding: "Space to keep from the viewport edges in px.",
  avoidCollisions: "Flip or shift to stay on screen.",
  sticky: "Keep the content attached while scrolling.",
  hideWhenDetached: "Hide when the trigger scrolls out of view.",
  onEscapeKeyDown: "Called on Escape; call event.preventDefault() to keep it open.",
  onPointerDownOutside: "Called on a pointer down outside; preventDefault() keeps it open.",
  onInteractOutside: "Called on any interaction outside; preventDefault() keeps it open.",
  onFocusOutside: "Called when focus moves outside.",
  onOpenAutoFocus: "Called when focus moves in on open; preventDefault() to manage focus yourself.",
  onCloseAutoFocus: "Called when focus returns on close; preventDefault() to manage focus yourself.",
  modal: "Block interaction with the rest of the page while open.",
  delayDuration: "Hover delay before showing, in ms.",
  autoComplete: "Browser autofill hint for the hidden native select.",
  "aria-label": "Accessible name, when there is no visible label.",
  variant: "Visual style.",
  size: "Size. Every size keeps at least a 44px touch target.",
  block: "Stretch to the full width.",
  tone: "Color tone. Text always carries the meaning too, never color alone.",
  textValue: "Text used for typeahead when the item's content isn't plain text.",
  onSelect: "Called when the item is chosen; event.preventDefault() keeps the menu open.",
  position: "\"popper\" places the list next to the trigger; \"item-aligned\" overlays it like a native select.",
  arrowPadding: "Padding between the arrow and the content edges in px.",
  collisionBoundary: "Element(s) used as the collision boundary instead of the viewport.",
  updatePositionStrategy: "\"optimized\" or \"always\" recompute the position on every frame.",
  virtualRef: "Anchor to a virtual element, e.g. a text selection.",
  getValueLabel: "Builds aria-valuetext from (value, max)."
};

const docs = parser.parse(files);
const out = {};
for (const doc of docs) {
  const props = Object.values(doc.props)
    .filter((p) => !p.name.startsWith("__"))
    .map((p) => ({
      name: p.name,
      type: p.type?.raw && p.type.raw.length < 120 ? p.type.raw : p.type?.name ?? "unknown",
      required: Boolean(p.required),
      defaultValue: p.defaultValue?.value ?? null,
      description: p.description || fallback[p.name] || ""
    }))
    .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
  out[doc.displayName] = { description: doc.description ?? "", props };
}

mkdirSync(join(here, "generated"), { recursive: true });
writeFileSync(join(here, "generated", "props.json"), JSON.stringify(out, null, 2));
console.log(`props.json: ${Object.keys(out).length} components`);
