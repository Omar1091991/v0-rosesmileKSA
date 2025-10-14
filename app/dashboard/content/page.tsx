"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, FileText, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const CONTENT_SECTIONS = [
  {
    section: "hero",
    title: "القسم الرئيسي (Hero)",
    fields: [
      { key: "hero_title_ar", label: "العنوان الرئيسي", type: "text", defaultValue: "ابتسامة الورود ابتسامتك بتعود" },
      {
        key: "hero_description_ar",
        label: "الوصف",
        type: "textarea",
        defaultValue: "نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة",
      },
      { key: "hero_image_url", label: "صورة القسم", type: "image", defaultValue: "" },
    ],
  },
  {
    section: "features",
    title: "المميزات",
    fields: [
      { key: "feature_1_title_ar", label: "المميزة الأولى - العنوان", type: "text", defaultValue: "أطباء متخصصون" },
      {
        key: "feature_1_description_ar",
        label: "المميزة الأولى - الوصف",
        type: "textarea",
        defaultValue: "فريق طبي متميز من أفضل الأطباء والاستشاريين في مختلف التخصصات",
      },
      { key: "feature_2_title_ar", label: "المميزة الثانية - العنوان", type: "text", defaultValue: "أحدث التقنيات" },
      {
        key: "feature_2_description_ar",
        label: "المميزة الثانية - الوصف",
        type: "textarea",
        defaultValue: "نستخدم أحدث الأجهزة والتقنيات الطبية لضمان أفضل النتائج",
      },
      { key: "feature_3_title_ar", label: "المميزة الثالثة - العنوان", type: "text", defaultValue: "رعاية شاملة" },
      {
        key: "feature_3_description_ar",
        label: "المميزة الثالثة - الوصف",
        type: "textarea",
        defaultValue: "نقدم رعاية طبية شاملة ومتابعة مستمرة لضمان راحتك وصحتك",
      },
    ],
  },
  {
    section: "services",
    title: "قسم الخدمات",
    fields: [
      { key: "services_title_ar", label: "عنوان القسم", type: "text", defaultValue: "خدماتنا الطبية" },
      {
        key: "services_description_ar",
        label: "وصف القسم",
        type: "textarea",
        defaultValue: "نقدم مجموعة شاملة من الخدمات الطبية المتخصصة بأحدث التقنيات وأعلى معايير الجودة",
      },
    ],
  },
  {
    section: "doctors",
    title: "قسم الأطباء",
    fields: [
      { key: "doctors_title_ar", label: "عنوان القسم", type: "text", defaultValue: "أطباؤنا المتميزون" },
      {
        key: "doctors_description_ar",
        label: "وصف القسم",
        type: "textarea",
        defaultValue: "فريق طبي متخصص بخبرات عالمية",
      },
    ],
  },
  {
    section: "why_choose_us",
    title: "لماذا تختارنا",
    fields: [
      {
        key: "why_choose_us_title_ar",
        label: "عنوان القسم",
        type: "text",
        defaultValue: "لماذا تختار عيادات ابتسامة الورود؟",
      },
    ],
  },
  {
    section: "cta",
    title: "دعوة للعمل (CTA)",
    fields: [
      { key: "cta_title_ar", label: "العنوان", type: "text", defaultValue: "هل أنت مستعد لبدء رحلتك نحو صحة أفضل؟" },
      {
        key: "cta_description_ar",
        label: "الوصف",
        type: "textarea",
        defaultValue: "احجز موعدك الآن واحصل على استشارة طبية مجانية",
      },
    ],
  },
]

export default function ContentManagementPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const response = await fetch("/api/site-settings")
      const data = await response.json()

      const settingsMap: Record<string, any> = {}
      data.forEach((setting: any) => {
        settingsMap[setting.key] = setting
      })

      setSettings(settingsMap)

      const previews: Record<string, string> = {}
      data.forEach((setting: any) => {
        if (setting.type === "image" && setting.value_ar) {
          previews[setting.key] = setting.value_ar
        }
      })
      setImagePreview(previews)
    } catch (error) {
      console.error("[v0] Error fetching settings:", error)
      toast({
        title: "خطأ",
        description: "فشل في جلب الإعدادات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const promises = Object.entries(settings).map(async ([key, setting]) => {
        if (setting.id) {
          // تحديث إعداد موجود
          return fetch("/api/site-settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(setting),
          })
        } else {
          // إنشاء إعداد جديد
          return fetch("/api/site-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(setting),
          })
        }
      })

      await Promise.all(promises)

      toast({
        title: "نجح",
        description: "تم حفظ جميع التغييرات بنجاح",
      })

      fetchSettings()
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حفظ التغييرات",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  function handleChange(key: string, value: string, type: string) {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        key,
        value_ar: value,
        value_en: value,
        type,
      },
    }))
  }

  function handleImageUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      handleChange(key, base64, "image")
      setImagePreview((prev) => ({ ...prev, [key]: base64 }))
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            إدارة محتوى الموقع
          </h1>
          <p className="text-muted-foreground mt-2">تعديل جميع النصوص والصور في صفحات الموقع</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="ml-2 h-5 w-5" />
              حفظ جميع التغييرات
            </>
          )}
        </Button>
      </motion.div>

      <div className="space-y-6">
        {CONTENT_SECTIONS.map((section, sectionIndex) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === "text" && (
                      <Input
                        id={field.key}
                        value={settings[field.key]?.value_ar || field.defaultValue}
                        onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                        placeholder={field.defaultValue}
                      />
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        id={field.key}
                        value={settings[field.key]?.value_ar || field.defaultValue}
                        onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                        placeholder={field.defaultValue}
                        rows={3}
                      />
                    )}
                    {field.type === "image" && (
                      <div className="space-y-2">
                        <Input
                          id={field.key}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(field.key, e)}
                        />
                        {imagePreview[field.key] && (
                          <div className="relative w-full aspect-square max-w-xs rounded-lg overflow-hidden border">
                            <img
                              src={imagePreview[field.key] || "/placeholder.svg"}
                              alt={field.label}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                handleChange(field.key, "", field.type)
                                setImagePreview((prev) => {
                                  const newPrev = { ...prev }
                                  delete newPrev[field.key]
                                  return newPrev
                                })
                              }}
                            >
                              حذف
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
