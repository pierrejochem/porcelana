import { Button } from "@porcelana/ui";
import { AlarmIcon, TrashIcon } from "@porcelana/icons";

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button>Save</Button>
      <Button variant="soft" startIcon={<AlarmIcon size={18} />}>
        Snooze
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger" startIcon={<TrashIcon size={18} />}>
        Delete
      </Button>
      <Button loading>Saving</Button>
      <Button asChild variant="outline">
        <a href="#props">Link styled as a button</a>
      </Button>
    </div>
  );
}
