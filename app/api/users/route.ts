import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const result = await db.query(
      "SELECT id, full_name, email, phone, role, created_at FROM profiles ORDER BY created_at DESC",
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, full_name, phone, role } = body

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور والاسم الكامل مطلوبة" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    const existingUser = await db.query("SELECT email FROM profiles WHERE email = $1", [email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db.query(
      `INSERT INTO profiles (full_name, email, phone, role, password) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, full_name, email, phone, role`,
      [full_name, email, phone || null, role || "user", hashedPassword],
    )

    return NextResponse.json({
      success: true,
      user: result.rows[0],
    })
  } catch (error: any) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ غير متوقع أثناء إضافة المستخدم" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, full_name, role, phone, password } = body

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await db.query("UPDATE profiles SET full_name = $1, role = $2, phone = $3, password = $4 WHERE id = $5", [
        full_name,
        role,
        phone,
        hashedPassword,
        id,
      ])
    } else {
      await db.query("UPDATE profiles SET full_name = $1, role = $2, phone = $3 WHERE id = $4", [
        full_name,
        role,
        phone,
        id,
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    await db.query("DELETE FROM profiles WHERE id = $1", [userId])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 })
  }
}
