import { RadioGroup, RadioGroupItem } from "@porcelana/ui";

export default function Example() {
  return (
    <RadioGroup aria-label="Wake-up time" defaultValue="06:00">
      <RadioGroupItem value="05:30" label="05:30" />
      <RadioGroupItem value="06:00" label="06:00" />
      <RadioGroupItem value="07:15" label="07:15" />
    </RadioGroup>
  );
}
