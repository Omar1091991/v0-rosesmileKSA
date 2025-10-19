let settingsCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 60000 // 60 ثانية

export async function getCachedSettings() {
  const now = Date.now()

  // إذا كان هناك cache صالح، استخدمه
  if (settingsCache && now - settingsCache.timestamp < CACHE_DURATION) {
    console.log("[v0] Using cached settings")
    return settingsCache.data
  }

  // جلب البيانات من API
  try {
    const response = await fetch("/api/site-settings", {
      next: { revalidate: 60 }, // Next.js caching
    })

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }

    const data = await response.json()

    // تحديث cache
    settingsCache = {
      data,
      timestamp: now,
    }

    console.log("[v0] Settings cached successfully")
    return data
  } catch (error) {
    console.error("[v0] Error fetching settings:", error)
    // إذا فشل الجلب وهناك cache قديم، استخدمه
    if (settingsCache) {
      console.log("[v0] Using stale cache due to error")
      return settingsCache.data
    }
    throw error
  }
}

export function clearSettingsCache() {
  settingsCache = null
  console.log("[v0] Settings cache cleared")
}
