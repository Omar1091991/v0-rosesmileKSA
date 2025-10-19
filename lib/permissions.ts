import type { User } from "@/lib/auth"

export type Permission =
  | "bookings.read"
  | "bookings.write"
  | "bookings.edit"
  | "bookings.delete"
  | "articles.read"
  | "articles.write"
  | "articles.edit"
  | "articles.delete"
  | "services.read"
  | "services.write"
  | "services.edit"
  | "services.delete"
  | "doctors.read"
  | "doctors.write"
  | "doctors.edit"
  | "doctors.delete"
  | "offers.read"
  | "offers.write"
  | "offers.edit"
  | "offers.delete"
  | "departments.read"
  | "departments.write"
  | "departments.edit"
  | "departments.delete"
  | "users.read"
  | "users.write"
  | "users.edit"
  | "users.delete"
  | "settings.read"
  | "settings.write"
  | "gallery.read"
  | "gallery.write"
  | "gallery.edit"
  | "gallery.delete"
  | "booking_forms.read"
  | "booking_forms.write"
  | "booking_forms.edit"
  | "booking_forms.delete"

const rolePermissions: Record<string, Permission[]> = {
  admin: [
    // المسؤول لديه جميع الصلاحيات
    "bookings.read",
    "bookings.write",
    "bookings.edit",
    "bookings.delete",
    "articles.read",
    "articles.write",
    "articles.edit",
    "articles.delete",
    "services.read",
    "services.write",
    "services.edit",
    "services.delete",
    "doctors.read",
    "doctors.write",
    "doctors.edit",
    "doctors.delete",
    "offers.read",
    "offers.write",
    "offers.edit",
    "offers.delete",
    "departments.read",
    "departments.write",
    "departments.edit",
    "departments.delete",
    "users.read",
    "users.write",
    "users.edit",
    "users.delete",
    "settings.read",
    "settings.write",
    "gallery.read",
    "gallery.write",
    "gallery.edit",
    "gallery.delete",
    "booking_forms.read",
    "booking_forms.write",
    "booking_forms.edit",
    "booking_forms.delete",
  ],
  editor: [
    // المحرر يمكنه إدارة المقالات فقط
    "articles.read",
    "articles.write",
    "articles.edit",
    "articles.delete",
  ],
  user: [
    // المستخدم العادي يمكنه عرض الحجوزات فقط
    "bookings.read",
  ],
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false

  const permissions = rolePermissions[user.role] || []
  return permissions.includes(permission)
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.some((permission) => hasPermission(user, permission))
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false

  return permissions.every((permission) => hasPermission(user, permission))
}

export function canAccessPage(user: User | null, page: string): boolean {
  if (!user) return false

  const pagePermissions: Record<string, Permission[]> = {
    "/dashboard": [], // الجميع يمكنهم الوصول للصفحة الرئيسية
    "/dashboard/bookings": ["bookings.read"],
    "/dashboard/articles": ["articles.read"],
    "/dashboard/services": ["services.read"],
    "/dashboard/doctors": ["doctors.read"],
    "/dashboard/offers": ["offers.read"],
    "/dashboard/departments": ["departments.read"],
    "/dashboard/users": ["users.read"],
    "/dashboard/content": ["settings.read"],
    "/dashboard/gallery": ["gallery.read"],
    "/dashboard/media": ["gallery.read"],
    "/dashboard/booking-forms": ["booking_forms.read"],
    "/dashboard/database-setup": ["settings.write"],
  }

  const requiredPermissions = pagePermissions[page]
  if (!requiredPermissions || requiredPermissions.length === 0) return true

  return hasAnyPermission(user, requiredPermissions)
}
