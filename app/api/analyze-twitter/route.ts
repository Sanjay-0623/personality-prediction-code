import { type NextRequest, NextResponse } from "next/server"

async function fetchTwitterUser(username: string, bearerToken: string) {
  const response = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,description`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Twitter account not found. Please check the username and try again.")
    }
    throw new Error("Failed to fetch Twitter user data")
  }

  return response.json()
}

async function fetchTwitterTweets(userId: string, bearerToken: string) {
  const response = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=100&tweet.fields=created_at,public_metrics`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch tweets")
  }

  const data = await response.json()
  return data.data || []
}

function predictPersonality(tweets: string[]): {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
} {
  if (tweets.length === 0) {
    throw new Error("No tweets available for analysis. The account may be private or have no tweets.")
  }

  const combinedText = tweets.join(" ").toLowerCase()
  const wordCount = combinedText.split(/\s+/).length
  const uniqueWords = new Set(combinedText.split(/\s+/)).size
  const avgWordLength = combinedText.replace(/\s/g, "").length / wordCount
  const questionMarks = (combinedText.match(/\?/g) || []).length
  const exclamationMarks = (combinedText.match(/!/g) || []).length

  return {
    openness: Math.min(0.95, Math.max(0.2, (uniqueWords / wordCount) * 1.5)),
    conscientiousness: Math.min(0.95, Math.max(0.2, 0.4 + avgWordLength / 15)),
    extraversion: Math.min(0.95, Math.max(0.2, 0.3 + (exclamationMarks / tweets.length) * 2)),
    agreeableness: Math.min(0.95, Math.max(0.2, 0.5 + (tweets.length > 50 ? 0.2 : 0.1))),
    neuroticism: Math.min(0.95, Math.max(0.2, 0.3 + (questionMarks / tweets.length) * 1.5)),
  }
}

export async function POST(request: NextRequest) {
  try {
    const { twitterHandle } = await request.json()

    if (!twitterHandle) {
      return NextResponse.json({ error: "Twitter handle is required" }, { status: 400 })
    }

    const cleanHandle = twitterHandle.trim().replace(/^@/, "")
    if (!/^[A-Za-z0-9_]{1,15}$/.test(cleanHandle)) {
      return NextResponse.json(
        { error: "Invalid Twitter handle format. Use only letters, numbers, and underscores (max 15 characters)." },
        { status: 400 },
      )
    }

    const bearerToken = process.env.TWITTER_BEARER_TOKEN

    if (!bearerToken) {
      return NextResponse.json(
        {
          error:
            "Twitter API is not configured. Please add TWITTER_BEARER_TOKEN to environment variables to enable real Twitter analysis.",
        },
        { status: 503 },
      )
    }

    console.log("[v0] Fetching Twitter user:", cleanHandle)
    const userData = await fetchTwitterUser(cleanHandle, bearerToken)

    if (!userData.data) {
      return NextResponse.json(
        { error: "Twitter account not found. Please check the username and try again." },
        { status: 404 },
      )
    }

    console.log("[v0] Fetching tweets for user ID:", userData.data.id)
    const tweets = await fetchTwitterTweets(userData.data.id, bearerToken)

    if (!tweets || tweets.length === 0) {
      return NextResponse.json(
        {
          error: `There are no tweets from @${cleanHandle}'s account, so personality results cannot be calculated. Please try a different account with public tweets.`,
        },
        { status: 400 },
      )
    }

    const tweetTexts = tweets.map((tweet: any) => tweet.text)
    console.log("[v0] Analyzing", tweetTexts.length, "tweets")

    const personality = predictPersonality(tweetTexts)

    return NextResponse.json({
      success: true,
      twitterHandle: cleanHandle,
      personality,
      tweetCount: tweetTexts.length,
      message: `Successfully analyzed ${tweetTexts.length} tweets from @${cleanHandle}`,
    })
  } catch (error) {
    console.error("[v0] Twitter analysis error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to analyze Twitter account. Please try again." }, { status: 500 })
  }
}
