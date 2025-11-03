import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createGoogleSheet } from "@/lib/google-sheets"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    const formResult = await db.query(
      "SELECT id, name_ar, google_sheet_id, google_sheet_url FROM booking_forms WHERE id = $1",
      [id],
    )

    if (formResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "النموذج غير موجود", errorType: "FORM_NOT_FOUND" },
        { status: 404 },
      )
    }

    const form = formResult.rows[0]

    if (form.google_sheet_id) {
      return NextResponse.json(
        {
          success: false,
          error: "يوجد جدول Google Sheet مرتبط بالفعل",
          errorType: "SHEET_ALREADY_EXISTS",
          sheetUrl: form.google_sheet_url,
        },
        { status: 400 },
      )
    }

    console.log(`[v0] إنشاء جدول Google Sheet للنموذج: ${form.name_ar}`)

    const sheetResult = await createGoogleSheet(form.name_ar)

    if (!sheetResult.success) {
      console.error("[v0] فشل إنشاء الجدول:", sheetResult.error)
      return NextResponse.json(
        {
          success: false,
          error: `فشل في إنشاء جدول Google Sheet: ${sheetResult.error}`,
          errorType: "SHEET_CREATION_FAILED",
          details: sheetResult.error,
        },
        { status: 500 },
      )
    }

    console.log("[v0] تحديث قاعدة البيانات بمعلومات الجدول الجديد...")
    const updateResult = await db.query(
      `UPDATE booking_forms 
       SET google_sheet_id = $1, google_sheet_url = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [sheetResult.spreadsheetId, sheetResult.spreadsheetUrl, id],
    )

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "فشل في تحديث قاعدة البيانات",
          errorType: "DB_UPDATE_FAILED",
        },
        { status: 500 },
      )
    }

    console.log(`[v0] ✅ تم إنشاء جدول Google Sheet بنجاح للنموذج: ${form.name_ar}`)
    console.log(`[v0] رابط الجدول: ${sheetResult.spreadsheetUrl}`)

    return NextResponse.json({
      success: true,
      message: "تم إنشاء جدول Google Sheet بنجاح",
      googleSheetId: sheetResult.spreadsheetId,
      googleSheetUrl: sheetResult.spreadsheetUrl,
    })
  } catch (error: any) {
    console.error("[v0] خطأ في إنشاء جدول Google Sheet:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الجدول",
        errorType: "UNKNOWN_ERROR",
      },
      { status: 500 },
    )
  }
}
