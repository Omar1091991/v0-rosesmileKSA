"use client"

import { useEffect } from "react"

import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, FileText, Loader2 } from "lucide-react"
import { PermissionGuard } from "@/components/permission-guard"
import { TextFormatter } from "@/components/text-formatter"
import type React from "react"

interface Article {
  id: string
  title_ar: string
  title_en: string
  content_ar?: string
  content_en?: string
  excerpt_ar?: string
  excerpt_en?: string
  image_url?: string
  author?: string
  published: boolean
  created_at: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    excerpt_ar: "",
    excerpt_en: "",
    image_url: "",
    author: "",
    published: true,
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles")
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب المقالات",
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

      setIsUploadingImage(true)
      toast({
        title: "جاري رفع الصورة...",
        description: "يرجى الانتظار",
      })

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setFormData({ ...formData, image_url: base64 })
        setImagePreview(base64)
        setIsUploadingImage(false)
        toast({
          title: "تم رفع الصورة بنجاح",
          description: "يمكنك الآن حفظ المقال",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = async () => {
    if (!formData.title_ar || !formData.content_ar) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    toast({
      title: "جاري الحفظ...",
      description: "يرجى الانتظار",
    })

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "✅ تم الحفظ بنجاح",
          description: "تم إضافة المقال بنجاح",
          className: "bg-green-50 border-green-200",
        })
        setIsAddOpen(false)
        resetForm()
        fetchArticles()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إضافة المقال",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المقال",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!editingArticle) return

    setIsSaving(true)
    toast({
      title: "جاري الحفظ...",
      description: "يرجى الانتظار",
    })

    try {
      const response = await fetch("/api/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingArticle.id, ...formData }),
      })

      if (response.ok) {
        toast({
          title: "✅ تم الحفظ بنجاح",
          description: "تم تحديث المقال بنجاح",
          className: "bg-green-50 border-green-200",
        })
        setIsEditOpen(false)
        resetForm()
        fetchArticles()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تحديث المقال",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المقال",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return

    try {
      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف المقال بنجاح",
        })
        fetchArticles()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف المقال",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المقال",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title_ar: article.title_ar,
      title_en: article.title_en || "",
      content_ar: article.content_ar || "",
      content_en: article.content_en || "",
      excerpt_ar: article.excerpt_ar || "",
      excerpt_en: article.excerpt_en || "",
      image_url: article.image_url || "",
      author: article.author || "",
      published: article.published,
    })
    setImagePreview(article.image_url || "")
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title_ar: "",
      title_en: "",
      content_ar: "",
      content_en: "",
      excerpt_ar: "",
      excerpt_en: "",
      image_url: "",
      author: "",
      published: true,
    })
    setImagePreview("")
    setEditingArticle(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <PermissionGuard permission="articles.read">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8" />
              إدارة المقالات
            </h1>
            <p className="text-muted-foreground mt-2">إضافة وتعديل وحذف المقالات</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة مقال
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة مقال جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_ar">العنوان بالعربية *</Label>
                    <Input
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      placeholder="عنوان المقال"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      placeholder="Article Title"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt_ar">المقتطف بالعربية</Label>
                  <Textarea
                    id="excerpt_ar"
                    value={formData.excerpt_ar}
                    onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                    placeholder="مقتطف قصير عن المقال..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content_ar">المحتوى بالعربية *</Label>
                  <TextFormatter
                    id="content_ar"
                    value={formData.content_ar}
                    onChange={(value) => setFormData({ ...formData, content_ar: value })}
                    placeholder="محتوى المقال..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="content_en">المحتوى بالإنجليزية</Label>
                  <TextFormatter
                    id="content_en"
                    value={formData.content_en}
                    onChange={(value) => setFormData({ ...formData, content_en: value })}
                    placeholder="Article content..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="author">الكاتب</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="اسم الكاتب"
                  />
                </div>

                <div>
                  <Label htmlFor="image">صورة المقال</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploadingImage || isSaving}
                  />
                  {isUploadingImage && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>جاري رفع الصورة...</span>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={handleAdd} className="w-full" disabled={isUploadingImage || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "إضافة المقال"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{article.title_ar}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(article)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {article.image_url && (
                    <img
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title_ar}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    {article.excerpt_ar && <p className="text-sm text-muted-foreground mb-2">{article.excerpt_ar}</p>}
                    {article.author && <p className="text-sm">الكاتب: {article.author}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(article.created_at).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">لا يوجد مقالات حالياً</CardContent>
          </Card>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل المقال</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_title_ar">العنوان بالعربية *</Label>
                  <Input
                    id="edit_title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_title_en">العنوان بالإنجليزية</Label>
                  <Input
                    id="edit_title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit_excerpt_ar">المقتطف بالعربية</Label>
                <Textarea
                  id="edit_excerpt_ar"
                  value={formData.excerpt_ar}
                  onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="edit_content_ar">المحتوى بالعربية *</Label>
                <TextFormatter
                  id="edit_content_ar"
                  value={formData.content_ar}
                  onChange={(value) => setFormData({ ...formData, content_ar: value })}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="edit_content_en">المحتوى بالإنجليزية</Label>
                <TextFormatter
                  id="edit_content_en"
                  value={formData.content_en}
                  onChange={(value) => setFormData({ ...formData, content_en: value })}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="edit_author">الكاتب</Label>
                <Input
                  id="edit_author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit_image">صورة المقال</Label>
                <Input
                  id="edit_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploadingImage || isSaving}
                />
                {isUploadingImage && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري رفع الصورة...</span>
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleEdit} className="w-full" disabled={isUploadingImage || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التعديلات"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}
