"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Save, FileText, Loader2, Sparkles, X, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImagePicker } from "@/components/image-picker"
import Image from "next/image"

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
      { key: "hero_images", label: "صور القسم (متعددة)", type: "images", defaultValue: "[]" },
      { key: "hero_slideshow_duration", label: "مدة عرض كل صورة (ثانية)", type: "number", defaultValue: "5" },
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
]

const BACKGROUND_COLOR_SECTIONS = [
  {
    section: "global_backgrounds",
    title: "ألوان الخلفية العامة",
    fields: [
      { key: "site_background_color", label: "لون خلفية الموقع بالكامل", type: "color", defaultValue: "#ffe1f3" },
      { key: "header_background_color", label: "لون خلفية رأس الصفحة", type: "color", defaultValue: "#ffffff" },
      { key: "footer_background_color", label: "لون خلفية تذييل الصفحة", type: "color", defaultValue: "#1f2937" },
    ],
  },
  {
    section: "section_backgrounds",
    title: "ألوان خلفية الأقسام",
    fields: [
      { key: "hero_background_color", label: "لون خلفية القسم الرئيسي", type: "color", defaultValue: "#ffffff" },
      { key: "features_background_color", label: "لون خلفية قسم المميزات", type: "color", defaultValue: "#f9fafb" },
      { key: "services_background_color", label: "لون خلفية قسم الخدمات", type: "color", defaultValue: "#ffffff" },
      { key: "doctors_background_color", label: "لون خلفية قسم الأطباء", type: "color", defaultValue: "#f9fafb" },
      {
        key: "why_choose_us_background_color",
        label: "لون خلفية قسم لماذا تختارنا",
        type: "color",
        defaultValue: "#ffffff",
      },
      { key: "cta_background_color", label: "لون خلفية قسم دعوة للعمل", type: "color", defaultValue: "#ec4899" },
      {
        key: "working_hours_background_color",
        label: "لون خلفية قسم ساعات العمل",
        type: "color",
        defaultValue: "#f9fafb",
      },
    ],
  },
  {
    section: "text_colors",
    title: "ألوان النصوص حسب القسم",
    fields: [
      { key: "hero_title_color", label: "لون عنوان القسم الرئيسي", type: "color", defaultValue: "#1f2937" },
      { key: "hero_description_color", label: "لون وصف القسم الرئيسي", type: "color", defaultValue: "#4b5563" },
      { key: "features_title_color", label: "لون عنوان قسم المميزات", type: "color", defaultValue: "#1f2937" },
      { key: "features_text_color", label: "لون نص قسم المميزات", type: "color", defaultValue: "#4b5563" },
      { key: "services_title_color", label: "لون عنوان قسم الخدمات", type: "color", defaultValue: "#1f2937" },
      { key: "services_text_color", label: "لون نص قسم الخدمات", type: "color", defaultValue: "#4b5563" },
      { key: "doctors_title_color", label: "لون عنوان قسم الأطباء", type: "color", defaultValue: "#1f2937" },
      { key: "doctors_text_color", label: "لون نص قسم الأطباء", type: "color", defaultValue: "#4b5563" },
      { key: "working_hours_title_color", label: "لون عنوان ساعات العمل", type: "color", defaultValue: "#1f2937" },
      { key: "working_hours_text_color", label: "لون نص ساعات العمل", type: "color", defaultValue: "#4b5563" },
      { key: "cta_title_color", label: "لون عنوان دعوة للعمل", type: "color", defaultValue: "#ffffff" },
      { key: "cta_text_color", label: "لون نص دعوة للعمل", type: "color", defaultValue: "#ffffff" },
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

const CAROUSEL_SETTINGS = [
  {
    section: "services_carousel",
    title: "إعدادات التمرير التلقائي - قسم الخدمات",
    fields: [
      {
        key: "services_carousel_items_per_view",
        label: "عدد الخدمات المعروضة في كل مرة",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "6",
      },
      {
        key: "services_carousel_scroll_duration",
        label: "مدة التمرير التلقائي (ثانية)",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "10",
      },
      {
        key: "services_carousel_direction",
        label: "اتجاه التمرير",
        type: "select",
        options: [
          { value: "right", label: "من اليسار إلى اليمين" },
          { value: "left", label: "من اليمين إلى اليسار" },
        ],
        defaultValue: "left",
      },
      {
        key: "services_carousel_auto_scroll",
        label: "تفعيل التمرير التلقائي",
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
    section: "doctors_carousel",
    title: "إعدادات التمرير التلقائي - قسم الأطباء",
    fields: [
      {
        key: "doctors_carousel_items_per_view",
        label: "عدد الأطباء المعروضين في كل مرة",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "6",
      },
      {
        key: "doctors_carousel_scroll_duration",
        label: "مدة التمرير التلقائي (ثانية)",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "10",
      },
      {
        key: "doctors_carousel_direction",
        label: "اتجاه التمرير",
        type: "select",
        options: [
          { value: "right", label: "من اليسار إلى اليمين" },
          { value: "left", label: "من اليمين إلى اليسار" },
        ],
        defaultValue: "left",
      },
      {
        key: "doctors_carousel_auto_scroll",
        label: "تفعيل التمرير التلقائي",
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
    section: "articles_carousel",
    title: "إعدادات التمرير التلقائي - قسم المقالات",
    fields: [
      {
        key: "articles_carousel_items_per_view",
        label: "عدد المقالات المعروضة في كل مرة",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "6",
      },
      {
        key: "articles_carousel_scroll_duration",
        label: "مدة التمرير التلقائي (ثانية)",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "10",
      },
      {
        key: "articles_carousel_direction",
        label: "اتجاه التمرير",
        type: "select",
        options: [
          { value: "right", label: "من اليسار إلى اليمين" },
          { value: "left", label: "من اليمين إلى اليسار" },
        ],
        defaultValue: "left",
      },
      {
        key: "articles_carousel_auto_scroll",
        label: "تفعيل التمرير التلقائي",
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
    section: "offers_carousel",
    title: "إعدادات التمرير التلقائي - قسم العروض",
    fields: [
      {
        key: "offers_carousel_items_per_view",
        label: "عدد العروض المعروضة في كل مرة",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "6",
      },
      {
        key: "offers_carousel_scroll_duration",
        label: "مدة التمرير التلقائي (ثانية)",
        type: "number",
        defaultValue: "3",
        min: "1",
        max: "10",
      },
      {
        key: "offers_carousel_direction",
        label: "اتجاه التمرير",
        type: "select",
        options: [
          { value: "right", label: "من اليسار إلى اليمين" },
          { value: "left", label: "من اليمين إلى اليسار" },
        ],
        defaultValue: "left",
      },
      {
        key: "offers_carousel_auto_scroll",
        label: "تفعيل التمرير التلقائي",
        type: "select",
        options: [
          { value: "true", label: "نعم" },
          { value: "false", label: "لا" },
        ],
        defaultValue: "true",
      },
    ],
  },
]

export default function ContentManagementPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingSection, setSavingSection] = useState<string | null>(null)
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

      const responseData = await response.json()
      const data = Array.isArray(responseData) ? responseData : responseData.settings || []
      console.log("[v0] Settings fetched successfully:", data.length, "settings")

      const settingsMap: Record<string, any> = {}
      data.forEach((setting: any) => {
        settingsMap[setting.key] = setting
      })

      setSettings(settingsMap)
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

  async function handleSaveSection(sectionFields: string[]) {
    setSavingSection(sectionFields[0]) // Use the first field key as a general indicator for the section
    try {
      console.log("[v0] Saving section settings...", sectionFields)

      const promises = sectionFields.map(async (key) => {
        const setting = settings[key]
        if (!setting) return

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

      console.log("[v0] Section settings saved successfully")

      toast({
        title: "نجح",
        description: "تم حفظ التغييرات بنجاح",
      })

      await fetchSettings() // Refresh settings after saving
    } catch (error: any) {
      console.error("[v0] Error saving section settings:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في حفظ التغييرات",
        variant: "destructive",
      })
    } finally {
      setSavingSection(null)
    }
  }

  function handleChange(key: string, value: string, type: string) {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        key,
        value_ar: value,
        value_en: value, // Assuming value_en should also be updated for consistency
        type,
      },
    }))
  }

  function handleHeroImagesChange(images: string[]) {
    const imagesJson = JSON.stringify(images)
    setSettings((prev) => ({
      ...prev,
      hero_images: {
        ...prev.hero_images,
        key: "hero_images",
        value_ar: imagesJson,
        value_en: imagesJson,
        type: "text",
      },
    }))
  }

  function getHeroImages(): string[] {
    try {
      const value = settings.hero_images?.value_ar || "[]"
      return JSON.parse(value)
    } catch {
      return []
    }
  }

  function addHeroImage(url: string) {
    const currentImages = getHeroImages()
    handleHeroImagesChange([...currentImages, url])
  }

  function removeHeroImage(index: number) {
    const currentImages = getHeroImages()
    handleHeroImagesChange(currentImages.filter((_, i) => i !== index))
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
              <Loader2 className="ml-2 h-5 w-5 animate-spin text-primary mx-auto" />
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">
            <FileText className="ml-2 h-4 w-4" />
            المحتوى والنصوص
          </TabsTrigger>
          <TabsTrigger value="colors">
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            ألوان الخلفيات والنصوص
          </TabsTrigger>
          <TabsTrigger value="animations">
            <Sparkles className="ml-2 h-4 w-4" />
            تأثيرات الحركة
          </TabsTrigger>
          <TabsTrigger value="carousel">
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            التمرير التلقائي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          {CONTENT_SECTIONS.map((section, sectionIndex) => {
            const sectionFieldKeys = section.fields.map((f) => f.key)
            const isSavingThisSection = savingSection && sectionFieldKeys.includes(savingSection)

            return (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <Button
                      onClick={() => handleSaveSection(sectionFieldKeys)}
                      disabled={isSavingThisSection || saving}
                      size="sm"
                      variant="outline"
                    >
                      {isSavingThisSection ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="ml-2 h-4 w-4" />
                          حفظ {section.title}
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        {field.type === "text" && (
                          <Input
                            id={field.key}
                            value={settings[field.key]?.value_ar ?? field.defaultValue ?? ""}
                            onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                            placeholder={field.defaultValue}
                          />
                        )}
                        {field.type === "textarea" && (
                          <Textarea
                            id={field.key}
                            value={settings[field.key]?.value_ar ?? field.defaultValue ?? ""}
                            onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                            placeholder={field.defaultValue}
                            rows={3}
                          />
                        )}
                        {field.type === "number" && (
                          <Input
                            id={field.key}
                            type="number"
                            step="0.5"
                            min="1"
                            max="30"
                            value={settings[field.key]?.value_ar ?? field.defaultValue ?? ""}
                            onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                            placeholder={field.defaultValue}
                          />
                        )}
                        {field.type === "select" && (
                          <Select
                            value={settings[field.key]?.value_ar ?? field.defaultValue ?? ""}
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
                          <ImagePicker
                            value={settings[field.key]?.value_ar ?? ""}
                            onChange={(url) => handleChange(field.key, url, field.type)}
                            onRemove={() => handleChange(field.key, "", field.type)}
                          />
                        )}
                        {field.type === "images" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {getHeroImages().map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border">
                                    <Image
                                      src={imageUrl || "/placeholder.svg"}
                                      alt={`صورة ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeHeroImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                                    صورة {index + 1}
                                  </div>
                                </div>
                              ))}
                              <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                                <ImagePicker
                                  value=""
                                  onChange={(url) => addHeroImage(url)}
                                  onRemove={() => {}}
                                  trigger={
                                    <Button type="button" variant="ghost" className="h-full w-full">
                                      <Plus className="h-8 w-8 text-muted-foreground" />
                                    </Button>
                                  }
                                />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              أضف صور متعددة للقسم الرئيسي. سيتم عرضها بشكل متتابع حسب المدة المحددة.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </TabsContent>

        <TabsContent value="colors" className="space-y-6 mt-6">
          {BACKGROUND_COLOR_SECTIONS.map((section, sectionIndex) => {
            const sectionFieldKeys = section.fields.map((f) => f.key)
            const isSavingThisSection = savingSection && sectionFieldKeys.includes(savingSection)

            return (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <Button
                      onClick={() => handleSaveSection(sectionFieldKeys)}
                      disabled={isSavingThisSection || saving}
                      size="sm"
                      variant="outline"
                    >
                      {isSavingThisSection ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="ml-2 h-4 w-4" />
                          حفظ {section.title}
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
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
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange(field.key, field.defaultValue, field.type)}
                          >
                            إعادة تعيين
                          </Button>
                        </div>
                        <div
                          className="w-full h-16 rounded-lg border-2 border-dashed"
                          style={{ backgroundColor: settings[field.key]?.value_ar || field.defaultValue }}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </TabsContent>

        <TabsContent value="animations" className="space-y-6 mt-6">
          {ANIMATION_SECTIONS.map((section, sectionIndex) => {
            const sectionFieldKeys = section.fields.map((f) => f.key)
            const isSavingThisSection = savingSection && sectionFieldKeys.includes(savingSection)

            return (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      {section.title}
                    </CardTitle>
                    <Button
                      onClick={() => handleSaveSection(sectionFieldKeys)}
                      disabled={isSavingThisSection || saving}
                      size="sm"
                      variant="outline"
                    >
                      {isSavingThisSection ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="ml-2 h-4 w-4" />
                          حفظ {section.title}
                        </>
                      )}
                    </Button>
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
            )
          })}
        </TabsContent>

        <TabsContent value="carousel" className="space-y-6 mt-6">
          {CAROUSEL_SETTINGS.map((section, sectionIndex) => {
            const sectionFieldKeys = section.fields.map((f) => f.key)
            const isSavingThisSection = savingSection && sectionFieldKeys.includes(savingSection)

            return (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <Button
                      onClick={() => handleSaveSection(sectionFieldKeys)}
                      disabled={isSavingThisSection || saving}
                      size="sm"
                      variant="outline"
                    >
                      {isSavingThisSection ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="ml-2 h-4 w-4" />
                          حفظ {section.title}
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        {field.type === "number" && (
                          <Input
                            id={field.key}
                            type="number"
                            step="1"
                            min={field.min || "1"}
                            max={field.max || "10"}
                            value={settings[field.key]?.value_ar ?? field.defaultValue ?? ""}
                            onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                            placeholder={field.defaultValue}
                          />
                        )}
                        {field.type === "select" && (
                          <Select
                            value={settings[field.key]?.value_ar ?? field.defaultValue ?? ""}
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
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
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
