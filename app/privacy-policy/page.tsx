import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { query } from "@/lib/db"

async function getPrivacyPolicy() {
  try {
    const result = await query("SELECT setting_value FROM site_settings WHERE setting_key = $1", [
      "privacy_policy_content",
    ])

    if (result.rows.length > 0) {
      return result.rows[0].setting_value || ""
    }

    return ""
  } catch (error) {
    console.error("[v0] Error fetching privacy policy from database:", error)
    return ""
  }
}

export default async function PrivacyPolicyPage() {
  const content = await getPrivacyPolicy()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">سياسة الخصوصية</h1>
          <div
            className="prose prose-lg max-w-none text-foreground space-y-4 [&_strong]:font-bold [&_em]:italic [&_s]:line-through [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:my-2"
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.8",
            }}
            dangerouslySetInnerHTML={{
              __html: content || "<p>لم يتم إضافة محتوى سياسة الخصوصية بعد.</p>",
            }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
