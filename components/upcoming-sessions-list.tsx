"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { useLocalDatabase } from "@/hooks/use-local-database"

export default function UpcomingSessionsList() {
  const { getLiveSessions, isLoading, error } = useLocalDatabase("live-sessions")
  const [sessions, setSessions] = useState<any[]>([])
  const [filter, setFilter] = useState("all") // 'all', 'enrolled', 'available'

  useEffect(() => {
    const loadSessions = async () => {
      const sessionData = await getLiveSessions()
      if (sessionData) {
        setSessions(sessionData)
      }
    }

    loadSessions()
  }, [getLiveSessions])

  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true
    if (filter === "enrolled") return session.isEnrolled
    if (filter === "available") return !session.isEnrolled && new Date(session.startTime) > new Date()
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isLive = (session: any) => {
    const now = new Date()
    const start = new Date(session.startTime)
    const end = new Date(session.endTime)
    return now >= start && now <= end
  }

  const canJoin = (session: any) => {
    const now = new Date()
    const start = new Date(session.startTime)
    const joinWindow = new Date(start)
    joinWindow.setMinutes(joinWindow.getMinutes() - 10) // Can join 10 minutes before
    return (now >= joinWindow && isLive(session)) || session.isRecorded
  }

  if (isLoading) {
    return <div className="h-60 bg-muted animate-pulse rounded-lg"></div>
  }

  if (error) {
    return <div className="bg-destructive/10 p-4 rounded-lg text-destructive">Failed to load live sessions.</div>
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-muted p-8 rounded-lg text-center">
        <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p>No upcoming sessions scheduled.</p>
        <p className="text-sm text-muted-foreground mt-1">Check back later for new sessions.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "enrolled" ? "default" : "outline"} size="sm" onClick={() => setFilter("enrolled")}>
          My Sessions
        </Button>
        <Button
          variant={filter === "available" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("available")}
        >
          Available
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{session.title}</CardTitle>
                {isLive(session) && (
                  <Badge variant="destructive" className="uppercase">
                    Live Now
                  </Badge>
                )}
                {session.isRecorded && !isLive(session) && (
                  <Badge variant="outline" className="uppercase">
                    Recorded
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{session.description}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDate(session.startTime)}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{session.participants} participants</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              {session.isEnrolled ? (
                canJoin(session) ? (
                  <Button asChild>
                    <a href={`/live-sessions/${session.id}`}>{isLive(session) ? "Join Now" : "Watch Recording"}</a>
                  </Button>
                ) : (
                  <Button disabled>Starts at {formatTime(session.startTime)}</Button>
                )
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Enroll in session
                    const updatedSessions = sessions.map((s) => (s.id === session.id ? { ...s, isEnrolled: true } : s))
                    setSessions(updatedSessions)
                    localStorage.setItem("edureach_live-sessions", JSON.stringify(updatedSessions))
                  }}
                >
                  Enroll
                </Button>
              )}

              <Badge variant="outline" className="ml-2">
                {session.bandwidthRequirement}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

