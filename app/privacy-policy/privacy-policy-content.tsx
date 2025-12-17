"use client"

import { useLanguage } from "@/components/language-switcher"

interface PrivacyPolicyContentProps {
  contentAr: string
  contentEn: string
}

export function PrivacyPolicyContent({ contentAr, contentEn }: PrivacyPolicyContentProps) {
  const { isArabic } = useLanguage()

  const content = isArabic ? contentAr : contentEn || contentAr
  const title = isArabic ? "سياسة الخصوصية" : "Privacy Policy"
  const emptyMessage = isArabic
    ? "لم يتم إضافة محتوى سياسة الخصوصية بعد."
    : "Privacy policy content has not been added yet."

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">{title}</h1>
      <div
        className="prose prose-lg max-w-none text-foreground space-y-4 [&_strong]:font-bold [&_em]:italic [&_s]:line-through [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:my-2"
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.8",
        }}
        dangerouslySetInnerHTML={{
          __html: content || `<p>${emptyMessage}</p>`,
        }}
      />
    </>
  )
}
