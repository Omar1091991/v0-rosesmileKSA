import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { query } from "@/lib/db"
import { TermsConditionsContent } from "./terms-conditions-content"

async function getTermsConditions() {
  try {
    const result = await query("SELECT setting_value FROM site_settings WHERE setting_key = $1", [
      "terms_conditions_content",
    ])
    const resultEn = await query("SELECT setting_value FROM site_settings WHERE setting_key = $1", [
      "terms_conditions_content_en",
    ])

    return {
      ar: result.rows.length > 0 ? result.rows[0].setting_value || "" : "",
      en: resultEn.rows.length > 0 ? resultEn.rows[0].setting_value || "" : "",
    }
  } catch (error) {
    console.error("[v0] Error fetching terms and conditions from database:", error)
    return { ar: "", en: "" }
  }
}

export default async function TermsConditionsPage() {
  const content = await getTermsConditions()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <TermsConditionsContent contentAr={content.ar} contentEn={content.en} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
