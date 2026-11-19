import { Button, Field, Input, Popover, PopoverContent, PopoverTrigger } from "@porcelana/ui";

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="soft">Rename</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Rename alarm">
        <Field label="Alarm label">
          <Input defaultValue="Gym" />
        </Field>
      </PopoverContent>
    </Popover>
  );
}
