"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, Upload, Video, Loader2, Play } from "lucide-react"

export default function VideoAnalysisPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file")
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("Video size must be less than 50MB")
        return
      }
      setSelectedVideo(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError("")
    }
  }

  const handleAnalyze = async () => {
    if (!selectedVideo) {
      setError("Please select a video first")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("video", selectedVideo)

      const response = await fetch("/api/analyze-video", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      const updatedUser = {
        ...user,
        personalityScores: data.scores,
        lastAssessment: new Date().toISOString(),
        analysisSource: "video",
        analysisData: {
          videoAnalysis: data.analysis,
        },
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      router.push("/results")
    } catch (err: any) {
      setError(err.message || "Failed to analyze video. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PersonalityAI</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Video Personality Analysis</h2>
          <p className="text-gray-600">Upload a video of a person speaking to analyze their personality traits</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Upload Video
            </CardTitle>
            <CardDescription>
              Upload a video of a single person speaking. The AI will analyze facial expressions, body language, voice
              tone, and speech patterns to predict personality traits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
                id="video-upload"
                disabled={isAnalyzing}
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                {previewUrl ? (
                  <div className="space-y-4">
                    <video src={previewUrl} controls className="max-h-64 mx-auto rounded-lg">
                      <track kind="captions" />
                    </video>
                    <p className="text-sm text-gray-600">Click to change video</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Click to upload a video</p>
                      <p className="text-sm text-gray-500">MP4, MOV, AVI up to 50MB</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Video should be 30 seconds to 2 minutes long</li>
                <li>Person should be clearly visible and speaking</li>
                <li>Good lighting and clear audio quality</li>
                <li>Only one person should be in the video</li>
                <li>Natural conversation or presentation works best</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">What we analyze:</h4>
              <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                <li>Facial expressions and micro-expressions</li>
                <li>Body language and gestures</li>
                <li>Voice tone, pitch, and speaking pace</li>
                <li>Speech patterns and word choice</li>
                <li>Energy levels and engagement</li>
              </ul>
            </div>

            <Button onClick={handleAnalyze} disabled={!selectedVideo || isAnalyzing} className="w-full" size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Video...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Analyze Personality
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
