"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

const questions = [
  "Describe a typical day in your life. What activities do you enjoy most?",
  "How do you handle stressful situations? Give an example.",
  "What are your main goals and aspirations for the future?",
  "Describe your ideal social setting. Do you prefer large groups or intimate gatherings?",
  "How do you approach new challenges or unfamiliar tasks?",
  "What kind of activities help you relax and recharge?",
  "How would your friends describe your personality?",
  "What motivates you to work hard or pursue your interests?",
  "How do you make important decisions in your life?",
  "Describe a recent situation where you had to work with others. How did it go?",
]

export default function QuestionnairePage() {
  const [user, setUser] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>(Array(questions.length).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses]
    newResponses[currentQuestion] = value
    setResponses(newResponses)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const analyzePersonality = (responses: string[]) => {
    // Combine all responses into one text
    const allText = responses.join(" ").toLowerCase()

    // Simple keyword-based analysis (in production, use ML model)
    const keywords = {
      openness: ["creative", "curious", "imaginative", "artistic", "new", "explore", "learn", "ideas"],
      conscientiousness: ["organized", "plan", "goal", "responsible", "careful", "detail", "schedule", "complete"],
      extraversion: ["social", "people", "party", "friends", "outgoing", "energetic", "talk", "group"],
      agreeableness: ["help", "kind", "cooperative", "empathy", "understand", "support", "care", "team"],
      neuroticism: ["stress", "worry", "anxious", "nervous", "overwhelm", "pressure", "difficult", "struggle"],
    }

    const scores: any = {}

    for (const [trait, words] of Object.entries(keywords)) {
      let count = 0
      words.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\w*\\b`, "gi")
        const matches = allText.match(regex)
        if (matches) count += matches.length
      })
      // Normalize score between 0.3 and 0.9
      scores[trait] = Math.min(0.9, Math.max(0.3, 0.5 + count * 0.05))
    }

    return scores
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = responses.filter((r) => r.trim().length < 20)
    if (unanswered.length > 0) {
      alert("Please provide detailed responses (at least 20 characters) for all questions.")
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Analyze personality
    const personalityScores = analyzePersonality(responses)

    // Update user data
    const updatedUser = {
      ...user,
      personalityScores,
      lastAssessment: new Date().toISOString(),
      responses,
      analysisSource: "questionnaire",
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Navigate to results
    router.push("/results")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = responses[currentQuestion].trim().length >= 20

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PersonalityAI</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Personality Assessment</h2>
          <p className="text-gray-600">Answer the questions thoughtfully to get accurate results</p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-blue-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-base">{questions[currentQuestion]}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={responses[currentQuestion]}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Type your response here... (minimum 20 characters)"
              className="min-h-[200px] text-base"
            />
            <div className="mt-2 text-sm text-gray-500">
              {responses[currentQuestion].length} characters
              {responses[currentQuestion].length < 20 && (
                <span className="text-orange-600 ml-2">
                  (Need at least {20 - responses[currentQuestion].length} more)
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentQuestion
                    ? "bg-blue-600"
                    : responses[index].trim().length >= 20
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting}>
              {isSubmitting ? (
                "Analyzing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Assessment
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">Tips for Better Results</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be honest and authentic in your responses</li>
              <li>• Provide detailed answers with specific examples</li>
              <li>• Take your time to reflect on each question</li>
              <li>• There are no right or wrong answers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
