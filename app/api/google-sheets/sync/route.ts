import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbztWf9GvFqtZITkuc_5UeLO8GS8S3uW-fQFnDCu22_4gacrHTPtIk-5rsOnwiqOLM469w/exec"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Google Sheets Sync API جاهز",
    appsScriptUrl: APPS_SCRIPT_URL ? "مُعد" : "غير مُعد",
    usage: "استخدم POST مع body يحتوي على bookingId و formId و bookingData",
  })
}

export async function POST(request: Request) {
  try {
    const { bookingId, formId, bookingData } = await request.json()

    // جلب معرف الشيت للنموذج
    const formResult = await db.query("SELECT google_sheet_id FROM booking_forms WHERE id = $1", [formId])

    if (formResult.rows.length === 0 || !formResult.rows[0].google_sheet_id) {
      return NextResponse.json({ success: false, message: "لا يوجد شيت مرتبط بهذا النموذج" }, { status: 200 })
    }

    const sheetId = formResult.rows[0].google_sheet_id

    console.log("[v0] Syncing booking to Google Sheet via Apps Script:", bookingId)

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "new_booking",
        sheetId: sheetId,
        name: bookingData.name || "",
        phone: bookingData.phone || "",
        service: bookingData.service || "",
        date: bookingData.bookingDate || "",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Apps Script sync error:", errorText)
      throw new Error("فشل في إضافة الحجز للشيت")
    }

    const data = await response.json()
    console.log("[v0] Apps Script sync response:", data)

    return NextResponse.json({
      success: true,
      message: "تم إضافة الحجز للشيت بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error syncing to Google Sheet:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
