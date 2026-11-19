import { useState } from "react";
import { Card, CardDescription, CardTitle, Switch, ThemeProvider } from "@porcelana/ui";

export default function Example() {
  const [night, setNight] = useState(true);
  return (
    <ThemeProvider theme={night ? "night" : "light"} global={false} style={{ padding: 20, borderRadius: 28 }}>
      <Card>
        <CardTitle>{night ? "Night" : "Light"} theme</CardTitle>
        <CardDescription>Only this box switches, because global is false.</CardDescription>
        <Switch label="Night theme" checked={night} onCheckedChange={setNight} />
      </Card>
    </ThemeProvider>
  );
}
