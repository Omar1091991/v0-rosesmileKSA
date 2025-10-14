export async function submitToGoogleSheets(data: {
  full_name: string
  phone: string
  service_name: string
  notes?: string
}) {
  try {
    // إرسال البيانات إلى Google Sheets عبر API Route
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit to Google Sheets")
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("[v0] Error submitting to Google Sheets:", error)
    return { success: false, error }
  }
}
