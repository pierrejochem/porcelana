import { IconButton } from "@porcelana/ui";
import { PlusIcon, BellIcon, MoreIcon } from "@porcelana/icons";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <IconButton aria-label="Add alarm" variant="primary">
        <PlusIcon size={20} />
      </IconButton>
      <IconButton aria-label="Notifications">
        <BellIcon size={20} />
      </IconButton>
      <IconButton aria-label="More options" variant="ghost">
        <MoreIcon size={20} strokeWidth={3} />
      </IconButton>
    </div>
  );
}
