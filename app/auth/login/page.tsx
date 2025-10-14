"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupFullName, setSignupFullName] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [isSignupLoading, setIsSignupLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      toast({
        title: "تم تسجيل الدخول بنجاح!",
        description: "مرحباً بك في عيادات ابتسامة الورود",
        variant: "default",
      })

      await new Promise((resolve) => setTimeout(resolve, 500))
      router.refresh()
      router.push("/")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول"
      setError(errorMessage)
      toast({
        title: "فشل تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSignupLoading(true)

    try {
      if (!signupFullName.trim()) {
        throw new Error("الرجاء إدخال الاسم الكامل")
      }
      if (!signupPhone.trim()) {
        throw new Error("الرجاء إدخال رقم الهاتف")
      }
      if (signupPassword.length < 6) {
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      }

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupFullName,
            phone: signupPhone,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (error) throw error

      if (data.user) {
        const profileResponse = await fetch("/api/auth/create-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: data.user.id,
            email: signupEmail,
            full_name: signupFullName,
            phone: signupPhone,
            role: "user",
          }),
        })

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json()
          console.error("[v0] خطأ في إنشاء البروفايل:", errorData)
        }
      }

      toast({
        title: "تم إنشاء الحساب بنجاح!",
        description: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك لتفعيل الحساب.",
        variant: "default",
      })

      // إعادة تعيين النموذج
      setSignupEmail("")
      setSignupPassword("")
      setSignupFullName("")
      setSignupPhone("")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الحساب"

      toast({
        title: "فشل إنشاء الحساب",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSignupLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              ابتسامة الورود
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">مرحباً بك</CardTitle>
              <CardDescription>سجل دخولك أو أنشئ حساباً جديداً</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" dir="rtl">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          dir="ltr"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">كلمة المرور</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-sm text-destructive">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup}>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="signup-name">الاسم الكامل</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="أحمد محمد"
                          required
                          value={signupFullName}
                          onChange={(e) => setSignupFullName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signup-phone">رقم الهاتف</Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="05xxxxxxxx"
                          required
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          dir="ltr"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="example@email.com"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          dir="ltr"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signup-password">كلمة المرور</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="6 أحرف على الأقل"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSignupLoading}>
                        {isSignupLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-sm">
                <Link href="/" className="text-primary hover:underline">
                  العودة للصفحة الرئيسية
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
