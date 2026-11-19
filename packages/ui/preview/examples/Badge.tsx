import { Badge } from "@porcelana/ui";

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <Badge>Neutral</Badge>
      <Badge tone="primary">New</Badge>
      <Badge tone="success" dot>
        Online
      </Badge>
      <Badge tone="warning" dot>
        Syncing
      </Badge>
      <Badge tone="danger" dot>
        Offline
      </Badge>
    </div>
  );
}
