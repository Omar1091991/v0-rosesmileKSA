import { NextResponse } from "next/server"

const DEFAULT_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbztWf9GvFqtZITkuc_5UeLO8GS8S3uW-fQFnDCu22_4gacrHTPtIk-5rsOnwiqOLM469w/exec"

export async function GET() {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL
    const folderId = process.env.GOOGLE_FOLDER_ID || null

    // التحقق من أن الرابط مُعد (إما من متغير البيئة أو الافتراضي)
    const isConfigured = !!appsScriptUrl

    return NextResponse.json({
      appsScriptUrl: appsScriptUrl ? "مُعد" : "غير مُعد",
      folderId,
      isConfigured,
      method: "Apps Script",
      defaultUrlActive: !process.env.GOOGLE_APPS_SCRIPT_URL,
    })
  } catch (error) {
    console.error("Error fetching Google Sheets config:", error)
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}
