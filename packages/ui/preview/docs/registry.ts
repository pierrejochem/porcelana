import type { ComponentType } from "react";

import Accordion from "../examples/Accordion";
import AccordionCode from "../examples/Accordion.tsx?raw";
import AlertDialog from "../examples/AlertDialog";
import AlertDialogCode from "../examples/AlertDialog.tsx?raw";
import Avatar from "../examples/Avatar";
import AvatarCode from "../examples/Avatar.tsx?raw";
import Badge from "../examples/Badge";
import BadgeCode from "../examples/Badge.tsx?raw";
import Breadcrumb from "../examples/Breadcrumb";
import BreadcrumbCode from "../examples/Breadcrumb.tsx?raw";
import Button from "../examples/Button";
import ButtonCode from "../examples/Button.tsx?raw";
import Card from "../examples/Card";
import CardCode from "../examples/Card.tsx?raw";
import Checkbox from "../examples/Checkbox";
import CheckboxCode from "../examples/Checkbox.tsx?raw";
import Combobox from "../examples/Combobox";
import ComboboxCode from "../examples/Combobox.tsx?raw";
import DataTable from "../examples/DataTable";
import DataTableCode from "../examples/DataTable.tsx?raw";
import DatePicker from "../examples/DatePicker";
import DatePickerCode from "../examples/DatePicker.tsx?raw";
import Dialog from "../examples/Dialog";
import DialogCode from "../examples/Dialog.tsx?raw";
import DropdownMenu from "../examples/DropdownMenu";
import DropdownMenuCode from "../examples/DropdownMenu.tsx?raw";
import Field from "../examples/Field";
import FieldCode from "../examples/Field.tsx?raw";
import IconButton from "../examples/IconButton";
import IconButtonCode from "../examples/IconButton.tsx?raw";
import NumberStepper from "../examples/NumberStepper";
import NumberStepperCode from "../examples/NumberStepper.tsx?raw";
import Pagination from "../examples/Pagination";
import PaginationCode from "../examples/Pagination.tsx?raw";
import Popover from "../examples/Popover";
import PopoverCode from "../examples/Popover.tsx?raw";
import Progress from "../examples/Progress";
import ProgressCode from "../examples/Progress.tsx?raw";
import RadioGroup from "../examples/RadioGroup";
import RadioGroupCode from "../examples/RadioGroup.tsx?raw";
import Select from "../examples/Select";
import SelectCode from "../examples/Select.tsx?raw";
import Skeleton from "../examples/Skeleton";
import SkeletonCode from "../examples/Skeleton.tsx?raw";
import Slider from "../examples/Slider";
import SliderCode from "../examples/Slider.tsx?raw";
import Switch from "../examples/Switch";
import SwitchCode from "../examples/Switch.tsx?raw";
import Tabs from "../examples/Tabs";
import TabsCode from "../examples/Tabs.tsx?raw";
import ThemeProvider from "../examples/ThemeProvider";
import ThemeProviderCode from "../examples/ThemeProvider.tsx?raw";
import Toast from "../examples/Toast";
import ToastCode from "../examples/Toast.tsx?raw";
import ToggleGroup from "../examples/ToggleGroup";
import ToggleGroupCode from "../examples/ToggleGroup.tsx?raw";
import Tooltip from "../examples/Tooltip";
import TooltipCode from "../examples/Tooltip.tsx?raw";

export interface DocEntry {
  slug: string;
  name: string;
  group: "Actions" | "Inputs" | "Navigation" | "Overlays" | "Data & display" | "Theming";
  /** One sentence for the page intro, meta description and nav search. */
  summary: string;
  /** Components whose props tables appear on the page, in order. */
  props: string[];
  example: ComponentType;
  code: string;
  a11y: string[];
  mobile: string[];
  /** Radix primitive docs, when the component wraps one. */
  radix?: string;
}

const radix = (name: string) => `https://www.radix-ui.com/primitives/docs/components/${name}`;

