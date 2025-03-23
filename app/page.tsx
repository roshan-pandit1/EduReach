import { Suspense } from "react"
import CourseList from "@/components/course-list"
import WelcomeBanner from "@/components/welcome-banner"
import OfflineIndicator from "@/components/offline-indicator"
import SyncStatus from "@/components/sync-status"

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <OfflineIndicator />
      <SyncStatus />

      <WelcomeBanner />

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
        <Suspense fallback={<div className="p-4 text-center">Loading courses...</div>}>
          <CourseList />
        </Suspense>
      </section>
    </main>
  )
}

