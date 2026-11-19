import { useState } from "react";
import { Checkbox } from "@porcelana/ui";

export default function Example() {
  const [days, setDays] = useState({ mon: true, sat: false });
  const all = days.mon && days.sat ? true : days.mon || days.sat ? "indeterminate" : false;
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <Checkbox
        label="Every day"
        checked={all}
        onCheckedChange={(v) => setDays({ mon: v === true, sat: v === true })}
      />
      <Checkbox label="Monday" checked={days.mon} onCheckedChange={(v) => setDays({ ...days, mon: v === true })} />
      <Checkbox label="Saturday" checked={days.sat} onCheckedChange={(v) => setDays({ ...days, sat: v === true })} />
    </div>
  );
}
