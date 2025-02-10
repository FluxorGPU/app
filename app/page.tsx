"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DashboardSection } from "@/components/dashboard-section"
import { PerformanceSection } from "@/components/performance-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { MyGPUsSection } from "@/components/my-gpus-section"
import { SettingsSection } from "@/components/settings-section"
import { BarChart3, Globe, Home, LayoutDashboard, LogIn, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

type Section = "dashboard" | "performance" | "marketplace" | "my-gpus" | "settings"

export default function Page() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const router = useRouter()

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
      case "settings":
        return <SettingsSection />
      default:
        return <DashboardSection />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-[280px] border-r bg-background/50 backdrop-blur flex flex-col">
        <div className="flex h-20 items-center gap-3 border-b px-6">
          <Image
            src="https://sidedfjmghseyjjblsry.supabase.co/storage/v1/object/public/media//fluxor.png"
            alt="Fluxor Logo"
            width={32}
            height={32}
          />
          <span className="text-2xl font-bold">Fluxor</span>
        </div>
        <nav className="space-y-2 px-2 py-4 flex-grow">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${activeSection === "dashboard" ? "bg-white text-black" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${activeSection === "performance" ? "bg-white text-black" : ""}`}
            onClick={() => setActiveSection("performance")}
          >
            <BarChart3 className="h-4 w-4" />
            Performance
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${activeSection === "marketplace" ? "bg-white text-black" : ""}`}
            onClick={() => setActiveSection("marketplace")}
          >
            <Globe className="h-4 w-4" />
            Marketplace
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${activeSection === "my-gpus" ? "bg-white text-black" : ""}`}
            onClick={() => setActiveSection("my-gpus")}
          >
            <Home className="h-4 w-4" />
            My GPUs
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${activeSection === "settings" ? "bg-white text-black" : ""}`}
            onClick={() => setActiveSection("settings")}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
            <div className="text-sm text-muted-foreground">Manage your Fluxor account and preferences</div>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => router.push("/settings")}>
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>
        {renderSection()}
      </main>
    </div>
  )
}

