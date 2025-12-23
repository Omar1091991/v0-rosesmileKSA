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

    console.log("[v0] 📝 بدء إنشاء Google Sheet")
    console.log("[v0] formId:", formId)
    console.log("[v0] formName:", formName)

    if (!formId || !formName) {
      console.log("[v0] ❌ معرف النموذج واسمه مطلوبان")
      return NextResponse.json({ error: "معرف النموذج واسمه مطلوبان" }, { status: 400 })
    }

    // التحقق من وجود النموذج
    console.log("[v0] 🔍 التحقق من وجود النموذج في قاعدة البيانات...")
    const formResult = await db.query("SELECT id, google_sheet_id, google_sheet_url FROM booking_forms WHERE id = $1", [
      formId,
    ])

    if (formResult.rows.length === 0) {
      console.log("[v0] ❌ النموذج غير موجود")
      return NextResponse.json({ error: "النموذج غير موجود" }, { status: 404 })
    }

    console.log("[v0] ✅ تم العثور على النموذج")

    // إذا كان هناك شيت مرتبط بالفعل
    if (formResult.rows[0].google_sheet_id) {
      console.log("[v0] ⚠️ الشيت مرتبط بالفعل")
      return NextResponse.json({
        success: true,
        sheetId: formResult.rows[0].google_sheet_id,
        sheetUrl: formResult.rows[0].google_sheet_url,
        message: "الشيت مرتبط بالفعل",
      })
    }

    console.log("[v0] 🚀 إرسال طلب إلى Apps Script...")
    console.log("[v0] Apps Script URL:", APPS_SCRIPT_URL)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 ثانية timeout

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          type: "create_form",
          formName: formName,
        }),
        signal: controller.signal,
        redirect: "follow", // متابعة إعادة التوجيه تلقائياً
      })

      clearTimeout(timeoutId)

      console.log("[v0] 📬 حالة الاستجابة:", response.status)
      console.log("[v0] 📬 نوع الاستجابة:", response.headers.get("content-type"))

      const responseText = await response.text()
      console.log("[v0] 📬 نص الاستجابة:", responseText)

      if (!response.ok) {
        console.error("[v0] ❌ Apps Script error status:", response.status)
        throw new Error(`فشل في إنشاء الشيت: ${response.status} - ${responseText}`)
      }

      // محاولة تحليل JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[v0] ❌ فشل تحليل JSON:", parseError)
        throw new Error(`استجابة غير صالحة من Apps Script: ${responseText}`)
      }

      console.log("[v0] 📬 البيانات المستلمة:", JSON.stringify(data))

      if (!data.sheetId || !data.sheetUrl) {
        console.error("[v0] ❌ لم يتم إرجاع معرف الشيت")
        throw new Error("لم يتم إرجاع معرف الشيت من Apps Script")
      }

      // تحديث النموذج بمعرف الشيت
      console.log("[v0] 💾 تحديث قاعدة البيانات...")
      await db.query("UPDATE booking_forms SET google_sheet_id = $1, google_sheet_url = $2 WHERE id = $3", [
        data.sheetId,
        data.sheetUrl,
        formId,
      ])

      console.log("[v0] ✅ تم إنشاء وربط الشيت بنجاح!")

      return NextResponse.json({
        success: true,
        sheetId: data.sheetId,
        sheetUrl: data.sheetUrl,
        message: "تم إنشاء وربط الشيت بنجاح",
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === "AbortError") {
        console.error("[v0] ❌ انتهت مهلة الطلب")
        throw new Error("انتهت مهلة الاتصال بـ Apps Script (30 ثانية)")
      }

      throw fetchError
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في إنشاء Google Sheet:", error.message)
    console.error("[v0] ❌ تفاصيل الخطأ:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء إنشاء الشيت" }, { status: 500 })
  }
}
