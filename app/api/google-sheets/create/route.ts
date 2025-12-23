import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const APPS_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbztWf9GvFqtZITkuc_5UeLO8GS8S3uW-fQFnDCu22_4gacrHTPtIk-5rsOnwiqOLM469w/exec"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Google Sheets Create API جاهز",
    appsScriptUrl: APPS_SCRIPT_URL ? "مُعد" : "غير مُعد",
    usage: "استخدم POST مع body يحتوي على formId و formName",
  })
}

export async function POST(request: Request) {
  try {
    const { formId, formName } = await request.json()

    if (!formId || !formName) {
      return NextResponse.json({ error: "معرف النموذج واسمه مطلوبان" }, { status: 400 })
    }

    // التحقق من وجود النموذج
    const formResult = await db.query("SELECT id, google_sheet_id, google_sheet_url FROM booking_forms WHERE id = $1", [
      formId,
    ])

    if (formResult.rows.length === 0) {
      return NextResponse.json({ error: "النموذج غير موجود" }, { status: 404 })
    }

    // إذا كان هناك شيت مرتبط بالفعل
    if (formResult.rows[0].google_sheet_id) {
      return NextResponse.json({
        success: true,
        sheetId: formResult.rows[0].google_sheet_id,
        sheetUrl: formResult.rows[0].google_sheet_url,
        message: "الشيت مرتبط بالفعل",
      })
    }

    console.log("[v0] Creating Google Sheet via Apps Script for form:", formName)

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "create_form",
        formName: formName,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Apps Script error:", errorText)
      throw new Error("فشل في إنشاء الشيت عبر Apps Script")
    }

    const data = await response.json()
    console.log("[v0] Apps Script response:", data)

    if (!data.sheetId || !data.sheetUrl) {
      throw new Error("لم يتم إرجاع معرف الشيت من Apps Script")
    }

    // تحديث النموذج بمعرف الشيت
    await db.query("UPDATE booking_forms SET google_sheet_id = $1, google_sheet_url = $2 WHERE id = $3", [
      data.sheetId,
      data.sheetUrl,
      formId,
    ])

    console.log("[v0] ✅ Google Sheet created and linked successfully")

    return NextResponse.json({
      success: true,
      sheetId: data.sheetId,
      sheetUrl: data.sheetUrl,
      message: "تم إنشاء وربط الشيت بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error creating Google Sheet:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء إنشاء الشيت" }, { status: 500 })
  }
}
