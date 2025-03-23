"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

interface AudioPlayerProps {
  title: string
  src: string
  duration: number // in seconds
}

export default function AudioPlayer({ title, src, duration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(src)
    audioRef.current = audio

    audio.addEventListener("loadeddata", () => {
      setIsLoaded(true)
    })

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    return () => {
      audio.pause()
      audio.src = ""
      audio.removeEventListener("loadeddata", () => {})
      audio.removeEventListener("timeupdate", () => {})
      audio.removeEventListener("ended", () => {})
    }
  }, [src])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return

    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const resetAudio = () => {
    if (!audioRef.current) return

    audioRef.current.currentTime = 0
    setCurrentTime(0)

    if (isPlaying) {
      audioRef.current.play()
    }
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            disabled={!isLoaded}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <div className="flex-1">
            <div className="font-medium mb-1">{title}</div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration}
                  step={1}
                  onValueChange={handleSeek}
                  disabled={!isLoaded}
                  aria-label="Audio progress"
                />
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetAudio}
                disabled={!isLoaded || currentTime === 0}
                aria-label="Reset audio"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

