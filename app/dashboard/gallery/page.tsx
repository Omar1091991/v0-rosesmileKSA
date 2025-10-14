"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, ImageIcon } from "lucide-react"

interface GalleryItem {
  id: string
  title_ar?: string
  title_en?: string
  description_ar?: string
  description_en?: string
  image_url: string
  category?: string
  created_at: string
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
    category: "",
  })

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        setGallery(data)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب معرض الصور",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
  }

  const handleAdd = async () => {
    if (!formData.image_url) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار صورة",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم إضافة الصورة بنجاح",
        })
        setIsAddOpen(false)
        resetForm()
        fetchGallery()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إضافة الصورة",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الصورة",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return

    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الصورة بنجاح",
        })
        fetchGallery()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف الصورة",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الصورة",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      image_url: "",
      category: "",
    })
    setImagePreview("")
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            معرض الصور
          </h1>
          <p className="text-muted-foreground mt-2">إضافة وحذف الصور</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة صورة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة صورة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_ar">العنوان بالعربية</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    placeholder="عنوان الصورة"
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Image Title"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_ar">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف الصورة..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="category">الفئة</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="مثال: قبل وبعد، العيادة، الفريق"
                />
              </div>

              <div>
                <Label htmlFor="image">الصورة *</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleAdd} className="w-full">
                إضافة الصورة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative group">
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.title_ar || "صورة"}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {(item.title_ar || item.description_ar) && (
              <CardContent className="p-4">
                {item.title_ar && <h3 className="font-semibold">{item.title_ar}</h3>}
                {item.description_ar && <p className="text-sm text-muted-foreground mt-1">{item.description_ar}</p>}
                {item.category && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="font-medium">الفئة:</span> {item.category}
                  </p>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {gallery.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">لا يوجد صور في المعرض حالياً</CardContent>
        </Card>
      )}
    </div>
  )
}
