"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Trash2, CheckCircle, XCircle } from "lucide-react"

interface Booking {
  id: string
  patient_name: string
  patient_email: string
  patient_phone: string
  service_id?: string
  doctor_id?: string
  appointment_date: string
  appointment_time: string
  status: string
  notes?: string
  created_at: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
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
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف الحجز",
          variant: "destructive",
        })
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
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          إدارة الحجوزات
        </h1>
        <p className="text-muted-foreground mt-2">عرض وإدارة حجوزات المرضى</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>{booking.patient_name}</span>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="flex gap-2">
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
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(booking.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{booking.patient_email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">رقم الهاتف</p>
                  <p className="font-medium">{booking.patient_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">تاريخ الموعد</p>
                  <p className="font-medium">{new Date(booking.appointment_date).toLocaleDateString("ar-SA")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">وقت الموعد</p>
                  <p className="font-medium">{booking.appointment_time}</p>
                </div>
              </div>
              {booking.notes && (
                <div className="mt-4">
                  <p className="text-muted-foreground text-sm">ملاحظات</p>
                  <p className="text-sm">{booking.notes}</p>
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
    </div>
  )
}
