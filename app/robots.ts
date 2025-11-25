import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rosesmileksa.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/auth/", "/api/", "/database-fix/", "/database-test/", "/setup/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
