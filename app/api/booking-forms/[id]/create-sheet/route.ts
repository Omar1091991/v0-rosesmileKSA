import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createGoogleSheet } from "@/lib/google-sheets"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    // الحصول على بيانات النموذج
    const formResult = await db.query(
      "SELECT id, name_ar, google_sheet_id, google_sheet_url FROM booking_forms WHERE id = $1",
      [id],
    )

    if (formResult.rows.length === 0) {
      return NextResponse.json({ error: "النموذج غير موجود" }, { status: 404 })
    }

    const form = formResult.rows[0]

    // التحقق من وجود جدول موجود بالفعل
    if (form.google_sheet_id) {
      return NextResponse.json({ error: "يوجد جدول Google Sheet مرتبط بالفعل" }, { status: 400 })
    }

    console.log(`[v0] Creating Google Sheet for form: ${form.name_ar}`)

    // إنشاء جدول Google Sheet جديد
    const sheetResult = await createGoogleSheet(form.name_ar)

    if (!sheetResult.success) {
      return NextResponse.json({ error: "فشل في إنشاء جدول Google Sheet" }, { status: 500 })
    }

    // تحديث قاعدة البيانات بمعلومات الجدول الجديد
    const updateResult = await db.query(
      `UPDATE booking_forms 
       SET google_sheet_id = $1, google_sheet_url = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [sheetResult.spreadsheetId, sheetResult.spreadsheetUrl, id],
    )

    console.log(`[v0] ✅ Google Sheet created successfully for form: ${form.name_ar}`)
    console.log(`[v0] Sheet URL: ${sheetResult.spreadsheetUrl}`)

    return NextResponse.json({
      success: true,
      googleSheetId: sheetResult.spreadsheetId,
      googleSheetUrl: sheetResult.spreadsheetUrl,
    })
  } catch (error: any) {
    console.error("[v0] Error creating Google Sheet:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء إنشاء الجدول" }, { status: 500 })
  }
}
