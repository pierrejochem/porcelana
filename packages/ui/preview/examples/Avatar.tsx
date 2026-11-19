import { Avatar, AvatarGroup } from "@porcelana/ui";

export default function Example() {
  return (
    <AvatarGroup aria-label="Shared with">
      <Avatar name="Pierre Jochem" color="#f6c519" style={{ color: "#3a2d00" }} />
      <Avatar name="Ana Maria" color="#b8066f" />
      <Avatar name="Lena Kraus" color="#1d7a64" />
    </AvatarGroup>
  );
}
