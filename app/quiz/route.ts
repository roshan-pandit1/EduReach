import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get quiz ID from query params
  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get("id")

  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
  }

  try {
    // In a real app, this would fetch from a database
    // For demo purposes, we'll return mock data with a small payload
    const quiz = getMockQuiz(quizId)

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    if (!body.quizId || !body.answers) {
      return NextResponse.json({ error: "Quiz ID and answers are required" }, { status: 400 })
    }

    // In a real app, this would save to a database and calculate the score
    // For demo purposes, we'll return a mock result
    const result = {
      quizId: body.quizId,
      score: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
      correctAnswers: Math.floor(Math.random() * 5) + 3, // Random number between 3-7
      totalQuestions: 10,
      completedAt: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}

// Mock quiz data with minimal payload
function getMockQuiz(quizId: string) {
  const quizzes = {
    quiz1: {
      id: "quiz1",
      title: "Basic Mathematics Quiz",
      questions: [
        {
          id: "q1",
          text: "What is 5 + 7?",
          options: ["10", "12", "15", "17"],
          // Note: In a real app, we wouldn't send the correct answer to the client
          // It would be validated server-side
        },
        {
          id: "q2",
          text: "What is 8 × 4?",
          options: ["24", "28", "32", "36"],
        },
      ],
    },
    quiz2: {
      id: "quiz2",
      title: "Fractions Quiz",
      questions: [
        {
          id: "q1",
          text: "What is 1/4 as a decimal?",
          options: ["0.25", "0.4", "0.5", "0.75"],
        },
        {
          id: "q2",
          text: "What is 0.75 as a fraction?",
          options: ["3/4", "7/5", "75/100", "7/10"],
        },
      ],
    },
  }

  return quizzes[quizId as keyof typeof quizzes] || null
}

