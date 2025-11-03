"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, FileText, Star, X, RefreshCw, Settings } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { ImagePicker } from "@/components/image-picker"
import { TextFormatter } from "@/components/text-formatter"
import { toast } from "@/hooks/use-toast"
import { BookingFormActions } from "@/components/booking-form-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

interface Service {
  id: string
  title_ar: string
  title_en: string
}

interface CustomService {
  id: string
  title_ar: string
  title_en?: string
  description_ar?: string
}

interface BookingForm {
  id: string
  name_ar: string
  name_en: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  image_url: string
  is_active: boolean
  is_main: boolean
  order_index: number
  google_sheet_id?: string
  google_sheet_url?: string
  custom_services?: CustomService[]
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
  const [showReauthDialog, setShowReauthDialog] = useState(false)
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
    is_active: true,
    is_main: false,
    order_index: 0,
  })
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [customServices, setCustomServices] = useState<CustomService[]>([])
  const [formUrl, setFormUrl] = useState<string>("")
  const [newCustomService, setNewCustomService] = useState({ title_ar: "", title_en: "", description_ar: "" })

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
        console.error("[v0] Failed to fetch forms")
        setForms([])
      }
    } catch (error) {
      console.error("[v0] Error fetching forms:", error)
      setForms([])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = "/api/booking-forms"
      const method = editingForm ? "PATCH" : "POST"
      const body = editingForm
        ? { ...formData, id: editingForm.id, service_ids: selectedServices, custom_services: customServices }
        : { ...formData, service_ids: selectedServices, custom_services: customServices }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const savedForm = await response.json()

        const baseUrl = window.location.origin
        const bookingUrl = `${baseUrl}/booking/${savedForm.id || editingForm?.id}`
        setFormUrl(bookingUrl)

        toast({
          title: "نجح ✓",
          description: editingForm ? "تم تحديث النموذج بنجاح" : "تم إضافة النموذج بنجاح",
        })

        fetchForms()

        if (!editingForm) {
          // للنماذج الجديدة، عرض رابط النموذج
        } else {
          setOpen(false)
          resetForm()
        }
      } else {
        const error = await response.json()
        toast({
          title: "خطأ",
          description: error.error || "فشل في حفظ النموذج",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving form:", error)
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
      name_ar: form.name_ar ?? "",
      name_en: form.name_en ?? "",
      title_ar: form.title_ar ?? "",
      title_en: form.title_en ?? "",
      description_ar: form.description_ar ?? "",
      description_en: form.description_en ?? "",
      image_url: form.image_url ?? "",
      is_active: form.is_active ?? true,
      is_main: form.is_main ?? false,
      order_index: form.order_index ?? 0,
    })
    setSelectedServices(form.booking_form_services?.map((s) => s.service_id) || [])
    setCustomServices(form.custom_services || [])
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
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      image_url: "",
      is_active: true,
      is_main: false,
      order_index: 0,
    })
    setSelectedServices([])
    setCustomServices([])
    setEditingForm(null)
    setFormUrl("")
    setNewCustomService({ title_ar: "", title_en: "", description_ar: "" })
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handleAddCustomService = () => {
    if (!newCustomService.title_ar.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الخدمة",
        variant: "destructive",
      })
      return
    }

    const customService: CustomService = {
      id: `custom_${Date.now()}`,
      title_ar: newCustomService.title_ar,
      title_en: newCustomService.title_en || newCustomService.title_ar,
      description_ar: newCustomService.description_ar,
    }

    setCustomServices([...customServices, customService])
    setNewCustomService({ title_ar: "", title_en: "", description_ar: "" })

    toast({
      title: "تمت الإضافة",
      description: "تم إضافة الخدمة المخصصة",
    })
  }

  const removeCustomService = (serviceId: string) => {
    setCustomServices(customServices.filter((s) => s.id !== serviceId))
    toast({
      title: "تم الحذف",
      description: "تم حذف الخدمة المخصصة",
    })
  }

  const toggleFormActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/booking-forms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: !currentStatus ? "تم تفعيل النموذج" : "تم تعطيل النموذج",
        })
        fetchForms()
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تغيير حالة النموذج",
        variant: "destructive",
      })
    }
  }

  const setAsMainForm = async (id: string) => {
    try {
      const response = await fetch("/api/booking-forms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_main: true }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تعيين النموذج كنموذج رئيسي",
        })
        fetchForms()
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعيين النموذج",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} إلى الحافظة`,
    })
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
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
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

        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReauthDialog(true)}
            className="gap-2 flex-1 sm:flex-none bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة مصادقة Google
          </Button>

          <Button variant="outline" size="sm" asChild className="gap-2 flex-1 sm:flex-none bg-transparent">
            <Link href="/dashboard/google-sheets-setup">
              <Settings className="h-4 w-4" />
              إعدادات Google
            </Link>
          </Button>

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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingForm ? "تعديل نموذج الحجز" : "إضافة نموذج حجز جديد"}
                </DialogTitle>
              </DialogHeader>

              {formUrl && !editingForm && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-semibold">تم إنشاء النموذج بنجاح!</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-green-800">رابط النموذج:</Label>
                    <div className="flex gap-2">
                      <Input value={formUrl} readOnly className="bg-white text-sm" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formUrl, "رابط النموذج")}
                        className="flex-shrink-0"
                      >
                        نسخ
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setOpen(false)
                      resetForm()
                    }}
                  >
                    إغلاق
                  </Button>
                </div>
              )}

              {(!formUrl || editingForm) && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* المعلومات الأساسية */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">المعلومات الأساسية</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name_ar" className="text-sm font-medium">
                            الاسم الداخلي بالعربية <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name_ar"
                            required
                            placeholder="مثال: نموذج حجز سريع"
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            className="bg-background"
                          />
                          <p className="text-xs text-muted-foreground">للاستخدام الداخلي فقط (يظهر في لوحة التحكم)</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="name_en" className="text-sm font-medium">
                            الاسم الداخلي بالإنجليزية
                          </Label>
                          <Input
                            id="name_en"
                            placeholder="Example: Quick Booking Form"
                            value={formData.name_en}
                            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title_ar" className="text-sm font-medium">
                            العنوان العام بالعربية <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="title_ar"
                            required
                            placeholder="مثال: احجز موعدك الآن"
                            value={formData.title_ar}
                            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                            className="bg-background"
                          />
                          <p className="text-xs text-muted-foreground">يظهر للمستخدمين في صفحة الحجز</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title_en" className="text-sm font-medium">
                            العنوان العام بالإنجليزية
                          </Label>
                          <Input
                            id="title_en"
                            placeholder="Example: Book Your Appointment Now"
                            value={formData.title_en}
                            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description_ar" className="text-sm font-medium">
                          الوصف بالعربية
                        </Label>
                        <TextFormatter
                          id="description_ar"
                          value={formData.description_ar}
                          onChange={(value) => setFormData({ ...formData, description_ar: value })}
                          rows={3}
                          placeholder="وصف مختصر عن النموذج..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image_url" className="text-sm font-medium">
                          صورة النموذج
                        </Label>
                        <ImagePicker
                          value={formData.image_url}
                          onChange={(url) => setFormData({ ...formData, image_url: url })}
                          onRemove={() => setFormData({ ...formData, image_url: "" })}
                        />
                      </div>
                    </div>

                    {/* الخدمات */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">الخدمات المتاحة</h3>

                      <div className="space-y-3 border-b pb-4">
                        <Label className="text-sm font-medium text-blue-600">الخدمات المخصصة</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="اسم الخدمة المخصصة"
                            value={newCustomService.title_ar}
                            onChange={(e) => setNewCustomService({ ...newCustomService, title_ar: e.target.value })}
                            className="flex-1"
                          />
                          <Button type="button" onClick={handleAddCustomService} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {customServices.length > 0 && (
                          <div className="space-y-2">
                            {customServices.map((service) => (
                              <div
                                key={service.id}
                                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-2"
                              >
                                <span className="text-sm font-medium text-blue-900">{service.title_ar}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCustomService(service.id)}
                                  className="h-7 w-7 p-0 hover:bg-blue-100"
                                >
                                  <X className="h-4 w-4 text-blue-600" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* الخدمات العامة */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                          الخدمات العامة ({selectedServices.length} محددة)
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3 bg-background">
                          {services.map((service) => (
                            <div key={service.id} className="flex items-center space-x-2 space-x-reverse">
                              <Checkbox
                                id={service.id}
                                checked={selectedServices.includes(service.id)}
                                onCheckedChange={() => toggleService(service.id)}
                              />
                              <label htmlFor={service.id} className="text-sm cursor-pointer flex-1">
                                {service.title_ar}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* الإعدادات */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground">الإعدادات</h3>
                      <div className="flex items-center justify-between p-3 bg-background rounded-md">
                        <div className="space-y-0.5">
                          <Label htmlFor="is_active" className="text-sm font-medium">
                            تفعيل النموذج
                          </Label>
                          <p className="text-xs text-muted-foreground">السماح للمستخدمين بالحجز من خلال هذا النموذج</p>
                        </div>
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-background rounded-md">
                        <div className="space-y-0.5">
                          <Label htmlFor="is_main" className="text-sm font-medium">
                            نموذج رئيسي
                          </Label>
                          <p className="text-xs text-muted-foreground">سيظهر في زر "احجز موعد" في الصفحة الرئيسية</p>
                        </div>
                        <Switch
                          id="is_main"
                          checked={formData.is_main}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_main: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                    {loading ? "جاري الحفظ..." : editingForm ? "تحديث النموذج" : "حفظ النموذج"}
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* عرض النماذج */}
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
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={() => toggleFormActive(form.id, form.is_active)}
                    className="scale-75"
                  />
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
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">الخدمات المتاحة:</p>
                <p className="font-medium">
                  {(form.booking_form_services?.length || 0) + (form.custom_services?.length || 0)} خدمة
                </p>
                {form.custom_services && form.custom_services.length > 0 && (
                  <p className="text-xs text-blue-600">({form.custom_services.length} خدمة مخصصة)</p>
                )}
              </div>

              <BookingFormActions
                formId={form.id}
                googleSheetUrl={form.google_sheet_url}
                onEdit={() => handleEdit(form)}
                onDelete={() => handleDelete(form.id)}
                onSheetCreated={() => fetchForms()}
              />

              {!form.is_main && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAsMainForm(form.id)}
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Star className="ml-2 h-4 w-4" />
                  تعيين كنموذج رئيسي
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {forms.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">لا توجد نماذج حجز</p>
              <p className="text-sm text-muted-foreground">قم بتهيئة النظام أولاً لإنشاء الجداول المطلوبة</p>
            </div>
            <Button onClick={initializeTables} disabled={initializing} size="lg">
              {initializing ? "جاري التهيئة..." : "تهيئة نماذج الحجز الآن"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reauth dialog with detailed instructions */}
      <AlertDialog open={showReauthDialog} onOpenChange={setShowReauthDialog}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">إعادة مصادقة Google Sheets</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-right">
              <p className="text-base text-foreground">إذا كنت تواجه مشاكل في إنشاء Google Sheets، اتبع هذه الخطوات:</p>

              <div className="bg-muted p-4 rounded-lg space-y-3 text-sm">
                <h4 className="font-semibold text-foreground">الخطوات المطلوبة:</h4>
                <ol className="list-decimal list-inside space-y-2 text-foreground">
                  <li>
                    اذهب إلى صفحة{" "}
                    <Link href="/dashboard/google-sheets-setup" className="text-primary underline font-medium">
                      إعدادات Google Sheets
                    </Link>
                  </li>
                  <li>اضغط على زر "اختبار الاتصال" للتحقق من الحالة الحالية</li>
                  <li>إذا فشل الاختبار، اتبع التعليمات لإنشاء Service Account جديد</li>
                  <li>
                    تأكد من منح الصلاحيات المطلوبة:
                    <ul className="list-disc list-inside mr-6 mt-1 space-y-1">
                      <li>Google Sheets API</li>
                      <li>Google Drive API</li>
                    </ul>
                  </li>
                  <li>انسخ البيانات الجديدة (Email + Private Key)</li>
                  <li>حدّث المتغيرات البيئية في Vercel من قسم "Vars" في الشريط الجانبي</li>
                  <li>أعد نشر التطبيق لتطبيق التغييرات</li>
                </ol>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>ملاحظة مهمة:</strong> بعد إنشاء Service Account جديد، تأكد من إضافة Service Account Email إلى
                  Google Sheet كمحرر (Editor) لكل جدول تريد الكتابة إليه.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>نصيحة:</strong> يمكنك اختبار الاتصال مباشرة من صفحة الإعدادات للتأكد من نجاح المصادقة قبل
                  محاولة إنشاء جداول جديدة.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">إلغاء</AlertDialogCancel>
            <AlertDialogAction asChild className="w-full sm:w-auto">
              <Link href="/dashboard/google-sheets-setup">الذهاب إلى الإعدادات</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
