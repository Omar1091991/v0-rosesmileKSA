"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SiteHeader } from "@/components/site-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/auth/login")
  //   }
  // }, [user, loading, router])

  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen flex-col">
  //       <SiteHeader />
  //       <LoadingSpinner />
  //     </div>
  //   )
  // }

  // if (!user) {
  //   return null
  // }
  // </CHANGE>

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  )
}
