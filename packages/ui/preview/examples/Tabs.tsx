import { Tabs, TabsContent, TabsList, TabsTrigger } from "@porcelana/ui";

export default function Example() {
  return (
    <Tabs defaultValue="alarm">
      <TabsList aria-label="Schedule">
        <TabsTrigger value="alarm">Alarm</TabsTrigger>
        <TabsTrigger value="timer">Timer</TabsTrigger>
        <TabsTrigger value="sleep">Sleep</TabsTrigger>
      </TabsList>
      <TabsContent value="alarm">Next alarm at 06:00.</TabsContent>
      <TabsContent value="timer">No timers running.</TabsContent>
      <TabsContent value="sleep">7 h 30 min average this week.</TabsContent>
    </Tabs>
  );
}
