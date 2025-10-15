import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 })
    }

    // البحث عن المستخدم في قاعدة البيانات
    const result = await query("SELECT id, email, full_name, role, password FROM profiles WHERE email = $1", [email])

    console.log("[v0] Query result rows:", result.rows.length)

    if (result.rows.length === 0) {
      console.log("[v0] User not found")
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    const user = result.rows[0]
    console.log("[v0] User found:", { email: user.email, role: user.role })

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      console.log("[v0] Password mismatch")
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    console.log("[v0] Password match - creating session")

    // إنشاء جلسة جديدة
    const sessionId = createSession({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    })

    // حفظ معرف الجلسة في الكوكيز
    const cookieStore = await cookies()
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 ساعة
    })

    return NextResponse.json({
      success: true,
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 })
  }
}
