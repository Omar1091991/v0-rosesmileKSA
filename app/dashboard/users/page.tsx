"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, UsersIcon, Mail, Phone, Calendar, Search, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface User {
  id: string
  full_name: string
  email: string
  phone?: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const { toast } = useToast()

  const [showTempDataBanner, setShowTempDataBanner] = useState(true)

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "user",
  })

  const [isReplaceOpen, setIsReplaceOpen] = useState(false)
  const [existingUser, setExistingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      if (Array.isArray(data)) {
        setUsers(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
      toast({
        title: "خطأ",
        description: "فشل في جلب المستخدمين",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، كلمة المرور)",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "بريد إلكتروني غير صحيح",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      })
      return
    }

    if (newUser.password.length < 6) {
      toast({
        title: "كلمة مرور ضعيفة",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    const existingUserWithEmail = users.find((u) => u.email === newUser.email)
    if (existingUserWithEmail) {
      setExistingUser(existingUserWithEmail)
      setIsReplaceOpen(true)
      return
    }

    await createUser()
  }

  const createUser = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (!response.ok) {
        let errorTitle = "فشل في إضافة المستخدم"
        let errorDescription = data.error || "حدث خطأ غير متوقع"

        if (response.status === 409) {
          errorTitle = "بريد إلكتروني مكرر"
          errorDescription = "البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد آخر"
        } else if (response.status === 401) {
          errorTitle = "غير مصرح"
          errorDescription = "يجب تسجيل الدخول أولاً"
        } else if (response.status === 403) {
          errorTitle = "ليس لديك صلاحية"
          errorDescription = "ليس لديك صلاحية لإضافة مستخدمين"
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "✓ تم إضافة المستخدم بنجاح",
        description: `تم إضافة ${newUser.full_name} (${newUser.email}) كـ${newUser.role === "admin" ? "مسؤول" : "مستخدم عادي"}`,
        variant: "default",
      })

      setIsAddOpen(false)
      setNewUser({ email: "", password: "", full_name: "", phone: "", role: "user" })
      await fetchUsers()
    } catch (error: any) {
      console.error("[v0] Error creating user:", error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user")
      }

      toast({
        title: "نجح",
        description: `تم تحديث بيانات ${selectedUser.full_name} بنجاح`,
      })

      setIsEditOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (error: any) {
      console.error("[v0] Error updating user:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث المستخدم",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user")
      }

      toast({
        title: "نجح",
        description: "تم حذف المستخدم بنجاح",
      })

      await fetchUsers()
    } catch (error: any) {
      console.error("[v0] Error deleting user:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف المستخدم",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReplaceUser = async () => {
    if (!existingUser) return

    setLoading(true)
    try {
      await fetch(`/api/users?id=${existingUser.id}`, {
        method: "DELETE",
      })

      await createUser()

      toast({
        title: "✓ تم استبدال المستخدم بنجاح",
        description: `تم استبدال بيانات ${existingUser.full_name} بالبيانات الجديدة`,
      })

      setIsReplaceOpen(false)
      setExistingUser(null)
    } catch (error) {
      console.error("[v0] Error replacing user:", error)
      toast({
        title: "خطأ",
        description: "فشل في استبدال المستخدم",
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery))

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {showTempDataBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">وضع المعاينة - بيانات مؤقتة</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                التغييرات التي تجريها (إضافة، تعديل، حذف) مخزنة مؤقتاً في الذاكرة وستختفي عند تحديث الصفحة. عند النشر على
                Vercel، ستعمل قاعدة البيانات الحقيقية وسيتم حفظ جميع التغييرات بشكل دائم.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTempDataBanner(false)}
              className="text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              إخفاء
            </Button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UsersIcon className="h-8 w-8" />
            إدارة المستخدمين
          </h1>
          <p className="text-muted-foreground mt-2">إضافة وتعديل وحذف المستخدمين</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} disabled={loading}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة مستخدم
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم أو البريد الإلكتروني أو رقم الجوال..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="تصفية حسب الصلاحية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستخدمين</SelectItem>
                  <SelectItem value="admin">المسؤولين فقط</SelectItem>
                  <SelectItem value="user">المستخدمين العاديين</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                تم العثور على {filteredUsers.length} من أصل {users.length} مستخدم
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {loading && users.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              {searchQuery || roleFilter !== "all" ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد مستخدمين حالياً"}
            </p>
            {!searchQuery && roleFilter === "all" && (
              <Button size="sm" className="mt-4" onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة أول مستخدم
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-xl">{user.full_name}</h3>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "مسؤول" : "مستخدم"}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>

                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span dir="ltr">{user.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>تاريخ التسجيل: {formatDate(user.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditOpen(true)
                        }}
                        disabled={loading}
                      >
                        <Pencil className="h-4 w-4 ml-2" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              إضافة مستخدم جديد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                الاسم الكامل <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                placeholder="أدخل الاسم الكامل"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                البريد الإلكتروني <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="example@email.com"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الجوال</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="05xxxxxxxx"
                dir="ltr"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                كلمة المرور <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">الصلاحية</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">مستخدم عادي</SelectItem>
                  <SelectItem value="admin">مسؤول</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={loading}>
              إلغاء
            </Button>
            <Button onClick={handleAddUser} disabled={loading}>
              {loading ? "جاري الإضافة..." : "إضافة المستخدم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              تعديل بيانات المستخدم
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_full_name">الاسم الكامل</Label>
                <Input
                  id="edit_full_name"
                  value={selectedUser.full_name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email">البريد الإلكتروني</Label>
                <Input id="edit_email" value={selectedUser.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">لا يمكن تعديل البريد الإلكتروني</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone">رقم الجوال</Label>
                <Input
                  id="edit_phone"
                  value={selectedUser.phone || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_role">الصلاحية</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم عادي</SelectItem>
                    <SelectItem value="admin">مسؤول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={loading}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateUser} disabled={loading}>
              {loading ? "جاري التحديث..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReplaceOpen} onOpenChange={setIsReplaceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              المستخدم موجود مسبقاً
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              المستخدم بالبريد الإلكتروني <strong>{newUser.email}</strong> موجود مسبقاً:
            </p>
            {existingUser && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2">
                  <p>
                    <strong>الاسم:</strong> {existingUser.full_name}
                  </p>
                  <p>
                    <strong>البريد:</strong> {existingUser.email}
                  </p>
                  {existingUser.phone && (
                    <p>
                      <strong>الجوال:</strong> {existingUser.phone}
                    </p>
                  )}
                  <p>
                    <strong>الصلاحية:</strong> {existingUser.role === "admin" ? "مسؤول" : "مستخدم عادي"}
                  </p>
                </CardContent>
              </Card>
            )}
            <p className="text-sm text-muted-foreground">
              هل تريد استبدال البيانات القديمة بالبيانات الجديدة؟ سيتم حذف البيانات القديمة نهائياً.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsReplaceOpen(false)
                setExistingUser(null)
              }}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleReplaceUser} disabled={loading}>
              {loading ? "جاري الاستبدال..." : "استبدال وحفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
