import { NextResponse } from "next/server"
import { testGoogleSheetsConnection } from "@/lib/google-sheets"

export async function GET() {
  try {
    console.log("[v0] 🔍 بدء التشخيص...")

    const result = await testGoogleSheetsConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        details: result.details,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          details: result.details,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في التشخيص:", error)
    return NextResponse.json(
      {
        success: false,
        message: "خطأ في التشخيص",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
