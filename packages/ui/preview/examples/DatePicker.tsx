import { Calendar, DatePicker, Field } from "@porcelana/ui";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ maxWidth: 360 }}>
        <Field label="Start date">
          <DatePicker disabledDays={{ dayOfWeek: [0, 6] }} placeholder="Pick a weekday" />
        </Field>
      </div>
      <Calendar mode="single" />
    </div>
  );
}
