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
        notes TEXT,
        status TEXT DEFAULT 'pending',
        contacted BOOLEAN DEFAULT false,
        contact_attempts INTEGER DEFAULT 0,
        admin_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
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
    `)

    console.log("[v0] Database tables created successfully")

    await query(`
      -- إدراج مستخدم إداري افتراضي
      INSERT INTO profiles (full_name, email, phone, role)
      VALUES ('المسؤول', 'admin@rosesmile.com', '0500000000', 'admin')
      ON CONFLICT (email) DO NOTHING;

      -- إدراج نموذج حجز رئيسي
      INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, is_main, is_active)
      VALUES ('نموذج الحجز الرئيسي', 'Main Booking Form', 'نموذج الحجز الأساسي للموقع', 'Main booking form for the website', true, true)
      ON CONFLICT DO NOTHING;
    `)

    console.log("[v0] Default data inserted successfully")

    return NextResponse.json({
      success: true,
      message: "تم إنشاء قاعدة البيانات بنجاح",
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
