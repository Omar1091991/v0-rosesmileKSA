import { NextResponse } from "next/server"
import { sendBookingToGoogleSheets } from "@/lib/google-sheets"

export async function GET() {
  try {
    // بيانات تجريبية للاختبار
    const testBooking = {
      full_name: "اختبار الربط",
      phone: "0500000000",
      service_name: "خدمة تجريبية",
      booking_form_name: "نموذج تجريبي",
      notes: "هذا حجز تجريبي للتأكد من عمل الربط مع Google Sheets",
      created_at: new Date().toISOString(),
    }

    console.log("[v0] Testing Google Sheets integration...")
    console.log("[v0] Test booking data:", testBooking)

    // محاولة إرسال البيانات إلى Google Sheets
    await sendBookingToGoogleSheets(testBooking)

    console.log("[v0] ✅ Google Sheets integration test successful!")

    return NextResponse.json({
      success: true,
      message: "تم الاختبار بنجاح! تحقق من Google Sheet الخاص بك.",
      testData: testBooking,
    })
  } catch (error: any) {
    console.error("[v0] ❌ Google Sheets integration test failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "فشل الاختبار",
        error: error.message,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}
