"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  role: string
  created_at: string
}

export default function ProfilePage() {
  const { user, refreshSession } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  const [editedProfile, setEditedProfile] = useState({
    full_name: "",
    phone: "",
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()

      if (Array.isArray(data)) {
        const currentUser = data.find((u) => u.email === user.email)
        if (currentUser) {
          setProfile(currentUser)
          setEditedProfile({
            full_name: currentUser.full_name,
            phone: currentUser.phone || "",
          })
        }
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب بيانات الملف الشخصي",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInfo = async () => {
    if (!profile) return

    if (!editedProfile.full_name.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال الاسم الكامل",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profile.id,
          full_name: editedProfile.full_name,
          phone: editedProfile.phone,
          role: profile.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بياناتك الشخصية",
      })

      setIsEditingInfo(false)
      await fetchProfile()
      await refreshSession()
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث البيانات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!profile) return

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال كلمة المرور الجديدة وتأكيدها",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "كلمة مرور ضعيفة",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمة المرور وتأكيدها",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role,
          password: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password")
      }

      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      })

      setIsEditingPassword(false)
      setPasswordData({ newPassword: "", confirmPassword: "" })
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تغيير كلمة المرور",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "مسؤول"
      case "editor":
        return "محرر"
      case "user":
        return "مستخدم"
      default:
        return role
    }
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

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0]
    }
    return name.substring(0, 2)
  }

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">لم يتم العثور على بيانات الملف الشخصي</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          الملف الشخصي
        </h1>
        <p className="text-muted-foreground mt-2">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </CardDescription>
                <div className="mt-2">{getRoleBadge(profile.role)}</div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  المعلومات الشخصية
                </CardTitle>
                <CardDescription>معلوماتك الأساسية</CardDescription>
              </div>
              {!isEditingInfo && (
                <Button variant="outline" onClick={() => setIsEditingInfo(true)} disabled={loading}>
                  تعديل
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingInfo ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    الاسم الكامل <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    value={editedProfile.full_name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                    placeholder="أدخل الاسم الكامل"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الجوال</Label>
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateInfo} disabled={loading}>
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingInfo(false)
                      setEditedProfile({
                        full_name: profile.full_name,
                        phone: profile.phone || "",
                      })
                    }}
                    disabled={loading}
                  >
                    إلغاء
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">الاسم الكامل</p>
                    <p className="font-medium">{profile.full_name}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">البريد الإلكتروني</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">رقم الجوال</p>
                    <p className="font-medium" dir="ltr">
                      {profile.phone || "غير محدد"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">الصلاحية</p>
                    <p className="font-medium">{getRoleName(profile.role)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">تاريخ التسجيل</p>
                    <p className="font-medium">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  الأمان
                </CardTitle>
                <CardDescription>تغيير كلمة المرور</CardDescription>
              </div>
              {!isEditingPassword && (
                <Button variant="outline" onClick={() => setIsEditingPassword(true)} disabled={loading}>
                  تغيير كلمة المرور
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingPassword ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">
                    كلمة المرور الجديدة <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                      disabled={loading}
                      className="pl-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={loading}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">
                    تأكيد كلمة المرور <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      disabled={loading}
                      className="pl-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdatePassword} disabled={loading}>
                    {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingPassword(false)
                      setPasswordData({ newPassword: "", confirmPassword: "" })
                      setShowNewPassword(false)
                      setShowConfirmPassword(false)
                    }}
                    disabled={loading}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">كلمة المرور</p>
                  <p className="font-medium">••••••••</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
