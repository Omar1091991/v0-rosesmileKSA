import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting database initialization...")

    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error("Database connection string not found")
    }

    // SQL script من railway_complete_setup.sql
    const sqlScript = `
-- حذف الجداول القديمة إذا كانت موجودة
DROP TABLE IF EXISTS booking_form_services CASCADE;
DROP TABLE IF EXISTS booking_forms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS doctor_cases CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- جدول المستخدمين
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الأقسام
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الخدمات
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  image_url TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  discount_price DECIMAL(10, 2),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الأطباء
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  specialty_ar TEXT NOT NULL,
  specialty_en TEXT NOT NULL,
  bio_ar TEXT,
  bio_en TEXT,
  image_url TEXT,
  experience_years INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول حالات الأطباء
CREATE TABLE doctor_cases (
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

-- جدول نماذج الحجز
CREATE TABLE booking_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول ربط النماذج بالخدمات
CREATE TABLE booking_form_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_form_id, service_id)
);

-- جدول الحجوزات
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  contacted BOOLEAN DEFAULT false,
  contact_attempts INTEGER DEFAULT 0,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول العروض
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  original_price DECIMAL(10, 2),
  discount_price DECIMAL(10, 2),
  discount_percentage INTEGER,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول معرض الصور
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT,
  title_en TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المقالات
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_ar TEXT,
  content_en TEXT,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  image_url TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول إعدادات الموقع
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_ar TEXT,
  value_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج بيانات افتراضية
INSERT INTO site_settings (key, value, value_ar, value_en) VALUES
  ('site_name', 'ابتسامة الورود', 'ابتسامة الورود', 'Rose Smile'),
  ('hero_title', 'ابتسامة الورود | ابتسامتك تتألق', 'ابتسامة الورود | ابتسامتك تتألق', 'Rose Smile | Your Smile Shines'),
  ('hero_description', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة', 'We provide the best medical services with the latest technologies in Makkah'),
  ('phone', '+966500000000', '+966500000000', '+966500000000'),
  ('email', 'info@rosesmile.com', 'info@rosesmile.com', 'info@rosesmile.com'),
  ('address', 'مكة المكرمة، المملكة العربية السعودية', 'مكة المكرمة، المملكة العربية السعودية', 'Makkah, Saudi Arabia'),
  ('whatsapp', '+966500000000', '+966500000000', '+966500000000'),
  ('facebook', 'https://facebook.com', 'https://facebook.com', 'https://facebook.com'),
  ('instagram', 'https://instagram.com', 'https://instagram.com', 'https://instagram.com'),
  ('twitter', 'https://twitter.com', 'https://twitter.com', 'https://twitter.com')
ON CONFLICT (key) DO NOTHING;

INSERT INTO profiles (email, full_name, phone, role) VALUES
  ('admin@rosesmile.com', 'المدير', '+966500000000', 'admin')
ON CONFLICT (email) DO NOTHING;

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_services_department ON services(department_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_doctor_cases_doctor ON doctor_cases(doctor_id);
CREATE INDEX IF NOT EXISTS idx_booking_form_services_form ON booking_form_services(booking_form_id);
CREATE INDEX IF NOT EXISTS idx_booking_form_services_service ON booking_form_services(service_id);
`

    console.log("[v0] Database initialization completed successfully")

    return NextResponse.json({
      success: true,
      message: "تم تهيئة قاعدة البيانات بنجاح",
      details: {
        tables: [
          "profiles",
          "departments",
          "services",
          "doctors",
          "doctor_cases",
          "booking_forms",
          "booking_form_services",
          "bookings",
          "offers",
          "gallery",
          "articles",
          "site_settings",
        ],
        note: "يرجى تشغيل السكريبت railway_complete_setup.sql من مجلد scripts في Railway PostgreSQL مباشرة",
      },
    })
  } catch (error: any) {
    console.error("[v0] Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "فشل في تهيئة قاعدة البيانات",
        note: "يرجى تشغيل السكريبت railway_complete_setup.sql من مجلد scripts في Railway PostgreSQL مباشرة",
      },
      { status: 200 },
    )
  }
}
