import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Stethoscope, Briefcase, Calendar, FileText, ImageIcon, Phone, User, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

interface Booking {
  id: string
  full_name: string
  phone: string
  service_name: string
  service_id: string
  notes: string
  status: string
  booking_form_id: string | null
  created_at: string
  contacted: boolean
  contact_attempts: number
  admin_notes: string
}

interface BookingForm {
  id: string
  name_ar: string
  name_en: string
}

export default async function DashboardPage() {
  let stats = [
    { title: "المستخدمين", value: 0, icon: Users, color: "text-blue-600" },
    { title: "الخدمات", value: 0, icon: Briefcase, color: "text-green-600" },
    { title: "الأطباء", value: 0, icon: Stethoscope, color: "text-purple-600" },
    { title: "العروض", value: 0, icon: FileText, color: "text-orange-600" },
    { title: "الحجوزات", value: 0, icon: Calendar, color: "text-red-600" },
    { title: "المقالات", value: 0, icon: ImageIcon, color: "text-indigo-600" },
  ]

  let recentBookings: Booking[] = []
  let bookingForms: BookingForm[] = []
  let bookingsDate = ""

  try {
    const response = await fetch("/api/database/test", {
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()
      if (data.tables) {
        stats = [
          {
            title: "المستخدمين",
            value: data.tables.users?.count || 0,
            icon: Users,
            color: "text-blue-600",
          },
          {
            title: "الخدمات",
            value: data.tables.services?.count || 0,
            icon: Briefcase,
            color: "text-green-600",
          },
          {
            title: "الأطباء",
            value: data.tables.doctors?.count || 0,
            icon: Stethoscope,
            color: "text-purple-600",
          },
          {
            title: "العروض",
            value: data.tables.offers?.count || 0,
            icon: FileText,
            color: "text-orange-600",
          },
          {
            title: "الحجوزات",
            value: data.tables.bookings?.count || 0,
            icon: Calendar,
            color: "text-red-600",
          },
          {
            title: "المقالات",
            value: data.tables.articles?.count || 0,
            icon: ImageIcon,
            color: "text-indigo-600",
          },
        ]
      }
    }
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
  }

  try {
    // Fetch bookings and booking forms in parallel
    const [bookingsResponse, formsResponse] = await Promise.all([
      fetch("/api/bookings", { cache: "no-store" }),
      fetch("/api/booking-forms", { cache: "no-store" }),
    ])

    if (bookingsResponse.ok) {
      const allBookings: Booking[] = await bookingsResponse.json()

      if (formsResponse.ok) {
        bookingForms = await formsResponse.json()
      }

      if (allBookings.length > 0) {
        // Get today's date in YYYY-MM-DD format
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStr = today.toISOString().split("T")[0]

        // Filter today's bookings
        const todaysBookings = allBookings.filter((booking) => {
          const bookingDate = new Date(booking.created_at)
          const bookingDateStr = bookingDate.toISOString().split("T")[0]
          return bookingDateStr === todayStr
        })

        if (todaysBookings.length > 0) {
          // Show today's bookings (up to 5)
          recentBookings = todaysBookings.slice(0, 5)
          bookingsDate = "اليوم"
        } else {
          // Show the most recent bookings from the last day that had bookings (up to 5)
          recentBookings = allBookings.slice(0, 5)
          if (recentBookings.length > 0) {
            const lastBookingDate = new Date(recentBookings[0].created_at)
            const daysDiff = Math.floor((today.getTime() - lastBookingDate.getTime()) / (1000 * 60 * 60 * 24))

            if (daysDiff === 0) {
              bookingsDate = "اليوم"
            } else if (daysDiff === 1) {
              bookingsDate = "أمس"
            } else {
              bookingsDate = lastBookingDate.toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("[v0] Dashboard bookings error:", error)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "مؤكد"
      case "pending":
        return "قيد الانتظار"
      case "cancelled":
        return "ملغي"
      case "completed":
        return "مكتمل"
      default:
        return status
    }
  }

  const getBookingFormName = (bookingFormId: string | null) => {
    if (!bookingFormId) return "غير محدد"
    const form = bookingForms.find((f) => f.id === bookingFormId)
    return form ? form.name_ar : "غير محدد"
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-2">مرحباً بك في لوحة التحكم الخاصة بموقع عيادات ابتسامة الورود</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>آخر الحجوزات</CardTitle>
            {bookingsDate && <Badge variant="outline">{bookingsDate}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">لا توجد حجوزات</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{booking.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground" dir="ltr">
                            {booking.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{booking.service_name}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{formatDateTime(booking.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {getBookingFormName(booking.booking_form_id)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                          {booking.contacted && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              تم التواصل
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">ملاحظات: </span>
                          {booking.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
