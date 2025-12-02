import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// User types
export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  is_admin: boolean
  created_at: Date
  updated_at: Date
}

export interface PersonalityResult {
  id: number
  user_id: number
  source_type: "questionnaire" | "twitter" | "image" | "video"
  source_identifier?: string
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  is_demo: boolean
  created_at: Date
}

export interface QuestionnaireResponse {
  id: number
  user_id: number
  result_id: number
  question_number: number
  response: string
  created_at: Date
}
