"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function DatabaseTestPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/database/test")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">اختبار قاعدة البيانات</h1>

      {data?.success ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                الاتصال: {data.connection}
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.tables).map(([table, info]: [string, any]) => (
              <Card key={table}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{table}</span>
                    {info.exists ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {info.exists ? (
                    <p className="text-2xl font-bold">{info.count} سجل</p>
                  ) : (
                    <p className="text-sm text-red-600">{info.error}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              فشل الاتصال بقاعدة البيانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{data?.error || "خطأ غير معروف"}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
