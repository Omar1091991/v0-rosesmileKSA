import { NextResponse } from "next/server"

export async function GET() {
  try {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ""
    const folderId = process.env.GOOGLE_FOLDER_ID || null
    const privateKey = process.env.GOOGLE_PRIVATE_KEY || ""

    const isConfigured = !!(serviceAccountEmail && privateKey)

    return NextResponse.json({
      serviceAccountEmail,
      folderId,
      isConfigured,
    })
  } catch (error) {
    console.error("Error fetching Google Sheets config:", error)
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}
