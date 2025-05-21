import { Card } from "@/components/ui/card"
import { MetricsCard } from "@/components/metrics-card"
import { GPURentalsTable } from "@/components/gpu-rentals-table"
import { PerformanceTrendline } from "@/components/performance-trendline"
import { Activity, TrendingUp, Cpu, Server } from "lucide-react"

export function DashboardSection() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricsCard
          title="Total Computing Power"
          value="0"
          unit="TFLOPS"
          change={{ value: "+0", percentage: "+0%", isPositive: true }}
        />
        <MetricsCard
          title="Active GPUs"
          value="0"
          unit="/ 12"
          change={{ value: "+0", percentage: "+0%", isPositive: true }}
        />
        <MetricsCard
          title="Uptime"
          value="0"
          unit="%"
          change={{ value: "+0.0%", percentage: "", isPositive: true }}
        />
      </div>
      <Card className="mt-6 p-6 tech-card relative">
        {/* Graph lines background */}
        <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
          linear-gradient(to right, rgba(255, 204, 0, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 204, 0, 0.2) 1px, transparent 1px)
        `,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
        <div className="mb-4 flex items-center justify-between relative z-20">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" />
            Performance Analytics
          </h2>
        </div>
        <div className="relative z-20">
          <PerformanceTrendline />
        </div>
      </Card>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="tech-card p-6">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <Cpu className="h-5 w-5 text-yellow-500 mr-2" />
            GPU Utilization
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">RTX 5090</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "92%" }}></div>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">RTX 5080</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "87%" }}></div>
                </div>
                <span className="text-sm font-medium">87%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">RTX 4090</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "78%" }}></div>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">RTX 4080</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">AMD RX 7900 XTX</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "82%" }}></div>
                </div>
                <span className="text-sm font-medium">82%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="tech-card p-6">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <Server className="h-5 w-5 text-yellow-500 mr-2" />
            System Health
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Temperature</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">62°C</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Power Consumption</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">1.2 kW</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Network</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">4.5 Gbps</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                    style={{ width: "58%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">2.3 TB / 4 TB</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Memory</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                    style={{ width: "72%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">115 GB / 160 GB</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 text-yellow-500 mr-2" />
          Your GPU Rentals
        </h2>
        <div className="rounded-lg border tech-card">
          <GPURentalsTable />
        </div>
      </div>
      <div className="h-10"></div> {/* Bottom padding for scrolling */}
    </>
  )
}
