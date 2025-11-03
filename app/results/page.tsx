"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Download, Share2, BarChart3, Twitter, Check } from "lucide-react"

const traitDescriptions = {
  openness: {
    name: "Openness to Experience",
    high: "You are imaginative, creative, and open to new experiences. You enjoy exploring ideas and are intellectually curious.",
    low: "You prefer routine and familiar experiences. You are practical and conventional in your approach to life.",
    color: "bg-purple-500",
  },
  conscientiousness: {
    name: "Conscientiousness",
    high: "You are organized, responsible, and goal-oriented. You have strong self-discipline and prefer structure.",
    low: "You are more flexible and spontaneous. You prefer to go with the flow rather than stick to rigid plans.",
    color: "bg-green-500",
  },
  extraversion: {
    name: "Extraversion",
    high: "You are outgoing, energetic, and enjoy social interactions. You feel comfortable being the center of attention.",
    low: "You are more reserved and prefer quieter environments. You gain energy from solitude and reflection.",
    color: "bg-orange-500",
  },
  agreeableness: {
    name: "Agreeableness",
    high: "You are cooperative, trusting, and empathetic. You value harmony and are considerate of others' feelings.",
    low: "You are more competitive and skeptical. You prefer to be direct and are comfortable with conflict when necessary.",
    color: "bg-blue-500",
  },
  neuroticism: {
    name: "Neuroticism",
    high: "You tend to experience negative emotions more intensely. You may be more sensitive to stress and anxiety.",
    low: "You are emotionally stable and resilient. You handle stress well and maintain calm under pressure.",
    color: "bg-red-500",
  },
}

export default function ResultsPage() {
  const [user, setUser] = useState<any>(null)
  const [shareSuccess, setShareSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!parsedUser.personalityScores) {
      router.push("/questionnaire")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleDownloadReport = () => {
    if (!user || !user.personalityScores) return

    const scores = user.personalityScores
    const isTwitterAnalysis = user.assessmentSource === "twitter"

    // Generate report content
    let reportContent = `PERSONALITY ANALYSIS REPORT\n`
    reportContent += `Generated: ${new Date().toLocaleDateString()}\n`
    reportContent += `User: ${user.username}\n`

    if (isTwitterAnalysis) {
      reportContent += `Analysis Type: Twitter Analysis (@${user.twitterHandle})\n`
    } else {
      reportContent += `Analysis Type: Questionnaire Assessment\n`
    }

    reportContent += `\n${"=".repeat(50)}\n\n`
    reportContent += `BIG FIVE PERSONALITY TRAITS\n\n`

    Object.entries(scores).forEach(([trait, score]) => {
      const traitInfo = traitDescriptions[trait as keyof typeof traitDescriptions]
      const percentage = Math.round((score as number) * 100)
      const isHigh = (score as number) > 0.6

      reportContent += `${traitInfo.name}: ${percentage}%\n`
      reportContent += `${isHigh ? traitInfo.high : traitInfo.low}\n\n`
    })

    reportContent += `${"=".repeat(50)}\n\n`
    reportContent += `SUMMARY\n\n`
    reportContent += `Based on ${isTwitterAnalysis ? "the Twitter analysis" : "your responses"}, you show strong tendencies toward `

    const highTraits = Object.entries(scores)
      .filter(([_, score]) => (score as number) > 0.7)
      .map(([trait]) => traitDescriptions[trait as keyof typeof traitDescriptions].name)

    reportContent += highTraits.join(" and ") + ".\n\n"

    reportContent += `RECOMMENDATIONS\n\n`
    reportContent += `- Consider careers that align with your personality strengths\n`
    reportContent += `- Use your natural traits to improve relationships and communication\n`
    reportContent += `- Work on areas where you scored lower if you want to develop those skills\n`
    reportContent += `- Remember that all personality traits have their strengths and challenges\n`

    // Create and download file
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `personality-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleShareResults = async () => {
    if (!user || !user.personalityScores) return

    const scores = user.personalityScores
    const isTwitterAnalysis = user.assessmentSource === "twitter"

    const highTraits = Object.entries(scores)
      .filter(([_, score]) => (score as number) > 0.7)
      .map(([trait]) => traitDescriptions[trait as keyof typeof traitDescriptions].name)

    const shareText = `I just completed my personality analysis! My top traits are: ${highTraits.join(", ")}. ${
      isTwitterAnalysis ? `Analyzed via Twitter (@${user.twitterHandle})` : "Analyzed via questionnaire"
    }`

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Personality Analysis Results",
          text: shareText,
          url: window.location.origin,
        })
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 3000)
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed")
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 3000)
      } catch (err) {
        console.error("Failed to copy to clipboard:", err)
      }
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const scores = user.personalityScores
  const isTwitterAnalysis = user.assessmentSource === "twitter"

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PersonalityAI</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareResults}
              className={shareSuccess ? "bg-green-50 border-green-500" : ""}
            >
              {shareSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Results Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Personality Analysis Results</h2>
          {isTwitterAnalysis ? (
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Twitter className="h-5 w-5 text-blue-400" />
              <p>
                Based on Twitter analysis of <span className="font-semibold">@{user.twitterHandle}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-600">
              Based on your questionnaire responses, here's your Big Five personality profile
            </p>
          )}
        </div>

        {isTwitterAnalysis && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Twitter className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Twitter Analysis Complete</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    We analyzed recent tweets from @{user.twitterHandle} to predict personality traits using advanced AI
                    and natural language processing.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Analyzed on:</span>{" "}
                      <span className="font-medium">{new Date(user.lastAssessment).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personality Scores */}
        <div className="grid gap-6 mb-8">
          {Object.entries(scores).map(([trait, score]) => {
            const traitInfo = traitDescriptions[trait as keyof typeof traitDescriptions]
            const percentage = Math.round((score as number) * 100)
            const isHigh = (score as number) > 0.6

            return (
              <Card key={trait}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${traitInfo.color}`} />
                      <span>{traitInfo.name}</span>
                    </CardTitle>
                    <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={percentage} className="mb-4" />
                  <p className="text-gray-600">{isHigh ? traitInfo.high : traitInfo.low}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Personality Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Based on {isTwitterAnalysis ? "the Twitter analysis" : "your responses"}, you show strong tendencies
                toward{" "}
                <strong>
                  {Object.entries(scores)
                    .filter(([_, score]) => (score as number) > 0.7)
                    .map(([trait]) => traitDescriptions[trait as keyof typeof traitDescriptions].name)
                    .join(" and ")}
                </strong>
                . This suggests you are a well-rounded individual with distinct personality strengths.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Consider careers that align with your personality strengths</li>
                  <li>• Use your natural traits to improve relationships and communication</li>
                  <li>• Work on areas where you scored lower if you want to develop those skills</li>
                  <li>• Remember that all personality traits have their strengths and challenges</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          {isTwitterAnalysis ? (
            <>
              <Link href="/twitter-analysis">
                <Button variant="outline">Analyze Another Profile</Button>
              </Link>
              <Link href="/questionnaire">
                <Button variant="outline">Take Questionnaire</Button>
              </Link>
            </>
          ) : (
            <Link href="/questionnaire">
              <Button variant="outline">Retake Assessment</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button>View Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
