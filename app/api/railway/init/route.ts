import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting Railway database initialization...")

    await query(`
      -- جدول المستخدمين
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول الخدمات
      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title_ar TEXT NOT NULL,
        title_en TEXT NOT NULL,
        description_ar TEXT,
        description_en TEXT,
        icon TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول الأطباء
      CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        specialty_ar TEXT NOT NULL,
        specialty_en TEXT NOT NULL,
        bio_ar TEXT,
        bio_en TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول حالات الأطباء
      CREATE TABLE IF NOT EXISTS doctor_cases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        title_ar TEXT,
        title_en TEXT,
        description_ar TEXT,
        description_en TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول الأقسام
      CREATE TABLE IF NOT EXISTS departments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        description_ar TEXT,
        description_en TEXT,
        icon TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول العروض
      CREATE TABLE IF NOT EXISTS offers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title_ar TEXT NOT NULL,
        title_en TEXT NOT NULL,
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT,
        original_price DECIMAL(10,2),
        discount_price DECIMAL(10,2),
        discount_percentage INTEGER,
        is_active BOOLEAN DEFAULT true,
        start_date TIMESTAMPTZ,
        end_date TIMESTAMPTZ,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول المقالات
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title_ar TEXT NOT NULL,
        title_en TEXT NOT NULL,
        content_ar TEXT,
        content_en TEXT,
        excerpt_ar TEXT,
        excerpt_en TEXT,
        image_url TEXT,
        author TEXT,
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMPTZ,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول معرض الصور
      CREATE TABLE IF NOT EXISTS gallery (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title_ar TEXT,
        title_en TEXT,
        image_url TEXT NOT NULL,
        category TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول نماذج الحجز
      CREATE TABLE IF NOT EXISTS booking_forms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT,
        google_sheet_id TEXT,
        is_main BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول ربط نماذج الحجز بالخدمات
      CREATE TABLE IF NOT EXISTS booking_form_services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
        service_id UUID REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(booking_form_id, service_id)
      );

      -- جدول الحجوزات
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_id UUID REFERENCES services(id) ON DELETE SET NULL,
        service_name TEXT,
        booking_form_id UUID REFERENCES booking_forms(id) ON DELETE SET NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        contacted BOOLEAN DEFAULT false,
        contact_attempts INTEGER DEFAULT 0,
        admin_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- جدول إعدادات الموقع
      CREATE TABLE IF NOT EXISTS site_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key TEXT UNIQUE NOT NULL,
        value_ar TEXT,
        value_en TEXT,
        type TEXT DEFAULT 'text',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- إنشاء الفهارس لتحسين الأداء
      CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
      CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors(is_active);
      CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_bookings_form ON bookings(booking_form_id);
    `)

    console.log("[v0] Database tables created successfully")

    try {
      await query(`
        -- إضافة عمود booking_form_id إلى جدول bookings إذا لم يكن موجوداً
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'booking_form_id'
          ) THEN
            ALTER TABLE bookings ADD COLUMN booking_form_id UUID REFERENCES booking_forms(id) ON DELETE SET NULL;
          END IF;
        END $$;

        -- إضافة عمود updated_at إلى جدول bookings إذا لم يكن موجوداً
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'updated_at'
          ) THEN
            ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
          END IF;
        END $$;

        -- إضافة أعمدة value_ar, value_en, type إلى جدول site_settings إذا لم تكن موجودة
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'site_settings' AND column_name = 'value_ar'
          ) THEN
            ALTER TABLE site_settings ADD COLUMN value_ar TEXT;
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'site_settings' AND column_name = 'value_en'
          ) THEN
            ALTER TABLE site_settings ADD COLUMN value_en TEXT;
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'site_settings' AND column_name = 'type'
          ) THEN
            ALTER TABLE site_settings ADD COLUMN type TEXT DEFAULT 'text';
          END IF;

          -- نقل البيانات من value إلى value_ar إذا كانت موجودة
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'site_settings' AND column_name = 'value'
          ) THEN
            UPDATE site_settings SET value_ar = value WHERE value_ar IS NULL;
          END IF;
        END $$;

        -- إضافة عمود is_active إلى جدول doctors إذا لم يكن موجوداً
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'doctors' AND column_name = 'is_active'
          ) THEN
            ALTER TABLE doctors ADD COLUMN is_active BOOLEAN DEFAULT true;
          END IF;
        END $$;
      `)
      console.log("[v0] Missing columns added successfully")
    } catch (alterError) {
      console.log("[v0] Note: Some columns may already exist:", alterError)
    }

    await query(`
      -- إدراج مستخدم إداري افتراضي
      INSERT INTO profiles (full_name, email, phone, role)
      VALUES ('المسؤول', 'admin@rosesmile.com', '0500000000', 'admin')
      ON CONFLICT (email) DO NOTHING;

      -- إدراج نموذج حجز رئيسي
      INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, is_main, is_active)
      VALUES ('نموذج الحجز الرئيسي', 'Main Booking Form', 'نموذج الحجز الأساسي للموقع', 'Main booking form for the website', true, true)
      ON CONFLICT DO NOTHING;

      -- إدراج إعدادات الموقع الافتراضية
      INSERT INTO site_settings (key, value_ar, value_en, type) VALUES
        ('hero_title', 'ابتسامة الورود | ابتسامتك تتألود', 'Rose Smile | Your Smile Shines', 'text'),
        ('hero_description', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة', 'We provide the best medical services with the latest technologies in Makkah', 'textarea'),
        ('hero_animation_type', 'fade', 'fade', 'select'),
        ('phone', '+966500000000', '+966500000000', 'text'),
        ('email', 'info@rosesmile.com', 'info@rosesmile.com', 'text'),
        ('address', 'مكة المكرمة، المملكة العربية السعودية', 'Makkah, Saudi Arabia', 'text'),
        ('whatsapp', '+966500000000', '+966500000000', 'text')
      ON CONFLICT (key) DO NOTHING;
    `)

    console.log("[v0] Default data inserted successfully")

    return NextResponse.json({
      success: true,
      message: "تم إنشاء قاعدة البيانات بنجاح وإضافة جميع الأعمدة المطلوبة",
    })
  } catch (error: any) {
    console.error("[v0] Database initialization error:", error)
    return NextResponse.json(
      {
        error: error.message,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}
