import { NumberStepper } from "@porcelana/ui";

export default function Example() {
  return <NumberStepper label="Snooze" defaultValue={9} min={1} max={30} suffix="min" />;
}
