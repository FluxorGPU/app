"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DashboardSection } from "@/components/dashboard-section"
import { PerformanceSection } from "@/components/performance-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { MyGPUsSection } from "@/components/my-gpus-section"
import { SettingsSection } from "@/components/settings-section"
import { VirtualMachinesSection } from "@/components/virtual-machines-section"
import { ThemeToggle } from "@/components/theme-provider"
import { BarChart3, Globe, Home, LayoutDashboard, LogIn, Settings, User, Server } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

type Section = "dashboard" | "performance" | "marketplace" | "my-gpus" | "virtual-machines" | "settings"

export default function Page() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [logoUrl, setLogoUrl] = useState(
    "https://mrvxgfhnphezdjvqqvuz.supabase.co/storage/v1/object/public/media//fluxor-nobg.png",
  )

  // Initialize Supabase client only if credentials are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

  useEffect(() => {
    // Check if wallet is connected or username is stored in localStorage
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setIsLoggedIn(true)
      setUsername(storedUsername)
    }

    const checkWalletConnection = async () => {
      if ("solana" in window) {
        const provider = window.solana
        if (provider.isPhantom) {
          try {
            const response = await provider.connect({ onlyIfTrusted: true })
            setWalletConnected(true)
            setIsLoggedIn(true)
            setUsername(response.publicKey.toString().slice(0, 4) + "..." + response.publicKey.toString().slice(-4))
          } catch (err) {
            // User hasn't connected to the app before or has revoked permissions
          }
        }
      }
    }

    checkWalletConnection()

    // Try to fetch the latest logo from Supabase - only if we want to override the default
    const fetchLatestLogo = async () => {
      if (!supabase) {
        console.warn("Supabase client not initialized. Using default logo.")
        return
      }

      try {
        const { data, error } = await supabase.storage.from("media").list("logos", {
          limit: 1,
          sortBy: { column: "created_at", order: "desc" },
        })

        if (error) {
          console.error("Error fetching logo:", error)
          return
        }

        if (data && data.length > 0) {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(`logos/${data[0].name}`)
          setLogoUrl(urlData.publicUrl)
        }
      } catch (error) {
        console.error("Error fetching logo:", error)
      }
    }

    // Uncomment this if you want to use the latest uploaded logo instead of the specified one
    // if (supabase) {
    //   fetchLatestLogo()
    // }
  }, [supabaseUrl, supabaseKey])

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />
      case "performance":
        return <PerformanceSection />
      case "marketplace":
        return <MarketplaceSection />
      case "my-gpus":
        return <MyGPUsSection />
      case "virtual-machines":
        return <VirtualMachinesSection />
      case "settings":
        return <SettingsSection setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
      default:
        return <DashboardSection />
    }
  }

  const handleSectionChange = (section: Section) => {
    setActiveSection(section)
  }

  const shouldShowHeader = activeSection !== "virtual-machines"

  return (
    <div className="min-h-screen bg-background text-foreground tech-grid-bg">
      <div className="flex min-h-screen">
        <aside className="w-[280px] border-r bg-background/80 backdrop-blur-md flex flex-col z-10">
          <div className="flex h-20 items-center gap-3 border-b px-6 bg-gradient-to-r from-background via-background/90 to-background">
            <div className="relative w-16 h-16">
              <Image
                src={logoUrl || "/placeholder.svg"}
                alt="Fluxor Logo"
                width={64}
                height={64}
                className="relative z-10"
              />
              <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full"></div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500">
              Fluxor
            </span>
          </div>
          <nav className="space-y-2 px-2 py-4 flex-grow">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-300 cursor-pointer ${
                activeSection === "dashboard"
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 text-yellow-500 border-l-2 border-yellow-400"
                  : "hover:bg-background/60"
              }`}
              onClick={() => handleSectionChange("dashboard")}
            >
              <LayoutDashboard className={`h-4 w-4 ${activeSection === "dashboard" ? "text-yellow-500" : ""}`} />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-300 cursor-pointer ${
                activeSection === "performance"
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 text-yellow-500 border-l-2 border-yellow-400"
                  : "hover:bg-background/60"
              }`}
              onClick={() => handleSectionChange("performance")}
            >
              <BarChart3 className={`h-4 w-4 ${activeSection === "performance" ? "text-yellow-500" : ""}`} />
              Performance
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-300 cursor-pointer ${
                activeSection === "marketplace"
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 text-yellow-500 border-l-2 border-yellow-400"
                  : "hover:bg-background/60"
              }`}
              onClick={() => handleSectionChange("marketplace")}
            >
              <Globe className={`h-4 w-4 ${activeSection === "marketplace" ? "text-yellow-500" : ""}`} />
              Marketplace
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-300 cursor-pointer ${
                activeSection === "virtual-machines"
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 text-yellow-500 border-l-2 border-yellow-400"
                  : "hover:bg-background/60"
              }`}
              onClick={() => handleSectionChange("virtual-machines")}
            >
              <Server className={`h-4 w-4 ${activeSection === "virtual-machines" ? "text-yellow-500" : ""}`} />
              VM Instances
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-300 cursor-pointer ${
                activeSection === "my-gpus"
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 text-yellow-500 border-l-2 border-yellow-400"
                  : "hover:bg-background/60"
              }`}
              onClick={() => handleSectionChange("my-gpus")}
            >
              <Home className={`h-4 w-4 ${activeSection === "my-gpus" ? "text-yellow-500" : ""}`} />
              My GPUs
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-300 cursor-pointer ${
                activeSection === "settings"
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 text-yellow-500 border-l-2 border-yellow-400"
                  : "hover:bg-background/60"
              }`}
              onClick={() => handleSectionChange("settings")}
            >
              <Settings className={`h-4 w-4 ${activeSection === "settings" ? "text-yellow-500" : ""}`} />
              Settings
            </Button>
          </nav>
          <div className="p-4 text-xs text-muted-foreground border-t">
            <div className="flex items-center justify-between">
              <span>Fluxor v2.1.3</span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Online
              </span>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          {shouldShowHeader && (
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace("-", " ")}
                </h1>
                <div className="text-sm text-muted-foreground">Manage your Fluxor account and preferences</div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="outline"
                  className="gap-2 tech-glow border border-yellow-400/20 bg-background/50 backdrop-blur-sm cursor-pointer"
                  onClick={() => handleSectionChange("settings")}
                >
                  {isLoggedIn ? (
                    <>
                      <User className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-500">{username}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-500">Login</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
