import { AlarmIcon, BellIcon, SunIcon, MoonIcon, TrashIcon } from "@porcelana/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Combobox,
  DataTable,
  DatePicker,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  IconButton,
  InfoTip,
  Input,
  NumberStepper,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  toast,
  type ColumnDef
} from "../src";

interface Device {
  id: string;
  name: string;
  room: string;
  battery: number;
  status: "Online" | "Syncing" | "Offline";
}

const devices: Device[] = [
  { id: "d1", name: "Bedside dial", room: "Bedroom", battery: 86, status: "Online" },
  { id: "d2", name: "Kitchen puck", room: "Kitchen", battery: 54, status: "Syncing" },
  { id: "d3", name: "Hall panel", room: "Hallway", battery: 100, status: "Online" },
  { id: "d4", name: "Kids lamp", room: "Kids room", battery: 12, status: "Offline" },
  { id: "d5", name: "Desk pebble", room: "Office", battery: 71, status: "Online" },
  { id: "d6", name: "Garden chime", room: "Terrace", battery: 39, status: "Online" }
];

const tone = { Online: "success", Syncing: "warning", Offline: "danger" } as const;

const columns: ColumnDef<Device, unknown>[] = [
  { accessorKey: "name", header: "Device" },
  { accessorKey: "room", header: "Room" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (c) => (
      <Badge tone={tone[c.getValue<Device["status"]>()]} dot>
        {c.getValue<string>()}
      </Badge>
    )
  },
  { accessorKey: "battery", header: "Battery", cell: (c) => `${c.getValue<number>()}%` }
];

const section: React.CSSProperties = { display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" };

export function Gallery({ base }: { base: string }) {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 44px)" }}>Porcelana UI</h1>
          <p style={{ margin: 0, maxWidth: 680, color: "var(--pl-text-muted)", lineHeight: 1.5, fontSize: 17 }}>
            Accessible, mobile-ready React components on Radix UI primitives. Try every control below, with touch,
            keyboard or a screen reader. Switch between the porcelain and white surfaces at the top. Each one has its own{" "}
            <a href={`${base}components/button/`} style={{ color: "var(--pl-primary-text)" }}>docs page</a> with props and examples.
          </p>
        </header>

        <section style={section} aria-label="Controls">
          <Card>
            <CardHeader>
              <CardTitle level={2}>Buttons</CardTitle>
              <CardDescription>Raised, outline, ghost and danger.</CardDescription>
            </CardHeader>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button onClick={() => toast({ title: "Alarm saved", description: "06:00 · weekdays", action: { label: "Undo", altText: "Undo save", onClick: () => {} } })}>
                Save
              </Button>
              <Button variant="soft" startIcon={<AlarmIcon size={18} />}>
                Snooze
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button loading>Saving</Button>
              <Tooltip content="Ring at sunrise">
                <IconButton aria-label="Sunrise alarm">
                  <SunIcon size={20} />
                </IconButton>
              </Tooltip>
              <InfoTip label="About snooze">Snooze repeats every 9 minutes.</InfoTip>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle level={2}>Switches &amp; choices</CardTitle>
            </CardHeader>
            <Switch label="Alarm" description="Weekdays at 06:00" defaultChecked />
            <Switch label="Gradual wake light" size="lg" />
            <Checkbox label="Send me the morning briefing" defaultChecked />
            <RadioGroup aria-label="Wake-up time" defaultValue="06:00" orientation="horizontal">
              <RadioGroupItem value="05:30" label="05:30" />
              <RadioGroupItem value="06:00" label="06:00" />
              <RadioGroupItem value="07:15" label="07:15" />
            </RadioGroup>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle level={2}>Slider, stepper, progress</CardTitle>
            </CardHeader>
            <Slider label="Volume" defaultValue={[0]} showValue showSteppers stepperStep={5} formatValue={(v) => `${v}%`} />
            <Slider label="Quiet hours" defaultValue={[22, 100]} thumbLabels={["Start", "End"]} showValue />
            <NumberStepper label="Snooze" defaultValue={9} min={1} max={30} suffix="min" />
            <Progress label="Sync" value={72} />
            <Progress label="Battery" value={38} tone="warning" />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle level={2}>Segmented &amp; tabs</CardTitle>
            </CardHeader>
            <ToggleGroup type="single" defaultValue="week" aria-label="Range" block>
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
            <Tabs defaultValue="alarm">
              <TabsList aria-label="Schedule">
                <TabsTrigger value="alarm">Alarm</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
              </TabsList>
              <TabsContent value="alarm">Next alarm at 06:00.</TabsContent>
              <TabsContent value="timer">No timers running.</TabsContent>
              <TabsContent value="sleep">7 h 30 min average.</TabsContent>
            </Tabs>
            <Accordion type="single" collapsible defaultValue="a">
              <AccordionItem value="a">
                <AccordionTrigger>Repeat on weekdays</AccordionTrigger>
                <AccordionContent>Mon–Fri at 06:00. Weekends stay quiet.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle level={2}>Forms</CardTitle>
            </CardHeader>
            <Field label="Alarm label" description="Shown on the lock screen">
              <Input defaultValue="Morning run" />
            </Field>
            <Field label="Notify email" error="Enter a complete email address">
              <Input defaultValue="pierre@" />
            </Field>
            <Field label="Room">
              <Combobox
                options={[
                  { value: "bedroom", label: "Bedroom" },
                  { value: "kitchen", label: "Kitchen" },
                  { value: "office", label: "Office" }
                ]}
                defaultValue="bedroom"
              />
            </Field>
            <Field label="Sound">
              <Select defaultValue="chime">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birds">Birdsong</SelectItem>
                  <SelectItem value="chime">Morning chime</SelectItem>
                  <SelectItem value="bells">Soft bells</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Start date">
              <DatePicker defaultValue={new Date(2026, 10, 23)} />
            </Field>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle level={2}>Overlays &amp; people</CardTitle>
            </CardHeader>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="danger" startIcon={<TrashIcon size={18} />}>
                    Delete alarm…
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete this alarm?</AlertDialogTitle>
                  <AlertDialogDescription>The 06:00 weekday alarm will be removed from every device.</AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="danger" onClick={() => toast({ title: "Alarm deleted", tone: "danger" })}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="soft">Options</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem icon={<BellIcon size={18} />}>Edit alarm</DropdownMenuItem>
                  <DropdownMenuItem icon={<MoonIcon size={18} />}>Bedtime</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem danger>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AvatarGroup aria-label="Shared with">
                <Avatar name="Pierre Jochem" color="#f6c519" style={{ color: "#3a2d00" }} />
                <Avatar name="Ana Maria" color="#b8066f" />
                <Avatar name="Lena Kraus" color="#1d7a64" />
              </AvatarGroup>
              <Badge tone="warning">3 sharing</Badge>
              <Badge tone="success" dot>
                Synced
              </Badge>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }} aria-busy="true">
              <Skeleton circle height={44} />
              <div style={{ flex: 1, display: "grid", gap: 8 }}>
                <Skeleton width="70%" />
                <Skeleton width="45%" />
              </div>
            </div>
          </Card>
        </section>

        <DataTable
          data={devices}
          columns={columns}
          caption="Alarm devices"
          selectable
          searchable
          searchLabel="Search devices"
          pageSize={5}
          getRowId={(d) => d.id}
          getRowLabel={(d) => d.name}
        />
      </div>
  );
}
