"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, Server } from "lucide-react"

interface VMCreateDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (vm: any) => void
  initialValues?: any
  isEditing?: boolean
}

// OS options
const osOptions = [
  { id: "debian-11", name: "Debian GNU/Linux 11 (bullseye)" },
  { id: "debian-12", name: "Debian GNU/Linux 12 (bookworm)" },
  { id: "ubuntu-22-04", name: "Ubuntu 22.04 LTS" },
  { id: "ubuntu-20-04", name: "Ubuntu 20.04 LTS" },
  { id: "centos-stream-8", name: "CentOS Stream 8" },
  { id: "windows-server-2022", name: "Windows Server 2022" },
]

// Region options
const regionOptions = [
  { id: "us-central1", name: "us-central1 (Iowa)" },
  { id: "us-east1", name: "us-east1 (South Carolina)" },
  { id: "us-west1", name: "us-west1 (Oregon)" },
  { id: "europe-west1", name: "europe-west1 (Belgium)" },
  { id: "europe-west4", name: "europe-west4 (Netherlands)" },
  { id: "asia-east1", name: "asia-east1 (Taiwan)" },
  { id: "asia-southeast1", name: "asia-southeast1 (Singapore)" },
]

// Zone options by region
const zoneOptionsByRegion: Record<string, { id: string; name: string }[]> = {
  "us-central1": [
    { id: "us-central1-a", name: "us-central1-a" },
    { id: "us-central1-b", name: "us-central1-b" },
    { id: "us-central1-c", name: "us-central1-c" },
  ],
  "us-east1": [
    { id: "us-east1-b", name: "us-east1-b" },
    { id: "us-east1-c", name: "us-east1-c" },
    { id: "us-east1-d", name: "us-east1-d" },
  ],
  "us-west1": [
    { id: "us-west1-a", name: "us-west1-a" },
    { id: "us-west1-b", name: "us-west1-b" },
    { id: "us-west1-c", name: "us-west1-c" },
  ],
  "europe-west1": [
    { id: "europe-west1-b", name: "europe-west1-b" },
    { id: "europe-west1-c", name: "europe-west1-c" },
    { id: "europe-west1-d", name: "europe-west1-d" },
  ],
  "europe-west4": [
    { id: "europe-west4-a", name: "europe-west4-a" },
    { id: "europe-west4-b", name: "europe-west4-b" },
    { id: "europe-west4-c", name: "europe-west4-c" },
  ],
  "asia-east1": [
    { id: "asia-east1-a", name: "asia-east1-a" },
    { id: "asia-east1-b", name: "asia-east1-b" },
    { id: "asia-east1-c", name: "asia-east1-c" },
  ],
  "asia-southeast1": [
    { id: "asia-southeast1-a", name: "asia-southeast1-a" },
    { id: "asia-southeast1-b", name: "asia-southeast1-b" },
    { id: "asia-southeast1-c", name: "asia-southeast1-c" },
  ],
}

export function VMCreateDialog({ isOpen, onClose, onCreate, initialValues, isEditing = false }: VMCreateDialogProps) {
  const [instanceName, setInstanceName] = useState(`instance-${Date.now().toString().slice(-6)}`)
  const [region, setRegion] = useState("us-central1")
  const [zone, setZone] = useState("")
  const [os, setOs] = useState("debian-12")
  const [availableZones, setAvailableZones] = useState<{ id: string; name: string }[]>([])

  // Initialize form with existing values if editing
  useEffect(() => {
    if (isEditing && initialValues) {
      setInstanceName(initialValues.name)

      // Find region ID from name
      const regionId = regionOptions.find((r) => r.name === initialValues.region)?.id || "us-central1"
      setRegion(regionId)

      // Set available zones based on region
      setAvailableZones(zoneOptionsByRegion[regionId] || [])

      // Find zone ID from name
      setZone(initialValues.zone || zoneOptionsByRegion[regionId]?.[0]?.id || "")

      // Find OS ID from name
      const osId = osOptions.find((o) => o.name === initialValues.os)?.id || "debian-12"
      setOs(osId)
    } else {
      // Set available zones based on default region
      setAvailableZones(zoneOptionsByRegion["us-central1"] || [])
      setZone(zoneOptionsByRegion["us-central1"]?.[0]?.id || "")
    }
  }, [isEditing, initialValues])

  const handleCreate = () => {
    const vmData = {
      name: instanceName,
      type: "e2-standard-2",
      cpu: 2,
      ram: "8 GB",
      storage: 100, // Default storage
      os: osOptions.find((o) => o.id === os)?.name || "",
      region: regionOptions.find((r) => r.id === region)?.name || "",
      zone: zone,
      ip:
        isEditing && initialValues
          ? initialValues.ip
          : `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      internalIp:
        isEditing && initialValues
          ? initialValues.internalIp
          : `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      cost: 0.05, // Default cost
    }

    // If editing, preserve the ID
    if (isEditing && initialValues) {
      vmData.id = initialValues.id
      vmData.status = initialValues.status
      vmData.uptime = initialValues.uptime
    }

    onCreate(vmData)

    // Reset form
    if (!isEditing) {
      setInstanceName(`instance-${Date.now().toString().slice(-6)}`)
      setRegion("us-central1")
      setZone(zoneOptionsByRegion["us-central1"]?.[0]?.id || "")
      setOs("debian-12")
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstanceName(e.target.value)
  }

  const handleRegionChange = (value: string) => {
    setRegion(value)
    // Update available zones based on selected region
    setAvailableZones(zoneOptionsByRegion[value] || [])
    // Set default zone for the selected region
    setZone(zoneOptionsByRegion[value]?.[0]?.id || "")
  }

  const handleZoneChange = (value: string) => {
    setZone(value)
  }

  const handleOsChange = (value: string) => {
    setOs(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] tech-card border-primary/20 bg-background/90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-500">
            <Server className="h-5 w-5" />
            <span>{isEditing ? "Edit VM Instance" : "Create a VM Instance"}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify your virtual machine instance."
              : "Configure and deploy a new virtual machine instance."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Machine configuration</h3>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="instance-name" className="flex items-center">
                  Name <span className="text-red-500 ml-1">*</span>
                  <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                </Label>
                <Input
                  id="instance-name"
                  value={instanceName}
                  onChange={handleNameChange}
                  className="tech-card cursor-text"
                  disabled={isEditing} // Can't change name when editing
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center">
                    Region <span className="text-red-500 ml-1">*</span>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                  </Label>
                  <Select value={region} onValueChange={handleRegionChange} disabled={isEditing}>
                    <SelectTrigger id="region" className="tech-card cursor-pointer">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id} className="cursor-pointer">
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Region is permanent</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone" className="flex items-center">
                    Zone <span className="text-red-500 ml-1">*</span>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                  </Label>
                  <Select value={zone} onValueChange={handleZoneChange} disabled={isEditing}>
                    <SelectTrigger id="zone" className="tech-card cursor-pointer">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableZones.map((option) => (
                        <SelectItem key={option.id} value={option.id} className="cursor-pointer">
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Zone is permanent</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Boot disk</h3>

            <div className="space-y-2">
              <Label htmlFor="os">Operating System</Label>
              <Select value={os} onValueChange={handleOsChange}>
                <SelectTrigger id="os" className="tech-card cursor-pointer">
                  <SelectValue placeholder="Select operating system" />
                </SelectTrigger>
                <SelectContent>
                  {osOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="cursor-pointer">
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black tech-glow cursor-pointer"
            onClick={handleCreate}
          >
            {isEditing ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
