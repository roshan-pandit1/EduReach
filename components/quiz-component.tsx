"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useLocalDatabase } from "@/hooks/use-local-database"

interface QuizComponentProps {
  quizId: string
}

export default function QuizComponent({ quizId }: QuizComponentProps) {
  const { getQuiz, saveQuizResult, isLoading, error } = useLocalDatabase("quizzes")
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    const loadQuiz = async () => {
      const quizData = await getQuiz(quizId)
      if (quizData) {
        setQuiz(quizData)
      }
    }

    loadQuiz()
  }, [quizId, getQuiz])

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }))
  }

  const goToNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Calculate score
    let correctAnswers = 0

    quiz.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore(finalScore)
    setIsSubmitted(true)

    // Save result to local database
    await saveQuizResult(quizId, {
      score: finalScore,
      answers: selectedAnswers,
      completedAt: new Date().toISOString(),
    })
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setIsSubmitted(false)
    setScore(null)
  }

  if (isLoading) {
    return <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
  }

  if (error || !quiz) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg text-destructive">
        Failed to load quiz. Please try again later.
      </div>
    )
  }

  const currentQuestionData = quiz.questions[currentQuestion]

  if (isSubmitted) {
    return (
      <div className="text-center p-4">
        <div className="mb-4">
          {score! >= 70 ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
          ) : (
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
        <p className="mb-4">Your score: {score}%</p>

        {score! >= 70 ? (
          <p className="text-green-600 mb-6">Great job! You've passed this quiz.</p>
        ) : (
          <p className="text-yellow-600 mb-6">You might want to review the material and try again.</p>
        )}

        <Button onClick={resetQuiz}>Try Again</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
        <span className="text-sm font-medium">
          {Object.keys(selectedAnswers).length} of {quiz.questions.length} answered
        </span>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h4 className="text-lg font-medium mb-4">{currentQuestionData.question}</h4>

          <RadioGroup value={selectedAnswers[currentQuestion] || ""} onValueChange={handleAnswerSelect}>
            {currentQuestionData.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestion === 0}>
          Previous
        </Button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <Button onClick={goToNextQuestion} disabled={!selectedAnswers[currentQuestion]}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}>
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}

