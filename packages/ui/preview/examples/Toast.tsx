import { Button, toast } from "@porcelana/ui";

// Mount <Toaster /> once near the root of your app (this site already does).

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button
        onClick={() =>
          toast({
            title: "Alarm saved",
            description: "06:00 · weekdays",
            action: { label: "Undo", altText: "Undo saving the alarm", onClick: () => {} }
          })
        }
      >
        Show toast
      </Button>
      <Button variant="danger" onClick={() => toast({ title: "Sync failed", tone: "danger" })}>
        Error toast
      </Button>
    </div>
  );
}
