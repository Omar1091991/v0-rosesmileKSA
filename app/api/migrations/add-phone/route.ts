import { NextResponse } from "next/server"
import { addPhoneColumn } from "@/scripts/add-phone-column.mjs"

export async function POST() {
  try {
    const result = await addPhoneColumn()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
