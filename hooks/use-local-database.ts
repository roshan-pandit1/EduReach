"use client"

import { useState, useCallback, useEffect } from "react"

export function useLocalDatabase(tableName: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<any[] | null>(null)

  // Initialize database connection
  useEffect(() => {
    const initDb = async () => {
      try {
        // Check if IndexedDB is supported
        if (!("indexedDB" in window)) {
          throw new Error("IndexedDB not supported")
        }

        // For demo purposes, we'll use localStorage instead of actual IndexedDB
        const storedData = localStorage.getItem(`edureach_${tableName}`)

        if (storedData) {
          setData(JSON.parse(storedData))
        } else {
          // Initialize with demo data if empty
          const demoData = getDemoData(tableName)
          localStorage.setItem(`edureach_${tableName}`, JSON.stringify(demoData))
          setData(demoData)
        }

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setIsLoading(false)
      }
    }

    initDb()
  }, [tableName])

  // Get a single item by ID
  const getItem = useCallback(
    async (id: string) => {
      try {
        const storedData = localStorage.getItem(`edureach_${tableName}`)
        if (!storedData) return null

        const items = JSON.parse(storedData)
        return items.find((item: any) => item.id === id) || null
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to get item"))
        return null
      }
    },
    [tableName],
  )

  // Get course by ID
  const getCourse = useCallback(
    async (id: string) => {
      return getItem(id)
    },
    [getItem],
  )

  // Get modules for a course
  const getModules = useCallback(async (courseId: string) => {
    try {
      const storedData = localStorage.getItem("edureach_modules")
      if (!storedData) return []

      const modules = JSON.parse(storedData)
      return modules.filter((module: any) => module.courseId === courseId) || []
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to get modules"))
      return []
    }
  }, [])

  // Get quiz by ID
  const getQuiz = useCallback(
    async (id: string) => {
      return getItem(id)
    },
    [getItem],
  )

  // Save quiz result
  const saveQuizResult = useCallback(async (quizId: string, result: any) => {
    try {
      const storedResults = localStorage.getItem("edureach_quiz_results")
      const results = storedResults ? JSON.parse(storedResults) : []

      results.push({
        id: Date.now().toString(),
        quizId,
        ...result,
      })

      localStorage.setItem("edureach_quiz_results", JSON.stringify(results))
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to save quiz result"))
      return false
    }
  }, [])

  // Sync data with Firebase when online
  const syncWithFirebase = useCallback(async () => {
    if (!navigator.onLine) {
      return { success: false, message: "Device is offline" }
    }

    try {
      // This would be the actual Firebase sync code
      // For demo purposes, we'll just simulate a successful sync

      // Mark last sync time
      localStorage.setItem("lastSynced", new Date().toISOString())

      // Dispatch event for the UI to update
      window.dispatchEvent(
        new CustomEvent("syncUpdate", {
          detail: { state: "success" },
        }),
      )

      return { success: true, message: "Data synced successfully" }
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("syncUpdate", {
          detail: { state: "error" },
        }),
      )

      return { success: false, message: "Failed to sync data" }
    }
  }, [])

  // Get live sessions
  const getLiveSessions = useCallback(async () => {
    try {
      const storedData = localStorage.getItem("edureach_live-sessions")
      if (!storedData) {
        // Initialize with demo data if empty
        const demoData = getDemoLiveSessions()
        localStorage.setItem("edureach_live-sessions", JSON.stringify(demoData))
        return demoData
      }

      return JSON.parse(storedData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to get live sessions"))
      return []
    }
  }, [])

  // Get session by ID
  const getSession = useCallback(async (id: string) => {
    try {
      const storedData = localStorage.getItem("edureach_live-sessions")
      if (!storedData) return null

      const sessions = JSON.parse(storedData)
      return sessions.find((session: any) => session.id === id) || null
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to get session"))
      return null
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    getItem,
    getCourse,
    getModules,
    getQuiz,
    saveQuizResult,
    syncWithFirebase,
    courses: tableName === "courses" ? data : null,
    getLiveSessions,
    getSession,
  }
}

// Demo data for initial setup
function getDemoData(tableName: string) {
  switch (tableName) {
    case "courses":
      return [
        {
          id: "course1",
          title: "Introduction to Mathematics",
          description: "Learn the fundamentals of mathematics including algebra, geometry, and arithmetic.",
          progress: 35,
        },
        {
          id: "course2",
          title: "Basic Science",
          description: "Explore the world of science with topics in physics, chemistry, and biology.",
          progress: 20,
        },
        {
          id: "course3",
          title: "English Language",
          description: "Improve your English language skills with grammar, vocabulary, and writing exercises.",
          progress: 65,
        },
      ]
    case "modules":
      return [
        {
          id: "module1",
          courseId: "course1",
          title: "Numbers and Operations",
          description: "Learn about numbers, basic operations, and their properties.",
          content:
            "<p>Mathematics is all about numbers and operations. In this module, we will learn about:</p><ul><li>Natural numbers</li><li>Integers</li><li>Addition and subtraction</li><li>Multiplication and division</li></ul><p>Let's start with natural numbers. Natural numbers are the counting numbers: 1, 2, 3, 4, and so on.</p>",
          audioLessons: [
            {
              id: "audio1",
              title: "Introduction to Numbers",
              src: "/placeholder-audio.mp3",
              duration: 180,
            },
            {
              id: "audio2",
              title: "Basic Operations",
              src: "/placeholder-audio.mp3",
              duration: 240,
            },
          ],
          quiz: {
            id: "quiz1",
          },
        },
        {
          id: "module2",
          courseId: "course1",
          title: "Fractions and Decimals",
          description: "Understand fractions, decimals, and their operations.",
          content:
            "<p>Fractions and decimals are ways to represent parts of a whole. In this module, we will learn about:</p><ul><li>Fractions and their types</li><li>Decimal numbers</li><li>Converting between fractions and decimals</li><li>Operations with fractions and decimals</li></ul>",
          audioLessons: [
            {
              id: "audio3",
              title: "Understanding Fractions",
              src: "/placeholder-audio.mp3",
              duration: 210,
            },
          ],
          quiz: {
            id: "quiz2",
          },
        },
        {
          id: "module3",
          courseId: "course2",
          title: "Introduction to Physics",
          description: "Learn the basic concepts of physics and mechanics.",
          content:
            "<p>Physics is the study of matter, energy, and the interaction between them. In this module, we will learn about:</p><ul><li>Motion and forces</li><li>Energy and work</li><li>Simple machines</li></ul>",
          audioLessons: [
            {
              id: "audio4",
              title: "Forces and Motion",
              src: "/placeholder-audio.mp3",
              duration: 300,
            },
          ],
          quiz: {
            id: "quiz3",
          },
        },
      ]
    case "quizzes":
      return [
        {
          id: "quiz1",
          title: "Numbers and Operations Quiz",
          questions: [
            {
              question: "What is 5 + 7?",
              options: ["10", "12", "15", "17"],
              correctAnswer: "12",
            },
            {
              question: "What is 8 × 4?",
              options: ["24", "28", "32", "36"],
              correctAnswer: "32",
            },
            {
              question: "Which of these is NOT a natural number?",
              options: ["1", "10", "0", "100"],
              correctAnswer: "0",
            },
          ],
        },
        {
          id: "quiz2",
          title: "Fractions and Decimals Quiz",
          questions: [
            {
              question: "What is 1/4 as a decimal?",
              options: ["0.25", "0.4", "0.5", "0.75"],
              correctAnswer: "0.25",
            },
            {
              question: "What is 0.75 as a fraction in simplest form?",
              options: ["3/4", "7/5", "75/100", "7/10"],
              correctAnswer: "3/4",
            },
          ],
        },
        {
          id: "quiz3",
          title: "Physics Quiz",
          questions: [
            {
              question: "What is the unit of force?",
              options: ["Watt", "Joule", "Newton", "Volt"],
              correctAnswer: "Newton",
            },
            {
              question: "What is the formula for calculating work?",
              options: ["W = m × g", "W = F × d", "W = m × v²", "W = P × t"],
              correctAnswer: "W = F × d",
            },
          ],
        },
      ]
    default:
      return []
  }
}

// Demo data for live sessions
function getDemoLiveSessions() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  // Create session times
  const session1Start = new Date(now)
  session1Start.setHours(now.getHours() + 1)
  const session1End = new Date(session1Start)
  session1End.setHours(session1Start.getHours() + 1)

  const session2Start = new Date(tomorrow)
  session2Start.setHours(10, 0, 0)
  const session2End = new Date(session2Start)
  session2End.setHours(session2Start.getHours() + 1, 30)

  const session3Start = new Date(yesterday)
  session3Start.setHours(14, 0, 0)
  const session3End = new Date(session3Start)
  session3End.setHours(session3Start.getHours() + 1)

  return [
    {
      id: "session1",
      title: "Introduction to Algebra",
      description: "Learn the basics of algebra including variables, equations, and solving for x.",
      instructor: "Ms. Johnson",
      startTime: session1Start.toISOString(),
      endTime: session1End.toISOString(),
      duration: 60,
      isEnrolled: true,
      participants: 15,
      bandwidthRequirement: "Low (100 Kbps)",
      isRecorded: false,
    },
    {
      id: "session2",
      title: "Advanced Physics Concepts",
      description: "Explore advanced physics concepts including relativity and quantum mechanics.",
      instructor: "Dr. Patel",
      startTime: session2Start.toISOString(),
      endTime: session2End.toISOString(),
      duration: 90,
      isEnrolled: false,
      participants: 8,
      bandwidthRequirement: "Medium (300 Kbps)",
      isRecorded: false,
    },
    {
      id: "session3",
      title: "History of Ancient Civilizations",
      description: "Journey through the ancient civilizations of Egypt, Greece, and Rome.",
      instructor: "Prof. Martinez",
      startTime: session3Start.toISOString(),
      endTime: session3End.toISOString(),
      duration: 60,
      isEnrolled: true,
      participants: 22,
      bandwidthRequirement: "Low (100 Kbps)",
      isRecorded: true,
    },
  ]
}

