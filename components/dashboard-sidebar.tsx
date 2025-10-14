"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  Briefcase,
  Stethoscope,
  Building2,
  Tag,
  Calendar,
  FileText,
  ImageIcon,
  LayoutDashboard,
} from "lucide-react"

const menuItems = [
  { title: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { title: "المستخدمين", href: "/dashboard/users", icon: Users },
  { title: "الخدمات", href: "/dashboard/services", icon: Briefcase },
  { title: "الأطباء", href: "/dashboard/doctors", icon: Stethoscope },
  { title: "الأقسام", href: "/dashboard/departments", icon: Building2 },
  { title: "العروض", href: "/dashboard/offers", icon: Tag },
  { title: "الحجوزات", href: "/dashboard/bookings", icon: Calendar },
  { title: "المقالات", href: "/dashboard/articles", icon: FileText },
  { title: "معرض الصور", href: "/dashboard/gallery", icon: ImageIcon },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-l bg-muted/30 p-6 space-y-2">
      <div className="mb-8">
        <h2 className="text-lg font-bold">لوحة التحكم</h2>
        <p className="text-sm text-muted-foreground">إدارة الموقع</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
