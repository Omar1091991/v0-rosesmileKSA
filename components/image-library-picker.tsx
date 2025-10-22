"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageLibraryPickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
  disabled?: boolean
}

interface BlobImage {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export function ImageLibraryPicker({ value, onChange, label = "الصورة", disabled = false }: ImageLibraryPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<BlobImage[]>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>(value)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  const fetchImages = async () => {
    setLoadingImages(true)
    try {
      const response = await fetch("/api/media/list")
      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب الصور",
        variant: "destructive",
      })
    } finally {
      setLoadingImages(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    toast({
      title: "جاري رفع الصورة...",
      description: "يرجى الانتظار",
    })

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedImage(data.url)
        onChange(data.url)
        toast({
          title: "تم رفع الصورة بنجاح",
          description: "يمكنك الآن حفظ التغييرات",
        })
        fetchImages() // Refresh the library
      } else {
        toast({
          title: "خطأ",
          description: "فشل في رفع الصورة",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع الصورة",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSelectImage = (url: string) => {
    setSelectedImage(url)
    onChange(url)
    setIsOpen(false)
    toast({
      title: "تم اختيار الصورة",
      description: "يمكنك الآن حفظ التغييرات",
    })
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" disabled={disabled} className="flex-1 bg-transparent">
              <ImageIcon className="h-4 w-4 ml-2" />
              اختيار صورة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>اختيار صورة</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="library" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="library">مكتبة الصور</TabsTrigger>
                <TabsTrigger value="upload">رفع صورة جديدة</TabsTrigger>
              </TabsList>
              <TabsContent value="library" className="space-y-4">
                {loadingImages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">لا توجد صور في المكتبة</div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.url}
                        className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all hover:border-primary ${
                          selectedImage === image.url ? "border-primary ring-2 ring-primary" : "border-transparent"
                        }`}
                        onClick={() => handleSelectImage(image.url)}
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.pathname}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                          {image.pathname}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-12 w-12 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">جاري رفع الصورة...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-muted-foreground" />
                          <p className="text-sm font-medium">اضغط لاختيار صورة</p>
                          <p className="text-xs text-muted-foreground">الحد الأقصى: 5 ميجابايت</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {selectedImage && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">معاينة الصورة:</p>
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      {value && (
        <div className="mt-2">
          <img src={value || "/placeholder.svg"} alt="Current" className="w-full h-48 object-cover rounded-lg" />
        </div>
      )}
    </div>
  )
}
