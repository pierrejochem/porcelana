import { Field, Input, Textarea } from "@porcelana/ui";
import { SearchIcon } from "@porcelana/icons";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Field label="Alarm label" description="Shown on the lock screen" required>
        <Input defaultValue="Morning run" />
      </Field>
      <Field label="Notify email" error="Enter a complete email address">
        <Input type="email" defaultValue="pierre@" />
      </Field>
      <Field label="Note">
        <Textarea placeholder="Anything to remember at 06:00?" />
      </Field>
      <Input aria-label="Search" placeholder="Search" icon={<SearchIcon size={18} />} />
    </div>
  );
}
