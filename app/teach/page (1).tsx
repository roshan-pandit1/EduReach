import ScheduleSessionForm from "@/components/schedule-session-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeachPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Teach on EduReach</h1>

      <Tabs defaultValue="schedule">
        <TabsList className="mb-6">
          <TabsTrigger value="schedule">Schedule Session</TabsTrigger>
          <TabsTrigger value="resources">Teaching Resources</TabsTrigger>
          <TabsTrigger value="recordings">My Recordings</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ScheduleSessionForm />
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">For Low Bandwidth</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      <li>Use text chat as the primary communication method</li>
                      <li>Share materials before the session for offline access</li>
                      <li>Keep audio quality at 32 kbps for clarity with minimal data</li>
                      <li>Use short audio clips instead of continuous streaming</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">For Medium Bandwidth</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      <li>Use audio for most of the session</li>
                      <li>Share your video only when demonstrating important concepts</li>
                      <li>Use screen sharing sparingly</li>
                      <li>Compress images and slides before sharing</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">For High Bandwidth</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      <li>Use video and audio freely</li>
                      <li>Enable screen sharing for demonstrations</li>
                      <li>Record the session for offline viewing</li>
                      <li>Use interactive tools and media</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Teaching Resources</h2>
              <p className="text-muted-foreground mb-6">
                Access tools and resources to help you create effective online lessons.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Lesson Templates</h3>
                    <p className="text-sm text-muted-foreground">
                      Pre-designed templates for various subjects and teaching styles.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Media Compression Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Tools to optimize images, audio, and video for low-bandwidth environments.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Interactive Quizzes</h3>
                    <p className="text-sm text-muted-foreground">
                      Create lightweight quizzes that work even with limited connectivity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recordings">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">My Recordings</h2>
              <p className="text-muted-foreground mb-6">Access and manage your recorded teaching sessions.</p>

              <div className="text-center py-8">
                <p>You don't have any recordings yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Recordings will appear here after you complete a teaching session.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

