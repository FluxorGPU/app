"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Terminal, X } from "lucide-react"

interface SSHTerminalProps {
  isOpen: boolean
  onClose: () => void
  vmName: string
  ipAddress: string
  username?: string
}

export function SSHTerminal({ isOpen, onClose, vmName, ipAddress, username = "fluxor" }: SSHTerminalProps) {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTerminalOutput([])
      setIsConnecting(true)
      setIsConnected(false)
      setInputValue("")

      // Simulate connection process
      setTerminalOutput((prev) => [...prev, `Connecting to ${ipAddress}...`])

      const timeout1 = setTimeout(() => {
        setTerminalOutput((prev) => [...prev, `SSH connection established to ${vmName} (${ipAddress})`])
      }, 500)

      const timeout2 = setTimeout(() => {
        setTerminalOutput((prev) => [...prev, `Authenticating as ${username}...`])
      }, 1000)

      const timeout3 = setTimeout(() => {
        setTerminalOutput((prev) => [
          ...prev,
          "Authentication successful",
          `Welcome to ${vmName}`,
          "Last login: " + new Date().toLocaleString(),
          "",
        ])
        setIsConnecting(false)
        setIsConnected(true)
      }, 2000)

      return () => {
        clearTimeout(timeout1)
        clearTimeout(timeout2)
        clearTimeout(timeout3)
      }
    }
  }, [isOpen, ipAddress, vmName, username])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add command to terminal output
    setTerminalOutput((prev) => [...prev, `${username}@${vmName}:~$ ${inputValue}`])

    // Process command (just some mock responses)
    const command = inputValue.trim().toLowerCase()
    setTimeout(() => {
      if (command === "ls") {
        setTerminalOutput((prev) => [...prev, "app  config  data  logs  scripts  .bashrc  README.md"])
      } else if (command === "pwd") {
        setTerminalOutput((prev) => [...prev, `/home/${username}`])
      } else if (command === "whoami") {
        setTerminalOutput((prev) => [...prev, username])
      } else if (command === "date") {
        setTerminalOutput((prev) => [...prev, new Date().toString()])
      } else if (command === "uptime") {
        setTerminalOutput((prev) => [...prev, "up 2 days, 5 hours, 37 minutes"])
      } else if (command === "clear") {
        setTerminalOutput([])
      } else if (command === "exit") {
        setTerminalOutput((prev) => [...prev, "Connection closed.", ""])
        setTimeout(onClose, 500)
      } else {
        setTerminalOutput((prev) => [...prev, `Command not found: ${inputValue}`])
      }
      setInputValue("")
    }, 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] tech-card border-yellow-400/20 bg-background/95 backdrop-blur-md p-0 overflow-hidden">
        <DialogHeader className="bg-yellow-500 text-black p-2 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Terminal className="h-4 w-4" />
            <span>
              SSH: {username}@{vmName} ({ipAddress})
            </span>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-black hover:bg-yellow-600/50">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-4 font-mono text-sm bg-black/90 text-green-500 h-[400px] overflow-y-auto flex flex-col">
          <div className="flex-grow">
            {terminalOutput.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line || "\u00A0"}
              </div>
            ))}
          </div>

          {isConnected && (
            <form onSubmit={handleInputSubmit} className="flex items-center mt-2">
              <span className="mr-2">
                {username}@{vmName}:~$
              </span>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="flex-grow bg-transparent border-none outline-none text-green-500"
                autoFocus
              />
            </form>
          )}

          {isConnecting && (
            <div className="flex items-center">
              <span className="animate-pulse">▋</span>
            </div>
          )}
        </div>

        <div className="p-2 bg-gray-900 text-xs text-gray-400">
          <p>Type 'exit' to close the connection. Try commands like: ls, pwd, whoami, date, uptime, clear</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
