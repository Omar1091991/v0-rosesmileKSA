// دوال مساعدة لقاعدة البيانات

export async function initializeTables(setInitializing: (value: boolean) => void) {
  setInitializing(true)
  try {
    const response = await fetch("/api/booking-forms/init", {
      method: "POST",
    })

    if (response.ok) {
      // سيتم التعامل مع النجاح في المكون
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return { success: true }
    } else {
      const error = await response.json()
      return { success: false, error: error.error || "فشل في تهيئة الجداول" }
    }
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء التهيئة" }
  } finally {
    setInitializing(false)
  }
}
