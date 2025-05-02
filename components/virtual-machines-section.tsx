"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VMCreateDialog } from "@/components/vm-create-dialog"
import { VMCard } from "@/components/vm-card"
import { Server, Plus, Activity, Cpu, MemoryStickIcon as Memory, RefreshCw } from "lucide-react"
import { MonitoringChart } from "@/components/monitoring-chart"
import { SpinningLogo } from "@/components/spinning-logo"

// Generate a random internal IP
const generateInternalIp = () => {
  return `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

// Get zone based on region
const getZoneForRegion = (region: string) => {
  const regionPrefix = region.split(" ")[0]
  const zones = {
    "us-central1": ["us-central1-a", "us-central1-b", "us-central1-c"],
    "us-east1": ["us-east1-b", "us-east1-c", "us-east1-d"],
    "us-west1": ["us-west1-a", "us-west1-b", "us-west1-c"],
    "europe-west1": ["europe-west1-b", "europe-west1-c", "europe-west1-d"],
    "europe-west4": ["europe-west4-a", "europe-west4-b", "europe-west4-c"],
    "asia-east1": ["asia-east1-a", "asia-east1-b", "asia-east1-c"],
    "asia-southeast1": ["asia-southeast1-a", "asia-southeast1-b", "asia-southeast1-c"],
  }

  const availableZones = zones[regionPrefix as keyof typeof zones] || ["zone-a", "zone-b", "zone-c"]
  return availableZones[Math.floor(Math.random() * availableZones.length)]
}

// Sample VM for demonstration
const sampleVM = {
  id: "vm-1",
  name: "dev-server-1",
  status: "Running",
  type: "e2-standard-2",
  cpu: 2,
  ram: "8 GB",
  storage: 100,
  os: "Ubuntu 22.04 LTS",
  region: "us-central1 (Iowa)",
  zone: "us-central1-a",
  ip: "34.68.105.237",
  internalIp: "10.128.0.2",
  uptime: "2d 5h 37m",
  cost: 0.05,
}

export function VirtualMachinesSection() {
  const [activeTab, setActiveTab] = useState("vm-instances")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingVM, setEditingVM] = useState<any>(null)
  const [vms, setVms] = useState<any[]>([])
  const [monitoringData, setMonitoringData] = useState({
    cpu: [] as any[],
    memory: [] as any[],
    network: [] as any[],
    disk: [] as any[],
  })
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [monitoringInterval, setMonitoringIntervalState] = useState<NodeJS.Timeout | null>(null)

  // Generate initial monitoring data
  useEffect(() => {
    if (vms.length > 0 && activeTab === "monitoring") {
      generateInitialMonitoringData()
      startMonitoring()
    }

    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
      }
    }
  }, [vms.length, activeTab])

  const generateInitialMonitoringData = () => {
    const times = Array.from({ length: 10 }, (_, i) => {
      const date = new Date()
      date.setMinutes(date.getMinutes() - (9 - i))
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    })

    const cpuData = times.map((time) => ({
      time,
      value: Math.floor(Math.random() * 40) + 10, // 10-50% CPU usage
    }))

    const memoryData = times.map((time) => ({
      time,
      value: Math.floor(Math.random() * 30) + 20, // 20-50% memory usage
    }))

    const networkData = times.map((time) => ({
      time,
      value: Math.floor(Math.random() * 100) + 50, // 50-150 KB/s
    }))

    const diskData = times.map((time) => ({
      time,
      value: Math.floor(Math.random() * 20) + 5, // 5-25 IOPS
    }))

    setMonitoringData({
      cpu: cpuData,
      memory: memoryData,
      network: networkData,
      disk: diskData,
    })
  }

  const startMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval)
    }

    setIsMonitoring(true)
    const interval = setInterval(() => {
      updateMonitoringData()
    }, 5000) // Update every 5 seconds

    setMonitoringIntervalState(interval)
  }

  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval)
      setMonitoringIntervalState(null)
    }
    setIsMonitoring(false)
  }

  const updateMonitoringData = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    setMonitoringData((prev) => {
      // Helper function to update a specific metric
      const updateMetric = (data: any[], maxChange: number, minValue: number, maxValue: number) => {
        const newData = [...data.slice(1)]
        const lastValue = data[data.length - 1].value
        let newValue = lastValue + (Math.random() * maxChange * 2 - maxChange)

        // Keep within bounds
        newValue = Math.max(minValue, Math.min(maxValue, newValue))

        newData.push({ time: now, value: Math.round(newValue) })
        return newData
      }

      return {
        cpu: updateMetric(prev.cpu, 10, 5, 95), // CPU: 5-95%, max change ±10%
        memory: updateMetric(prev.memory, 5, 10, 90), // Memory: 10-90%, max change ±5%
        network: updateMetric(prev.network, 30, 10, 500), // Network: 10-500 KB/s, max change ±30 KB/s
        disk: updateMetric(prev.disk, 8, 0, 100), // Disk: 0-100 IOPS, max change ±8 IOPS
      }
    })
  }

  const handleCreateVM = (newVM: any) => {
    // Add zone and internal IP
    const zone = getZoneForRegion(newVM.region)
    const internalIp = generateInternalIp()

    setVms([
      ...vms,
      {
        ...newVM,
        id: `vm-${vms.length + 1}`,
        status: "Provisioning",
        uptime: "0d 0h 0m",
        zone,
        internalIp,
      },
    ])
    setIsCreateDialogOpen(false)

    // Simulate VM provisioning
    setTimeout(() => {
      setVms((currentVms) =>
        currentVms.map((vm) => {
          if (vm.id === `vm-${vms.length + 1}`) {
            return {
              ...vm,
              status: "Running",
            }
          }
          return vm
        }),
      )
    }, 3000)
  }

  const handleEditVM = (updatedVM: any) => {
    setVms(
      vms.map((vm) => {
        if (vm.id === updatedVM.id) {
          return {
            ...vm,
            ...updatedVM,
          }
        }
        return vm
      }),
    )
    setIsEditDialogOpen(false)
    setEditingVM(null)
  }

  const handleVMAction = (id: string, action: "start" | "stop" | "restart" | "delete" | "edit" | "ssh") => {
    if (action === "delete") {
      setVms(vms.filter((vm) => vm.id !== id))
      return
    }

    if (action === "edit") {
      const vmToEdit = vms.find((vm) => vm.id === id)
      if (vmToEdit) {
        setEditingVM(vmToEdit)
        setIsEditDialogOpen(true)
      }
      return
    }

    if (action === "ssh") {
      const vm = vms.find((vm) => vm.id === id)
      if (vm) {
        // Open SSH terminal in a new window
        const sshUrl = `/ssh-terminal?name=${encodeURIComponent(vm.name)}&ip=${encodeURIComponent(vm.ip)}&username=fluxor`
        window.open(sshUrl, `ssh-${vm.id}`, "width=800,height=600")
      }
      return
    }

    setVms(
      vms.map((vm) => {
        if (vm.id === id) {
          let newStatus = vm.status
          let newUptime = vm.uptime

          if (action === "start") {
            newStatus = "Running"
            newUptime = "0d 0h 1m"
          } else if (action === "stop") {
            newStatus = "Stopped"
          } else if (action === "restart") {
            newStatus = "Restarting"

            // Simulate restart process
            setTimeout(() => {
              setVms((currentVms) =>
                currentVms.map((currentVm) => {
                  if (currentVm.id === id) {
                    return {
                      ...currentVm,
                      status: "Running",
                    }
                  }
                  return currentVm
                }),
              )
            }, 5000)
          }

          return {
            ...vm,
            status: newStatus,
            uptime: newUptime,
          }
        }
        return vm
      }),
    )
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingVM(null)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "monitoring" && vms.length > 0) {
      generateInitialMonitoringData()
      startMonitoring()
    } else {
      stopMonitoring()
    }
  }

  // Add a sample VM if none exist
  useEffect(() => {
    if (vms.length === 0) {
      setVms([sampleVM])
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">VM Instances</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your Virtual Machines</p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-yellow-400 hover:bg-yellow-500 text-black tech-glow cursor-pointer"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Instance
        </Button>
      </div>

      <div className="w-full">
        {/* Completely redesigned tab navigation using native HTML elements for maximum clickability */}
        <div className="flex border-b border-yellow-400/30 mb-6">
          <div
            onClick={() => handleTabChange("vm-instances")}
            className={`relative z-10 px-6 py-3 text-base font-medium cursor-pointer select-none ${
              activeTab === "vm-instances"
                ? "text-yellow-500 border-b-2 border-yellow-500"
                : "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10"
            }`}
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              VM Instances
            </div>
          </div>
          <div
            onClick={() => handleTabChange("monitoring")}
            className={`relative z-10 px-6 py-3 text-base font-medium cursor-pointer select-none ${
              activeTab === "monitoring"
                ? "text-yellow-500 border-b-2 border-yellow-500"
                : "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10"
            }`}
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitoring
            </div>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "vm-instances" && (
            <>
              {vms.length === 0 ? (
                <Card className="tech-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Server className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No VM Instances</h3>
                    <p className="text-muted-foreground">You haven't created any virtual machine instances yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {vms.map((vm) => (
                    <VMCard key={vm.id} vm={vm} onAction={handleVMAction} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "monitoring" && (
            <>
              {vms.length === 0 ? (
                <Card className="tech-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Activity className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No VM Instances to Monitor</h3>
                    <p className="text-muted-foreground">Create a VM instance first to see monitoring data.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium flex items-center">
                      <Activity className="h-5 w-5 text-yellow-500 mr-2" />
                      Real-time Monitoring
                    </h3>
                    <div className="flex items-center gap-2">
                      {isMonitoring ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <SpinningLogo isSpinning={true} size={48} />
                          <span className="text-sm">Live Data</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                          <span className="text-sm">Paused</span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={isMonitoring ? stopMonitoring : startMonitoring}
                        className="border-yellow-400/20 hover:bg-yellow-400/10 cursor-pointer"
                        type="button"
                      >
                        {isMonitoring ? (
                          <>
                            <span className="mr-1">■</span> Stop
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" /> Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="tech-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Cpu className="h-4 w-4 text-yellow-500 mr-2" />
                          CPU Usage
                        </CardTitle>
                        <CardDescription>Percentage of CPU utilization</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MonitoringChart data={monitoringData.cpu} dataKey="value" yAxisLabel="%" color="#FFAB00" />
                        <div className="mt-2 flex justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">Current:</span>{" "}
                            <span className="font-medium text-yellow-500">
                              {monitoringData.cpu.length > 0
                                ? monitoringData.cpu[monitoringData.cpu.length - 1].value
                                : 0}
                              %
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg:</span>{" "}
                            <span className="font-medium">
                              {monitoringData.cpu.length > 0
                                ? Math.round(
                                    monitoringData.cpu.reduce((sum, item) => sum + item.value, 0) /
                                      monitoringData.cpu.length,
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="tech-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Memory className="h-4 w-4 text-yellow-500 mr-2" />
                          Memory Usage
                        </CardTitle>
                        <CardDescription>Percentage of memory utilization</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MonitoringChart data={monitoringData.memory} dataKey="value" yAxisLabel="%" color="#FFAB00" />
                        <div className="mt-2 flex justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">Current:</span>{" "}
                            <span className="font-medium text-yellow-500">
                              {monitoringData.memory.length > 0
                                ? monitoringData.memory[monitoringData.memory.length - 1].value
                                : 0}
                              %
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg:</span>{" "}
                            <span className="font-medium">
                              {monitoringData.memory.length > 0
                                ? Math.round(
                                    monitoringData.memory.reduce((sum, item) => sum + item.value, 0) /
                                      monitoringData.memory.length,
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <VMCreateDialog isOpen={isCreateDialogOpen} onClose={closeCreateDialog} onCreate={handleCreateVM} />

      {editingVM && (
        <VMCreateDialog
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          onCreate={handleEditVM}
          initialValues={editingVM}
          isEditing={true}
        />
      )}
    </div>
  )
}
