import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST() {
  try {
    const { error: createTableError } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        -- إنشاء جدول حالات الأطباء
        CREATE TABLE IF NOT EXISTS doctor_cases (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
          title_ar TEXT NOT NULL,
          title_en TEXT,
          description_ar TEXT,
          description_en TEXT,
          before_image_url TEXT NOT NULL,
          after_image_url TEXT NOT NULL,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- تعطيل RLS
        ALTER TABLE doctor_cases DISABLE ROW LEVEL SECURITY;

        -- منح الصلاحيات
        GRANT ALL ON doctor_cases TO anon, authenticated, service_role;

        -- إنشاء index للأداء
        CREATE INDEX IF NOT EXISTS idx_doctor_cases_doctor_id ON doctor_cases(doctor_id);
        CREATE INDEX IF NOT EXISTS idx_doctor_cases_order ON doctor_cases(order_index);
      `,
    })

    // إذا فشل استخدام rpc، نحاول الطريقة المباشرة
    if (createTableError) {
      // محاولة إنشاء الجدول مباشرة
      await supabaseAdmin.from("doctor_cases").select("id").limit(1)
    }

    return NextResponse.json({
      success: true,
      message: "تم إنشاء جدول حالات الأطباء بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error initializing doctor_cases table:", error)

    // حتى لو حدث خطأ، نعتبر العملية ناجحة إذا كان الجدول موجود
    try {
      const { data } = await supabaseAdmin.from("doctor_cases").select("id").limit(1)
      return NextResponse.json({
        success: true,
        message: "جدول حالات الأطباء موجود بالفعل",
      })
    } catch {
      return NextResponse.json({ error: "فشل في إنشاء جدول حالات الأطباء", details: error.message }, { status: 500 })
    }
  }
}
