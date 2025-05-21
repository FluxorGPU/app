import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function GPURentalsTable() {
  const gpuRentals: any[] = [] // Empty array to represent no rentals

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border/50 bg-background/30">
          <TableHead className="text-primary/80">GPU Model</TableHead>
          <TableHead className="text-primary/80">Cores</TableHead>
          <TableHead className="text-primary/80">Memory</TableHead>
          <TableHead className="text-primary/80">Performance</TableHead>
          <TableHead className="text-primary/80">Usage</TableHead>
          <TableHead className="text-primary/80">Hourly Rate</TableHead>
          <TableHead className="text-primary/80">Total Earnings</TableHead>
          <TableHead className="text-primary/80">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gpuRentals.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
                  <svg
                    className="w-full h-full text-primary/20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1" />
                    <rect x="6" y="6" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
                    <path d="M6 10H18" stroke="currentColor" strokeWidth="1" />
                    <path d="M10 6L10 18" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-1">No GPUs Rented Yet</p>
                <p className="text-sm">Visit the Marketplace to start renting GPUs</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          gpuRentals.map((gpu) => <TableRow key={gpu.name}>{/* GPU rental row content */}</TableRow>)
        )}
      </TableBody>
    </Table>
  )
}
