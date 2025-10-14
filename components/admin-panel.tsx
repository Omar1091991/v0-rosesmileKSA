"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus, Pencil, Trash2, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AdminPanelProps {
  onClose: () => void
}

interface User {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  created_at: string
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user",
  })

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
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
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) throw new Error("Failed to create user")

      toast({
        title: "نجح",
        description: "تم إضافة المستخدم بنجاح",
      })

      setIsAddUserOpen(false)
      setNewUser({ email: "", password: "", full_name: "", role: "user" })
      fetchUsers()
    } catch (error) {
      console.error("[v0] Error creating user:", error)
      toast({
        title: "خطأ",
        description: "فشل في إضافة المستخدم",
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

      if (!response.ok) throw new Error("Failed to update user")

      toast({
        title: "نجح",
        description: "تم تحديث المستخدم بنجاح",
      })

      setIsEditUserOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      console.error("[v0] Error updating user:", error)
      toast({
        title: "خطأ",
        description: "فشل في تحديث المستخدم",
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

      if (!response.ok) throw new Error("Failed to delete user")

      toast({
        title: "نجح",
        description: "تم حذف المستخدم بنجاح",
      })

      fetchUsers()
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
      toast({
        title: "خطأ",
        description: "فشل في حذف المستخدم",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Card
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-2xl">لوحة التحكم</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="users">المستخدمين</TabsTrigger>
                <TabsTrigger value="services">الخدمات</TabsTrigger>
                <TabsTrigger value="doctors">الأطباء</TabsTrigger>
                <TabsTrigger value="offers">العروض</TabsTrigger>
                <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    إدارة المستخدمين
                  </h3>
                  <Button size="sm" onClick={() => setIsAddUserOpen(true)}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة مستخدم
                  </Button>
                </div>

                {loading ? (
                  <p className="text-center text-muted-foreground py-8">جاري التحميل...</p>
                ) : users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">لا يوجد مستخدمين حالياً</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{user.full_name}</h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    user.role === "admin"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {user.role === "admin" ? "مسؤول" : "مستخدم"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsEditUserOpen(true)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">إدارة الخدمات</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة خدمة
                  </Button>
                </div>
                <div className="space-y-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">تقويم الأسنان</h4>
                          <p className="text-sm text-muted-foreground">علاج وتصحيح الأسنان</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="doctors" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">إدارة الأطباء</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة طبيب
                  </Button>
                </div>
                <p className="text-center text-muted-foreground py-8">لا يوجد أطباء حالياً</p>
              </TabsContent>

              <TabsContent value="offers" className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">إدارة العروض</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة عرض
                  </Button>
                </div>
                <p className="text-center text-muted-foreground py-8">لا توجد عروض حالياً</p>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">الحجوزات الأخيرة</h3>
                <p className="text-center text-muted-foreground py-8">لا توجد حجوزات حالياً</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">الاسم الكامل</Label>
              <Input
                id="full_name"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="أدخل كلمة المرور"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">الصلاحية</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">مستخدم</SelectItem>
                  <SelectItem value="admin">مسؤول</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddUser} disabled={loading}>
              {loading ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_full_name">الاسم الكامل</Label>
                <Input
                  id="edit_full_name"
                  value={selectedUser.full_name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone">رقم الجوال</Label>
                <Input
                  id="edit_phone"
                  value={selectedUser.phone || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  placeholder="05xxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_role">الصلاحية</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="admin">مسؤول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateUser} disabled={loading}>
              {loading ? "جاري التحديث..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
