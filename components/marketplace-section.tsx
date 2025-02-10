"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const gpus = [
  {
    name: "NVIDIA RTX 5090",
    series: "50 Series",
    cores: 18432,
    memory: "48 GB GDDR7",
    performance: "85 TFLOPS",
    price: 2.5,
  },
  {
    name: "NVIDIA RTX 5080",
    series: "50 Series",
    cores: 14592,
    memory: "32 GB GDDR7",
    performance: "68 TFLOPS",
    price: 2.0,
  },
  {
    name: "NVIDIA RTX 5070",
    series: "50 Series",
    cores: 10240,
    memory: "24 GB GDDR7",
    performance: "52 TFLOPS",
    price: 1.5,
  },
  {
    name: "NVIDIA RTX 5060",
    series: "50 Series",
    cores: 7168,
    memory: "16 GB GDDR7",
    performance: "38 TFLOPS",
    price: 1.0,
  },
  {
    name: "NVIDIA RTX 4090",
    series: "40 Series",
    cores: 16384,
    memory: "24 GB GDDR6X",
    performance: "82.6 TFLOPS",
    price: 2.25,
  },
  {
    name: "NVIDIA RTX 4080",
    series: "40 Series",
    cores: 9728,
    memory: "16 GB GDDR6X",
    performance: "49 TFLOPS",
    price: 1.75,
  },
  {
    name: "NVIDIA RTX 4070",
    series: "40 Series",
    cores: 5888,
    memory: "12 GB GDDR6X",
    performance: "29 TFLOPS",
    price: 1.25,
  },
  {
    name: "NVIDIA RTX 4060",
    series: "40 Series",
    cores: 3072,
    memory: "8 GB GDDR6",
    performance: "15 TFLOPS",
    price: 0.75,
  },
  {
    name: "NVIDIA RTX 3090",
    series: "30 Series",
    cores: 10496,
    memory: "24 GB GDDR6X",
    performance: "35.6 TFLOPS",
    price: 1.6,
  },
  {
    name: "NVIDIA RTX 3080",
    series: "30 Series",
    cores: 8704,
    memory: "10 GB GDDR6X",
    performance: "29.8 TFLOPS",
    price: 1.35,
  },
  {
    name: "NVIDIA RTX 3070",
    series: "30 Series",
    cores: 5888,
    memory: "8 GB GDDR6",
    performance: "20.4 TFLOPS",
    price: 1.0,
  },
  {
    name: "NVIDIA RTX 3060",
    series: "30 Series",
    cores: 3584,
    memory: "12 GB GDDR6",
    performance: "12.7 TFLOPS",
    price: 0.6,
  },
  {
    name: "AMD RX 7900 XTX",
    series: "RX 7000",
    cores: 12288,
    memory: "24 GB GDDR6",
    performance: "61 TFLOPS",
    price: 2.1,
  },
  {
    name: "AMD RX 7800 XT",
    series: "RX 7000",
    cores: 7680,
    memory: "16 GB GDDR6",
    performance: "40 TFLOPS",
    price: 1.6,
  },
  {
    name: "AMD RX 7700 XT",
    series: "RX 7000",
    cores: 5376,
    memory: "12 GB GDDR6",
    performance: "28 TFLOPS",
    price: 1.25,
  },
  { name: "AMD RX 7600", series: "RX 7000", cores: 2048, memory: "8 GB GDDR6", performance: "17 TFLOPS", price: 0.85 },
  {
    name: "AMD RX 6900 XT",
    series: "RX 6000",
    cores: 5120,
    memory: "16 GB GDDR6",
    performance: "23 TFLOPS",
    price: 1.5,
  },
  {
    name: "AMD RX 6800 XT",
    series: "RX 6000",
    cores: 4608,
    memory: "16 GB GDDR6",
    performance: "20.7 TFLOPS",
    price: 1.25,
  },
  {
    name: "AMD RX 6700 XT",
    series: "RX 6000",
    cores: 2560,
    memory: "12 GB GDDR6",
    performance: "13.2 TFLOPS",
    price: 0.85,
  },
  {
    name: "AMD RX 6600 XT",
    series: "RX 6000",
    cores: 2048,
    memory: "8 GB GDDR6",
    performance: "10.6 TFLOPS",
    price: 0.6,
  },
]

export function MarketplaceSection() {
  const [selectedSeries, setSelectedSeries] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGPUs = gpus.filter((gpu) => {
    const matchesSeries = selectedSeries === "all" || gpu.series.toLowerCase() === selectedSeries.toLowerCase()
    const matchesSearch =
      gpu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpu.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpu.performance.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeries && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">GPU Marketplace</h2>
        <div className="flex space-x-2">
          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Series</SelectItem>
              <SelectItem value="50 Series">NVIDIA 50 Series</SelectItem>
              <SelectItem value="40 Series">NVIDIA 40 Series</SelectItem>
              <SelectItem value="30 Series">NVIDIA 30 Series</SelectItem>
              <SelectItem value="RX 7000">AMD RX 7000</SelectItem>
              <SelectItem value="RX 6000">AMD RX 6000</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search GPUs"
            className="w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="border border-secondary rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">GPU Model</TableHead>
              <TableHead>Cores</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
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
                <TableRow key={gpu.name}>
                  <TableCell className="font-medium">
                    <div>
                      {gpu.name}
                      <div className="text-sm text-muted-foreground">{gpu.series}</div>
                    </div>
                  </TableCell>
                  <TableCell>{gpu.cores.toLocaleString()}</TableCell>
                  <TableCell>{gpu.memory}</TableCell>
                  <TableCell>{gpu.performance}</TableCell>
                  <TableCell>
                    <div>
                      ${gpu.price.toFixed(2)}/hr
                      <div className="text-sm text-muted-foreground">${(gpu.price * 24).toFixed(2)}/day</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Rent Now</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

