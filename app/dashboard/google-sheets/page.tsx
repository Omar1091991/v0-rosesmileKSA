"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sheet,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  FileSpreadsheet,
  Settings,
  Link2,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookingForm {
  id: string
  title: string
  title_en: string
  google_sheet_id: string | null
  google_sheet_url: string | null
  created_at: string
}

interface GoogleSheetsConfig {
  serviceAccountEmail: string
  isConfigured: boolean
  folderId: string | null
}

export default function GoogleSheetsPage() {
  const [bookingForms, setBookingForms] = useState<BookingForm[]>([])
  const [config, setConfig] = useState<GoogleSheetsConfig>({
    serviceAccountEmail: "",
    isConfigured: false,
    folderId: null,
  })
  const [loading, setLoading] = useState(true)
  const [creatingSheet, setCreatingSheet] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch booking forms
      const formsResponse = await fetch("/api/booking-forms")
      if (formsResponse.ok) {
        const formsData = await formsResponse.json()
        setBookingForms(formsData)
      }

      // Check Google Sheets configuration
      const configResponse = await fetch("/api/google-sheets/config")
      if (configResponse.ok) {
        const configData = await configResponse.json()
        setConfig(configData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const createGoogleSheet = async (formId: string, formTitle: string) => {
    setCreatingSheet(formId)
    try {
      const response = await fetch("/api/google-sheets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingFormId: formId, title: formTitle }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "تم إنشاء الشيت بنجاح",
          description: "تم ربط Google Sheet بنموذج الحجز",
        })
        fetchData()
      } else {
        const error = await response.json()
        toast({
          title: "خطأ",
          description: error.error || "فشل في إنشاء الشيت",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الشيت",
        variant: "destructive",
      })
    } finally {
      setCreatingSheet(null)
    }
  }

  const syncBookings = async (formId: string) => {
    setSyncing(formId)
    try {
      const response = await fetch("/api/google-sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingFormId: formId }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "تمت المزامنة بنجاح",
          description: `تم مزامنة ${data.syncedCount} حجز`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "خطأ",
          description: error.error || "فشل في المزامنة",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء المزامنة",
        variant: "destructive",
      })
    } finally {
      setSyncing(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "تم النسخ",
      description: "تم نسخ البريد الإلكتروني",
    })
  }

  const formsWithSheets = bookingForms.filter((f) => f.google_sheet_id)
  const formsWithoutSheets = bookingForms.filter((f) => !f.google_sheet_id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إعدادات Google Sheets</h1>
          <p className="text-muted-foreground">إدارة ربط نماذج الحجز مع Google Sheets</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="forms">نماذج الحجز</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي النماذج</CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingForms.length}</div>
                <p className="text-xs text-muted-foreground">نموذج حجز</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مرتبطة بـ Sheets</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formsWithSheets.length}</div>
                <p className="text-xs text-muted-foreground">نموذج مرتبط</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">غير مرتبطة</CardTitle>
                <XCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formsWithoutSheets.length}</div>
                <p className="text-xs text-muted-foreground">تحتاج للربط</p>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                حالة التهيئة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.isConfigured ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>التهيئة مكتملة</AlertTitle>
                  <AlertDescription>Google Sheets API مهيأ بشكل صحيح ويمكنك إنشاء وربط الشيتات.</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>التهيئة غير مكتملة</AlertTitle>
                  <AlertDescription>يرجى إضافة متغيرات البيئة المطلوبة لتفعيل Google Sheets API.</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>حساب الخدمة (Service Account)</Label>
                  <div className="flex items-center gap-2">
                    <Input value={config.serviceAccountEmail || "غير مهيأ"} readOnly className="font-mono text-sm" />
                    {config.serviceAccountEmail && (
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(config.serviceAccountEmail)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    شارك هذا البريد مع مجلد Google Drive للسماح بإنشاء الشيتات
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>معرف المجلد (Folder ID)</Label>
                  <Input value={config.folderId || "غير محدد"} readOnly className="font-mono text-sm" />
                  <p className="text-xs text-muted-foreground">المجلد الذي سيتم إنشاء الشيتات فيه</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions for Forms without Sheets */}
          {formsWithoutSheets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  نماذج تحتاج للربط
                </CardTitle>
                <CardDescription>هذه النماذج لم يتم ربطها بـ Google Sheets بعد</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formsWithoutSheets.map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{form.title}</p>
                        <p className="text-sm text-muted-foreground">{form.title_en}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => createGoogleSheet(form.id, form.title)}
                        disabled={creatingSheet === form.id || !config.isConfigured}
                      >
                        {creatingSheet === form.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                        ) : (
                          <Sheet className="h-4 w-4 ml-2" />
                        )}
                        إنشاء شيت
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>نماذج الحجز وشيتات Google</CardTitle>
              <CardDescription>عرض وإدارة جميع نماذج الحجز وربطها مع Google Sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم النموذج</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>رابط الشيت</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{form.title}</p>
                          <p className="text-sm text-muted-foreground">{form.title_en}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {form.google_sheet_id ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 ml-1" />
                            مرتبط
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 ml-1" />
                            غير مرتبط
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {form.google_sheet_url ? (
                          <Button variant="link" size="sm" asChild>
                            <a href={form.google_sheet_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 ml-1" />
                              فتح الشيت
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {form.google_sheet_id ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => syncBookings(form.id)}
                              disabled={syncing === form.id}
                            >
                              {syncing === form.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin ml-1" />
                              ) : (
                                <RefreshCw className="h-4 w-4 ml-1" />
                              )}
                              مزامنة
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => createGoogleSheet(form.id, form.title)}
                              disabled={creatingSheet === form.id || !config.isConfigured}
                            >
                              {creatingSheet === form.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin ml-1" />
                              ) : (
                                <Sheet className="h-4 w-4 ml-1" />
                              )}
                              إنشاء شيت
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات Google Sheets API</CardTitle>
              <CardDescription>تهيئة الاتصال مع Google Sheets API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>متغيرات البيئة المطلوبة</AlertTitle>
                <AlertDescription>يجب إضافة المتغيرات التالية في إعدادات المشروع على Vercel:</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">GOOGLE_SERVICE_ACCOUNT_EMAIL</code>
                    {config.serviceAccountEmail ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 ml-1" />
                        مهيأ
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 ml-1" />
                        غير مهيأ
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    البريد الإلكتروني لحساب الخدمة من Google Cloud Console
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">GOOGLE_PRIVATE_KEY</code>
                    <Badge variant="secondary">مطلوب</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">المفتاح الخاص لحساب الخدمة (Private Key)</p>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">GOOGLE_FOLDER_ID</code>
                    {config.folderId ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 ml-1" />
                        مهيأ
                      </Badge>
                    ) : (
                      <Badge variant="secondary">اختياري</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">معرف مجلد Google Drive الذي سيتم إنشاء الشيتات فيه</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">خطوات التهيئة:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>انتقل إلى Google Cloud Console وأنشئ مشروع جديد</li>
                  <li>فعّل Google Sheets API و Google Drive API</li>
                  <li>أنشئ حساب خدمة (Service Account) وحمّل ملف المفاتيح JSON</li>
                  <li>انسخ البريد الإلكتروني والمفتاح الخاص إلى متغيرات البيئة</li>
                  <li>شارك مجلد Google Drive مع حساب الخدمة (صلاحية التحرير)</li>
                  <li>انسخ معرف المجلد من رابط المجلد وأضفه للمتغيرات</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
