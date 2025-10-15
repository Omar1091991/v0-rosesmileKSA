export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "user" | "editor"
}

export interface Session {
  user: User
  expiresAt: number
}

// تخزين الجلسات في الذاكرة (للمعاينة فقط - في الإنتاج استخدم قاعدة البيانات أو Redis)
const sessions = new Map<string, Session>()

export function createSession(user: User): string {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 ساعة

  sessions.set(sessionId, {
    user,
    expiresAt,
  })

  return sessionId
}

export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId)

  if (!session) {
    return null
  }

  // التحقق من انتهاء صلاحية الجلسة
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId)
    return null
  }

  return session
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId)
}

export function hasPermission(role: string, requiredPermission: string): boolean {
  const permissions: Record<string, string[]> = {
    admin: ["*"], // المسؤول لديه جميع الصلاحيات
    editor: ["articles.read", "articles.write", "articles.edit", "articles.delete"],
    user: ["bookings.read"], // المستخدم العادي يمكنه فقط عرض الحجوزات
  }

  const userPermissions = permissions[role] || []

  // إذا كان المستخدم مسؤول، لديه جميع الصلاحيات
  if (userPermissions.includes("*")) {
    return true
  }

  return userPermissions.includes(requiredPermission)
}
