import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/auth"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (sessionId) {
      deleteSession(sessionId)
    }

    cookieStore.delete("session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الخروج" }, { status: 500 })
  }
}
