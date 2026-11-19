import { Skeleton } from "@porcelana/ui";

export default function Example() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading alarms" style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 420 }}>
      <Skeleton circle height={44} />
      <div style={{ flex: 1, display: "grid", gap: 8 }}>
        <Skeleton width="70%" />
        <Skeleton width="45%" />
      </div>
    </div>
  );
}
