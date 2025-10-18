import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { db } from "@/lib/db"

async function getPrivacyPolicy() {
  try {
    const result = await db.query("SELECT * FROM site_settings WHERE setting_key = 'privacy_policy_content'")
    return result.rows[0]?.setting_value || ""
  } catch (error) {
    console.error("Error fetching privacy policy:", error)
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
            className="prose prose-lg max-w-none text-foreground space-y-4"
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: content || "<p>لم يتم إضافة محتوى سياسة الخصوصية بعد.</p>" }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
