import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { GPURentalsTable } from "@/components/gpu-rentals-table"

export function DashboardSection() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <MetricsCard
          title="Total Computing Power"
          value="98.62"
          unit="TFLOPS"
          change={{ value: "+2.5 TFLOPS", percentage: "+2.6%", isPositive: true }}
        />
        <MetricsCard
          title="Active GPUs"
          value="2"
          unit="/ 3"
          change={{ value: "-1", percentage: "-33.3%", isPositive: false }}
        />
      </div>
      <Card className="mt-6 p-6">
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
        <StatsChart />
      </Card>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Your GPU Rentals</h2>
        <GPURentalsTable />
      </div>
    </>
  )
}

