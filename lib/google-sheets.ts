export async function submitToGoogleSheets(
  data: {
    full_name: string
    phone: string
    service_name: string
    notes?: string
  },
  sheet_id?: string,
) {
  try {
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        sheet_id, // إرسال معرف الـ sheet
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to submit to Google Sheets")
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("[v0] Error submitting to Google Sheets:", error)
    return { success: false, error }
  }
}
