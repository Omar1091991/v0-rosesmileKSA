"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshSession: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      setUser(data.user || null)
    } catch (error) {
      console.error("[v0] Error fetching session:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    }
  }

  const refreshSession = async () => {
    await fetchSession()
  }

  return <AuthContext.Provider value={{ user, loading, logout, refreshSession }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
