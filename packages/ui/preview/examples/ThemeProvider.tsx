import { useState } from "react";
import { Card, CardDescription, CardTitle, Slider, Switch, ThemeProvider, ToggleGroup, ToggleGroupItem, type SurfaceName } from "@porcelana/ui";

export default function Example() {
  const [night, setNight] = useState(false);
  const [surface, setSurface] = useState<SurfaceName>("white");
  return (
    <ThemeProvider
      theme={night ? "night" : "light"}
      surface={surface}
      global={false}
      style={{ padding: 20, borderRadius: 28 }}
    >
      <Card>
        <CardTitle>
          {night ? "Night" : "Light"} theme · {surface} surface
        </CardTitle>
        <CardDescription>Only this box changes, because global is false. The white surface applies to the light theme.</CardDescription>
        <ToggleGroup type="single" aria-label="Surface" value={surface} onValueChange={(v) => v && setSurface(v as SurfaceName)}>
          <ToggleGroupItem value="porcelain">Porcelain</ToggleGroupItem>
          <ToggleGroupItem value="white">White</ToggleGroupItem>
        </ToggleGroup>
        <Switch label="Night theme" checked={night} onCheckedChange={setNight} />
        <Slider label="Volume" defaultValue={[62]} showValue formatValue={(v) => `${v}%`} />
      </Card>
    </ThemeProvider>
  );
}
