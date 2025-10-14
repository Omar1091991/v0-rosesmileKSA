"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, FileText, Loader2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  {
    section: "whatsapp",
    title: "إعدادات الواتساب",
    fields: [
      { key: "whatsapp_number", label: "رقم الواتساب (مع رمز الدولة)", type: "text", defaultValue: "+966500000000" },
      {
        key: "whatsapp_visible",
        label: "إظهار زر الواتساب",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "true",
      },
    ],
  },
  {
    section: "social_media",
    title: "روابط التواصل الاجتماعي",
    fields: [
      { key: "facebook_url", label: "رابط فيسبوك", type: "text", defaultValue: "" },
      {
        key: "facebook_visible",
        label: "إظهار فيسبوك",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "false",
      },
      { key: "twitter_url", label: "رابط تويتر (X)", type: "text", defaultValue: "" },
      {
        key: "twitter_visible",
        label: "إظهار تويتر",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "false",
      },
      { key: "instagram_url", label: "رابط إنستغرام", type: "text", defaultValue: "" },
      {
        key: "instagram_visible",
        label: "إظهار إنستغرام",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "false",
      },
      { key: "linkedin_url", label: "رابط لينكد إن", type: "text", defaultValue: "" },
      {
        key: "linkedin_visible",
        label: "إظهار لينكد إن",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "false",
      },
      { key: "youtube_url", label: "رابط يوتيوب", type: "text", defaultValue: "" },
      {
        key: "youtube_visible",
        label: "إظهار يوتيوب",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "false",
      },
      { key: "tiktok_url", label: "رابط تيك توك", type: "text", defaultValue: "" },
      {
        key: "tiktok_visible",
        label: "إظهار تيك توك",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "false",
      },
      { key: "snapchat_url", label: "رابط سناب شات", type: "text", defaultValue: "" },
      {
        key: "snapchat_visible",
        label: "إظهار سناب شات",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "false",
      },
    ],
  },
  {
    section: "colors",
    title: "ألوان الكتابة",
    fields: [
      { key: "primary_color", label: "اللون الأساسي (الوردي)", type: "color", defaultValue: "#ec4899" },
      { key: "secondary_color", label: "اللون الثانوي (الأزرق)", type: "color", defaultValue: "#3b82f6" },
      { key: "heading_color", label: "لون العناوين", type: "color", defaultValue: "#1f2937" },
      { key: "text_color", label: "لون النصوص", type: "color", defaultValue: "#4b5563" },
    ],
  },
  {
    section: "working_hours",
    title: "ساعات العمل",
    fields: [
      { key: "working_hours_title_ar", label: "عنوان ساعات العمل", type: "text", defaultValue: "ساعات العمل" },
      { key: "saturday_hours", label: "السبت", type: "text", defaultValue: "9:00 ص - 9:00 م" },
      { key: "sunday_hours", label: "الأحد", type: "text", defaultValue: "9:00 ص - 9:00 م" },
      { key: "monday_hours", label: "الاثنين", type: "text", defaultValue: "9:00 ص - 9:00 م" },
      { key: "tuesday_hours", label: "الثلاثاء", type: "text", defaultValue: "9:00 ص - 9:00 م" },
      { key: "wednesday_hours", label: "الأربعاء", type: "text", defaultValue: "9:00 ص - 9:00 م" },
      { key: "thursday_hours", label: "الخميس", type: "text", defaultValue: "9:00 ص - 9:00 م" },
      { key: "friday_hours", label: "الجمعة", type: "text", defaultValue: "مغلق" },
      { key: "working_hours_note", label: "ملاحظة (اختياري)", type: "textarea", defaultValue: "" },
    ],
  },
]

