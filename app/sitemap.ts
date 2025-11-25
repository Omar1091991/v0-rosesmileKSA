import type { MetadataRoute } from "next"
import { query } from "@/lib/db"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rosesmileksa.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    // Fetch all doctors
    const doctorsResult = await query("SELECT id, updated_at FROM doctors WHERE is_published = true ORDER BY id")

    for (const doctor of doctorsResult.rows) {
      sitemap.push({
        url: `${BASE_URL}/doctors/${doctor.id}`,
        lastModified: doctor.updated_at ? new Date(doctor.updated_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    }

    // Fetch all services
    const servicesResult = await query("SELECT id, updated_at FROM services ORDER BY id")

    for (const service of servicesResult.rows) {
      sitemap.push({
        url: `${BASE_URL}/services/${service.id}`,
        lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }

    // Fetch all published articles
    const articlesResult = await query("SELECT id, updated_at FROM articles WHERE is_published = true ORDER BY id DESC")

    for (const article of articlesResult.rows) {
      sitemap.push({
        url: `${BASE_URL}/articles/${article.id}`,
        lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      })
    }
  } catch (error) {
    console.error("[v0] Error generating sitemap:", error)
  }

  return sitemap
}
