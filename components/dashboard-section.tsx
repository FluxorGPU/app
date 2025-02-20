import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricsCard } from "@/components/metrics-card"
import { GPURentalsTable } from "@/components/gpu-rentals-table"

export function DashboardSection() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <MetricsCard
          title="Total Computing Power"
          value="0"
          unit="TFLOPS"
          change={{ value: "N/A", percentage: "N/A", isPositive: true }}
        />
        <MetricsCard
          title="Active GPUs"
          value="0"
          unit="/ 0"
          change={{ value: "N/A", percentage: "N/A", isPositive: true }}
        />
      </div>
      <Card className="mt-6 p-6 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Performance History</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              Daily
            </Button>
            <Button size="sm" variant="ghost">
              Weekly
            </Button>
            <Button size="sm" variant="ghost">
              Monthly
            </Button>
            <Button size="sm" variant="ghost">
              Yearly
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No performance data available yet.
        </div>
      </Card>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Your GPU Rentals</h2>
        <div className="rounded-lg border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <GPURentalsTable />
        </div>
      </div>
    </>
  )
}

