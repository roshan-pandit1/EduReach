"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, FileText, HelpCircle } from "lucide-react"
import { useLocalDatabase } from "@/hooks/use-local-database"
import AudioPlayer from "@/components/audio-player"
import QuizComponent from "@/components/quiz-component"

export default function CourseContent({ courseId }: { courseId: string }) {
  const { getModules, isLoading, error } = useLocalDatabase("modules")
  const [modules, setModules] = useState<any[]>([])
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("lessons")

  useEffect(() => {
    const loadModules = async () => {
      const moduleData = await getModules(courseId)
      if (moduleData && moduleData.length > 0) {
        setModules(moduleData)
        setActiveModule(moduleData[0].id)
      }
    }

    loadModules()
  }, [courseId, getModules])

  const currentModule = modules.find((m) => m.id === activeModule)

  if (isLoading) {
    return <div className="h-60 bg-muted animate-pulse rounded-lg"></div>
  }

  if (error) {
    return <div className="bg-destructive/10 p-4 rounded-lg text-destructive">Failed to load course content.</div>
  }

  if (modules.length === 0) {
    return <div className="bg-muted p-8 rounded-lg text-center">No modules available for this course yet.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-3">Modules</h3>
          <ul className="space-y-1">
            {modules.map((module) => (
              <li key={module.id}>
                <Button
                  variant={activeModule === module.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveModule(module.id)}
                >
                  {module.title}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-3">
        {currentModule && (
          <>
            <h2 className="text-2xl font-bold mb-4">{currentModule.title}</h2>
            <p className="text-muted-foreground mb-6">{currentModule.description}</p>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="lessons">
                  <FileText className="h-4 w-4 mr-2" />
                  Lessons
                </TabsTrigger>
                <TabsTrigger value="audio">
                  <Play className="h-4 w-4 mr-2" />
                  Audio
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Quiz
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lessons" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audio" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Audio Lessons</h3>
                    {currentModule.audioLessons && currentModule.audioLessons.length > 0 ? (
                      <div className="space-y-4">
                        {currentModule.audioLessons.map((audio: any) => (
                          <AudioPlayer key={audio.id} title={audio.title} src={audio.src} duration={audio.duration} />
                        ))}
                      </div>
                    ) : (
                      <p>No audio lessons available for this module.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quiz" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Knowledge Check</h3>
                    {currentModule.quiz ? (
                      <QuizComponent quizId={currentModule.quiz.id} />
                    ) : (
                      <p>No quiz available for this module.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

