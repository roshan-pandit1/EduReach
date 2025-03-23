"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SyncStatus() {
  const [syncState, setSyncState] = useState("idle") // 'idle', 'syncing', 'success', 'error'
  const [lastSynced, setLastSynced] = useState<string | null>(null)

  useEffect(() => {
    // Get last synced time from local storage
    const storedLastSynced = localStorage.getItem("lastSynced")
    if (storedLastSynced) {
      setLastSynced(storedLastSynced)
    }

    // Listen for sync events from the service worker
    const handleSyncUpdate = (event: CustomEvent) => {
      setSyncState(event.detail.state)
      if (event.detail.state === "success") {
        const now = new Date().toISOString()
        setLastSynced(now)
        localStorage.setItem("lastSynced", now)
      }
    }

    window.addEventListener("syncUpdate", handleSyncUpdate as EventListener)

    return () => {
      window.removeEventListener("syncUpdate", handleSyncUpdate as EventListener)
    }
  }, [])

  const triggerSync = () => {
    setSyncState("syncing")
    // This would trigger the sync process via the service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SYNC_DATA",
      })
    }
  }

  if (syncState === "idle" && !lastSynced) return null

  return (
    <div className="flex items-center justify-between bg-card p-3 rounded-md mb-4 text-sm">
      <div>
        {syncState === "syncing" && (
          <span className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing your data...
          </span>
        )}
        {syncState === "success" && (
          <span>Last synced: {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}</span>
        )}
        {syncState === "error" && <span className="text-destructive">Sync failed. Will retry when online.</span>}
      </div>

      <Button variant="outline" size="sm" onClick={triggerSync} disabled={syncState === "syncing" || !navigator.onLine}>
        Sync Now
      </Button>
    </div>
  )
}

