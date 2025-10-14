import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { user_id, email, full_name, phone, role } = body

    console.log("[v0] Creating profile for user:", { user_id, email, full_name })

    // التحقق من عدم وجود profile مسبقاً
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user_id).single()

    if (existingProfile) {
      console.log("[v0] Profile already exists, updating...")
      // تحديث البروفايل الموجود
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name,
          phone,
          email,
          role: role || "user",
        })
        .eq("id", user_id)

      if (updateError) {
        console.error("[v0] Error updating profile:", updateError)
        throw updateError
      }

      return NextResponse.json({ success: true, message: "Profile updated" })
    }

    // إنشاء profile جديد
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user_id,
      email,
      full_name,
      phone,
      role: role || "user",
    })

    if (insertError) {
      console.error("[v0] Error creating profile:", insertError)
      throw insertError
    }

    console.log("[v0] Profile created successfully")
    return NextResponse.json({ success: true, message: "Profile created" })
  } catch (error: any) {
    console.error("[v0] Error in create-profile:", error)
    return NextResponse.json({ error: error.message || "Failed to create profile" }, { status: 500 })
  }
}