const ANIMATION_SECTIONS = [
  {
    section: "hero_animation",
    title: "تأثيرات القسم الرئيسي",
    fields: [
      {
        key: "hero_animation_type",
        label: "نوع التأثير",
        type: "select",
        options: [
          { value: "fade-up", label: "ظهور من الأسفل" },
          { value: "fade-in", label: "ظهور تدريجي" },
          { value: "scale-in", label: "تكبير تدريجي" },
          { value: "slide-left", label: "انزلاق من اليسار" },
          { value: "slide-right", label: "انزلاق من اليمين" },
          { value: "bounce", label: "ارتداد" },
          { value: "rotate", label: "دوران" },
        ],
        defaultValue: "fade-up",
      },
      {
        key: "hero_animation_duration",
        label: "مدة التأثير (ثانية)",
        type: "number",
        defaultValue: "0.6",
      },
      {
        key: "hero_animation_delay",
        label: "تأخير التأثير (ثانية)",
        type: "number",
        defaultValue: "0",
      },
    ],
  },
  {
    section: "features_animation",
    title: "تأثيرات قسم المميزات",
    fields: [
      {
        key: "features_animation_type",
        label: "نوع التأثير",
        type: "select",
        options: [
          { value: "fade-up", label: "ظهور من الأسفل" },
          { value: "fade-in", label: "ظهور تدريجي" },
          { value: "scale-in", label: "تكبير تدريجي" },
          { value: "slide-left", label: "انزلاق من اليسار" },
          { value: "slide-right", label: "انزلاق من اليمين" },
          { value: "bounce", label: "ارتداد" },
          { value: "rotate", label: "دوران" },
        ],
        defaultValue: "scale-in",
      },
      {
        key: "features_animation_stagger",
        label: "تأخير بين العناصر (ثانية)",
        type: "number",
        defaultValue: "0.1",
      },
    ],
  },
  {
    section: "services_animation",
    title: "تأثيرات قسم الخدمات",
    fields: [
      {
        key: "services_animation_type",
        label: "نوع التأثير",
        type: "select",
        options: [
          { value: "fade-up", label: "ظهور من الأسفل" },
          { value: "fade-in", label: "ظهور تدريجي" },
          { value: "scale-in", label: "تكبير تدريجي" },
          { value: "slide-left", label: "انزلاق من اليسار" },
          { value: "slide-right", label: "انزلاق من اليمين" },
          { value: "bounce", label: "ارتداد" },
          { value: "rotate", label: "دوران" },
        ],
        defaultValue: "fade-up",
      },
      {
        key: "services_animation_stagger",
        label: "تأخير بين العناصر (ثانية)",
        type: "number",
        defaultValue: "0.15",
      },
    ],
  },
  {
    section: "doctors_animation",
    title: "تأثيرات قسم الأطباء",
    fields: [
      {
        key: "doctors_animation_type",
        label: "نوع التأثير",
        type: "select",
        options: [
          { value: "fade-up", label: "ظهور من الأسفل" },
          { value: "fade-in", label: "ظهور تدريجي" },
          { value: "scale-in", label: "تكبير تدريجي" },
          { value: "slide-left", label: "انزلاق من اليسار" },
          { value: "slide-right", label: "انزلاق من اليمين" },
          { value: "bounce", label: "ارتداد" },
          { value: "rotate", label: "دوران" },
        ],
        defaultValue: "scale-in",
      },
      {
        key: "doctors_animation_stagger",
        label: "تأخير بين العناصر (ثانية)",
        type: "number",
        defaultValue: "0.1",
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
      console.log("[v0] Fetching site settings...")
      const response = await fetch("/api/site-settings")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في جلب الإعدادات")
      }

      const data = await response.json()
      console.log("[v0] Settings fetched successfully:", data.length, "settings")

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
    } catch (error: any) {
      console.error("[v0] Error fetching settings:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في جلب الإعدادات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      console.log("[v0] Saving settings...", Object.keys(settings).length, "settings")

      const promises = Object.entries(settings).map(async ([key, setting]) => {
        console.log("[v0] Saving setting:", key, setting)

        if (setting.id) {
          const response = await fetch("/api/site-settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(setting),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`فشل في تحديث ${key}: ${errorData.error}`)
          }

          return response
        } else {
          const response = await fetch("/api/site-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(setting),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`فشل في إنشاء ${key}: ${errorData.error}`)
          }

          return response
        }
      })

      await Promise.all(promises)

      console.log("[v0] All settings saved successfully")

      toast({
        title: "نجح",
        description: "تم حفظ جميع التغييرات بنجاح",
      })

      fetchSettings()
    } catch (error: any) {
      console.error("[v0] Error saving settings:", error)
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
          <p className="text-muted-foreground mt-2">تعديل جميع النصوص والصور والتأثيرات في صفحات الموقع</p>
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

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">
            <FileText className="ml-2 h-4 w-4" />
            المحتوى والنصوص
          </TabsTrigger>
          <TabsTrigger value="animations">
            <Sparkles className="ml-2 h-4 w-4" />
            تأثيرات الحركة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
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
                      {field.type === "color" && (
                        <div className="flex gap-2">
                          <Input
                            id={field.key}
                            type="color"
                            value={settings[field.key]?.value_ar || field.defaultValue}
                            onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                            className="w-20 h-10"
                          />
                          <Input
                            type="text"
                            value={settings[field.key]?.value_ar || field.defaultValue}
                            onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                            placeholder={field.defaultValue}
                            className="flex-1"
                          />
                        </div>
                      )}
                      {field.type === "select" && (
                        <Select
                          value={settings[field.key]?.value_ar || field.defaultValue}
                          onValueChange={(value) => handleChange(field.key, value, field.type)}
                        >
                          <SelectTrigger id={field.key}>
                            <SelectValue placeholder="اختر خياراً" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
        </TabsContent>

        <TabsContent value="animations" className="space-y-6 mt-6">
          {ANIMATION_SECTIONS.map((section, sectionIndex) => (
            <motion.div
              key={section.section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      {field.type === "select" && (
                        <Select
                          value={settings[field.key]?.value_ar || field.defaultValue}
                          onValueChange={(value) => handleChange(field.key, value, field.type)}
                        >
                          <SelectTrigger id={field.key}>
                            <SelectValue placeholder="اختر نوع التأثير" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {field.type === "number" && (
                        <Input
                          id={field.key}
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={settings[field.key]?.value_ar || field.defaultValue}
                          onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                        />
                      )}
                    </div>
                  ))}
                  <div className="mt-6 p-6 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-4">معاينة التأثير:</p>
                    <AnimationPreview
                      type={settings[section.fields[0].key]?.value_ar || section.fields[0].defaultValue}
                      duration={
                        section.fields.find((f) => f.key.includes("duration"))
                          ? Number.parseFloat(
                              settings[section.fields.find((f) => f.key.includes("duration"))!.key]?.value_ar ||
                                section.fields.find((f) => f.key.includes("duration"))!.defaultValue,
                            )
                          : 0.6
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AnimationPreview({ type, duration }: { type: string; duration: number }) {
  const [key, setKey] = useState(0)

  const animations: Record<string, any> = {
    "fade-up": { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    "fade-in": { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "scale-in": { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
    "slide-left": { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    "slide-right": { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    bounce: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
    rotate: { initial: { opacity: 0, rotate: -10 }, animate: { opacity: 1, rotate: 0 } },
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        key={key}
        initial={animations[type]?.initial}
        animate={animations[type]?.animate}
        transition={{ duration, ease: "easeOut" }}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
      >
        مثال على التأثير
      </motion.div>
      <Button variant="outline" size="sm" onClick={() => setKey((k) => k + 1)}>
        إعادة التشغيل
      </Button>
    </div>
  )
}
