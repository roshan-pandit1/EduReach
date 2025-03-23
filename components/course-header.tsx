"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { useLocalDatabase } from "@/hooks/use-local-database"

export default function CourseHeader({ courseId }: { courseId: string }) {
  const { getCourse, isLoading, error } = useLocalDatabase("courses")
  const [course, setCourse] = useState<any>(null)

  useEffect(() => {
    const loadCourse = async () => {
      const courseData = await getCourse(courseId)
      if (courseData) {
        setCourse(courseData)
      }
    }

    loadCourse()
  }, [courseId, getCourse])

  if (isLoading) {
    return <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
  }

  if (error || !course) {
    return <div className="bg-destructive/10 p-4 rounded-lg text-destructive">Failed to load course information.</div>
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="mt-2 text-muted-foreground">{course.description}</p>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Your progress</span>
          <span>{course.progress}%</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>
    </div>
  )
}

