"use client"

import { DialogContent } from "@/components/ui/dialog"
import { DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { DialogDescription } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { Dialog, DialogClose, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  CalendarIcon,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Phone,
  MessageSquare,
  Edit,
  Filter,
  FileText,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  CheckSquare,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { ar } from "date-fns/locale"
import { format } from "date-fns"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PermissionGuard } from "@/components/permission-guard"
import { Checkbox } from "@/components/ui/checkbox"

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
  booking_form_id?: string
  booking_form_name?: string
  created_at: string
}

interface BookingForm {
  id: string
  name_ar: string
  name_en: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingForms, setBookingForms] = useState<BookingForm[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [contactAttempts, setContactAttempts] = useState(0)
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const [filterBookingForm, setFilterBookingForm] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterContacted, setFilterContacted] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set())

  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
    fetchBookingForms()
  }, [])

  useEffect(() => {
    let filtered = [...bookings]

    if (dateFrom || dateTo) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.created_at)
        if (dateFrom && dateTo) {
          return bookingDate >= dateFrom && bookingDate <= dateTo
        }
        if (dateFrom) {
          return bookingDate >= dateFrom
        }
        if (dateTo) {
          return bookingDate <= dateTo
        }
        return true
      })
    }

    if (filterBookingForm !== "all") {
      filtered = filtered.filter((booking) => booking.booking_form_id === filterBookingForm)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === filterStatus)
    }

    if (filterContacted !== "all") {
      const isContacted = filterContacted === "contacted"
      filtered = filtered.filter((booking) => booking.contacted === isContacted)
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
    setSelectedBookings(new Set())
  }, [bookings, dateFrom, dateTo, filterBookingForm, filterStatus, filterContacted])

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBookings = filteredBookings.slice(startIndex, endIndex)

  const isAllSelected = filteredBookings.length > 0 && filteredBookings.every((b) => selectedBookings.has(b.id))
  const isPartiallySelected = selectedBookings.size > 0 && !isAllSelected
  const selectedCount = selectedBookings.size

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBookings(new Set())
    } else {
      setSelectedBookings(new Set(filteredBookings.map((b) => b.id)))
    }
  }

  const toggleSelectBooking = (id: string) => {
    const newSelected = new Set(selectedBookings)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedBookings(newSelected)
  }

  const getDataToExport = () => {
    // If there are selected bookings, export only those
    if (selectedBookings.size > 0) {
      return filteredBookings.filter((b) => selectedBookings.has(b.id))
    }
    // Otherwise export filtered bookings
    return filteredBookings
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setBookings(data)
          setFilteredBookings(data)
        } else {
          setBookings(data.bookings || [])
          setFilteredBookings(data.bookings || [])
        }
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

  const fetchBookingForms = async () => {
    try {
      const response = await fetch("/api/booking-forms")
      if (response.ok) {
        const data = await response.json()
        setBookingForms(data)
      }
    } catch (error) {
      console.error("Error fetching booking forms:", error)
    }
  }

  const getBookingFormName = (bookingFormId?: string) => {
    if (!bookingFormId) return "غير محدد"
    const form = bookingForms.find((f) => f.id === bookingFormId)
    return form ? form.name_ar : "غير محدد"
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
    const dataToExport = getDataToExport()

    const headers = [
      "الاسم",
      "رقم الجوال",
      "الخدمة",
      "الحالة",
      "تم التواصل",
      "مرات المحاولة",
      "الملاحظات",
      "ملاحظات الإدارة",
      "نموذج الحجز",
      "تاريخ الإنشاء",
    ]
    const rows = dataToExport.map((booking) => [
      booking.full_name,
      booking.phone,
      booking.service_name || "-",
      booking.status,
      booking.contacted ? "نعم" : "لا",
      booking.contact_attempts || 0,
      booking.notes || "-",
      booking.admin_notes || "-",
      booking.booking_form_name || getBookingFormName(booking.booking_form_id),
      format(new Date(booking.created_at), "yyyy-MM-dd", { locale: ar }),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)

    const fileName =
      selectedBookings.size > 0
        ? `bookings_selected_${new Date().toISOString().split("T")[0]}.csv`
        : `bookings_${new Date().toISOString().split("T")[0]}.csv`

    link.download = fileName
    link.click()

    toast({
      title: "نجح",
      description: `تم تصدير ${dataToExport.length} حجز بنجاح`,
    })
  }

  const exportToPDF = () => {
    const dataToExport = getDataToExport()

    const doc = new jsPDF()

    doc.setFont("helvetica")
    doc.setFontSize(16)

    doc.text("Bookings Report - Rose Smile", 105, 15, { align: "center" })
    doc.setFontSize(10)
    doc.text(`Generated: ${format(new Date(), "yyyy-MM-dd HH:mm")}`, 105, 22, { align: "center" })

    if (selectedBookings.size > 0) {
      doc.text(`Selected: ${dataToExport.length} bookings`, 105, 28, { align: "center" })
    } else if (dateFrom || dateTo) {
      const dateRange = `Period: ${dateFrom ? format(dateFrom, "yyyy-MM-dd") : "Start"} to ${dateTo ? format(dateTo, "yyyy-MM-dd") : "End"}`
      doc.text(dateRange, 105, 28, { align: "center" })
    }

    let yPosition = 40
    doc.setFontSize(9)

    doc.setFillColor(41, 98, 255)
    doc.rect(10, yPosition, 190, 8, "F")
    doc.setTextColor(255, 255, 255)
    doc.text("Name", 12, yPosition + 5)
    doc.text("Phone", 50, yPosition + 5)
    doc.text("Service", 85, yPosition + 5)
    doc.text("Status", 120, yPosition + 5)
    doc.text("Contacted", 145, yPosition + 5)
    doc.text("Booking Form", 170, yPosition + 5)

    yPosition += 10
    doc.setTextColor(0, 0, 0)

    dataToExport.forEach((booking, index) => {
      if (yPosition > 280) {
        doc.addPage()
        yPosition = 20
      }

      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245)
        doc.rect(10, yPosition - 4, 190, 8, "F")
      }

      doc.text(booking.full_name.substring(0, 15), 12, yPosition)
      doc.text(booking.phone, 50, yPosition)
      doc.text((booking.service_name || "-").substring(0, 12), 85, yPosition)
      doc.text(booking.status, 120, yPosition)
      doc.text(booking.contacted ? "Yes" : "No", 145, yPosition)
      doc.text(
        (booking.booking_form_name || getBookingFormName(booking.booking_form_id)).substring(0, 15),
        170,
        yPosition,
      )

      yPosition += 8
    })

    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
      doc.text(`Total Bookings: ${dataToExport.length}`, 195, 290, { align: "right" })
    }

    const fileName =
      selectedBookings.size > 0
        ? `bookings_selected_${new Date().toISOString().split("T")[0]}.pdf`
        : `bookings_${new Date().toISOString().split("T")[0]}.pdf`

    doc.save(fileName)

    toast({
      title: "نجح",
      description: `تم تصدير ${dataToExport.length} حجز إلى PDF بنجاح`,
    })
  }

  const exportToExcel = () => {
    const dataToExport = getDataToExport()

    const worksheetData = [
      [
        "الاسم الكامل",
        "رقم الجوال",
        "الخدمة",
        "الحالة",
        "تم التواصل",
        "محاولات التواصل",
        "ملاحظات العميل",
        "ملاحظات الإدارة",
        "نموذج الحجز",
        "تاريخ الإنشاء",
      ],
      ...dataToExport.map((booking) => [
        booking.full_name,
        booking.phone,
        booking.service_name || "-",
        booking.status === "confirmed"
          ? "مؤكد"
          : booking.status === "pending"
            ? "قيد الانتظار"
            : booking.status === "cancelled"
              ? "ملغي"
              : booking.status === "completed"
                ? "مكتمل"
                : booking.status,
        booking.contacted ? "نعم" : "لا",
        booking.contact_attempts || 0,
        booking.notes || "-",
        booking.admin_notes || "-",
        booking.booking_form_name || getBookingFormName(booking.booking_form_id),
        format(new Date(booking.created_at), "yyyy-MM-dd HH:mm", { locale: ar }),
      ]),
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    const columnWidths = [
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 18 },
    ]
    worksheet["!cols"] = columnWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "الحجوزات")

    const fileName =
      selectedBookings.size > 0
        ? `bookings_selected_${new Date().toISOString().split("T")[0]}.xlsx`
        : `bookings_${new Date().toISOString().split("T")[0]}.xlsx`

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "نجح",
      description: `تم تصدير ${dataToExport.length} حجز إلى Excel بنجاح`,
    })
  }

  const resetFilter = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    setFilterBookingForm("all")
    setFilterStatus("all")
    setFilterContacted("all")
    setSelectedBookings(new Set())
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
    <PermissionGuard permission="bookings.read">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              إدارة الحجوزات
            </h1>
            <p className="text-muted-foreground mt-2">
              عرض وإدارة حجوزات المرضى ({filteredBookings.length} من {bookings.length})
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedCount} محدد</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBookings(new Set())}
                  className="h-6 px-2 text-xs"
                >
                  إلغاء التحديد
                </Button>
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="ml-2 h-4 w-4" />
                  فلتر التاريخ
                  {(dateFrom || dateTo) && (
                    <Badge className="mr-2" variant="secondary">
                      نشط
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">من تاريخ</Label>
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      locale={ar}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">إلى تاريخ</Label>
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      locale={ar}
                      className="rounded-md border"
                    />
                  </div>
                  <Button onClick={resetFilter} variant="outline" className="w-full bg-transparent">
                    إعادة تعيين الكل
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Download className="ml-2 h-4 w-4" />
                  تصدير
                  {selectedCount > 0 && (
                    <Badge className="mr-2" variant="secondary">
                      {selectedCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground px-2 pb-2 border-b">
                    {selectedCount > 0
                      ? `سيتم تصدير ${selectedCount} حجز محدد`
                      : `سيتم تصدير ${filteredBookings.length} حجز`}
                  </p>
                  <Button variant="ghost" className="w-full justify-start" onClick={exportToExcel}>
                    <FileSpreadsheet className="ml-2 h-4 w-4 text-green-600" />
                    تصدير Excel
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={exportToPDF}>
                    <FileText className="ml-2 h-4 w-4 text-red-600" />
                    تصدير PDF
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={exportToCSV}>
                    <Download className="ml-2 h-4 w-4 text-blue-600" />
                    تصدير CSV
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              الفلاتر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm mb-2 block">نموذج الحجز</Label>
                <Select value={filterBookingForm} onValueChange={setFilterBookingForm}>
                  <SelectTrigger>
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    {bookingForms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">الحالة</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">حالة التواصل</Label>
                <Select value={filterContacted} onValueChange={setFilterContacted}>
                  <SelectTrigger>
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="contacted">تم التواصل</SelectItem>
                    <SelectItem value="not_contacted">لم يتم التواصل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={resetFilter} variant="outline" className="w-full bg-transparent">
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredBookings.length > 0 && (
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="select-all" className="cursor-pointer text-sm font-medium">
                    {isAllSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
                  </Label>
                  {isPartiallySelected && (
                    <span className="text-xs text-muted-foreground">
                      ({selectedCount} من {filteredBookings.length})
                    </span>
                  )}
                </div>
                {selectedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={exportToExcel} className="gap-1 bg-transparent">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      تصدير المحدد
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {currentBookings.map((booking) => (
            <Card
              key={booking.id}
              className={`hover:shadow-lg transition-shadow ${selectedBookings.has(booking.id) ? "ring-2 ring-primary bg-primary/5" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Checkbox
                      checked={selectedBookings.has(booking.id)}
                      onCheckedChange={() => toggleSelectBooking(booking.id)}
                      className="h-5 w-5"
                    />
                    <span className="text-lg">{booking.full_name}</span>
                    {getStatusBadge(booking.status)}
                    {booking.contacted && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Phone className="h-3 w-3 ml-1" />
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">رقم الجوال</p>
                    <p className="font-medium">{booking.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الخدمة</p>
                    <p className="font-medium">{booking.service_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">نموذج الحجز</p>
                    <p className="font-medium flex items-center gap-1">
                      <FileCheck className="h-4 w-4 text-primary" />
                      {booking.booking_form_name || getBookingFormName(booking.booking_form_id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">مرات المحاولة</p>
                    <p className="font-medium">{booking.contact_attempts || 0}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>تاريخ الإنشاء: {format(new Date(booking.created_at), "yyyy-MM-dd HH:mm", { locale: ar })}</p>
                </div>
                {booking.notes && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground text-sm font-medium mb-1">ملاحظات العميل</p>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
                {booking.admin_notes && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-muted-foreground text-sm font-medium mb-1">ملاحظات الإدارة</p>
                    <p className="text-sm">{booking.admin_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-muted-foreground">
                  عرض {startIndex + 1} - {Math.min(endIndex, filteredBookings.length)} من {filteredBookings.length} حجز
                  {selectedCount > 0 && <span className="mr-2 text-primary font-medium">({selectedCount} محدد)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page: number
                      if (totalPages <= 5) {
                        page = i + 1
                      } else if (currentPage <= 3) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i
                      } else {
                        page = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[2.5rem]"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {dateFrom || dateTo || filterBookingForm !== "all" || filterStatus !== "all" || filterContacted !== "all"
                ? "لا توجد حجوزات تطابق الفلاتر المحددة"
                : "لا يوجد حجوزات حالياً"}
            </CardContent>
          </Card>
        )}

        <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
          <DialogClose />
          <DialogOverlay />
          <DialogPortal>
            <DialogContent>
              <DialogTitle>إضافة ملاحظات إدارية</DialogTitle>
              <DialogDescription>أضف ملاحظات حول هذا الحجز لمتابعة أفضل</DialogDescription>
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
          </DialogPortal>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}
