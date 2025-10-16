-- سكريبت تهيئة قاعدة بيانات Railway
-- يقوم بإنشاء جميع الجداول المطلوبة للموقع

-- حذف الجداول القديمة إن وجدت
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS booking_form_services CASCADE;
DROP TABLE IF EXISTS booking_forms CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- جدول المستخدمين
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول إعدادات الموقع
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الخدمات
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  image_url TEXT,
  price DECIMAL(10, 2),
  duration INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأطباء
CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  specialty_ar TEXT,
  specialty_en TEXT,
  bio_ar TEXT,
  bio_en TEXT,
  image_url TEXT,
  phone TEXT,
  email TEXT,
  experience_years INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأقسام
CREATE TABLE departments (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول العروض
CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  discount_percentage INTEGER,
  original_price DECIMAL(10, 2),
  discounted_price DECIMAL(10, 2),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المقالات
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  content_ar TEXT,
  content_en TEXT,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  image_url TEXT,
  author_id TEXT REFERENCES profiles(id),
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المعرض
CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  title_ar TEXT,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول نماذج الحجز
CREATE TABLE booking_forms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول ربط نماذج الحجز بالخدمات
CREATE TABLE booking_form_services (
  id TEXT PRIMARY KEY,
  booking_form_id TEXT REFERENCES booking_forms(id) ON DELETE CASCADE,
  service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_form_id, service_id)
);

-- جدول الحجوزات
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  booking_form_id TEXT REFERENCES booking_forms(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_id TEXT REFERENCES services(id),
  booking_date DATE,
  booking_time TIME,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  contacted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة مستخدم مدير افتراضي
-- كلمة المرور: admin123 (مشفرة بـ bcrypt)
INSERT INTO profiles (id, email, full_name, phone, role, password, created_at)
VALUES (
  '1',
  'admin@rosesmile.com',
  'مدير النظام',
  '0123456789',
  'admin',
  '$2b$10$rZ5L3KqX.vYxqYqYqYqYqOqYqYqYqYqYqYqYqYqYqYqYqYqYqYqYq',
  CURRENT_TIMESTAMP
);

-- إضافة إعدادات افتراضية للموقع
INSERT INTO site_settings (id, key, value) VALUES
  ('1', 'site_name_ar', 'إبتسامة الورود'),
  ('2', 'site_name_en', 'Rose Smile'),
  ('3', 'hero_title_ar', 'مرحباً بك في إبتسامة الورود'),
  ('4', 'hero_title_en', 'Welcome to Rose Smile'),
  ('5', 'hero_description_ar', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات'),
  ('6', 'hero_description_en', 'We provide the best medical services with the latest technologies'),
  ('7', 'primary_color', '#ec4899'),
  ('8', 'secondary_color', '#8b5cf6'),
  ('9', 'whatsapp_number', '966500000000'),
  ('10', 'phone_number', '0123456789'),
  ('11', 'email', 'info@rosesmile.com'),
  ('12', 'address_ar', 'الرياض، المملكة العربية السعودية'),
  ('13', 'address_en', 'Riyadh, Saudi Arabia');

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_doctors_is_active ON doctors(is_active);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_articles_is_published ON articles(is_published);

-- رسالة نجاح
SELECT 'تم تهيئة قاعدة البيانات بنجاح!' as message;
