import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@porcelana/ui";
import { EditIcon, CopyIcon } from "@porcelana/icons";

export default function Example() {
  const [snooze, setSnooze] = useState(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="soft">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Alarm</DropdownMenuLabel>
        <DropdownMenuItem icon={<EditIcon size={18} />} shortcut="⌘E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem icon={<CopyIcon size={18} />}>Duplicate</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={snooze} onCheckedChange={setSnooze}>
          Snooze enabled
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem danger>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