export const docs: DocEntry[] = [
  {
    slug: "button",
    name: "Button",
    group: "Actions",
    summary: "Raised, outline, ghost and danger buttons with icons, a loading state and asChild for links.",
    props: ["Button"],
    example: Button,
    code: ButtonCode,
    a11y: [
      "Renders a real <button type=\"button\"> unless you pass type or asChild.",
      "loading sets aria-busy and aria-disabled but keeps the button focusable, so screen-reader users don't lose their place.",
      "Use asChild with an <a> for navigation, so the element keeps link semantics."
    ],
    mobile: ["Minimum height is 44px at every size, including sm.", "Presses scale down slightly for touch feedback, without a 300ms tap delay."]
  },
  {
    slug: "icon-button",
    name: "IconButton",
    group: "Actions",
    summary: "A 44px circular button for a single icon, with a required accessible name.",
    props: ["IconButton"],
    example: IconButton,
    code: IconButtonCode,
    a11y: ["aria-label is required by the type: an icon-only button without a name fails to compile.", "Icons inside are decorative (aria-hidden) by default."],
    mobile: ["Always at least 44 × 44px; the lg size is 52px."]
  },
  {
    slug: "field",
    name: "Field, Input & Textarea",
    group: "Inputs",
    summary: "Labelled text inputs with descriptions and errors wired up for screen readers.",
    props: ["Field", "Input", "Textarea", "Label"],
    example: Field,
    code: FieldCode,
    a11y: [
      "Field links the label with htmlFor and joins description and error into aria-describedby.",
      "error sets aria-invalid on the control and announces the message with role=\"alert\".",
      "required adds aria-required and a visual asterisk that screen readers skip."
    ],
    mobile: ["Inputs use a 16px font so iOS doesn't zoom in on focus.", "48px tall fields."]
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    group: "Inputs",
    summary: "Checkbox with an optional label row and an indeterminate (mixed) state.",
    props: ["Checkbox"],
    example: Checkbox,
    code: CheckboxCode,
    radix: radix("checkbox"),
    a11y: ["Space toggles; checked=\"indeterminate\" is announced as mixed.", "With label, clicking the text toggles the box."],
    mobile: ["The whole label row is a 44px touch target; the box itself has an invisible 44px hit area."]
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    group: "Inputs",
    summary: "Single choice from a short list, with roving focus and labelled items.",
    props: ["RadioGroup", "RadioGroupItem"],
    example: RadioGroup,
    code: RadioGroupCode,
    radix: radix("radio-group"),
    a11y: ["Tab enters the group once; arrow keys move between options and Space selects.", "Give the group an aria-label or wrap it in a labelled fieldset."],
    mobile: ["Each option row is at least 44px tall.", "Set orientation=\"horizontal\" for a wrapping row."]
  },
  {
    slug: "switch",
    name: "Switch",
    group: "Inputs",
    summary: "On/off toggle whose thumb always stays inside the track, as a full-width labelled row.",
    props: ["Switch"],
    example: Switch,
    code: SwitchCode,
    radix: radix("switch"),
    a11y: ["role=\"switch\" with aria-checked; Space and Enter toggle.", "description becomes the switch's accessible description."],
    mobile: ["With label, the whole row toggles, so the target is far larger than the switch.", "Two sizes: 64 × 36px and 96 × 48px."]
  },
  {
    slug: "slider",
    name: "Slider",
    group: "Inputs",
    summary: "Single or range slider with a spoken value, optional − / + buttons and thumbs that stay inside the track.",
    props: ["Slider"],
    example: Slider,
    code: SliderCode,
    radix: radix("slider"),
    a11y: [
      "Each thumb is a labelled role=\"slider\"; formatValue sets aria-valuetext (\"62 percent\").",
      "Arrows ±step, Page Up/Down ±10 steps, Home/End jump to min/max.",
      "Range sliders name each thumb with thumbLabels."
    ],
    mobile: ["The 32px thumb has a 44px invisible touch area.", "Horizontal drags move the slider; vertical swipes still scroll the page.", "Steppers disable themselves at min and max."]
  },
  {
    slug: "number-stepper",
    name: "NumberStepper",
    group: "Inputs",
    summary: "A spinbutton with − / + buttons, typing, clamping and a spoken unit.",
    props: ["NumberStepper"],
    example: NumberStepper,
    code: NumberStepperCode,
    a11y: ["A real role=\"spinbutton\" with aria-valuenow, min and max; suffix is spoken via aria-valuetext.", "Arrows ±step, Page Up/Down ±10 steps, Home/End; the buttons are skipped in tab order."],
    mobile: ["Opens the numeric keypad (inputMode=\"numeric\").", "44px buttons that disable at the limits."]
  },
  {
    slug: "select",
    name: "Select",
    group: "Inputs",
    summary: "Accessible dropdown select with grouped, disabled and checked items.",
    props: ["Select", "SelectTrigger", "SelectItem", "SelectContent"],
    example: Select,
    code: SelectCode,
    radix: radix("select"),
    a11y: ["Follows the select-only combobox pattern: arrows move, typeahead jumps, Enter picks, Escape closes.", "Wrap the trigger in Field to label it."],
    mobile: ["48px trigger and 44px options; the list stays within the screen with 8px of padding."]
  },
  {
    slug: "combobox",
    name: "Combobox",
    group: "Inputs",
    summary: "Searchable select: type to filter options, pick with Enter, with an empty state.",
    props: ["Combobox"],
    example: Combobox,
    code: ComboboxCode,
    a11y: ["The trigger is a combobox button; the popup is a cmdk listbox with arrow navigation.", "Focus moves into the search field on open and returns to the trigger on close.", "keywords add extra search terms per option."],
    mobile: ["The list scrolls inside the popover (max half the screen height) without scrolling the page behind it."]
  },
  {
    slug: "date-picker",
    name: "DatePicker & Calendar",
    group: "Inputs",
    summary: "Date picker with a month grid, disabled days, localised formatting and keyboard navigation.",
    props: ["DatePicker", "Calendar"],
    example: DatePicker,
    code: DatePickerCode,
    a11y: ["The calendar is a labelled grid; arrows move by day and week, Enter picks.", "Focus lands on the selected day (or today) when it opens.", "Disabled days are announced and can't be picked."],
    mobile: ["44px day cells and navigation buttons."]
  },
  {
    slug: "toggle-group",
    name: "ToggleGroup",
    group: "Inputs",
    summary: "Segmented control for picking one or several options.",
    props: ["ToggleGroup", "ToggleGroupItem"],
    example: ToggleGroup,
    code: ToggleGroupCode,
    radix: radix("toggle-group"),
    a11y: ["type=\"single\" behaves like a radio group; type=\"multiple\" like toggle buttons.", "Give the group an aria-label."],
    mobile: ["block stretches items to the full width; long groups scroll sideways instead of overflowing."]
  },
  {
    slug: "tabs",
    name: "Tabs",
    group: "Navigation",
    summary: "Tabbed panels with arrow-key navigation.",
    props: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"],
    example: Tabs,
    code: TabsCode,
    radix: radix("tabs"),
    a11y: ["Tab list, tabs and panels are linked with ARIA; arrows move between tabs.", "Name the list with aria-label."],
    mobile: ["The tab list scrolls sideways when it doesn't fit; block makes tabs share the width equally."]
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    group: "Navigation",
    summary: "Where-am-I trail; the last item is the current page.",
    props: ["Breadcrumb"],
    example: Breadcrumb,
    code: BreadcrumbCode,
    a11y: ["A nav landmark named Breadcrumb with an ordered list; the last item has aria-current=\"page\".", "Separators are hidden from screen readers."],
    mobile: ["Links have 44px targets and the trail wraps onto more lines."]
  },
  {
    slug: "pagination",
    name: "Pagination",
    group: "Navigation",
    summary: "Page buttons with ellipses and previous/next.",
    props: ["Pagination"],
    example: Pagination,
    code: PaginationCode,
    a11y: ["A nav landmark named Pagination; the current page has aria-current=\"page\".", "Every button has a full name (\"Page 5\"); edge buttons disable at the ends."],
    mobile: ["44px buttons; siblingCount controls how many pages show around the current one."]
  },
  {
    slug: "dialog",
    name: "Dialog",
    group: "Overlays",
    summary: "Modal dialog that becomes a bottom sheet on phones.",
    props: ["DialogContent", "Dialog"],
    example: Dialog,
    code: DialogCode,
    radix: radix("dialog"),
    a11y: ["Focus is trapped inside and returns to the trigger on close; Escape closes.", "DialogTitle names it and DialogDescription describes it.", "The × button has a translatable label (closeLabel)."],
    mobile: ["Under 640px it slides up as a bottom sheet with a grab handle, and footer buttons stack full-width.", "Pass centered to keep the modal layout."]
  },
  {
    slug: "alert-dialog",
    name: "AlertDialog",
    group: "Overlays",
    summary: "Confirmation that must be answered, for destructive actions.",
    props: ["AlertDialogContent", "AlertDialogAction", "AlertDialogCancel"],
    example: AlertDialog,
    code: AlertDialogCode,
    radix: radix("alert-dialog"),
    a11y: ["role=\"alertdialog\"; clicking outside doesn't close it.", "Cancel gets focus first, so Enter never confirms by accident."],
    mobile: ["Bottom sheet under 640px with full-width, 52px buttons."]
  },
  {
    slug: "popover",
    name: "Popover",
    group: "Overlays",
    summary: "Floating panel anchored to a trigger, for small forms and details.",
    props: ["PopoverContent"],
    example: Popover,
    code: PopoverCode,
    radix: radix("popover"),
    a11y: ["The trigger exposes aria-expanded; Escape closes and focus returns.", "Give the content an aria-label when it has no heading."],
    mobile: ["Stays inside the screen with 8px of padding and flips sides when there's no room."]
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    group: "Overlays",
    summary: "Menu of actions with checkbox and radio items, as an action sheet on phones.",
    props: ["DropdownMenuContent", "DropdownMenuItem", "DropdownMenuCheckboxItem"],
    example: DropdownMenu,
    code: DropdownMenuCode,
    radix: radix("dropdown-menu"),
    a11y: ["Opens with Enter, Space or ↓; arrows and typeahead move between items.", "Checkbox and radio items announce their state; shortcuts are visual only."],
    mobile: ["Under 640px it becomes a bottom action sheet with 56px items (turn off with sheetOnMobile={false})."]
  },
  {
    slug: "tooltip",
    name: "Tooltip & InfoTip",
    group: "Overlays",
    summary: "Hover/focus hints, and a tap-to-open InfoTip for touch screens.",
    props: ["Tooltip", "InfoTip"],
    example: Tooltip,
    code: TooltipCode,
    radix: radix("tooltip"),
    a11y: ["Tooltip shows on hover and keyboard focus and describes its trigger.", "Never put the only label of a control in a tooltip."],
    mobile: ["Touch screens have no hover, so Tooltip won't appear there. Use InfoTip for anything people need to read on a phone."]
  },
  {
    slug: "toast",
    name: "Toast",
    group: "Overlays",
    summary: "Short notifications raised from anywhere with toast(), with actions and swipe to dismiss.",
    props: ["Toaster"],
    example: Toast,
    code: ToastCode,
    a11y: [
      "Toasts are announced politely (errors assertively) in a labelled region; F8 moves focus there.",
      "Actions need altText describing another way to do the same thing.",
      "Timers pause while the toast is hovered or focused."
    ],
    mobile: ["Swipe sideways to dismiss; the stack respects the iPhone home indicator area."]
  },
  {
    slug: "data-table",
    name: "DataTable",
    group: "Data & display",
    summary: "Sortable, searchable, selectable, paginated table that turns into cards on phones.",
    props: ["DataTable"],
    example: DataTable,
    code: DataTableCode,
    a11y: [
      "A captioned table; sortable headers are buttons and the header cells carry aria-sort.",
      "Row checkboxes are named after the row (getRowLabel); select-all is page-scoped and tri-state.",
      "Result counts are announced live after searching or paging.",
      "The scroll area is a focusable, labelled region so keyboard users can scroll wide tables."
    ],
    mobile: ["Under 640px rows become tap-to-select cards, and sort options become a row of chips.", "Force a layout with layout=\"table\" or layout=\"cards\"."]
  },
  {
    slug: "card",
    name: "Card",
    group: "Data & display",
    summary: "Raised or inset surface with header, title, description and footer.",
    props: ["Card", "CardTitle"],
    example: Card,
    code: CardCode,
    a11y: ["CardTitle takes a level so cards fit your page's heading outline (default h3)."],
    mobile: ["The footer wraps its buttons onto new lines on narrow screens."]
  },
  {
    slug: "badge",
    name: "Badge",
    group: "Data & display",
    summary: "Small status label in five tones, with an optional dot.",
    props: ["Badge"],
    example: Badge,
    code: BadgeCode,
    a11y: ["Every tone meets 4.5:1 contrast in both themes.", "The dot is decorative: the text always carries the meaning, never color alone."],
    mobile: []
  },
  {
    slug: "avatar",
    name: "Avatar",
    group: "Data & display",
    summary: "Profile image with an initials fallback, and overlapping groups.",
    props: ["Avatar"],
    example: Avatar,
    code: AvatarCode,
    radix: radix("avatar"),
    a11y: ["The image's alt text and the fallback's label both use name.", "AvatarGroup is a group; give it an aria-label."],
    mobile: []
  },
  {
    slug: "progress",
    name: "Progress",
    group: "Data & display",
    summary: "Determinate or indeterminate progress bar in four tones.",
    props: ["Progress"],
    example: Progress,
    code: ProgressCode,
    radix: radix("progress"),
    a11y: ["role=\"progressbar\" with a required label and aria-valuenow; value={null} means indeterminate.", "The animation stops when reduced motion is on."],
    mobile: []
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    group: "Data & display",
    summary: "Pulsing placeholders while content loads.",
    props: ["Skeleton"],
    example: Skeleton,
    code: SkeletonCode,
    a11y: ["Hidden from screen readers; mark the loading region with aria-busy and a label instead.", "The pulse stops when reduced motion is on."],
    mobile: []
  },
  {
    slug: "accordion",
    name: "Accordion",
    group: "Data & display",
    summary: "Expandable sections, one or many open at a time.",
    props: ["Accordion", "AccordionTrigger"],
    example: Accordion,
    code: AccordionCode,
    radix: radix("accordion"),
    a11y: ["Each trigger sits in a heading (level prop) and exposes aria-expanded; panels are labelled regions.", "Enter and Space toggle; arrows move between triggers."],
    mobile: ["56px trigger rows."]
  },
  {
    slug: "theme-provider",
    name: "ThemeProvider",
    group: "Theming",
    summary: "Light, night or system theme, and a porcelain or white surface, for the whole app or one section.",
    props: ["ThemeProvider"],
    example: ThemeProvider,
    code: ThemeProviderCode,
    a11y: [
      "Both themes and both surfaces meet WCAG AA text contrast; focus rings are dark blue in light and yellow in night.",
      "theme=\"system\" follows the operating system's dark mode.",
      "surface=\"white\" adds hairline edges so unchecked boxes, off switches and fields stay visible on white."
    ],
    mobile: ["Sets data-theme on <html> by default, so portalled sheets and menus pick up the theme too."]
  }
];

export const groups = ["Actions", "Inputs", "Navigation", "Overlays", "Data & display", "Theming"] as const;

export function findDoc(slug: string): DocEntry | undefined {
  return docs.find((d) => d.slug === slug);
}
