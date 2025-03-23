"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocalDatabase } from "@/hooks/use-local-database"

export default function LiveSessionBanner() {
  const { getLiveSessions } = useLocalDatabase("live-sessions")
  const [currentSession, setCurrentSession] = useState<any>(null)

  useEffect(() => {
    const checkForLiveSessions = async () => {
      const sessions = await getLiveSessions()
      if (!sessions) return

      const now = new Date()
      const liveSession = sessions.find((session: any) => {
        const start = new Date(session.startTime)
        const end = new Date(session.endTime)
        return session.isEnrolled && now >= start && now <= end
      })

      setCurrentSession(liveSession || null)
    }

    checkForLiveSessions()

    // Check every minute
    const interval = setInterval(checkForLiveSessions, 60000)

    return () => clearInterval(interval)
  }, [getLiveSessions])

  if (!currentSession) return null

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="font-bold text-lg mb-1">Live Now: {currentSession.title}</div>
          <p className="text-primary-foreground/80">Your enrolled session is currently live!</p>
        </div>

        <Button variant="secondary" asChild>
          <a href={`/live-sessions/${currentSession.id}`}>Join Session</a>
        </Button>
      </CardContent>
    </Card>
  )
}

