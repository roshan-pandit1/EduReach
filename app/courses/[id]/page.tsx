import { Suspense } from "react"
import CourseContent from "@/components/course-content"
import CourseHeader from "@/components/course-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CoursePage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/courses" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="p-8 text-center">Loading course...</div>}>
        <CourseHeader courseId={params.id} />
        <CourseContent courseId={params.id} />
      </Suspense>
    </main>
  )
}

