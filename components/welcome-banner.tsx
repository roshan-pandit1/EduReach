"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLocalDatabase } from "@/hooks/use-local-database"

export default function WelcomeBanner() {
  const [username, setUsername] = useState("Student")
  const [hasLiveSessions, setHasLiveSessions] = useState(false)
  const { getLiveSessions } = useLocalDatabase("live-sessions")

  useEffect(() => {
    // Get username from local storage if available
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  useEffect(() => {
    const checkForLiveSessions = async () => {
      const sessions = await getLiveSessions()
      if (!sessions) return

      const now = new Date()
      const upcomingSessions = sessions.filter((session: any) => {
        const start = new Date(session.startTime)
        return session.isEnrolled && start > now && start.getTime() - now.getTime() < 24 * 60 * 60 * 1000 // Within 24 hours
      })

      setHasLiveSessions(upcomingSessions.length > 0)
    }

    checkForLiveSessions()
  }, [getLiveSessions])

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Welcome back, {username}!</h1>
      <p className="mt-2 text-muted-foreground">
        Continue your learning journey today. Your progress is saved even when offline.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild>
          <a href="/courses">Continue Learning</a>
        </Button>
        {hasLiveSessions && (
          <Button variant="secondary" asChild>
            <a href="/live-sessions">Join Live Session</a>
          </Button>
        )}
        <Button variant="outline" asChild>
          <a href="/downloads">Manage Downloads</a>
        </Button>
      </div>
    </div>
  )
}

