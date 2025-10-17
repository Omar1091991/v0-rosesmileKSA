"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Loader2, ImageIcon, Upload, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

interface BlobImage {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export default function MediaPage() {
  const [images, setImages] = useState<BlobImage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<BlobImage | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/media/list")
      const data = await response.json()

      if (data.success) {
        setImages(data.images)
      } else {
        toast({
          title: "خطأ",
          description: "فشل في جلب الصور",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (image: BlobImage) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return

    setDeleting(imageToDelete.url)
    try {
      const response = await fetch("/api/media/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageToDelete.url }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "نجح",
          description: "تم حذف الصورة بنجاح",
        })
        // Remove the image from the list
        setImages(images.filter((img) => img.url !== imageToDelete.url))
      } else {
        toast({
          title: "خطأ",
          description: data.error || "فشل في حذف الصورة",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الصورة",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
      setDeleteDialogOpen(false)
      setImageToDelete(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف صورة",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "نجح",
          description: "تم رفع الصورة بنجاح",
        })
        // Refresh the images list
        await fetchImages()
      } else {
        toast({
          title: "خطأ",
          description: data.error || "فشل في رفع الصورة",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في رفع الصورة",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset the input
      e.target.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مكتبة الصور</h1>
          <p className="text-muted-foreground">إدارة جميع الصور المرفوعة على الموقع</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchImages} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="media-upload"
          />
          <label htmlFor="media-upload">
            <Button type="button" disabled={uploading} asChild>
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 ml-2" />
                    رفع صورة جديدة
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الصور المحفوظة ({images.length})</CardTitle>
          <CardDescription>جميع الصور المرفوعة على الموقع</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد صور محفوظة</p>
              <p className="text-sm text-muted-foreground mt-2">ابدأ برفع صورة جديدة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card key={image.url} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image src={image.url || "/placeholder.svg"} alt={image.pathname} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm font-medium truncate" title={image.pathname}>
                      {image.pathname}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(image.size)}</span>
                      <span>{formatDate(image.uploadedAt)}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDeleteClick(image)}
                      disabled={deleting === image.url}
                    >
                      {deleting === image.url ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          جاري الحذف...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الصورة نهائياً ولن يمكن استرجاعها. قد يؤثر هذا على الصفحات التي تستخدم هذه الصورة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
