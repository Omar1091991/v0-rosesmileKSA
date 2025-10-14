import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // التحقق من صلاحيات المسؤول
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // جلب جميع المستخدمين
    const { data: users, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ users })
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // التحقق من صلاحيات المسؤول
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "ليس لديك صلاحية لإضافة مستخدمين" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, full_name, phone, role } = body

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور والاسم الكامل مطلوبة" }, { status: 400 })
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 })
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const { data: existingUser } = await supabase.from("profiles").select("email").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 })
    }

    // إنشاء مستخدم جديد في Supabase Auth
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (authError) {
      console.error("[v0] Auth error:", authError)
      if (authError.message.includes("already registered")) {
        return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 })
      }
      return NextResponse.json({ error: `فشل في إنشاء الحساب: ${authError.message}` }, { status: 500 })
    }

    // إنشاء البروفايل
    const { error: profileError } = await supabase.from("profiles").insert({
      id: newUser.user.id,
      full_name,
      email,
      phone: phone || null,
      role: role || "user",
    })

    if (profileError) {
      console.error("[v0] Profile error:", profileError)
      await supabase.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json({ error: `فشل في حفظ بيانات المستخدم: ${profileError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email,
        full_name,
        phone,
        role: role || "user",
      },
    })
  } catch (error: any) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ غير متوقع أثناء إضافة المستخدم" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    // التحقق من صلاحيات المسؤول
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id, full_name, role, phone } = body

    // تحديث البروفايل
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name,
        role,
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    // التحقق من صلاحيات المسؤول
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // حذف المستخدم من Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) throw authError

    // حذف البروفايل
    const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)
    if (profileError) throw profileError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 })
  }
}
