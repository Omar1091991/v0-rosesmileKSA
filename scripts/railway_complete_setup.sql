-- =====================================================
-- سكريبت إنشاء قاعدة بيانات كاملة لـ Railway
-- =====================================================

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

-- =====================================================
-- 1. جدول المستخدمين (profiles)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. جدول الأقسام (departments)
-- =====================================================
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

-- =====================================================
-- 3. جدول الخدمات (services)
-- =====================================================
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

-- =====================================================
-- 4. جدول الأطباء (doctors)
-- =====================================================
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

-- =====================================================
-- 5. جدول حالات الأطباء (doctor_cases)
-- =====================================================
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

-- =====================================================
-- 6. جدول نماذج الحجز (booking_forms)
-- =====================================================
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

-- =====================================================
-- 7. جدول ربط النماذج بالخدمات (booking_form_services)
-- =====================================================
CREATE TABLE booking_form_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_form_id, service_id)
);

-- =====================================================
-- 8. جدول الحجوزات (bookings)
-- =====================================================
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

-- =====================================================
-- 9. جدول العروض (offers)
-- =====================================================
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

-- =====================================================
-- 10. جدول معرض الصور (gallery)
-- =====================================================
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT,
  title_en TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. جدول المقالات (articles)
-- =====================================================
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

-- =====================================================
-- 12. جدول إعدادات الموقع (site_settings)
-- =====================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- إدراج بيانات افتراضية
-- =====================================================

-- إعدادات الموقع الافتراضية
INSERT INTO site_settings (key, value) VALUES
  ('site_name_ar', 'ابتسامة الورود'),
  ('site_name_en', 'Rose Smile'),
  ('hero_title_ar', 'ابتسامة الورود | ابتسامتك تتألود'),
  ('hero_title_en', 'Rose Smile | Your Smile Shines'),
  ('hero_description_ar', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة'),
  ('hero_description_en', 'We provide the best medical services with the latest technologies in Makkah'),
  ('phone', '+966500000000'),
  ('email', 'info@rosesmile.com'),
  ('address_ar', 'مكة المكرمة، المملكة العربية السعودية'),
  ('address_en', 'Makkah, Saudi Arabia'),
  ('whatsapp', '+966500000000'),
  ('facebook', 'https://facebook.com'),
  ('instagram', 'https://instagram.com'),
  ('twitter', 'https://twitter.com'),
  ('enable_animations', 'true'),
  ('animation_duration', '0.5'),
  ('primary_color', '#ec4899'),
  ('secondary_color', '#3b82f6'),
  ('text_color', '#1f2937'),
  ('heading_color', '#111827')
ON CONFLICT (key) DO NOTHING;

-- إنشاء مستخدم إداري افتراضي
INSERT INTO profiles (email, full_name, phone, role) VALUES
  ('admin@rosesmile.com', 'المدير', '+966500000000', 'admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- إنشاء الفهارس لتحسين الأداء
-- =====================================================
CREATE INDEX idx_services_department ON services(department_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX idx_doctor_cases_doctor ON doctor_cases(doctor_id);
CREATE INDEX idx_booking_form_services_form ON booking_form_services(booking_form_id);
CREATE INDEX idx_booking_form_services_service ON booking_form_services(service_id);

-- =====================================================
-- تم الانتهاء من إنشاء قاعدة البيانات
-- =====================================================
