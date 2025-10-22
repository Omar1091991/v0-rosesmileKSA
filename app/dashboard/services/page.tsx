"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Briefcase, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { TextFormatter } from "@/components/text-formatter"
import { ImageLibraryPicker } from "@/components/image-library-picker"

interface Service {
  id: string
  title_ar: string
  title_en?: string
  subtitle_ar?: string
  subtitle_en?: string
  description_ar: string
  description_en?: string
  icon?: string
  image_url?: string
  is_active: boolean
  order_index: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [editImagePreview, setEditImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [newService, setNewService] = useState({
    title_ar: "",
    title_en: "",
    subtitle_ar: "",
    subtitle_en: "",
    description_ar: "",
    description_en: "",
    icon: "",
    image_url: "",
    is_active: true,
    order_index: 0,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/services")
      const data = await response.json()
      if (Array.isArray(data)) {
        setServices(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching services:", error)
      toast({
        title: "خطأ",
        description: "فشل في جلب الخدمات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async () => {
    if (!newService.title_ar || !newService.description_ar) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
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
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create service")
      }

      toast({
        title: "✅ تم الحفظ بنجاح",
        description: `تم إضافة الخدمة ${newService.title_ar} بنجاح`,
        className: "bg-green-50 border-green-200",
      })

      setIsAddOpen(false)
      setImagePreview("")
      setNewService({
        title_ar: "",
        title_en: "",
        subtitle_ar: "",
        subtitle_en: "",
        description_ar: "",
        description_en: "",
        icon: "",
        image_url: "",
        is_active: true,
        order_index: 0,
      })
      await fetchServices()
    } catch (error: any) {
      console.error("[v0] Error creating service:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة الخدمة",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateService = async () => {
    if (!selectedService) return

    setIsSaving(true)
    toast({
      title: "جاري الحفظ...",
      description: "يرجى الانتظار",
    })

    try {
      const response = await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedService),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update service")
      }

      toast({
        title: "✅ تم الحفظ بنجاح",
        description: `تم تحديث الخدمة ${selectedService.title_ar} بنجاح`,
        className: "bg-green-50 border-green-200",
      })

      setIsEditOpen(false)
      setEditImagePreview("")
      setSelectedService(null)
      await fetchServices()
    } catch (error: any) {
      console.error("[v0] Error updating service:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث الخدمة",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/services?id=${serviceId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete service")
      }

      toast({
        title: "نجح",
        description: "تم حذف الخدمة بنجاح",
      })

      await fetchServices()
    } catch (error: any) {
      console.error("[v0] Error deleting service:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف الخدمة",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            إدارة الخدمات
          </h1>
          <p className="text-muted-foreground mt-2">إضافة وتعديل وحذف الخدمات الطبية</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} disabled={loading || isSaving}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      {loading && services.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      ) : services.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">لا توجد خدمات حالياً</p>
            <Button size="sm" className="mt-4" onClick={() => setIsAddOpen(true)} disabled={loading || isSaving}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة أول خدمة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {service.image_url && (
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={service.image_url || "/placeholder.svg"}
                        alt={service.title_ar}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {service.icon && <span className="text-2xl">{service.icon}</span>}
                      <h3 className="font-semibold text-lg">{service.title_ar}</h3>
                    </div>
                    {service.subtitle_ar && (
                      <div className="flex items-center gap-2 text-sm">
                        <h4 className="font-medium text-base">{service.subtitle_ar}</h4>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className={service.is_active ? "text-green-600" : "text-red-600"}>
                        {service.is_active ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setSelectedService(service)
                        setEditImagePreview(service.image_url || "")
                        setIsEditOpen(true)
                      }}
                      disabled={loading || isSaving}
                    >
                      <Pencil className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={loading || isSaving}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Service Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              إضافة خدمة جديدة
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>صورة الخدمة</Label>
              <ImageLibraryPicker
                value={newService.image_url}
                onChange={(url) => setNewService({ ...newService, image_url: url })}
                onUploadStart={() => setIsUploadingImage(true)}
                onUploadEnd={() => setIsUploadingImage(false)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_ar">
                العنوان بالعربية <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title_ar"
                value={newService.title_ar}
                onChange={(e) => setNewService({ ...newService, title_ar: e.target.value })}
                placeholder="مثال: تقويم الأسنان"
                disabled={loading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
              <Input
                id="title_en"
                value={newService.title_en}
                onChange={(e) => setNewService({ ...newService, title_en: e.target.value })}
                placeholder="Example: Orthodontics"
                disabled={loading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle_ar">العنوان الفرعي بالعربية</Label>
              <Input
                id="subtitle_ar"
                value={newService.subtitle_ar}
                onChange={(e) => setNewService({ ...newService, subtitle_ar: e.target.value })}
                placeholder="مثال: حلول متقدمة لابتسامة مثالية"
                disabled={loading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle_en">العنوان الفرعي بالإنجليزية</Label>
              <Input
                id="subtitle_en"
                value={newService.subtitle_en}
                onChange={(e) => setNewService({ ...newService, subtitle_en: e.target.value })}
                placeholder="Example: Advanced solutions for a perfect smile"
                disabled={loading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ar">
                الوصف بالعربية <span className="text-destructive">*</span>
              </Label>
              <TextFormatter
                id="description_ar"
                value={newService.description_ar}
                onChange={(value) => setNewService({ ...newService, description_ar: value })}
                placeholder="وصف تفصيلي للخدمة"
                rows={4}
                disabled={loading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
              <TextFormatter
                id="description_en"
                value={newService.description_en}
                onChange={(value) => setNewService({ ...newService, description_en: value })}
                placeholder="Detailed service description"
                rows={4}
                disabled={loading || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">أيقونة (Emoji)</Label>
              <Input
                id="icon"
                value={newService.icon}
                onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                placeholder="🦷"
                disabled={loading || isSaving}
              />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_active"
                checked={newService.is_active}
                onCheckedChange={(checked) => setNewService({ ...newService, is_active: checked })}
                disabled={loading || isSaving}
              />
              <Label htmlFor="is_active">نشط</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isUploadingImage || isSaving}>
              إلغاء
            </Button>
            <Button onClick={handleAddService} disabled={isUploadingImage || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                "إضافة الخدمة"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              تعديل الخدمة
            </DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>صورة الخدمة</Label>
                <ImageLibraryPicker
                  value={selectedService.image_url || ""}
                  onChange={(url) => setSelectedService({ ...selectedService, image_url: url })}
                  onUploadStart={() => setIsUploadingImage(true)}
                  onUploadEnd={() => setIsUploadingImage(false)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_title_ar">العنوان بالعربية</Label>
                <Input
                  id="edit_title_ar"
                  value={selectedService.title_ar}
                  onChange={(e) => setSelectedService({ ...selectedService, title_ar: e.target.value })}
                  disabled={loading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_title_en">العنوان بالإنجليزية</Label>
                <Input
                  id="edit_title_en"
                  value={selectedService.title_en || ""}
                  onChange={(e) => setSelectedService({ ...selectedService, title_en: e.target.value })}
                  disabled={loading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_subtitle_ar">العنوان الفرعي بالعربية</Label>
                <Input
                  id="edit_subtitle_ar"
                  value={selectedService.subtitle_ar || ""}
                  onChange={(e) => setSelectedService({ ...selectedService, subtitle_ar: e.target.value })}
                  disabled={loading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_subtitle_en">العنوان الفرعي بالإنجليزية</Label>
                <Input
                  id="edit_subtitle_en"
                  value={selectedService.subtitle_en || ""}
                  onChange={(e) => setSelectedService({ ...selectedService, subtitle_en: e.target.value })}
                  disabled={loading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description_ar">الوصف بالعربية</Label>
                <TextFormatter
                  id="edit_description_ar"
                  value={selectedService.description_ar}
                  onChange={(value) => setSelectedService({ ...selectedService, description_ar: value })}
                  rows={4}
                  disabled={loading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description_en">الوصف بالإنجليزية</Label>
                <TextFormatter
                  id="edit_description_en"
                  value={selectedService.description_en || ""}
                  onChange={(value) => setSelectedService({ ...selectedService, description_en: value })}
                  rows={4}
                  disabled={loading || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_icon">أيقونة (Emoji)</Label>
                <Input
                  id="edit_icon"
                  value={selectedService.icon || ""}
                  onChange={(e) => setSelectedService({ ...selectedService, icon: e.target.value })}
                  disabled={loading || isSaving}
                />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="edit_is_active"
                  checked={selectedService.is_active}
                  onCheckedChange={(checked) => setSelectedService({ ...selectedService, is_active: checked })}
                  disabled={loading || isSaving}
                />
                <Label htmlFor="edit_is_active">نشط</Label>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUploadingImage || isSaving}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateService} disabled={isUploadingImage || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
