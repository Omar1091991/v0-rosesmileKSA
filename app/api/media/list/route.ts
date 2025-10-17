import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    const { blobs } = await list()

    return NextResponse.json({
      success: true,
      images: blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
    })
  } catch (error) {
    console.error("Error listing images:", error)
    return NextResponse.json({ success: false, error: "فشل في جلب الصور" }, { status: 500 })
  }
}
