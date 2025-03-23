// Service Worker for EduReach - Offline Education Platform

const CACHE_NAME = "edureach-cache-v1"
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker-register.js",
  "/placeholder-audio.mp3",
  "/placeholder.svg",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name !== CACHE_NAME
            })
            .map((name) => {
              return caches.delete(name)
            }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // For API requests, try network first, then cache
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          return caches.match(event.request)
        }),
    )
    return
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response to store in cache
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data.type === "SYNC_DATA") {
    // Attempt to sync data with the server
    syncData().then((result) => {
      // Notify all clients about the sync result
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "SYNC_RESULT",
            success: result.success,
            message: result.message,
          })
        })
      })
    })
  }

  if (event.data.type === "DOWNLOAD_COURSE") {
    // Download course assets for offline use
    downloadCourseAssets(event.data.courseId).then((result) => {
      // Notify the client about the download result
      event.source.postMessage({
        type: "DOWNLOAD_RESULT",
        courseId: event.data.courseId,
        success: result.success,
        message: result.message,
      })
    })
  }
})

// Background sync for data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData())
  }
})

// Function to sync data with the server
async function syncData() {
  try {
    // Get pending changes from IndexedDB
    // This would be implemented with actual IndexedDB code

    // For demo purposes, we'll simulate a successful sync
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return { success: true, message: "Data synced successfully" }
  } catch (error) {
    return { success: false, message: "Failed to sync data" }
  }
}

// Function to download course assets for offline use
async function downloadCourseAssets(courseId) {
  try {
    // In a real implementation, this would fetch and cache all course assets
    // For demo purposes, we'll simulate a successful download
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return { success: true, message: "Course downloaded successfully" }
  } catch (error) {
    return { success: false, message: "Failed to download course" }
  }
}

