import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting database initialization...")

    await query(`
      -- جدول الملفات الشخصية
      CREATE TABLE IF NOT EXISTS public.profiles (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول الخدمات
      CREATE TABLE IF NOT EXISTS public.services (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        icon VARCHAR(100),
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول الأطباء
      CREATE TABLE IF NOT EXISTS public.doctors (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        specialty_ar VARCHAR(255),
        specialty_en VARCHAR(255),
        bio_ar TEXT,
        bio_en TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول الأقسام
      CREATE TABLE IF NOT EXISTS public.departments (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        icon VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول العروض
      CREATE TABLE IF NOT EXISTS public.offers (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        price_before DECIMAL(10, 2),
        price_after DECIMAL(10, 2),
        discount_percentage INTEGER,
        valid_from DATE,
        valid_until DATE,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول المقالات
      CREATE TABLE IF NOT EXISTS public.articles (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        content_ar TEXT,
        content_en TEXT,
        image_url TEXT,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول الحجوزات
      CREATE TABLE IF NOT EXISTS public.bookings (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        service_name VARCHAR(255),
        service_id INTEGER,
        booking_form_id INTEGER,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول المعرض
      CREATE TABLE IF NOT EXISTS public.gallery (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255),
        title_en VARCHAR(255),
        image_url TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول إعدادات الموقع
      CREATE TABLE IF NOT EXISTS public.site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value_ar TEXT,
        value_en TEXT,
        type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول نماذج الحجز
      CREATE TABLE IF NOT EXISTS public.booking_forms (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT,
        is_main BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول خدمات نماذج الحجز
      CREATE TABLE IF NOT EXISTS public.booking_form_services (
        id SERIAL PRIMARY KEY,
        booking_form_id INTEGER REFERENCES booking_forms(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- جدول حالات الأطباء
      CREATE TABLE IF NOT EXISTS public.doctor_cases (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        title_ar VARCHAR(255),
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log("[v0] Tables created successfully")

    // إضافة البيانات الأولية
    await query(`
      INSERT INTO public.site_settings (key, value_ar, value_en, type) VALUES
      ('site_name', 'عيادات ابتسامة الورود', 'Rose Smile Clinics', 'text'),
      ('phone', '0123456789', '0123456789', 'text'),
      ('email', 'info@rosesmile.com', 'info@rosesmile.com', 'text'),
      ('address', 'الرياض، المملكة العربية السعودية', 'Riyadh, Saudi Arabia', 'text'),
      ('whatsapp', '966123456789', '966123456789', 'text'),
      ('facebook', 'https://facebook.com/rosesmile', 'https://facebook.com/rosesmile', 'url'),
      ('twitter', 'https://twitter.com/rosesmile', 'https://twitter.com/rosesmile', 'url'),
      ('instagram', 'https://instagram.com/rosesmile', 'https://instagram.com/rosesmile', 'url')
      ON CONFLICT (key) DO NOTHING
    `)

    await query(`
      INSERT INTO public.profiles (email, full_name, phone, role) VALUES
      ('admin@rosesmile.com', 'المدير', '0123456789', 'admin')
      ON CONFLICT (email) DO NOTHING
    `)

    await query(`
      INSERT INTO public.booking_forms (name_ar, name_en, description_ar, description_en, is_main, is_active) VALUES
      ('نموذج الحجز الرئيسي', 'Main Booking Form', 'نموذج الحجز الرئيسي للعيادة', 'Main clinic booking form', true, true)
    `)

    console.log("[v0] Initial data seeded successfully")

    return NextResponse.json({
      success: true,
      message: "تم تهيئة قاعدة البيانات بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "فشل في تهيئة قاعدة البيانات",
      },
      { status: 500 },
    )
  }
}
