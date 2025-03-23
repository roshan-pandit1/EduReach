"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, HardDrive } from "lucide-react"
import { useLocalDatabase } from "@/hooks/use-local-database"
import { formatBytes } from "@/lib/utils"

export default function DownloadManager() {
  const { courses, isLoading, error } = useLocalDatabase("courses")
  const [downloadedCourses, setDownloadedCourses] = useState<string[]>([])
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    available: 0,
  })

  useEffect(() => {
    // Get downloaded courses from localStorage
    if (courses) {
      const downloaded: string[] = []

      courses.forEach((course: any) => {
        const isDownloaded = localStorage.getItem(`course_${course.id}_downloaded`) === "true"
        if (isDownloaded) {
          downloaded.push(course.id)
        }
      })

      setDownloadedCourses(downloaded)
    }

    // Estimate storage usage (in a real app, this would use the Storage API)
    const estimateStorage = async () => {
      try {
        // For demo purposes, we'll use mock values
        setStorageInfo({
          used: 25 * 1024 * 1024, // 25 MB
          available: 500 * 1024 * 1024, // 500 MB
        })

        // In a real implementation, you might use:
        // if ('storage' in navigator && 'estimate' in navigator.storage) {
        //   const estimate = await navigator.storage.estimate();
        //   setStorageInfo({
        //     used: estimate.usage || 0,
        //     available: estimate.quota || 0
        //   });
        // }
      } catch (error) {
        console.error("Failed to estimate storage", error)
      }
    }

    estimateStorage()
  }, [courses])

  const handleDeleteDownload = (courseId: string) => {
    // Remove from localStorage
    localStorage.removeItem(`course_${courseId}_downloaded`)

    // Update state
    setDownloadedCourses((prev) => prev.filter((id) => id !== courseId))

    // In a real app, this would also clear cached assets from the service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "DELETE_COURSE",
        courseId,
      })
    }
  }

  if (isLoading) {
    return <div className="h-60 bg-muted animate-pulse rounded-lg"></div>
  }

  if (error) {
    return <div className="bg-destructive/10 p-4 rounded-lg text-destructive">Failed to load download information.</div>
  }

  const downloadedCoursesData = courses?.filter((course: any) => downloadedCourses.includes(course.id)) || []

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HardDrive className="h-5 w-5 mr-2 text-muted-foreground" />
              <h2 className="text-lg font-medium">Storage</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatBytes(storageInfo.used)} used of {formatBytes(storageInfo.available)}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${(storageInfo.used / storageInfo.available) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Downloaded Courses</h2>

      {downloadedCoursesData.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center">
          <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p>No courses downloaded yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Download courses to access them offline.</p>
          <Button asChild className="mt-4">
            <a href="/courses">Browse Courses</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloadedCoursesData.map((course: any) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">{course.description}</p>
                <div className="mt-2 flex items-center text-sm">
                  <Download className="h-4 w-4 mr-1 text-green-500" />
                  <span>Downloaded • Approximately 8 MB</span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <a href={`/courses/${course.id}`}>Open</a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDownload(course.id)}
                  title="Delete download"
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

