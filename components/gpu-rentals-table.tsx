import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"

const gpuRentals = [
  {
    name: "NVIDIA RTX 3090",
    cores: 10496,
    memory: "24 GB GDDR6X",
    performance: "35.58 TFLOPS",
    usage: "89%",
    hourlyRate: "$0.99",
    totalEarnings: "$1,267.54",
    status: "Active",
  },
  {
    name: "AMD Radeon RX 6900 XT",
    cores: 5120,
    memory: "16 GB GDDR6",
    performance: "23.04 TFLOPS",
    usage: "76%",
    hourlyRate: "$0.75",
    totalEarnings: "$987.25",
    status: "Active",
  },
  {
    name: "NVIDIA RTX A6000",
    cores: 10752,
    memory: "48 GB GDDR6",
    performance: "40.0 TFLOPS",
    usage: "95%",
    hourlyRate: "$1.50",
    totalEarnings: "$2,345.00",
    status: "Maintenance",
  },
]

export function GPURentalsTable() {
  return (
    <Table>
      <thead>
        <TableRow>
          <TableHead>GPU Model</TableHead>
          <TableHead>Cores</TableHead>
          <TableHead>Memory</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Hourly Rate</TableHead>
          <TableHead>Total Earnings</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </thead>
      <TableBody>
        {gpuRentals.map((gpu) => (
          <TableRow key={gpu.name}>
            <TableCell className="font-medium">{gpu.name}</TableCell>
            <TableCell>{gpu.cores}</TableCell>
            <TableCell>{gpu.memory}</TableCell>
            <TableCell>{gpu.performance}</TableCell>
            <TableCell>{gpu.usage}</TableCell>
            <TableCell>{gpu.hourlyRate}</TableCell>
            <TableCell>{gpu.totalEarnings}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  gpu.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {gpu.status}
              </span>
            </TableCell>
            <TableCell>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
