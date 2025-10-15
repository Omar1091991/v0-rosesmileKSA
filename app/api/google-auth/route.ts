import { NextResponse } from "next/server"
import { google } from "googleapis"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    // إذا كان هناك code، نكمل عملية OAuth
    if (code) {
      // هنا يمكن معالجة الـ code وحفظ الـ tokens
      // لكن نحن نستخدم Service Account، لذا نوجه للصفحة الرئيسية
      return NextResponse.redirect(new URL("/dashboard/google-auth?success=true", request.url))
    }

    // إذا لم يكن هناك code، نبدأ OAuth flow
    // لكن نحن نستخدم Service Account، لذا نوجه مباشرة لصفحة التعليمات
    return NextResponse.redirect(new URL("/dashboard/google-auth?info=service-account", request.url))
  } catch (error) {
    console.error("[v0] Error in Google Auth GET:", error)
    return NextResponse.redirect(new URL("/dashboard/google-auth?error=true", request.url))
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // التحقق من أن المستخدم مسجل دخول وهو admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { credentials, spreadsheetId } = body

    // التحقق من صحة البيانات
    if (!credentials || !spreadsheetId) {
      return NextResponse.json({ error: "Missing credentials or spreadsheet ID" }, { status: 400 })
    }

    // اختبار الاتصال بـ Google Sheets
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(credentials),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      const sheets = google.sheets({ version: "v4", auth })

      // محاولة قراءة الورقة للتأكد من صحة البيانات
      await sheets.spreadsheets.get({
        spreadsheetId,
      })

      return NextResponse.json({
        success: true,
        message: "Google Sheets connection verified successfully",
      })
    } catch (error) {
      console.error("[v0] Google Sheets verification error:", error)
      return NextResponse.json(
        {
          error: "Invalid credentials or spreadsheet ID",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Error in Google Auth API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
