"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Trash2, CheckCircle, XCircle, Download, Phone, MessageSquare, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Booking {
  id: string
  full_name: string
  phone: string
  service_id?: string
  service_name?: string
  status: string
  notes?: string
  contacted?: boolean
  admin_notes?: string
  contact_attempts?: number
  created_at: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [contactAttempts, setContactAttempts] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب الحجوزات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تحديث حالة الحجز بنجاح",
        })
        fetchBookings()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تحديث حالة الحجز",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الحجز",
        variant: "destructive",
      })
    }
  }

  const toggleContacted = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, contacted: !currentStatus }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تحديث حالة التواصل بنجاح",
        })
        fetchBookings()
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة التواصل",
        variant: "destructive",
      })
    }
  }

  const incrementContactAttempts = async (id: string, currentAttempts: number) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, contact_attempts: currentAttempts + 1 }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تسجيل محاولة التواصل",
        })
        fetchBookings()
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تسجيل محاولة التواصل",
        variant: "destructive",
      })
    }
  }

  const saveAdminNotes = async () => {
    if (!editingBooking) return

    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBooking.id,
          admin_notes: adminNotes,
          contact_attempts: contactAttempts,
        }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حفظ الملاحظات بنجاح",
        })
        setEditingBooking(null)
        fetchBookings()
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الملاحظات",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = () => {
    const headers = [
      "الاسم",
      "رقم الجوال",
      "الخدمة",
      "الحالة",
      "تم التواصل",
      "مرات المحاولة",
      "الملاحظات",
      "ملاحظات الإدارة",
      "تاريخ الإنشاء",
    ]
    const rows = bookings.map((booking) => [
      booking.full_name,
      booking.phone,
      booking.service_name || "-",
      booking.status,
      booking.contacted ? "نعم" : "لا",
      booking.contact_attempts || 0,
      booking.notes || "-",
      booking.admin_notes || "-",
      new Date(booking.created_at).toLocaleDateString("ar-SA"),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `bookings_${new Date().toISOString().split("T")[0]}.csv`
    link.click()

    toast({
      title: "نجح",
      description: "تم تصدير الحجوزات بنجاح",
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return

    try {
      const response = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الحجز بنجاح",
        })
        fetchBookings()
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الحجز",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">مؤكد</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">قيد الانتظار</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">ملغي</Badge>
      case "completed":
        return <Badge className="bg-blue-500">مكتمل</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            إدارة الحجوزات
          </h1>
          <p className="text-muted-foreground mt-2">عرض وإدارة حجوزات المرضى</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="ml-2 h-4 w-4" />
          تصدير الحجوزات
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>{booking.full_name}</span>
                  {getStatusBadge(booking.status)}
                  {booking.contacted && (
                    <Badge variant="outline" className="bg-green-50">
                      تم التواصل
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleContacted(booking.id, booking.contacted || false)}
                    title={booking.contacted ? "إلغاء التواصل" : "تم التواصل"}
                  >
                    <Phone className={`h-4 w-4 ${booking.contacted ? "text-green-600" : "text-gray-400"}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => incrementContactAttempts(booking.id, booking.contact_attempts || 0)}
                    title="تسجيل محاولة تواصل"
                  >
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingBooking(booking)
                      setAdminNotes(booking.admin_notes || "")
                      setContactAttempts(booking.contact_attempts || 0)
                    }}
                    title="إضافة ملاحظات"
                  >
                    <Edit className="h-4 w-4 text-purple-600" />
                  </Button>
                  {booking.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        title="تأكيد"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        title="إلغاء"
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(booking.id)} title="حذف">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">رقم الجوال</p>
                  <p className="font-medium">{booking.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الخدمة</p>
                  <p className="font-medium">{booking.service_name || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">مرات المحاولة</p>
                  <p className="font-medium">{booking.contact_attempts || 0}</p>
                </div>
              </div>
              {booking.notes && (
                <div className="mt-4">
                  <p className="text-muted-foreground text-sm">ملاحظات العميل</p>
                  <p className="text-sm">{booking.notes}</p>
                </div>
              )}
              {booking.admin_notes && (
                <div className="mt-4">
                  <p className="text-muted-foreground text-sm">ملاحظات الإدارة</p>
                  <p className="text-sm">{booking.admin_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">لا يوجد حجوزات حالياً</CardContent>
        </Card>
      )}

      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة ملاحظات إدارية</DialogTitle>
            <DialogDescription>أضف ملاحظات حول هذا الحجز لمتابعة أفضل</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-attempts">عدد محاولات التواصل</Label>
              <Input
                id="contact-attempts"
                type="number"
                value={contactAttempts}
                onChange={(e) => setContactAttempts(Number.parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="admin-notes">ملاحظات الإدارة</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="أضف ملاحظاتك هنا..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>
              إلغاء
            </Button>
            <Button onClick={saveAdminNotes}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
