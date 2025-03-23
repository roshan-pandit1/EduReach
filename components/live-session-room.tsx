"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Users,
  Send,
  Download,
  Settings,
  AlertTriangle,
} from "lucide-react"
import { useLocalDatabase } from "@/hooks/use-local-database"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

export default function LiveSessionRoom({ sessionId }: { sessionId: string }) {
  const { getSession, isLoading, error } = useLocalDatabase("live-sessions")
  const [session, setSession] = useState<any>(null)
  const [isLive, setIsLive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<"good" | "fair" | "poor">("good")
  const [activeTab, setActiveTab] = useState("video")
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTeacher, setIsTeacher] = useState(false)
  const [isTextOnly, setIsTextOnly] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const { toast } = useToast()

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await getSession(sessionId)
      if (sessionData) {
        setSession(sessionData)

        // Check if session is live
        const now = new Date()
        const start = new Date(sessionData.startTime)
        const end = new Date(sessionData.endTime)
        setIsLive(now >= start && now <= end)

        // For demo purposes, set some participants
        setParticipants([
          { id: "teacher1", name: "Ms. Johnson", isTeacher: true, hasAudio: true, hasVideo: true },
          { id: "student1", name: "Alex Smith", isTeacher: false, hasAudio: false, hasVideo: false },
          { id: "student2", name: "Jamie Lee", isTeacher: false, hasAudio: true, hasVideo: false },
          { id: "student3", name: "Taylor Wong", isTeacher: false, hasAudio: false, hasVideo: false },
          { id: "student4", name: "Jordan Rivera", isTeacher: false, hasAudio: false, hasVideo: false },
        ])

        // For demo purposes, set some messages
        setMessages([
          {
            id: 1,
            sender: "Ms. Johnson",
            text: "Welcome to today's session on algebra!",
            time: "10:00 AM",
            isTeacher: true,
          },
          { id: 2, sender: "Jamie Lee", text: "Hi everyone, excited to learn!", time: "10:01 AM", isTeacher: false },
          {
            id: 3,
            sender: "Ms. Johnson",
            text: "Today we'll be covering linear equations.",
            time: "10:02 AM",
            isTeacher: true,
          },
          { id: 4, sender: "Alex Smith", text: "Will this be on the test?", time: "10:03 AM", isTeacher: false },
          {
            id: 5,
            sender: "Ms. Johnson",
            text: "Yes, this is important material for your upcoming exam.",
            time: "10:04 AM",
            isTeacher: true,
          },
        ])

        // Simulate network quality check
        checkNetworkQuality()
      }
    }

    loadSession()

    // Cleanup function
    return () => {
      // In a real app, this would disconnect from the live session
    }
  }, [sessionId, getSession])

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Simulate checking network quality
  const checkNetworkQuality = () => {
    // In a real app, this would actually check network conditions
    const qualities = ["good", "fair", "poor"]
    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)] as "good" | "fair" | "poor"
    setConnectionQuality(randomQuality)

    if (randomQuality === "poor") {
      toast({
        title: "Poor connection detected",
        description: "Switching to text-only mode to conserve bandwidth.",
        variant: "destructive",
      })
      setIsTextOnly(true)
      setVideoEnabled(false)
      setAudioEnabled(false)
    }
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)

    toast({
      title: audioEnabled ? "Microphone disabled" : "Microphone enabled",
      description: audioEnabled ? "Others can no longer hear you" : "Others can now hear you",
    })
  }

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled)

    toast({
      title: videoEnabled ? "Camera disabled" : "Camera enabled",
      description: videoEnabled ? "Others can no longer see you" : "Others can now see you",
    })
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isTeacher: isTeacher,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording
        ? "The recording will be available for download soon"
        : "This session is now being recorded",
    })
  }

  const downloadRecording = () => {
    toast({
      title: "Downloading recording",
      description: "Your recording will be available offline soon",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
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

  if (isLoading) {
    return <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
  }

  if (error || !session) {
    return <div className="bg-destructive/10 p-4 rounded-lg text-destructive">Failed to load session information.</div>
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{session.title}</h1>
          <p className="text-muted-foreground">
            {formatDate(session.startTime)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {connectionQuality === "good" && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Good Connection
            </Badge>
          )}
          {connectionQuality === "fair" && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Fair Connection
            </Badge>
          )}
          {connectionQuality === "poor" && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Poor Connection
            </Badge>
          )}

          {isLive ? <Badge variant="destructive">LIVE</Badge> : <Badge variant="outline">RECORDED</Badge>}

          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              REC
            </Badge>
          )}
        </div>
      </div>

      {isTextOnly && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-700">Text-only mode active</p>
              <p className="text-sm text-yellow-600">Due to low bandwidth, video and audio are disabled.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {!isLive && !session.isRecorded ? (
                <div className="flex flex-col items-center justify-center h-96 bg-muted">
                  <p className="text-lg font-medium mb-2">This session hasn't started yet</p>
                  <p className="text-muted-foreground">
                    Starts at {formatTime(session.startTime)} on {formatDate(session.startTime)}
                  </p>
                </div>
              ) : isTextOnly ? (
                <div className="flex flex-col items-center justify-center h-96 bg-muted">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                  <p className="text-lg font-medium mb-2">Text-only mode active</p>
                  <p className="text-muted-foreground text-center max-w-md px-4">
                    Due to bandwidth limitations, video is disabled. Please use the chat to participate.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-auto aspect-video bg-black"
                    poster="/placeholder.svg?height=480&width=854"
                    controls={!isLive}
                    autoPlay={isLive}
                    muted={!audioEnabled}
                  >
                    {session.isRecorded && <source src="/placeholder-video.mp4" type="video/mp4" />}
                    Your browser does not support the video tag.
                  </video>

                  {isLive && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <div className="bg-background/80 backdrop-blur-sm rounded-full flex items-center p-1">
                        <Button
                          variant={audioEnabled ? "default" : "outline"}
                          size="icon"
                          className="rounded-full"
                          onClick={toggleAudio}
                        >
                          {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>

                        <Button
                          variant={videoEnabled ? "default" : "outline"}
                          size="icon"
                          className="rounded-full ml-2"
                          onClick={toggleVideo}
                        >
                          {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>

                        {isTeacher && (
                          <Button
                            variant={isRecording ? "destructive" : "outline"}
                            size="sm"
                            className="rounded-full ml-2"
                            onClick={toggleRecording}
                          >
                            {isRecording ? "Stop Recording" : "Record"}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {!isLive && session.isRecorded && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                This is a recording of a session that took place on {formatDate(session.startTime)}.
              </p>

              <Button variant="outline" size="sm" onClick={downloadRecording}>
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
            </div>
          )}
        </div>

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.sender}</span>
                          {message.isTeacher && (
                            <Badge variant="outline" size="sm" className="text-xs">
                              Teacher
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">{message.time}</span>
                        </div>
                        <p className="mt-1">{message.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Participants ({participants.length})</h3>

                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {participant.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{participant.name}</div>
                              {participant.isTeacher && (
                                <Badge variant="outline" size="sm" className="text-xs">
                                  Teacher
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {participant.hasAudio ? (
                              <Mic className="h-4 w-4 text-green-500" />
                            ) : (
                              <MicOff className="h-4 w-4 text-muted-foreground" />
                            )}

                            {participant.hasVideo ? (
                              <Video className="h-4 w-4 text-green-500 ml-1" />
                            ) : (
                              <VideoOff className="h-4 w-4 text-muted-foreground ml-1" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Session Information</h3>
          <p className="text-sm text-muted-foreground mb-4">{session.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Instructor</p>
              <p className="text-muted-foreground">{session.instructor}</p>
            </div>

            <div>
              <p className="font-medium">Bandwidth Requirement</p>
              <p className="text-muted-foreground">{session.bandwidthRequirement}</p>
            </div>

            <div>
              <p className="font-medium">Duration</p>
              <p className="text-muted-foreground">{session.duration} minutes</p>
            </div>

            <div>
              <p className="font-medium">Materials</p>
              <Button variant="link" className="p-0 h-auto text-sm" asChild>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    toast({
                      title: "Downloading materials",
                      description: "Session materials will be available offline",
                    })
                  }}
                >
                  Download Materials
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

