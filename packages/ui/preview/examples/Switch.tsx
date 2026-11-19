import { Switch } from "@porcelana/ui";

export default function Example() {
  return (
    <div style={{ display: "grid", maxWidth: 420 }}>
      <Switch label="Alarm" description="Weekdays at 06:00" defaultChecked />
      <Switch label="Gradual wake light" size="lg" />
      <Switch aria-label="Standalone switch" />
    </div>
  );
}
