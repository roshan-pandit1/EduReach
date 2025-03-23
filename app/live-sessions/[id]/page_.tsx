import { Suspense } from "react"
import UpcomingSessionsList from "@/components/upcoming-sessions-list"
import LiveSessionBanner from "@/components/live-session-banner"

export default function LiveSessionsPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Live Teaching Sessions</h1>

      <LiveSessionBanner />

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
        <Suspense fallback={<div className="p-4 text-center">Loading sessions...</div>}>
          <UpcomingSessionsList />
        </Suspense>
      </section>
    </main>
  )
}

