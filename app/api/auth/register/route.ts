import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    console.log("[v0] Registration attempt for:", { username, email })

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters long" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    console.log("[v0] Checking for existing user...")
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} OR username = ${username}
    `

    if (existingUser.length > 0) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 409 })
    }

    // Hash password
    console.log("[v0] Hashing password...")
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    console.log("[v0] Creating user in database...")
    const result = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${passwordHash})
      RETURNING id, username, email, is_admin, created_at
    `

    const user = result[0]
    console.log("[v0] User created successfully:", user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create user"
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
