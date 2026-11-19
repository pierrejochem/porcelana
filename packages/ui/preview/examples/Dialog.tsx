import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger, Field, Input } from "@porcelana/ui";

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit alarm</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit alarm</DialogTitle>
        <DialogDescription>Changes apply to every device.</DialogDescription>
        <Field label="Label">
          <Input defaultValue="Morning run" />
        </Field>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
