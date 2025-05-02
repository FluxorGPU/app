"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { User, Bell, CreditCard, FileImage } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { BrandingManager } from "@/components/branding-manager"

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
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [activeTab, setActiveTab] = useState("account")
  const stripeCheckoutUrl = "https://buy.stripe.com/test_4gweVBfeVc0Tb0A3cc"

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

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

    // Check if profile image URL is stored in localStorage
    const storedProfileImageUrl = localStorage.getItem("profileImageUrl")
    if (storedProfileImageUrl) {
      setProfileImageUrl(storedProfileImageUrl)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (localUsername) {
      localStorage.setItem("username", localUsername)
      setIsLoggedIn(true)
      setUsername(localUsername)
    }
    if (phoneNumber) {
      localStorage.setItem("phoneNumber", phoneNumber)
    }

    // Upload profile image to Supabase if one is selected
    if (profileImage && supabase) {
      try {
        const fileExt = profileImage.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `profiles/${fileName}`

        const { data, error } = await supabase.storage.from("media").upload(filePath, profileImage, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("Error uploading image:", error)
        } else {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath)
          setProfileImageUrl(urlData.publicUrl)
          localStorage.setItem("profileImageUrl", urlData.publicUrl)
        }
      } catch (error) {
        console.error("Error handling file upload:", error)
      }
    } else if (profileImage && !supabase) {
      console.warn("Supabase client not initialized. Profile image not uploaded.")
    }
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="space-y-6 pt-6">
      {/* Completely redesigned tab navigation to ensure it's clickable */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <Button
          onClick={() => handleTabChange("account")}
          className={`py-6 h-auto flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer !important ${
            activeTab === "account"
              ? "bg-yellow-400/20 text-yellow-500 border-2 border-yellow-500"
              : "bg-background hover:bg-yellow-400/10 text-muted-foreground"
          }`}
          type="button"
        >
          <User className="h-4 w-4" />
          Account
        </Button>
        <Button
          onClick={() => handleTabChange("notifications")}
          className={`py-6 h-auto flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer !important ${
            activeTab === "notifications"
              ? "bg-yellow-400/20 text-yellow-500 border-2 border-yellow-500"
              : "bg-background hover:bg-yellow-400/10 text-muted-foreground"
          }`}
          type="button"
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
        <Button
          onClick={() => handleTabChange("billing")}
          className={`py-6 h-auto flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer !important ${
            activeTab === "billing"
              ? "bg-yellow-400/20 text-yellow-500 border-2 border-yellow-500"
              : "bg-background hover:bg-yellow-400/10 text-muted-foreground"
          }`}
          type="button"
        >
          <CreditCard className="h-4 w-4" />
          Billing
        </Button>
        <Button
          onClick={() => handleTabChange("branding")}
          className={`py-6 h-auto flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer !important ${
            activeTab === "branding"
              ? "bg-yellow-400/20 text-yellow-500 border-2 border-yellow-500"
              : "bg-background hover:bg-yellow-400/10 text-muted-foreground"
          }`}
          type="button"
        >
          <FileImage className="h-4 w-4" />
          Branding
        </Button>
      </div>

      {activeTab === "account" && (
        <Card className="tech-card border-yellow-400/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-yellow-500" />
              Account Information
            </CardTitle>
            <CardDescription>Update your account details here.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-yellow-400/30 bg-yellow-400/5">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-yellow-400/10 text-yellow-500">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="profile-image" className="block mb-2 text-sm font-medium">
                    Profile Image
                  </Label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="tech-card border-yellow-400/20 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                  className="tech-card border-yellow-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="tech-card border-yellow-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="tech-card border-yellow-400/20"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-renew"
                  className="data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                />
                <Label htmlFor="auto-renew" className="cursor-pointer">
                  Auto-renew Rentals
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black tech-glow cursor-pointer">
                Save All Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card className="tech-card border-yellow-400/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="cursor-pointer">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications" className="cursor-pointer">
                SMS Notifications
              </Label>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
                className="data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black cursor-pointer"
              />
            </div>
            <div className="space-y-2 pt-4 border-t border-yellow-400/10">
              <h3 className="text-sm font-medium text-yellow-500">Notification Types</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gpu-alerts" className="text-sm cursor-pointer">
                    GPU Status Alerts
                  </Label>
                  <Switch
                    id="gpu-alerts"
                    defaultChecked={true}
                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="billing-alerts" className="text-sm cursor-pointer">
                    Billing Notifications
                  </Label>
                  <Switch
                    id="billing-alerts"
                    defaultChecked={true}
                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketplace-alerts" className="text-sm cursor-pointer">
                    Marketplace Updates
                  </Label>
                  <Switch
                    id="marketplace-alerts"
                    defaultChecked={false}
                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="security-alerts" className="text-sm cursor-pointer">
                    Security Alerts
                  </Label>
                  <Switch
                    id="security-alerts"
                    defaultChecked={true}
                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black tech-glow cursor-pointer">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      )}

      {activeTab === "billing" && (
        <Card className="tech-card border-yellow-400/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-yellow-500" />
              Billing Information
            </CardTitle>
            <CardDescription>Manage your billing details, payment methods, and wallet connection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="**** **** **** 1234" className="tech-card border-yellow-400/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" className="tech-card border-yellow-400/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" className="tech-card border-yellow-400/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-on-card">Name on Card</Label>
              <Input id="name-on-card" placeholder="John Doe" className="tech-card border-yellow-400/20" />
            </div>

            <div className="pt-4 border-t border-yellow-400/10">
              <h3 className="text-sm font-medium text-yellow-500 mb-4">Wallet Connection</h3>
              {walletConnected ? (
                <div className="p-4 rounded-md bg-yellow-400/10 border border-yellow-400/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Wallet Connected</p>
                      <p className="text-sm text-muted-foreground mt-1 font-mono">{walletAddress}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-yellow-400/20 hover:bg-yellow-400/10 text-yellow-500 cursor-pointer"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black tech-glow cursor-pointer"
                >
                  Connect Phantom Wallet
                </Button>
              )}
            </div>

            <div className="pt-4 border-t border-yellow-400/10">
              <h3 className="text-sm font-medium text-yellow-500 mb-4">Payment History</h3>
              <div className="text-center py-6 border border-dashed border-yellow-400/20 rounded-md bg-yellow-400/5">
                <p className="text-muted-foreground">No payment history available</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="border-yellow-400/20 hover:bg-yellow-400/10 cursor-pointer">
              Cancel
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black tech-glow cursor-pointer">
              Save Payment Details
            </Button>
          </CardFooter>
        </Card>
      )}

      {activeTab === "branding" && <BrandingManager />}
    </div>
  )
}
