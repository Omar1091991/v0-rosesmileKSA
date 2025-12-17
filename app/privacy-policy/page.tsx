import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { query } from "@/lib/db"
import { PrivacyPolicyContent } from "./privacy-policy-content"

async function getPrivacyPolicy() {
  try {
    const result = await query("SELECT setting_value FROM site_settings WHERE setting_key = $1", [
      "privacy_policy_content",
    ])
    const resultEn = await query("SELECT setting_value FROM site_settings WHERE setting_key = $1", [
      "privacy_policy_content_en",
    ])

    return {
      ar: result.rows.length > 0 ? result.rows[0].setting_value || "" : "",
      en: resultEn.rows.length > 0 ? resultEn.rows[0].setting_value || "" : "",
    }
  } catch (error) {
    console.error("[v0] Error fetching privacy policy from database:", error)
    return { ar: "", en: "" }
  }
}

export default async function PrivacyPolicyPage() {
  const content = await getPrivacyPolicy()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <PrivacyPolicyContent contentAr={content.ar} contentEn={content.en} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
