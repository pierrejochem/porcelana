import { Combobox, Field } from "@porcelana/ui";

const rooms = [
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen", keywords: ["cook"] },
  { value: "office", label: "Office" },
  { value: "terrace", label: "Terrace" },
  { value: "attic", label: "Attic", disabled: true }
];

export default function Example() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Field label="Room">
        <Combobox options={rooms} placeholder="Pick a room" searchPlaceholder="Search rooms" />
      </Field>
    </div>
  );
}
