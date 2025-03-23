// Register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope)
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error)
      })
  })
}

// Listen for messages from the service worker
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data.type === "SYNC_RESULT") {
    // Dispatch custom event for the UI to handle
    window.dispatchEvent(
      new CustomEvent("syncUpdate", {
        detail: {
          state: event.data.success ? "success" : "error",
          message: event.data.message,
        },
      }),
    )
  }

  if (event.data.type === "DOWNLOAD_RESULT") {
    // Dispatch custom event for the UI to handle
    window.dispatchEvent(
      new CustomEvent("downloadUpdate", {
        detail: {
          courseId: event.data.courseId,
          state: event.data.success ? "downloaded" : "error",
          message: event.data.message,
        },
      }),
    )
  }
})

