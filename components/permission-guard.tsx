"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { hasPermission, type Permission } from "@/lib/permissions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

interface PermissionGuardProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { user } = useAuth()

  if (!hasPermission(user, permission)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>غير مصرح</AlertTitle>
        <AlertDescription>ليس لديك صلاحية للوصول إلى هذا المحتوى.</AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
