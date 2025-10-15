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
  ImageIcon,
  LayoutDashboard,
  LogOut,
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
  { title: "الرئيسية", href: "/dashboard", icon: LayoutDashboard, permission: "*" },
  { title: "المستخدمين", href: "/dashboard/users", icon: Users, permission: "admin" },
  { title: "محتوى الموقع", href: "/dashboard/content", icon: FileText, permission: "admin" },
  { title: "الخدمات", href: "/dashboard/services", icon: Briefcase, permission: "admin" },
  { title: "الأطباء", href: "/dashboard/doctors", icon: Stethoscope, permission: "admin" },
  { title: "الأقسام", href: "/dashboard/departments", icon: Building2, permission: "admin" },
  { title: "العروض", href: "/dashboard/offers", icon: Tag, permission: "admin" },
  { title: "نماذج الحجز", href: "/dashboard/booking-forms", icon: FileText, permission: "admin" },
  { title: "الحجوزات", href: "/dashboard/bookings", icon: Calendar, permission: "*" },
  { title: "المقالات", href: "/dashboard/articles", icon: FileText, permission: "editor" },
  { title: "معرض الصور", href: "/dashboard/gallery", icon: ImageIcon, permission: "admin" },
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

  const canAccessMenuItem = (permission: string) => {
    if (!user) return false
    if (permission === "*") return true
    if (user.role === "admin") return true
    if (permission === "editor" && (user.role === "editor" || user.role === "admin")) return true
    return false
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0]
    }
    return name.substring(0, 2)
  }

  return (
    <aside className="w-64 border-l bg-muted/30 p-6 space-y-4 flex flex-col">
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
          {menuItems.map((item) => {
            if (!canAccessMenuItem(item.permission)) return null

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
      </div>
    </aside>
  )
}
