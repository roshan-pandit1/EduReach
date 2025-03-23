"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle, AlertCircle } from "lucide-react"
import { useLocalDatabase } from "@/hooks/use-local-database"

export default function CourseList() {
  const { courses, isLoading, error } = useLocalDatabase("courses")
  const [downloadStatus, setDownloadStatus] = useState<Record<string, string>>({})

  const handleDownload = async (courseId: string) => {
    setDownloadStatus((prev) => ({ ...prev, [courseId]: "downloading" }))

    try {
      // This would trigger the actual download process
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "DOWNLOAD_COURSE",
          courseId,
        })

        // For demo purposes, we'll simulate a successful download after 2 seconds
        setTimeout(() => {
          setDownloadStatus((prev) => ({ ...prev, [courseId]: "downloaded" }))
          localStorage.setItem(`course_${courseId}_downloaded`, "true")
        }, 2000)
      }
    } catch (error) {
      setDownloadStatus((prev) => ({ ...prev, [courseId]: "error" }))
    }
  }

  useEffect(() => {
    // Check which courses are already downloaded
    if (courses) {
      const newStatus: Record<string, string> = {}

      courses.forEach((course) => {
        const isDownloaded = localStorage.getItem(`course_${course.id}_downloaded`) === "true"
        if (isDownloaded) {
          newStatus[course.id] = "downloaded"
        }
      })

      setDownloadStatus(newStatus)
    }
  }, [courses])

  if (isLoading) {
    return <div className="text-center p-8">Loading courses...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        Failed to load courses. Please try again later.
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        No courses available. Check back later or contact your administrator.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="h-40 bg-muted relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {course.title.charAt(0)}
            </div>
          </div>

          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <a href={`/courses/${course.id}`}>Continue</a>
            </Button>

            {downloadStatus[course.id] === "downloaded" ? (
              <Button variant="ghost" size="icon" disabled>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </Button>
            ) : downloadStatus[course.id] === "downloading" ? (
              <Button variant="ghost" size="icon" disabled>
                <Download className="h-5 w-5 animate-pulse" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(course.id)}
                title="Download for offline use"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

