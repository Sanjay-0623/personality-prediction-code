"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Twitter, ArrowLeft, Loader2 } from "lucide-react"

export default function TwitterAnalysisPage() {
  const router = useRouter()
  const [twitterHandle, setTwitterHandle] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze-twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twitterHandle: twitterHandle.replace("@", "") }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze Twitter account")
      }

      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        user.personalityScores = data.personality
        user.lastAssessment = new Date().toISOString()
        user.assessmentSource = "twitter"
        user.twitterHandle = twitterHandle.replace("@", "")
        user.isDemo = data.isDemo || false
        user.tweetCount = data.tweetCount
        localStorage.setItem("user", JSON.stringify(user))
      }

      router.push("/results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PersonalityAI</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Twitter className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-3xl">Twitter Personality Analysis</CardTitle>
              </div>
              <CardDescription>
                Analyze personality traits based on Twitter posts. Enter any public Twitter handle to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="twitter-handle">Twitter Handle</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl text-gray-500">@</span>
                    <Input
                      id="twitter-handle"
                      type="text"
                      placeholder="elonmusk"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      required
                      disabled={isAnalyzing}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Enter the Twitter handle without the @ symbol</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-semibold mb-2">Analysis Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                    {error.includes("rate limit") && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <p className="text-sm text-red-700 font-medium mb-2">Alternative options:</p>
                        <div className="space-y-1">
                          <Link href="/questionnaire">
                            <Button variant="outline" size="sm" className="w-full bg-white">
                              Take Questionnaire Instead
                            </Button>
                          </Link>
                          <Link href="/image-analysis">
                            <Button variant="outline" size="sm" className="w-full bg-white">
                              Try Image Analysis
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Note:</h4>
                  <p className="text-sm text-amber-800">
                    If Twitter API rate limits are reached, the system will provide simulated demo results to
                    demonstrate the personality analysis feature.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We analyze recent tweets from the account</li>
                    <li>• AI processes writing style and content</li>
                    <li>• Results show Big Five personality traits</li>
                    <li>• Only public accounts can be analyzed</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Twitter Account...
                    </>
                  ) : (
                    <>
                      <Twitter className="mr-2 h-4 w-4" />
                      Analyze Personality
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
