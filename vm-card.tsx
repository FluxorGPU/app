"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Server,
  MoreVertical,
  Play,
  Square,
  RefreshCw,
  Trash2,
  Terminal,
  HardDrive,
  Cpu,
  MemoryStickIcon as Memory,
  Globe,
  Clock,
  Edit,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SpinningLogo } from "@/components/spinning-logo"

interface VMCardProps {
  vm: {
    id: string
    name: string
    status: string
    type: string
    cpu: number | string
    ram: string | number
    storage: number
    os: string
    region: string
    zone: string
    ip: string
    internalIp: string
    uptime: string
    cost: number
  }
  onAction: (id: string, action: "start" | "stop" | "restart" | "delete" | "edit" | "ssh") => void
}

export function VMCard({ vm, onAction }: VMCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isRunning = vm.status.toLowerCase() === "running"

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return "bg-green-500"
      case "stopped":
        return "bg-red-500"
      case "provisioning":
        return "bg-yellow-500"
      case "restarting":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleAction = (action: "start" | "stop" | "restart" | "delete" | "edit" | "ssh") => {
    onAction(vm.id, action)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Card className={`tech-card transition-all duration-300 ${isExpanded ? "border-yellow-400/30" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {isRunning ? (
              <SpinningLogo isSpinning={true} size={48} className="text-yellow-500" />
            ) : (
              <Server className="h-10 w-10 text-yellow-500" />
            )}
            <CardTitle>{vm.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 border-yellow-400/20">
              <div className={`h-2 w-2 rounded-full ${getStatusColor(vm.status)}`}></div>
              {vm.status}
            </Badge>
            <div className="relative z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-yellow-400/10 cursor-pointer relative z-20"
                    type="button"
                  >
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-30">
                  {vm.status.toLowerCase() !== "running" && (
                    <DropdownMenuItem
                      onClick={() => handleAction("start")}
                      className="cursor-pointer hover:bg-yellow-400/10"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </DropdownMenuItem>
                  )}
                  {vm.status.toLowerCase() === "running" && (
                    <DropdownMenuItem
                      onClick={() => handleAction("stop")}
                      className="cursor-pointer hover:bg-yellow-400/10"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleAction("restart")}
                    className="cursor-pointer hover:bg-yellow-400/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("ssh")}
                    className="cursor-pointer hover:bg-yellow-400/10"
                  >
                    <Terminal className="h-4 w-4 mr-2" />
                    SSH Connect
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("edit")}
                    className="cursor-pointer hover:bg-yellow-400/10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("delete")}
                    className="cursor-pointer hover:bg-yellow-400/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">CPU:</span>
            <span>{vm.cpu} vCPUs</span>
          </div>
          <div className="flex items-center gap-2">
            <Memory className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">RAM:</span>
            <span>{typeof vm.ram === "number" ? `${vm.ram} GB` : vm.ram}</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Storage:</span>
            <span>{vm.storage} GB</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Region:</span>
            <span>{vm.region}</span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">OS:</span>
              <span>{vm.os}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Uptime:</span>
              <span>{vm.uptime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Zone:</span>
              <span>{vm.zone}</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">External IP:</span>
              <span className="font-mono">{vm.ip}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1 hover:bg-yellow-400/10 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(vm.ip)}
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                <path d="M2 12h20"></path>
                <path d="M12 2v20"></path>
              </svg>
              <span className="text-muted-foreground">Internal IP:</span>
              <span className="font-mono">{vm.internalIp}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1 hover:bg-yellow-400/10 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(vm.internalIp)}
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground">Hourly Cost:</span>
              <span className="text-yellow-500 font-medium">${vm.cost.toFixed(2)}/hr</span>
              <span className="text-muted-foreground text-xs">(${(vm.cost * 24 * 30).toFixed(2)}/mo est.)</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-yellow-500 hover:bg-yellow-400/10 cursor-pointer !important"
          onClick={toggleExpand}
          type="button"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
        {isRunning && (
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-400/20 hover:bg-yellow-400/10 text-yellow-500 cursor-pointer !important"
            onClick={() => handleAction("ssh")}
            type="button"
          >
            <Terminal className="h-4 w-4 mr-2" />
            SSH Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
