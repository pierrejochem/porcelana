import { Breadcrumb } from "@porcelana/ui";

export default function Example() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#" },
        { label: "Alarms", href: "#" },
        { label: "New alarm" }
      ]}
    />
  );
}
