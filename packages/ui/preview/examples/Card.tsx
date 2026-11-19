import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@porcelana/ui";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      <Card>
        <CardHeader>
          <CardTitle>Weekday alarm</CardTitle>
          <CardDescription>06:00 · Mon–Fri</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="soft">Edit</Button>
        </CardFooter>
      </Card>
      <Card inset>
        <CardHeader>
          <CardTitle>Inset card</CardTitle>
          <CardDescription>Recessed into the surface, for grouped settings.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
