import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === "add_phone_column") {
      console.log("[v0] Running phone column migration...")

      const migrationSQL = `
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                AND column_name = 'phone'
            ) THEN
                ALTER TABLE users ADD COLUMN phone VARCHAR(50);
                RAISE NOTICE 'تم إضافة عمود phone بنجاح';
            ELSE
                RAISE NOTICE 'عمود phone موجود بالفعل';
            END IF;
        END $$;
      `

      await db.query(migrationSQL)
      console.log("[v0] Phone column migration completed successfully")
      return NextResponse.json({ success: true, message: "تم التحقق من عمود phone بنجاح" })
    }

    if (action === "fix_doctor_cases") {
      console.log("[v0] Running doctor cases fix migration...")

      const migrationSQL = `
        ALTER TABLE doctor_cases 
          ALTER COLUMN title_ar DROP NOT NULL,
          ALTER COLUMN title_en DROP NOT NULL,
          ALTER COLUMN description_ar DROP NOT NULL,
          ALTER COLUMN description_en DROP NOT NULL;
      `

      await db.query(migrationSQL)
      console.log("[v0] Doctor cases migration completed successfully")
      return NextResponse.json({ success: true, message: "تم إصلاح جدول حالات الأطباء بنجاح" })
    }

    if (action === "add_contacted_column") {
      console.log("[v0] Running contacted column migration...")

      const migrationSQL = `
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'bookings' 
                AND column_name = 'contacted'
            ) THEN
                ALTER TABLE bookings ADD COLUMN contacted BOOLEAN DEFAULT false;
                CREATE INDEX IF NOT EXISTS idx_bookings_contacted ON bookings(contacted);
                RAISE NOTICE 'تم إضافة عمود contacted بنجاح';
            ELSE
                RAISE NOTICE 'عمود contacted موجود بالفعل';
            END IF;
        END $$;
      `

      await db.query(migrationSQL)
      console.log("[v0] Contacted column migration completed successfully")
      return NextResponse.json({ success: true, message: "تم إضافة عمود contacted بنجاح" })
    }

    if (action === "add_booking_tracking_columns") {
      console.log("[v0] Running booking tracking columns migration...")

      const migrationSQL = `
        DO $$ 
        BEGIN
            -- إضافة عمود contacted إذا لم يكن موجوداً
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'bookings' 
                AND column_name = 'contacted'
            ) THEN
                ALTER TABLE bookings ADD COLUMN contacted BOOLEAN DEFAULT false;
                RAISE NOTICE 'تم إضافة عمود contacted';
            END IF;

            -- إضافة عمود contact_attempts إذا لم يكن موجوداً
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'bookings' 
                AND column_name = 'contact_attempts'
            ) THEN
                ALTER TABLE bookings ADD COLUMN contact_attempts INTEGER DEFAULT 0;
                RAISE NOTICE 'تم إضافة عمود contact_attempts';
            END IF;

            -- إضافة عمود admin_notes إذا لم يكن موجوداً
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'bookings' 
                AND column_name = 'admin_notes'
            ) THEN
                ALTER TABLE bookings ADD COLUMN admin_notes TEXT;
                RAISE NOTICE 'تم إضافة عمود admin_notes';
            END IF;

            -- تحديث القيم الافتراضية للصفوف الموجودة
            UPDATE bookings SET contacted = false WHERE contacted IS NULL;
            UPDATE bookings SET contact_attempts = 0 WHERE contact_attempts IS NULL;

            -- إنشاء فهرس لتحسين الأداء
            CREATE INDEX IF NOT EXISTS idx_bookings_contacted ON bookings(contacted);
            CREATE INDEX IF NOT EXISTS idx_bookings_contact_attempts ON bookings(contact_attempts);

            RAISE NOTICE 'تم إضافة جميع أعمدة التتبع بنجاح';
        END $$;
      `

      await db.query(migrationSQL)
      console.log("[v0] Booking tracking columns migration completed successfully")
      return NextResponse.json({ success: true, message: "تم إضافة جميع أعمدة التتبع للحجوزات بنجاح" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] Database setup error:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء تنفيذ العملية" }, { status: 500 })
  }
}
