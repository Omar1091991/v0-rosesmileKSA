"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Tag, Loader2 } from "lucide-react"
import { ImageLibraryPicker } from "@/components/image-library-picker"

interface Offer {
  id: string
  title_ar: string
  title_en: string
  description_ar?: string
  description_en?: string
  discount_percentage?: number
  original_price?: number
  discounted_price?: number
  valid_until?: string
  image_url?: string
  active: boolean
  created_at: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    discount_percentage: 0,
    original_price: 0,
    discounted_price: 0,
    valid_until: "",
    image_url: "",
    active: true,
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers")
      if (response.ok) {
        const data = await response.json()
        setOffers(data)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب العروض",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, image_url: url })
    setImagePreview(url)
  }

  const handleAdd = async () => {
    if (!formData.title_ar) {
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
      const dataToSend = { ...formData }
      if (!dataToSend.discount_percentage) delete dataToSend.discount_percentage
      if (!dataToSend.original_price) delete dataToSend.original_price
      if (!dataToSend.discounted_price) delete dataToSend.discounted_price
      if (!dataToSend.valid_until) delete dataToSend.valid_until

      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        toast({
          title: "✅ تم الحفظ بنجاح",
          description: "تم إضافة العرض بنجاح",
          className: "bg-green-50 border-green-200",
        })
        setIsAddOpen(false)
        resetForm()
        fetchOffers()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إضافة العرض",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة العرض",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!editingOffer) return

    setIsSaving(true)
    toast({
      title: "جاري الحفظ...",
      description: "يرجى الانتظار",
    })

    try {
      const response = await fetch("/api/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingOffer.id, ...formData }),
      })

      if (response.ok) {
        toast({
          title: "✅ تم الحفظ بنجاح",
          description: "تم تحديث العرض بنجاح",
          className: "bg-green-50 border-green-200",
        })
        setIsEditOpen(false)
        resetForm()
        fetchOffers()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تحديث العرض",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث العرض",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return

    try {
      const response = await fetch("/api/offers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف العرض بنجاح",
        })
        fetchOffers()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف العرض",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف العرض",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      title_ar: offer.title_ar,
      title_en: offer.title_en || "",
      description_ar: offer.description_ar || "",
      description_en: offer.description_en || "",
      discount_percentage: offer.discount_percentage || 0,
      original_price: offer.original_price || 0,
      discounted_price: offer.discounted_price || 0,
      valid_until: offer.valid_until || "",
      image_url: offer.image_url || "",
      active: offer.active,
    })
    setImagePreview(offer.image_url || "")
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      discount_percentage: 0,
      original_price: 0,
      discounted_price: 0,
      valid_until: "",
      image_url: "",
      active: true,
    })
    setImagePreview("")
    setEditingOffer(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="h-8 w-8" />
            إدارة العروض
          </h1>
          <p className="text-muted-foreground mt-2">إضافة وتعديل وحذف العروض</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة عرض
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة عرض جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_ar">العنوان بالعربية *</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    placeholder="عرض خاص"
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Special Offer"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_ar">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف العرض..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Offer description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discount_percentage">نسبة الخصم (%) - اختياري</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    value={formData.discount_percentage || ""}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">السعر الأصلي - اختياري</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price || ""}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="discounted_price">السعر بعد الخصم - اختياري</Label>
                  <Input
                    id="discounted_price"
                    type="number"
                    value={formData.discounted_price || ""}
                    onChange={(e) => setFormData({ ...formData, discounted_price: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="valid_until">صالح حتى - اختياري</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </div>

              <div>
                <Label>صورة العرض</Label>
                <ImageLibraryPicker
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  onUploadStart={() => setIsUploadingImage(true)}
                  onUploadEnd={() => setIsUploadingImage(false)}
                />
              </div>

              <Button onClick={handleAdd} className="w-full" disabled={isUploadingImage || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  "إضافة العرض"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader>
              {offer.image_url && (
                <img
                  src={offer.image_url || "/placeholder.svg"}
                  alt={offer.title_ar}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <CardTitle className="flex items-center justify-between">
                <span>{offer.title_ar}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(offer)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(offer.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offer.description_ar && <p className="text-sm text-muted-foreground mb-2">{offer.description_ar}</p>}
              {offer.discount_percentage && (
                <p className="text-lg font-bold text-primary">خصم {offer.discount_percentage}%</p>
              )}
              {offer.original_price && offer.discounted_price && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="line-through text-muted-foreground">{offer.original_price} ريال</span>
                  <span className="text-lg font-bold text-primary">{offer.discounted_price} ريال</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {offers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">لا يوجد عروض حالياً</CardContent>
        </Card>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل العرض</DialogTitle>
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
              <Label htmlFor="edit_description_ar">الوصف بالعربية</Label>
              <Textarea
                id="edit_description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit_description_en">الوصف بالإنجليزية</Label>
              <Textarea
                id="edit_description_en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit_discount_percentage">نسبة الخصم (%) - اختياري</Label>
                <Input
                  id="edit_discount_percentage"
                  type="number"
                  value={formData.discount_percentage || ""}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit_original_price">السعر الأصلي - اختياري</Label>
                <Input
                  id="edit_original_price"
                  type="number"
                  value={formData.original_price || ""}
                  onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit_discounted_price">السعر بعد الخصم - اختياري</Label>
                <Input
                  id="edit_discounted_price"
                  type="number"
                  value={formData.discounted_price || ""}
                  onChange={(e) => setFormData({ ...formData, discounted_price: Number(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_valid_until">صالح حتى - اختياري</Label>
              <Input
                id="edit_valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              />
            </div>

            <div>
              <Label>صورة العرض</Label>
              <ImageLibraryPicker
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onUploadStart={() => setIsUploadingImage(true)}
                onUploadEnd={() => setIsUploadingImage(false)}
              />
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
  )
}
