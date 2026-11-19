import { Badge, DataTable, type ColumnDef } from "@porcelana/ui";

interface Device {
  id: string;
  name: string;
  room: string;
  battery: number;
  status: "Online" | "Offline";
}

const devices: Device[] = [
  { id: "d1", name: "Bedside dial", room: "Bedroom", battery: 86, status: "Online" },
  { id: "d2", name: "Kitchen puck", room: "Kitchen", battery: 54, status: "Online" },
  { id: "d3", name: "Hall panel", room: "Hallway", battery: 100, status: "Online" },
  { id: "d4", name: "Kids lamp", room: "Kids room", battery: 12, status: "Offline" },
  { id: "d5", name: "Desk pebble", room: "Office", battery: 71, status: "Online" },
  { id: "d6", name: "Garden chime", room: "Terrace", battery: 39, status: "Offline" }
];

const columns: ColumnDef<Device, unknown>[] = [
  { accessorKey: "name", header: "Device" },
  { accessorKey: "room", header: "Room" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (c) => (
      <Badge tone={c.getValue() === "Online" ? "success" : "danger"} dot>
        {c.getValue<string>()}
      </Badge>
    )
  },
  { accessorKey: "battery", header: "Battery", cell: (c) => `${c.getValue<number>()}%` }
];

export default function Example() {
  return (
    <DataTable
      data={devices}
      columns={columns}
      caption="Alarm devices"
      selectable
      searchable
      searchLabel="Search devices"
      pageSize={4}
      getRowId={(d) => d.id}
      getRowLabel={(d) => d.name}
    />
  );
}
