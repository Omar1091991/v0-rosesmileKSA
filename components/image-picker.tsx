"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ImagePickerProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
}

interface BlobImage {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export function ImagePicker({ value, onChange, onRemove }: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState<BlobImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchImages()
    }
  }, [open])

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
        onChange(data.url)
        setOpen(false)
        toast({
          title: "نجح",
          description: "تم رفع واختيار الصورة بنجاح",
        })
        // Refresh the images list in the background
        fetchImages()
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
    }
  }

  const handleSelectImage = (url: string) => {
    onChange(url)
    setOpen(false)
    toast({
      title: "نجح",
      description: "تم اختيار الصورة",
    })
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
          <Image src={value || "/placeholder.svg"} alt="Selected image" fill className="object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
              <ImageIcon className="h-4 w-4 ml-2" />
              تغيير
            </Button>
            {onRemove && (
              <Button type="button" size="sm" variant="destructive" onClick={onRemove}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" className="w-full h-48 bg-transparent" onClick={() => setOpen(true)}>
          <ImageIcon className="h-8 w-8 ml-2" />
          اختيار صورة
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>اختيار صورة</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload new image */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="outline" disabled={uploading} asChild>
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
              <p className="text-sm text-muted-foreground mt-2">PNG, JPG, GIF حتى 5MB</p>
            </div>

            {/* Existing images */}
            <div>
              <h3 className="text-lg font-semibold mb-3">الصور المحفوظة</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : images.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">لا توجد صور محفوظة</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <button
                      key={image.url}
                      type="button"
                      onClick={() => handleSelectImage(image.url)}
                      className="relative aspect-square border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                    >
                      <Image src={image.url || "/placeholder.svg"} alt={image.pathname} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
