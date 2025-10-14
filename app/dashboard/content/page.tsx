"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Plus, Trash2, ImageIcon, FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function ContentManagementPage() {
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    section: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
  })

  useEffect(() => {
    fetchContents()
  }, [])

  async function fetchContents() {
    try {
      const response = await fetch("/api/site-content")
      const data = await response.json()
      setContents(data)
    } catch (error) {
      console.error("[v0] Error fetching contents:", error)
      toast({
        title: "خطأ",
        description: "فشل في جلب المحتوى",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(content: any) {
    setEditingContent(content)
    setFormData({
      section: content.section || "",
      title_ar: content.title_ar || "",
      title_en: content.title_en || "",
      description_ar: content.description_ar || "",
      description_en: content.description_en || "",
      image_url: content.image_url || "",
    })
    setImagePreview(content.image_url || "")
    setDialogOpen(true)
  }

  function handleAdd() {
    setEditingContent(null)
    setFormData({
      section: "",
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      image_url: "",
    })
    setImagePreview("")
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = "/api/site-content"
      const method = editingContent ? "PATCH" : "POST"
      const body = editingContent ? { ...formData, id: editingContent.id } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "فشل في حفظ المحتوى")
      }

      toast({
        title: "نجح",
        description: editingContent ? "تم تحديث المحتوى بنجاح" : "تم إضافة المحتوى بنجاح",
      })

      setDialogOpen(false)
      fetchContents()
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المحتوى؟")) return

    try {
      const response = await fetch(`/api/site-content?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("فشل في حذف المحتوى")

      toast({
        title: "نجح",
        description: "تم حذف المحتوى بنجاح",
      })

      fetchContents()
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      setFormData({ ...formData, image_url: base64 })
      setImagePreview(base64)
    }
    reader.readAsDataURL(file)
  }

  if (loading && contents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
          <p className="text-muted-foreground mt-2">تعديل النصوص والصور في صفحات الموقع</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="lg">
              <Plus className="ml-2 h-5 w-5" />
              إضافة محتوى
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingContent ? "تعديل المحتوى" : "إضافة محتوى جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section">القسم *</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="مثال: hero, about, contact"
                  required
                  disabled={!!editingContent}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_ar">العنوان بالعربية</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    placeholder="العنوان بالعربية"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Title in English"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_ar">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="الوصف بالعربية"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Description in English"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">صورة القسم</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <img src={imagePreview || "/placeholder.svg"} alt="معاينة" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setFormData({ ...formData, image_url: "" })
                        setImagePreview("")
                      }}
                    >
                      حذف
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "جاري الحفظ..." : editingContent ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {contents.map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{content.section}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(content)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(content.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.image_url && (
                  <div className="w-full aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={content.image_url || "/placeholder.svg"}
                      alt={content.title_ar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {content.title_ar && (
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-semibold">{content.title_ar}</p>
                  </div>
                )}
                {content.description_ar && (
                  <div>
                    <p className="text-sm text-muted-foreground">الوصف</p>
                    <p className="text-sm line-clamp-3">{content.description_ar}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {contents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا يوجد محتوى حتى الآن</p>
            <Button onClick={handleAdd} className="mt-4">
              إضافة محتوى جديد
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
