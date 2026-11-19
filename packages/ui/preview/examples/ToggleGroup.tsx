import { ToggleGroup, ToggleGroupItem } from "@porcelana/ui";

export default function Example() {
  return (
    <ToggleGroup type="single" defaultValue="week" aria-label="Range">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  );
}
