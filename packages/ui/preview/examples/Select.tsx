import { Field, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@porcelana/ui";

export default function Example() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Field label="Sound">
        <Select defaultValue="chime">
          <SelectTrigger>
            <SelectValue placeholder="Choose a sound" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birds">Birdsong</SelectItem>
            <SelectItem value="chime">Morning chime</SelectItem>
            <SelectItem value="bells">Soft bells</SelectItem>
            <SelectItem value="radio" disabled>
              Radio (offline)
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
