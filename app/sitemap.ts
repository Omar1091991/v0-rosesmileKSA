import type { MetadataRoute } from "next"
import { query } from "@/lib/db"

const BASE_URL = "https://rosesmileksa.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/doctors`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/offers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/departments`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  try {
    const doctorsResult = await query("SELECT id, updated_at FROM doctors WHERE is_published = true ORDER BY id")

    if (doctorsResult?.rows && Array.isArray(doctorsResult.rows)) {
      doctorsResult.rows.forEach((doctor: any) => {
        if (doctor?.id && typeof doctor.id === "number") {
          sitemap.push({
            url: `${BASE_URL}/doctors/${doctor.id}`,
            lastModified: doctor.updated_at ? new Date(doctor.updated_at) : new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
          })
        }
      })
    }

    const servicesResult = await query("SELECT id, updated_at FROM services ORDER BY id")

    if (servicesResult?.rows && Array.isArray(servicesResult.rows)) {
      servicesResult.rows.forEach((service: any) => {
        if (service?.id && typeof service.id === "number") {
          sitemap.push({
            url: `${BASE_URL}/services/${service.id}`,
            lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          })
        }
      })
    }

    const articlesResult = await query("SELECT id, updated_at FROM articles WHERE is_published = true ORDER BY id DESC")

    if (articlesResult?.rows && Array.isArray(articlesResult.rows)) {
      articlesResult.rows.forEach((article: any) => {
        if (article?.id && typeof article.id === "number") {
          sitemap.push({
            url: `${BASE_URL}/articles/${article.id}`,
            lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          })
        }
      })
    }
  } catch (error) {
    console.error("[v0] Error generating dynamic sitemap entries:", error)
  }

  return sitemap.filter((entry) => {
    return entry.url && typeof entry.url === "string" && entry.url.startsWith("https://rosesmileksa.com")
  })
}
