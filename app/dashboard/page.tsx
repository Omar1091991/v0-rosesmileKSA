"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Users, Stethoscope, Briefcase, CalendarIcon, FileText, ImageIcon, Phone, User, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { cn } from "@/lib/utils"

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

interface Stats {
  users: number
  services: number
  doctors: number
  offers: number
  bookings: number
  articles: number
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "today" | "date">("today")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [stats, setStats] = useState<Stats>({
    users: 0,
    services: 0,
    doctors: 0,
    offers: 0,
    bookings: 0,
    articles: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [bookingForms, setBookingForms] = useState<BookingForm[]>([])
  const [bookingsDate, setBookingsDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [filter, selectedDate])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch stats
      let statsUrl = `/api/stats?filter=${filter}`
      if (filter === "date" && selectedDate) {
        statsUrl += `&date=${format(selectedDate, "yyyy-MM-dd")}`
      }

      const statsResponse = await fetch(statsUrl, { cache: "no-store" })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch bookings and booking forms
      const [bookingsResponse, formsResponse] = await Promise.all([
        fetch("/api/bookings", { cache: "no-store" }),
        fetch("/api/booking-forms", { cache: "no-store" }),
      ])

      if (formsResponse.ok) {
        const forms = await formsResponse.json()
        setBookingForms(forms)
      }

      if (bookingsResponse.ok) {
        const allBookings: Booking[] = await bookingsResponse.json()

        if (allBookings.length > 0) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          let filteredBookings: Booking[] = []

          if (filter === "today") {
            const todayStr = today.toISOString().split("T")[0]
            filteredBookings = allBookings.filter((booking) => {
              const bookingDate = new Date(booking.created_at)
              const bookingDateStr = bookingDate.toISOString().split("T")[0]
              return bookingDateStr === todayStr
            })
            setBookingsDate("اليوم")
          } else if (filter === "date" && selectedDate) {
            const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
            filteredBookings = allBookings.filter((booking) => {
              const bookingDate = new Date(booking.created_at)
              const bookingDateStr = bookingDate.toISOString().split("T")[0]
              return bookingDateStr === selectedDateStr
            })
            setBookingsDate(format(selectedDate, "EEEE، d MMMM yyyy", { locale: ar }))
          } else {
            // Show all bookings
            filteredBookings = allBookings
            setBookingsDate("جميع الحجوزات")
          }

          setRecentBookings(filteredBookings.slice(0, 5))
        } else {
          setRecentBookings([])
          setBookingsDate("")
        }
      }
    } catch (error) {
      console.error("[v0] Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsConfig = [
    { title: "المستخدمين", key: "users" as keyof Stats, icon: Users, color: "text-blue-600" },
    { title: "الخدمات", key: "services" as keyof Stats, icon: Briefcase, color: "text-green-600" },
    { title: "الأطباء", key: "doctors" as keyof Stats, icon: Stethoscope, color: "text-purple-600" },
    { title: "العروض", key: "offers" as keyof Stats, icon: FileText, color: "text-orange-600" },
    { title: "الحجوزات", key: "bookings" as keyof Stats, icon: CalendarIcon, color: "text-red-600" },
    { title: "المقالات", key: "articles" as keyof Stats, icon: ImageIcon, color: "text-indigo-600" },
  ]

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

      <Card>
        <CardHeader>
          <CardTitle>فلتر الإحصائيات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => {
                setFilter("all")
                setSelectedDate(undefined)
              }}
            >
              الكل
            </Button>
            <Button
              variant={filter === "today" ? "default" : "outline"}
              onClick={() => {
                setFilter("today")
                setSelectedDate(undefined)
              }}
            >
              اليوم
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={filter === "date" ? "default" : "outline"}
                  className={cn("justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : "اختر تاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setFilter("date")
                  }}
                  locale={ar}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsConfig.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats[stat.key]}</div>
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
                              <span className="text-sm text-muted-foreground">
                                {formatDateTime(booking.created_at)}
                              </span>
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
        </>
      )}
    </div>
  )
}
