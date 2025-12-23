"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  Briefcase,
  Stethoscope,
  Building2,
  Tag,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  LucideComponent as ImageIconComponent,
  Newspaper,
  UserCircle,
  Sheet,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  {
    title: "الرئيسية",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "editor", "user"],
    color: "text-blue-500",
  },
  { title: "الحجوزات", href: "/dashboard/bookings", icon: Calendar, roles: ["admin", "user"], color: "text-green-500" },
  {
    title: "المقالات",
    href: "/dashboard/articles",
    icon: Newspaper,
    roles: ["admin", "editor"],
    color: "text-purple-500",
  },
  { title: "الخدمات", href: "/dashboard/services", icon: Briefcase, roles: ["admin"], color: "text-orange-500" },
  { title: "الأطباء", href: "/dashboard/doctors", icon: Stethoscope, roles: ["admin"], color: "text-teal-500" },
  { title: "العروض", href: "/dashboard/offers", icon: Tag, roles: ["admin"], color: "text-pink-500" },
  { title: "الأقسام", href: "/dashboard/departments", icon: Building2, roles: ["admin"], color: "text-indigo-500" },
  { title: "نماذج الحجز", href: "/dashboard/booking-forms", icon: FileText, roles: ["admin"], color: "text-cyan-500" },
  {
    title: "Google Sheets",
    href: "/dashboard/google-sheets",
    icon: Sheet,
    roles: ["admin"],
    color: "text-emerald-500",
  },
  {
    title: "مكتبة الصور",
    href: "/dashboard/media",
    icon: ImageIconComponent,
    roles: ["admin"],
    color: "text-amber-500",
  },
  { title: "المستخدمين", href: "/dashboard/users", icon: Users, roles: ["admin"], color: "text-rose-500" },
  { title: "محتوى الموقع", href: "/dashboard/content", icon: FileText, roles: ["admin"], color: "text-lime-500" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">مسؤول</Badge>
      case "editor":
        return <Badge variant="secondary">محرر</Badge>
      case "user":
        return <Badge variant="outline">مستخدم</Badge>
      default:
        return null
    }
  }

  const visibleMenuItems = menuItems.filter((item) => {
    if (!user) return false
    return item.roles.includes(user.role)
  })

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0]
    }
    return name.substring(0, 2)
  }

  return (
    <aside
      className="w-64 border-l p-6 space-y-4 flex flex-col"
      style={{
        backgroundColor: "var(--sidebar-menu-bg-color, #f9fafb)",
      }}
    >
      {user && (
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3 px-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-right overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <div className="mt-1">{getRoleBadge(user.role)}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer">
                <UserCircle className="ml-2 h-4 w-4" />
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator />
        </div>
      )}

      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-lg font-bold">لوحة التحكم</h2>
          <p className="text-sm text-muted-foreground">إدارة الموقع</p>
        </div>

        <nav className="space-y-1">
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "" // إزالة الكلاسات الافتراضية لاستخدام الألوان المخصصة
                    : "hover:text-foreground",
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--sidebar-active-item-bg-color, #ec4899)",
                        color: "var(--sidebar-active-item-text-color, #ffffff)",
                      }
                    : {
                        backgroundColor: "transparent",
                        color: "var(--sidebar-menu-item-text-color, #6b7280)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "var(--sidebar-menu-item-hover-bg-color, #f3f4f6)"
                    e.currentTarget.style.color = "var(--sidebar-menu-item-hover-text-color, #1f2937)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "var(--sidebar-menu-item-text-color, #6b7280)"
                  }
                }}
              >
                <item.icon
                  className="h-5 w-5"
                  style={!isActive ? { color: "var(--sidebar-menu-item-icon-color, #6b7280)" } : undefined}
                />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
