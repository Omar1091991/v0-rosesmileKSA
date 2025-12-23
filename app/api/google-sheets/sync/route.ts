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

    console.log("[v0] 📝 بدء مزامنة الحجز مع Google Sheet")
    console.log("[v0] bookingId:", bookingId)
    console.log("[v0] formId:", formId)

    // جلب معرف الشيت للنموذج
    const formResult = await db.query("SELECT google_sheet_id, google_sheet_url FROM booking_forms WHERE id = $1", [
      formId,
    ])

    console.log("[v0] Form result:", formResult.rows)

    if (formResult.rows.length === 0) {
      console.log("[v0] ❌ النموذج غير موجود")
      return NextResponse.json({ success: false, message: "النموذج غير موجود" }, { status: 404 })
    }

    if (!formResult.rows[0].google_sheet_id) {
      console.log("[v0] ⚠️ لا يوجد شيت مرتبط بهذا النموذج")
      return NextResponse.json({ success: false, message: "لا يوجد شيت مرتبط بهذا النموذج" }, { status: 200 })
    }

    const sheetId = formResult.rows[0].google_sheet_id

    console.log("[v0] 🔗 Sheet ID:", sheetId)
    console.log("[v0] 🚀 إرسال الحجز إلى Apps Script...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          type: "new_booking",
          sheetId: sheetId,
          name: bookingData.name || "",
          phone: bookingData.phone || "",
          service: bookingData.service || "",
          date: bookingData.bookingDate || "",
        }),
        signal: controller.signal,
        redirect: "follow",
      })

      clearTimeout(timeoutId)

      console.log("[v0] 📬 حالة الاستجابة:", response.status)

      const responseText = await response.text()
      console.log("[v0] 📬 نص الاستجابة:", responseText)

      if (!response.ok) {
        console.error("[v0] ❌ Apps Script sync error:", response.status)
        throw new Error("فشل في إضافة الحجز للشيت")
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        data = { success: true }
      }

      console.log("[v0] ✅ تم مزامنة الحجز بنجاح")

      return NextResponse.json({
        success: true,
        message: "تم إضافة الحجز للشيت بنجاح",
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === "AbortError") {
        console.error("[v0] ❌ انتهت مهلة الطلب")
        throw new Error("انتهت مهلة الاتصال بـ Apps Script")
      }

      throw fetchError
    }
  } catch (error: any) {
    console.error("[v0] ❌ Error syncing to Google Sheet:", error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
