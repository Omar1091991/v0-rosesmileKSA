import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    const session = getSession(sessionId)

    if (!session) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error("[v0] Session error:", error)
    return NextResponse.json({ user: null })
  }
}
