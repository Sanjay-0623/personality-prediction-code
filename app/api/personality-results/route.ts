import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const results = await sql`
      SELECT * FROM personality_results 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ results })
  } catch (error) {
    console.error("[v0] Error fetching personality results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      sourceType,
      sourceIdentifier,
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism,
      isDemo,
    } = await request.json()

    if (!userId || !sourceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO personality_results (
        user_id, source_type, source_identifier,
        openness, conscientiousness, extraversion, agreeableness, neuroticism, is_demo
      )
      VALUES (
        ${userId}, ${sourceType}, ${sourceIdentifier || null},
        ${openness}, ${conscientiousness}, ${extraversion}, ${agreeableness}, ${neuroticism}, ${isDemo || false}
      )
      RETURNING *
    `

    return NextResponse.json({ result: result[0] })
  } catch (error) {
    console.error("[v0] Error saving personality result:", error)
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 })
  }
}
