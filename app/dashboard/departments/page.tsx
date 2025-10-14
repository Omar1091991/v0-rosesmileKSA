"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Building2 } from "lucide-react"

interface Department {
  id: string
  name_ar: string
  name_en: string
  description_ar?: string
  description_en?: string
  icon?: string
  is_active: boolean
  created_at: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    icon: "",
    is_active: true,
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments")
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب الأقسام",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name_ar) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم إضافة القسم بنجاح",
        })
        setIsAddOpen(false)
        resetForm()
        fetchDepartments()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إضافة القسم",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة القسم",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!editingDepartment) return

    try {
      const response = await fetch("/api/departments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingDepartment.id, ...formData }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تحديث القسم بنجاح",
        })
        setIsEditOpen(false)
        resetForm()
        fetchDepartments()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تحديث القسم",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث القسم",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return

    try {
      const response = await fetch("/api/departments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف القسم بنجاح",
        })
        fetchDepartments()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف القسم",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف القسم",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name_ar: department.name_ar,
      name_en: department.name_en || "",
      description_ar: department.description_ar || "",
      description_en: department.description_en || "",
      icon: department.icon || "",
      is_active: department.is_active,
    })
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      icon: "",
      is_active: true,
    })
    setEditingDepartment(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            إدارة الأقسام
          </h1>
          <p className="text-muted-foreground mt-2">إضافة وتعديل وحذف الأقسام</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة قسم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة قسم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="قسم الأسنان"
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="Dental Department"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_ar">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف القسم..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Department description..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="icon">أيقونة (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🦷"
                  maxLength={2}
                />
              </div>

              <Button onClick={handleAdd} className="w-full">
                إضافة القسم
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {department.icon && <span className="text-2xl">{department.icon}</span>}
                  {department.name_ar}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(department)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(department.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {department.description_ar && (
                <p className="text-sm text-muted-foreground">{department.description_ar}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">لا يوجد أقسام حالياً</CardContent>
        </Card>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل القسم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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

            <div>
              <Label htmlFor="edit_icon">أيقونة (Emoji)</Label>
              <Input
                id="edit_icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                maxLength={2}
              />
            </div>

            <Button onClick={handleEdit} className="w-full">
              حفظ التعديلات
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
