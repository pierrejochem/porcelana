import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button
} from "@porcelana/ui";

export default function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Delete alarm…</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete this alarm?</AlertDialogTitle>
        <AlertDialogDescription>The 06:00 weekday alarm will be removed from every device.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="danger">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
