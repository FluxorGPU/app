"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PaymentPopup } from "@/components/payment-popup"
import { Search, Cpu, Check } from "lucide-react"

const gpus = [
  {
    name: "NVIDIA RTX 5090",
    series: "50 Series",
    cores: 18432,
    memory: "48 GB GDDR7",
    performance: "0 TFLOPS",
    price: 3.5,
  },
  {
    name: "NVIDIA RTX 5080",
    series: "50 Series",
    cores: 14592,
    memory: "32 GB GDDR7",
    performance: "0 TFLOPS",
    price: 3,
  },
  {
    name: "NVIDIA RTX 5070",
    series: "50 Series",
    cores: 10240,
    memory: "24 GB GDDR7",
    performance: "0 TFLOPS",
    price: 2.5,
  },
  {
    name: "NVIDIA RTX 5060",
    series: "50 Series",
    cores: 7168,
    memory: "16 GB GDDR7",
    performance: "0 TFLOPS",
    price: 2,
  },
  {
    name: "NVIDIA RTX 4090",
    series: "40 Series",
    cores: 16384,
    memory: "24 GB GDDR6X",
    performance: "0 TFLOPS",
    price: 2.5,
  },
  {
    name: "NVIDIA RTX 4080",
    series: "40 Series",
    cores: 9728,
    memory: "16 GB GDDR6X",
    performance: "0 TFLOPS",
    price: 2,
  },
  {
    name: "NVIDIA RTX 4070",
    series: "40 Series",
    cores: 5888,
    memory: "12 GB GDDR6X",
    performance: "0 TFLOPS",
    price: 1.5,
  },
  {
    name: "NVIDIA RTX 4060",
    series: "40 Series",
    cores: 3072,
    memory: "8 GB GDDR6",
    performance: "0 TFLOPS",
    price: 1,
  },
  {
    name: "NVIDIA RTX 3090",
    series: "30 Series",
    cores: 10496,
    memory: "24 GB GDDR6X",
    performance: "0 TFLOPS",
    price: 1.5,
  },
  {
    name: "NVIDIA RTX 3080",
    series: "30 Series",
    cores: 8704,
    memory: "10 GB GDDR6X",
    performance: "0 TFLOPS",
    price: 1,
  },
  {
    name: "NVIDIA RTX 3070",
    series: "30 Series",
    cores: 5888,
    memory: "8 GB GDDR6",
    performance: "0 TFLOPS",
    price: 0.6,
  },
  {
    name: "NVIDIA RTX 3060",
    series: "30 Series",
    cores: 3584,
    memory: "12 GB GDDR6",
    performance: "0 TFLOPS",
    price: 0.4,
  },
  {
    name: "AMD RX 7900 XTX",
    series: "RX 7000",
    cores: 12288,
    memory: "24 GB GDDR6",
    performance: "0 TFLOPS",
    price: 2.5,
  },
  {
    name: "AMD RX 7800 XT",
    series: "RX 7000",
    cores: 7680,
    memory: "16 GB GDDR6",
    performance: "0 TFLOPS",
    price: 1.5,
  },
  {
    name: "AMD RX 7700 XT",
    series: "RX 7000",
    cores: 5376,
    memory: "12 GB GDDR6",
    performance: "0 TFLOPS",
    price: 1,
  },
  {
    name: "AMD RX 7600",
    series: "RX 7000",
    cores: 2048,
    memory: "8 GB GDDR6",
    performance: "0 TFLOPS",
    price: 0.6,
  },
  {
    name: "AMD RX 6900 XT",
    series: "RX 6000",
    cores: 5120,
    memory: "16 GB GDDR6",
    performance: "0 TFLOPS",
    price: 1,
  },
  {
    name: "AMD RX 6800 XT",
    series: "RX 6000",
    cores: 4608,
    memory: "16 GB GDDR6",
    performance: "0 TFLOPS",
    price: 0.6,
  },
  {
    name: "AMD RX 6700 XT",
    series: "RX 6000",
    cores: 2560,
    memory: "12 GB GDDR6",
    performance: "0 TFLOPS",
    price: 0.4,
  },
  {
    name: "AMD RX 6600 XT",
    series: "RX 6000",
    cores: 2048,
    memory: "8 GB GDDR6",
    performance: "0 TFLOPS",
    price: 0.4,
  },
]

const subscriptionPlans = {
  basic: {
    name: "Basic",
    description: "For individuals and small projects",
    monthlyPrice: 150,
    yearlyPrice: 1500,
    credits: 150,
    features: ["150 compute credits", "5 parallel processes", "Basic analytics", "Email support"],
    popular: false,
  },
  pro: {
    name: "Pro",
    description: "For professional developers and small teams",
    monthlyPrice: 800,
    yearlyPrice: 8000,
    credits: 1000,
    features: [
      "1000 compute credits",
      "20 parallel processes",
      "Advanced analytics",
      "Priority support",
      "Enhanced API limits",
      "API access",
      "Custom integrations",
    ],
    popular: true,
  },
  enterprise: {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    monthlyPrice: null,
    yearlyPrice: null,
    credits: null,
    features: [
      "Custom compute credits",
      "Unlimited parallel processes",
      "Real-time analytics dashboard",
      "24/7 dedicated support",
      "Priority task scheduling",
      "API access",
      "SLA guarantees",
      "Custom development",
    ],
    popular: false,
  },
}

