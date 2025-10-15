import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Briefcase, Calendar, FileText, ImageIcon } from "lucide-react"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  let stats
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Database query timeout")), 5000))

    const queries = Promise.all([
      db.query("SELECT COUNT(*) FROM profiles"),
      db.query("SELECT COUNT(*) FROM services"),
      db.query("SELECT COUNT(*) FROM doctors"),
      db.query("SELECT COUNT(*) FROM offers"),
      db.query("SELECT COUNT(*) FROM bookings"),
      db.query("SELECT COUNT(*) FROM articles"),
    ])

    const [usersCount, servicesCount, doctorsCount, offersCount, bookingsCount, articlesCount] = (await Promise.race([
      queries,
      timeout,
    ])) as any[]

    stats = [
      {
        title: "المستخدمين",
        value: Number.parseInt(usersCount.rows[0].count) || 0,
        icon: Users,
        color: "text-blue-600",
      },
      {
        title: "الخدمات",
        value: Number.parseInt(servicesCount.rows[0].count) || 0,
        icon: Briefcase,
        color: "text-green-600",
      },
      {
        title: "الأطباء",
        value: Number.parseInt(doctorsCount.rows[0].count) || 0,
        icon: Stethoscope,
        color: "text-purple-600",
      },
      {
        title: "العروض",
        value: Number.parseInt(offersCount.rows[0].count) || 0,
        icon: FileText,
        color: "text-orange-600",
      },
      {
        title: "الحجوزات",
        value: Number.parseInt(bookingsCount.rows[0].count) || 0,
        icon: Calendar,
        color: "text-red-600",
      },
      {
        title: "المقالات",
        value: Number.parseInt(articlesCount.rows[0].count) || 0,
        icon: ImageIcon,
        color: "text-indigo-600",
      },
    ]
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
    stats = [
      { title: "المستخدمين", value: 0, icon: Users, color: "text-blue-600" },
      { title: "الخدمات", value: 0, icon: Briefcase, color: "text-green-600" },
      { title: "الأطباء", value: 0, icon: Stethoscope, color: "text-purple-600" },
      { title: "العروض", value: 0, icon: FileText, color: "text-orange-600" },
      { title: "الحجوزات", value: 0, icon: Calendar, color: "text-red-600" },
      { title: "المقالات", value: 0, icon: ImageIcon, color: "text-indigo-600" },
    ]
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
