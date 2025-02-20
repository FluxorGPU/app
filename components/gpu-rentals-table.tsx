import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function GPURentalsTable() {
  const gpuRentals: any[] = [] // Empty array to represent no rentals

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>GPU Model</TableHead>
          <TableHead>Cores</TableHead>
          <TableHead>Memory</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Hourly Rate</TableHead>
          <TableHead>Total Earnings</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gpuRentals.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              You haven't rented any GPUs yet. Visit the Marketplace to start renting!
            </TableCell>
          </TableRow>
        ) : (
          gpuRentals.map((gpu) => <TableRow key={gpu.name}>{/* GPU rental row content */}</TableRow>)
        )}
      </TableBody>
    </Table>
  )
}