export function MarketplaceSection() {
  const [selectedSeries, setSelectedSeries] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false)
  const [selectedGPU, setSelectedGPU] = useState<(typeof gpus)[0] | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
  const [tabValue, setTabValue] = useState("yearly")

  // Handle tab change
  const handleTabChange = (value: "monthly" | "yearly") => {
    setTabValue(value)
    setBillingCycle(value)
  }

  const filteredGPUs = gpus.filter((gpu) => {
    const matchesSeries = selectedSeries === "all" || gpu.series.toLowerCase() === selectedSeries.toLowerCase()
    const matchesSearch =
      gpu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpu.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpu.performance.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeries && matchesSearch
  })

  const handleRentNow = (gpu: (typeof gpus)[0]) => {
    setSelectedGPU(gpu)
    setIsPaymentPopupOpen(true)
  }

  const handleSeriesChange = (value: string) => {
    setSelectedSeries(value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClosePaymentPopup = () => {
    setIsPaymentPopupOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500 mb-2">
            Choose Your Subscription Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your computational needs. All plans include access to our high-performance
            GPU marketplace.
          </p>

          <div className="flex justify-center mt-6">
            <div className="bg-background/50 p-1 rounded-md border border-border flex">
              <button
                onClick={() => handleTabChange("monthly")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors relative z-50 cursor-pointer ${
                  tabValue === "monthly" ? "bg-yellow-400 text-black" : "hover:bg-yellow-400/10 text-muted-foreground"
                }`}
                type="button"
              >
                Monthly
              </button>
              <button
                onClick={() => handleTabChange("yearly")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors relative z-50 cursor-pointer ${
                  tabValue === "yearly" ? "bg-yellow-400 text-black" : "hover:bg-yellow-400/10 text-muted-foreground"
                }`}
                type="button"
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(subscriptionPlans).map(([key, plan]) => (
            <div
  key={key}
  className={`border rounded-lg pt-8 p-6 relative flex flex-col justify-between ${
    plan.popular
      ? "border-yellow-400/50 tech-card bg-gradient-to-br from-background to-yellow-950/10 shadow-lg shadow-yellow-500/5"
      : "border-border tech-card"
  }`}
>
              {plan.popular && (
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold z-10">
    Most Popular
  </div>
)}
              <div className="text-xl font-bold mb-1">{plan.name}</div>
              <div className="text-sm text-muted-foreground mb-4">{plan.description}</div>

              {plan.monthlyPrice !== null ? (
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-yellow-500">
                      ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-muted-foreground ml-1">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  <div className="text-sm font-medium mt-1">{plan.credits} compute credits</div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="text-2xl font-bold">Contact Us</div>
                  <div className="text-sm font-medium mt-1">Custom compute credits</div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  plan.name === "Enterprise"
                    ? "bg-background hover:bg-background/80 border border-yellow-400/50"
                    : "bg-yellow-400 hover:bg-yellow-500 text-black"
                } tech-glow cursor-pointer`}
              >
                {plan.name === "Enterprise" ? "Contact Us" : "Subscribe Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center">
          <Cpu className="mr-2 h-8 w-8 text-yellow-500" />
          GPU Marketplace
        </h2>
        <div className="flex space-x-2">
          <Select value={selectedSeries} onValueChange={handleSeriesChange}>
            <SelectTrigger className="w-[180px] tech-card border-yellow-400/20 cursor-pointer">
              <SelectValue placeholder="Filter by series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Series
              </SelectItem>
              <SelectItem value="50 Series" className="cursor-pointer">
                NVIDIA 50 Series
              </SelectItem>
              <SelectItem value="40 Series" className="cursor-pointer">
                NVIDIA 40 Series
              </SelectItem>
              <SelectItem value="30 Series" className="cursor-pointer">
                NVIDIA 30 Series
              </SelectItem>
              <SelectItem value="RX 7000" className="cursor-pointer">
                AMD RX 7000
              </SelectItem>
              <SelectItem value="RX 6000" className="cursor-pointer">
                AMD RX 6000
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search GPUs"
              className="w-[200px] pl-9 tech-card border-yellow-400/20 cursor-text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <div className="border border-yellow-400/20 rounded-lg tech-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 bg-background/30 hover:bg-transparent">
              <TableHead className="text-yellow-500/80 w-[250px]">GPU Model</TableHead>
              <TableHead className="text-yellow-500/80">Cores</TableHead>
              <TableHead className="text-yellow-500/80">Memory</TableHead>
              <TableHead className="text-yellow-500/80">Performance</TableHead>
              <TableHead className="text-yellow-500/80">Credits</TableHead>
              <TableHead className="text-yellow-500/80 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGPUs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No GPUs found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredGPUs.map((gpu) => (
                <TableRow key={gpu.name} className="hover:bg-yellow-400/5 transition-colors">
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium text-foreground">{gpu.name}</div>
                      <div className="text-sm text-muted-foreground">{gpu.series}</div>
                    </div>
                  </TableCell>
                  <TableCell>{gpu.cores.toLocaleString()}</TableCell>
                  <TableCell>{gpu.memory}</TableCell>
                  <TableCell>
                    <span className="text-yellow-500">{gpu.performance}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{gpu.price} credits/hr</div>
                      <div className="text-sm text-muted-foreground">{gpu.price * 24} credits/day</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black tech-glow cursor-pointer"
                      onClick={() => handleRentNow(gpu)}
                    >
                      Rent Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {selectedGPU && (
        <PaymentPopup isOpen={isPaymentPopupOpen} onClose={handleClosePaymentPopup} gpuName={selectedGPU.name} />
      )}
    </div>
  )
}
