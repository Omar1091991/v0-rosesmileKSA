import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Briefcase, Calendar, FileText, ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: usersCount },
    { count: servicesCount },
    { count: doctorsCount },
    { count: offersCount },
    { count: bookingsCount },
    { count: articlesCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("doctors").select("*", { count: "exact", head: true }),
    supabase.from("offers").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { title: "المستخدمين", value: usersCount || 0, icon: Users, color: "text-blue-600" },
    { title: "الخدمات", value: servicesCount || 0, icon: Briefcase, color: "text-green-600" },
    { title: "الأطباء", value: doctorsCount || 0, icon: Stethoscope, color: "text-purple-600" },
    { title: "العروض", value: offersCount || 0, icon: FileText, color: "text-orange-600" },
    { title: "الحجوزات", value: bookingsCount || 0, icon: Calendar, color: "text-red-600" },
    { title: "المقالات", value: articlesCount || 0, icon: ImageIcon, color: "text-indigo-600" },
  ]

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
