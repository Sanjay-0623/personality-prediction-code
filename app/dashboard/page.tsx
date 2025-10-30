"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, User, BarChart3, Settings, LogOut, Calendar, Target, Twitter, ImageIcon, Video } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const hasCompletedAssessment = user.personalityScores

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PersonalityAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Track your personality insights and progress</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Assessment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Assessment Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasCompletedAssessment ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-medium">Completed</span>
                    <span className="text-sm text-gray-500">{new Date(user.lastAssessment).toLocaleDateString()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <Link href="/results">
                    <Button size="sm" className="w-full mt-2">
                      View Results
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-orange-600 font-medium">Pending</div>
                  <Progress value={0} className="h-2" />
                  <Link href="/questionnaire">
                    <Button size="sm" className="w-full mt-2">
                      Start Assessment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assessments</span>
                  <span className="font-medium">{hasCompletedAssessment ? 1 : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hasCompletedAssessment ? (
                  <>
                    <div className="text-sm">
                      <div className="font-medium">Assessment Completed</div>
                      <div className="text-gray-500">{new Date(user.lastAssessment).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Profile Updated</div>
                      <div className="text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">No recent activity</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personality Overview */}
        {hasCompletedAssessment && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personality Overview</CardTitle>
              <CardDescription>Your Big Five personality trait scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {Object.entries(user.personalityScores).map(([trait, score]) => (
                  <div key={trait} className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {trait.charAt(0).toUpperCase() + trait.slice(1)}
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{Math.round((score as number) * 100)}%</div>
                    <Progress value={(score as number) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Methods</CardTitle>
            <CardDescription>Choose how you want to analyze personality traits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/questionnaire">
                <Button variant="outline" className="w-full h-auto flex-col gap-3 py-6 bg-transparent">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <div className="font-semibold">Questionnaire</div>
                    <div className="text-xs text-gray-500 mt-1">Answer personality questions</div>
                  </div>
                </Button>
              </Link>

              <Link href="/twitter-analysis">
                <Button variant="outline" className="w-full h-auto flex-col gap-3 py-6 bg-transparent">
                  <Twitter className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <div className="font-semibold">Twitter Analysis</div>
                    <div className="text-xs text-gray-500 mt-1">Analyze tweets and posts</div>
                  </div>
                </Button>
              </Link>

              <Link href="/image-analysis">
                <Button variant="outline" className="w-full h-auto flex-col gap-3 py-6 bg-transparent">
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <div className="font-semibold">Image Analysis</div>
                    <div className="text-xs text-gray-500 mt-1">Upload a photo for analysis</div>
                  </div>
                </Button>
              </Link>

              <Link href="/video-analysis">
                <Button variant="outline" className="w-full h-auto flex-col gap-3 py-6 bg-transparent">
                  <Video className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <div className="font-semibold">Video Analysis</div>
                    <div className="text-xs text-gray-500 mt-1">Upload a video for analysis</div>
                  </div>
                </Button>
              </Link>

              <Link href="/profile">
                <Button variant="outline" className="w-full h-auto flex-col gap-3 py-6 bg-transparent">
                  <Settings className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <div className="font-semibold">Profile Settings</div>
                    <div className="text-xs text-gray-500 mt-1">Update your information</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
