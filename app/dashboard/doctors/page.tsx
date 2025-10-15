"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Stethoscope, Settings, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Doctor {
  id: string
  name_ar: string
  name_en: string
  specialty_ar: string
  specialty_en: string
  bio_ar?: string
  bio_en?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

interface DoctorCase {
  id: string
  doctor_id: string
  image_url: string
  caption_ar?: string
  caption_en?: string
  order_index: number
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const { toast } = useToast()
  const [needsInit, setNeedsInit] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    specialty_ar: "",
    specialty_en: "",
    bio_ar: "",
    bio_en: "",
    image_url: "",
    is_active: true,
  })

  const [doctorCases, setDoctorCases] = useState<DoctorCase[]>([])
  const [caseImages, setCaseImages] = useState<string[]>([])
  const [caseImagePreviews, setCaseImagePreviews] = useState<string[]>([])

  useEffect(() => {
    fetchDoctors()
    checkIfNeedsInit()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors")
      if (response.ok) {
        const data = await response.json()
        setDoctors(data)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب الأطباء",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorCases = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/doctor-cases?doctor_id=${doctorId}`)
      if (response.ok) {
        const data = await response.json()
        setDoctorCases(data)
      }
    } catch (error) {
      console.error("Failed to fetch doctor cases:", error)
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

  const handleCaseImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []
    const newPreviews: string[] = []

    Array.from(files).forEach((file) => {
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
        newImages.push(base64)
        newPreviews.push(base64)
        setCaseImages([...caseImages, ...newImages])
        setCaseImagePreviews([...caseImagePreviews, ...newPreviews])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeCaseImage = (index: number) => {
    setCaseImages(caseImages.filter((_, i) => i !== index))
    setCaseImagePreviews(caseImagePreviews.filter((_, i) => i !== index))
  }

  const handleAddCases = async () => {
    if (!editingDoctor || caseImages.length === 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إضافة صورة واحدة على الأقل",
        variant: "destructive",
      })
      return
    }

    try {
      // إضافة كل صورة كحالة منفصلة
      for (const image of caseImages) {
        await fetch("/api/doctor-cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctor_id: editingDoctor.id,
            image_url: image,
            order_index: doctorCases.length,
          }),
        })
      }

      toast({
        title: "نجح",
        description: "تم إضافة الصور بنجاح",
      })
      setCaseImages([])
      setCaseImagePreviews([])
      fetchDoctorCases(editingDoctor.id)
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الصور",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!editingDoctor) return

    try {
      const response = await fetch("/api/doctors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingDoctor.id, ...formData }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تحديث الطبيب بنجاح",
        })
        setIsEditOpen(false)
        resetForm()
        fetchDoctors()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تحديث الطبيب",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الطبيب",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطبيب؟")) return

    try {
      const response = await fetch("/api/doctors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الطبيب بنجاح",
        })
        fetchDoctors()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف الطبيب",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الطبيب",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCase = async (caseId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return

    try {
      const response = await fetch("/api/doctor-cases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: caseId }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الصورة بنجاح",
        })
        if (editingDoctor) {
          fetchDoctorCases(editingDoctor.id)
        }
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
      name_ar: "",
      name_en: "",
      specialty_ar: "",
      specialty_en: "",
      bio_ar: "",
      bio_en: "",
      image_url: "",
      is_active: true,
    })
    setImagePreview("")
    setEditingDoctor(null)
  }

  const resetCaseForm = () => {
    setCaseImages([])
    setCaseImagePreviews([])
  }

  const openEditDialog = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      name_ar: doctor.name_ar,
      name_en: doctor.name_en || "",
      specialty_ar: doctor.specialty_ar,
      specialty_en: doctor.specialty_en || "",
      bio_ar: doctor.bio_ar || "",
      bio_en: doctor.bio_en || "",
      image_url: doctor.image_url || "",
      is_active: doctor.is_active,
    })
    setImagePreview(doctor.image_url || "")
    fetchDoctorCases(doctor.id)
    setIsEditOpen(true)
  }

  const checkIfNeedsInit = async () => {
    try {
      const response = await fetch("/api/doctor-cases?doctor_id=test")
      if (!response.ok) {
        setNeedsInit(true)
      }
    } catch (error) {
      setNeedsInit(true)
    }
  }

  const handleInitialize = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/doctor-cases/init", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تهيئة جدول حالات الأطباء بنجاح",
        })
        setNeedsInit(false)
      } else {
        const error = await response.json()
        toast({
          title: "خطأ",
          description: error.error || "فشل في تهيئة الجدول",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التهيئة",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.image_url) {
      toast({
        title: "خطأ",
        description: "الرجاء إضافة صورة واحدة على الأقل",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم إضافة الطبيب بنجاح",
        })
        setIsAddOpen(false)
        resetForm()
        fetchDoctors()
      } else {
        const errorData = await response.json()
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في إضافة الطبيب",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الطبيب",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      {needsInit && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>يجب تهيئة جدول حالات الأطباء لاستخدام ميزة "قبل وبعد"</span>
            <Button onClick={handleInitialize} disabled={isInitializing} size="sm">
              {isInitializing ? "جاري التهيئة..." : "تهيئة الآن"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Stethoscope className="h-8 w-8" />
            إدارة الأطباء
          </h1>
          <p className="text-muted-foreground mt-2">إضافة وتعديل وحذف الأطباء</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة طبيب
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة طبيب جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="د. أحمد محمد"
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="Dr. Ahmed Mohamed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty_ar">التخصص بالعربية *</Label>
                  <Input
                    id="specialty_ar"
                    value={formData.specialty_ar}
                    onChange={(e) => setFormData({ ...formData, specialty_ar: e.target.value })}
                    placeholder="طبيب أسنان"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty_en">التخصص بالإنجليزية</Label>
                  <Input
                    id="specialty_en"
                    value={formData.specialty_en}
                    onChange={(e) => setFormData({ ...formData, specialty_en: e.target.value })}
                    placeholder="Dentist"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio_ar">النبذة بالعربية</Label>
                <Textarea
                  id="bio_ar"
                  value={formData.bio_ar}
                  onChange={(e) => setFormData({ ...formData, bio_ar: e.target.value })}
                  placeholder="نبذة عن الطبيب..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bio_en">النبذة بالإنجليزية</Label>
                <Textarea
                  id="bio_en"
                  value={formData.bio_en}
                  onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                  placeholder="About the doctor..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">صورة الطبيب</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleAdd} className="w-full">
                إضافة الطبيب
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader>
              {doctor.image_url && (
                <img
                  src={doctor.image_url || "/placeholder.svg"}
                  alt={doctor.name_ar}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <CardTitle className="flex items-center justify-between">
                <span>{doctor.name_ar}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(doctor)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doctor.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{doctor.specialty_ar}</p>
              {doctor.bio_ar && <p className="text-sm mt-2">{doctor.bio_ar}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {doctors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">لا يوجد أطباء حالياً</CardContent>
        </Card>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الطبيب</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="cases">صور الحالات</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_name_ar">الاسم بالعربية *</Label>
                  <Input
                    id="edit_name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_name_en">الاسم بالإنجليزية</Label>
                  <Input
                    id="edit_name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_specialty_ar">التخصص بالعربية *</Label>
                  <Input
                    id="edit_specialty_ar"
                    value={formData.specialty_ar}
                    onChange={(e) => setFormData({ ...formData, specialty_ar: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_specialty_en">التخصص بالإنجليزية</Label>
                  <Input
                    id="edit_specialty_en"
                    value={formData.specialty_en}
                    onChange={(e) => setFormData({ ...formData, specialty_en: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit_bio_ar">النبذة بالعربية</Label>
                <Textarea
                  id="edit_bio_ar"
                  value={formData.bio_ar}
                  onChange={(e) => setFormData({ ...formData, bio_ar: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="edit_bio_en">النبذة بالإنجليزية</Label>
                <Textarea
                  id="edit_bio_en"
                  value={formData.bio_en}
                  onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="edit_image">صورة الطبيب</Label>
                <Input id="edit_image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleEdit} className="w-full">
                حفظ التعديلات
              </Button>
            </TabsContent>

            <TabsContent value="cases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إضافة صور الحالات (اختياري)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="case_images">اختر صور متعددة</Label>
                    <Input
                      id="case_images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleCaseImagesChange}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">يمكنك اختيار عدة صور في نفس الوقت</p>
                  </div>

                  {caseImagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {caseImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeCaseImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {caseImages.length > 0 && (
                    <Button onClick={handleAddCases} className="w-full">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة {caseImages.length} صورة
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-semibold">الصور المضافة</h3>
                {doctorCases.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">لا توجد صور مضافة</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {doctorCases.map((case_) => (
                      <Card key={case_.id} className="relative group">
                        <CardContent className="p-2">
                          <img
                            src={case_.image_url || "/placeholder.svg"}
                            alt="Case"
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteCase(case_.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
