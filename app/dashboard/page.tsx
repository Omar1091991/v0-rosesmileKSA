import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Briefcase, Calendar, FileText, ImageIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  let stats = [
    { title: "المستخدمين", value: 0, icon: Users, color: "text-blue-600" },
    { title: "الخدمات", value: 0, icon: Briefcase, color: "text-green-600" },
    { title: "الأطباء", value: 0, icon: Stethoscope, color: "text-purple-600" },
    { title: "العروض", value: 0, icon: FileText, color: "text-orange-600" },
    { title: "الحجوزات", value: 0, icon: Calendar, color: "text-red-600" },
    { title: "المقالات", value: 0, icon: ImageIcon, color: "text-indigo-600" },
  ]

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/database/test`, {
      cache: "no-store",
    })
    if (response.ok) {
      const data = await response.json()
      if (data.tables) {
        stats = [
          {
            title: "المستخدمين",
            value: data.tables.find((t: any) => t.name === "profiles")?.count || 0,
            icon: Users,
            color: "text-blue-600",
          },
          {
            title: "الخدمات",
            value: data.tables.find((t: any) => t.name === "services")?.count || 0,
            icon: Briefcase,
            color: "text-green-600",
          },
          {
            title: "الأطباء",
            value: data.tables.find((t: any) => t.name === "doctors")?.count || 0,
            icon: Stethoscope,
            color: "text-purple-600",
          },
          {
            title: "العروض",
            value: data.tables.find((t: any) => t.name === "offers")?.count || 0,
            icon: FileText,
            color: "text-orange-600",
          },
          {
            title: "الحجوزات",
            value: data.tables.find((t: any) => t.name === "bookings")?.count || 0,
            icon: Calendar,
            color: "text-red-600",
          },
          {
            title: "المقالات",
            value: data.tables.find((t: any) => t.name === "articles")?.count || 0,
            icon: ImageIcon,
            color: "text-indigo-600",
          },
        ]
      }
    }
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
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
          <CardTitle>آخر الحجوزات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">لا توجد حجوزات جديدة</p>
        </CardContent>
      </Card>
    </div>
  )
}
