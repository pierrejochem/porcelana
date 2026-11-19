import { Progress } from "@porcelana/ui";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Progress label="Sync" value={72} />
      <Progress label="Battery" value={38} tone="warning" />
      <Progress label="Firmware update" value={null} />
    </div>
  );
}
