import { Suspense } from "react"
import UserProfile from "@/components/user-profile"

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Suspense fallback={<div className="p-8 text-center">Loading profile...</div>}>
        <UserProfile />
      </Suspense>
    </main>
  )
}

