"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

interface Service {
  id: string
  title_ar: string
  title_en: string
}

interface BookingForm {
  id: string
  name_ar: string
  name_en: string
  description_ar: string
  description_en: string
  image_url: string
  google_sheet_id: string
  is_active: boolean
  is_main: boolean
  order_index: number
  booking_form_services?: Array<{
    service_id: string
    services: Service
  }>
}

export default function BookingFormsPage() {
  const [forms, setForms] = useState<BookingForm[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<BookingForm | null>(null)
  const [initializing, setInitializing] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
    google_sheet_id: "",
    is_active: true,
    is_main: false,
    order_index: 0,
  })
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    fetchForms()
    fetchServices()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/booking-forms")
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      } else {
        console.error("[v0] Failed to fetch forms, table might not exist")
      }
    } catch (error) {
      console.error("[v0] Error fetching forms:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data.filter((s: any) => s.is_active))
      }
    } catch (error) {
      console.error("[v0] Error fetching services:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData({ ...formData, image_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = "/api/booking-forms"
      const method = editingForm ? "PATCH" : "POST"
      const body = editingForm
        ? { ...formData, id: editingForm.id, service_ids: selectedServices }
        : { ...formData, service_ids: selectedServices }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: editingForm ? "تم تحديث النموذج بنجاح" : "تم إضافة النموذج بنجاح",
        })
        setOpen(false)
        resetForm()
        fetchForms()
      } else {
        const error = await response.json()
        toast({
          title: "خطأ",
          description: error.error || "فشل في حفظ النموذج",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error saving form:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ النموذج",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (form: BookingForm) => {
    setEditingForm(form)
    setFormData({
      name_ar: form.name_ar,
      name_en: form.name_en || "",
      description_ar: form.description_ar || "",
      description_en: form.description_en || "",
      image_url: form.image_url || "",
      google_sheet_id: form.google_sheet_id || "",
      is_active: form.is_active,
      is_main: form.is_main,
      order_index: form.order_index,
    })
    setImagePreview(form.image_url || "")
    setSelectedServices(form.booking_form_services?.map((s) => s.service_id) || [])
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا النموذج؟")) return

    try {
      const response = await fetch("/api/booking-forms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف النموذج بنجاح",
        })
        fetchForms()
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف النموذج",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      image_url: "",
      google_sheet_id: "",
      is_active: true,
      is_main: false,
      order_index: 0,
    })
    setSelectedServices([])
    setImageFile(null)
    setImagePreview("")
    setEditingForm(null)
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const initializeTables = async () => {
    setInitializing(true)
    try {
      const response = await fetch("/api/booking-forms/init", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تهيئة نماذج الحجز بنجاح",
        })
        fetchForms()
      } else {
        const error = await response.json()
        toast({
          title: "خطأ",
          description: error.error || "فشل في تهيئة الجداول",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error initializing tables:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التهيئة",
        variant: "destructive",
      })
    } finally {
      setInitializing(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
            إدارة نماذج الحجز
          </h1>
          <p className="text-muted-foreground mt-2">إنشاء وتعديل نماذج الحجز المخصصة</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {forms.length === 0 && (
            <Button
              onClick={initializeTables}
              disabled={initializing}
              variant="outline"
              className="flex-1 sm:flex-none bg-transparent"
            >
              {initializing ? "جاري التهيئة..." : "تهيئة النماذج"}
            </Button>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex-1 sm:flex-none">
                <Plus className="ml-2 h-4 w-4" />
                إضافة نموذج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingForm ? "تعديل نموذج الحجز" : "إضافة نموذج حجز جديد"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                    <Input
                      id="name_ar"
                      required
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف بالعربية</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_sheet_id">معرف Google Sheet</Label>
                  <Input
                    id="google_sheet_id"
                    value={formData.google_sheet_id}
                    onChange={(e) => setFormData({ ...formData, google_sheet_id: e.target.value })}
                    placeholder="أدخل معرف Google Sheet"
                  />
                </div>

                <div className="space-y-2">
                  <Label>صورة النموذج</Label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreview && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image src={imagePreview || "/placeholder.svg"} alt="معاينة" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>الخدمات المتاحة في النموذج</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                        />
                        <label htmlFor={service.id} className="text-sm cursor-pointer">
                          {service.title_ar}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">نشط</Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="is_main"
                      checked={formData.is_main}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_main: checked })}
                    />
                    <Label htmlFor="is_main">نموذج رئيسي</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري الحفظ..." : editingForm ? "تحديث النموذج" : "إضافة النموذج"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="truncate">{form.name_ar}</span>
                <div className="flex gap-2 flex-shrink-0">
                  {form.is_main && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">رئيسي</span>
                  )}
                  {!form.is_active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">غير نشط</span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.image_url && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image src={form.image_url || "/placeholder.svg"} alt={form.name_ar} fill className="object-cover" />
                </div>
              )}
              {form.description_ar && (
                <p className="text-sm text-muted-foreground line-clamp-2">{form.description_ar}</p>
              )}
              <div className="text-sm">
                <p className="text-muted-foreground">الخدمات المتاحة:</p>
                <p className="font-medium">{form.booking_form_services?.length || 0} خدمة</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(form)} className="flex-1">
                  <Pencil className="ml-2 h-4 w-4" />
                  تعديل
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(form.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {forms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">لا توجد نماذج حجز.</p>
            <Button onClick={initializeTables} disabled={initializing}>
              {initializing ? "جاري التهيئة..." : "تهيئة نماذج الحجز"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
