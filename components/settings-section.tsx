"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

interface SettingsSectionProps {
  setIsLoggedIn: (value: boolean) => void
  setUsername: (value: string) => void
}

export function SettingsSection({ setIsLoggedIn, setUsername }: SettingsSectionProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [localUsername, setLocalUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  useEffect(() => {
    // Check if Phantom wallet is installed
    const checkPhantomWallet = async () => {
      if ("solana" in window) {
        const provider = window.solana
        if (provider.isPhantom) {
          try {
            const response = await provider.connect({ onlyIfTrusted: true })
            setWalletConnected(true)
            setWalletAddress(response.publicKey.toString())
            setIsLoggedIn(true)
            setUsername(response.publicKey.toString().slice(0, 4) + "..." + response.publicKey.toString().slice(-4))
          } catch (err) {
            // User hasn't connected to the app before or has revoked permissions
            setWalletConnected(false)
          }
        }
      }
    }

    checkPhantomWallet()

    // Check if username is stored in localStorage
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setLocalUsername(storedUsername)
      setIsLoggedIn(true)
      setUsername(storedUsername)
    }

    // Check if phone number is stored in localStorage
    const storedPhoneNumber = localStorage.getItem("phoneNumber")
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber)
    }
  }, [setIsLoggedIn, setUsername])

  const connectWallet = async () => {
    if ("solana" in window) {
      const provider = window.solana
      if (provider.isPhantom) {
        try {
          const response = await provider.connect()
          setWalletConnected(true)
          setWalletAddress(response.publicKey.toString())
          setIsLoggedIn(true)
          setUsername(response.publicKey.toString().slice(0, 4) + "..." + response.publicKey.toString().slice(-4))
        } catch (err) {
          // Handle errors here
          console.error("Failed to connect wallet:", err)
        }
      }
    } else {
      window.open("https://phantom.app/", "_blank")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (localUsername) {
      localStorage.setItem("username", localUsername)
      setIsLoggedIn(true)
      setUsername(localUsername)
    }
    if (phoneNumber) {
      localStorage.setItem("phoneNumber", phoneNumber)
    }
    // Add any other form submission logic here
  }

  return (
    <div className="space-y-6 pt-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details here.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={localUsername}
                    onChange={(e) => setLocalUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-renew" />
                  <Label htmlFor="auto-renew">Auto-renew Rentals</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Save All Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your billing details, payment methods, and wallet connection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="**** **** **** 1234" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address">Billing Address</Label>
                <Input id="billing-address" placeholder="123 Main St, City, Country" />
              </div>
              <div className="space-y-2">
                <Label>Wallet Connection</Label>
                {walletConnected ? (
                  <div>
                    <p>Wallet connected</p>
                    <p className="text-sm text-muted-foreground break-all">{walletAddress}</p>
                  </div>
                ) : (
                  <p>No wallet connected</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Update Billing Info
              </Button>
              <Button onClick={connectWallet} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {walletConnected ? "Disconnect Wallet" : "Connect Phantom Wallet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

