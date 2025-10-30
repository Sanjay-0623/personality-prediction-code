import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PersonalityAI</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Your Personality Through <span className="text-blue-600">AI Analysis</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Our advanced AI system analyzes your writing patterns and responses to provide insights into your personality
          based on the Big Five personality traits.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="px-8 py-3">
              Start Your Analysis
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Answer Questions</CardTitle>
              <CardDescription>Complete our comprehensive personality questionnaire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our scientifically-backed questions help us understand your personality traits and behavioral patterns.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>Advanced natural language processing analyzes your responses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI examines your writing style, word choice, and response patterns to predict personality traits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Get Insights</CardTitle>
              <CardDescription>Receive detailed personality analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get comprehensive insights into your Big Five personality traits with personalized recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 PersonalityAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
