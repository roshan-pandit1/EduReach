import { Suspense } from "react"
import LiveSessionRoom from "@/components/live-session-room"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function LiveSessionPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/live-sessions" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Sessions
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="p-8 text-center">Loading session...</div>}>
        <LiveSessionRoom sessionId={params.id} />
      </Suspense>
    </main>
  )
}

