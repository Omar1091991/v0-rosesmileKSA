import type { MetadataRoute } from "next"
import { query } from "@/lib/db"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rosesmileksa.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("[v0] Generating sitemap with BASE_URL:", BASE_URL)

  const sitemap: MetadataRoute.Sitemap = []

  // Static pages with high priority
  sitemap.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  })

  sitemap.push({
    url: `${BASE_URL}/services`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  })

  sitemap.push({
    url: `${BASE_URL}/doctors`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  })

  sitemap.push({
    url: `${BASE_URL}/articles`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  })

  sitemap.push({
    url: `${BASE_URL}/offers`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  })

  sitemap.push({
    url: `${BASE_URL}/departments`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  })

  sitemap.push({
    url: `${BASE_URL}/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  })

  sitemap.push({
    url: `${BASE_URL}/terms-conditions`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  })

  try {
    console.log("[v0] Fetching doctors for sitemap...")
    const doctorsResult = await query("SELECT id, updated_at FROM doctors WHERE is_published = true ORDER BY id")
    console.log("[v0] Found", doctorsResult.rows?.length || 0, "doctors for sitemap")

    if (doctorsResult.rows && Array.isArray(doctorsResult.rows)) {
      for (const doctor of doctorsResult.rows) {
        if (doctor && doctor.id) {
          sitemap.push({
            url: `${BASE_URL}/doctors/${doctor.id}`,
            lastModified: doctor.updated_at ? new Date(doctor.updated_at) : new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
          })
        }
      }
    }

    console.log("[v0] Fetching services for sitemap...")
    const servicesResult = await query("SELECT id, updated_at FROM services ORDER BY id")
    console.log("[v0] Found", servicesResult.rows?.length || 0, "services for sitemap")

    if (servicesResult.rows && Array.isArray(servicesResult.rows)) {
      for (const service of servicesResult.rows) {
        if (service && service.id) {
          sitemap.push({
            url: `${BASE_URL}/services/${service.id}`,
            lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          })
        }
      }
    }

    console.log("[v0] Fetching articles for sitemap...")
    const articlesResult = await query("SELECT id, updated_at FROM articles WHERE is_published = true ORDER BY id DESC")
    console.log("[v0] Found", articlesResult.rows?.length || 0, "articles for sitemap")

    if (articlesResult.rows && Array.isArray(articlesResult.rows)) {
      for (const article of articlesResult.rows) {
        if (article && article.id) {
          sitemap.push({
            url: `${BASE_URL}/articles/${article.id}`,
            lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          })
        }
      }
    }
  } catch (error) {
    console.error("[v0] Error generating dynamic sitemap entries:", error)
  }

  console.log("[v0] Sitemap generated with", sitemap.length, "URLs")

  const validSitemap = sitemap.filter((entry) => {
    const isValid = entry.url && entry.url.startsWith("http")
    if (!isValid) {
      console.error("[v0] Invalid URL in sitemap:", entry.url)
    }
    return isValid
  })

  console.log("[v0] Valid URLs in sitemap:", validSitemap.length)

  return validSitemap
}
