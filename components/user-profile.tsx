"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export default function UserProfile() {
  const [username, setUsername] = useState("Student")
  const [email, setEmail] = useState("student@example.com")
  const [audioQuality, setAudioQuality] = useState(32) // 32 kbps
  const [downloadOnWifiOnly, setDownloadOnWifiOnly] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load user settings from localStorage
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    const storedEmail = localStorage.getItem("email")
    if (storedEmail) {
      setEmail(storedEmail)
    }

    const storedAudioQuality = localStorage.getItem("audioQuality")
    if (storedAudioQuality) {
      setAudioQuality(Number.parseInt(storedAudioQuality, 10))
    }

    const storedDownloadOnWifiOnly = localStorage.getItem("downloadOnWifiOnly")
    if (storedDownloadOnWifiOnly) {
      setDownloadOnWifiOnly(storedDownloadOnWifiOnly === "true")
    }

    const storedAutoSync = localStorage.getItem("autoSync")
    if (storedAutoSync) {
      setAutoSync(storedAutoSync === "true")
    }
  }, [])

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem("username", username)
    localStorage.setItem("email", email)
    localStorage.setItem("audioQuality", audioQuality.toString())
    localStorage.setItem("downloadOnWifiOnly", downloadOnWifiOnly.toString())
    localStorage.setItem("autoSync", autoSync.toString())

    // Show success toast
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated.",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Display Name</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <p className="text-xs text-muted-foreground">Used for syncing your progress across devices</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Data & Storage</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-quality">Audio Quality (kbps)</Label>
                <span className="text-sm font-medium">{audioQuality} kbps</span>
              </div>
              <Slider
                id="audio-quality"
                min={16}
                max={128}
                step={16}
                value={[audioQuality]}
                onValueChange={(value) => setAudioQuality(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Lower quality uses less storage and works better with slow connections
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="wifi-only" className="block mb-1">
                  Download on Wi-Fi only
                </Label>
                <p className="text-xs text-muted-foreground">Prevent downloads over mobile data</p>
              </div>
              <Switch id="wifi-only" checked={downloadOnWifiOnly} onCheckedChange={setDownloadOnWifiOnly} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync" className="block mb-1">
                  Auto-sync when online
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync your progress when internet is available
                </p>
              </div>
              <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Courses Enrolled</p>
              <p className="text-2xl font-bold">3</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
              <p className="text-2xl font-bold">7</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">82%</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Study Streak</p>
              <p className="text-2xl font-bold">5 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Export My Data
            </Button>

            <Button variant="outline" className="w-full text-destructive">
              Clear All Downloaded Content
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3">
        <CardFooter className="px-0">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardFooter>
      </div>
    </div>
  )
}

