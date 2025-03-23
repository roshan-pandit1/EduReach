import { Suspense } from "react"
import DownloadManager from "@/components/download-manager"

export default function DownloadsPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Manage Downloads</h1>

      <Suspense fallback={<div className="p-8 text-center">Loading downloads...</div>}>
        <DownloadManager />
      </Suspense>
    </main>
  )
}

