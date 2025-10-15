import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 })
    }

    // البحث عن المستخدم في قاعدة البيانات
    const result = await query("SELECT id, email, full_name, role, password FROM profiles WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    const user = result.rows[0]

    // التحقق من كلمة المرور (في الإنتاج، استخدم bcrypt للتحقق من كلمة المرور المشفرة)
    if (user.password !== password) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

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
