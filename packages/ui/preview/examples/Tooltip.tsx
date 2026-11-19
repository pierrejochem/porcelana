import { IconButton, InfoTip, Tooltip } from "@porcelana/ui";
import { SunIcon } from "@porcelana/icons";

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Tooltip content="Ring at sunrise">
        <IconButton aria-label="Sunrise alarm">
          <SunIcon size={20} />
        </IconButton>
      </Tooltip>
      <span>Snooze length</span>
      <InfoTip label="About snooze">Snooze repeats the alarm every 9 minutes until you turn it off.</InfoTip>
    </div>
  );
}
