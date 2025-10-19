import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

async function getPrivacyPolicy() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/site-settings`, {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Error fetching settings:", response.statusText)
      return ""
    }

    const data = await response.json()
    const settings = Array.isArray(data) ? data : data.settings || []
    const privacyPolicy = settings.find((s: any) => s.key === "privacy_policy_content")
    return privacyPolicy?.value_ar || ""
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
