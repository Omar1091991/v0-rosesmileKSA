-- سكريبت تهيئة قاعدة بيانات Neon
-- يجب تشغيل هذا السكريبت أولاً قبل أي سكريبت آخر

-- حذف الجداول القديمة إذا كانت موجودة (اختياري - احذف هذا القسم إذا كنت تريد الحفاظ على البيانات)
DROP TABLE IF EXISTS doctor_cases CASCADE;
DROP TABLE IF EXISTS booking_form_services CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS booking_forms CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- جدول المستخدمين
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول إعدادات الموقع
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأطباء
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  specialty_ar VARCHAR(255) NOT NULL,
  specialty_en VARCHAR(255),
  bio_ar TEXT,
  bio_en TEXT,
  qualifications_ar TEXT[],
  qualifications_en TEXT[],
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول حالات الأطباء
CREATE TABLE doctor_cases (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الخدمات
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  icon VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأقسام
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  icon VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول العروض
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  original_price DECIMAL(10, 2),
  discounted_price DECIMAL(10, 2),
  discount_percentage INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المقالات
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  content_ar TEXT NOT NULL,
  content_en TEXT,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  author_ar VARCHAR(255),
  author_en VARCHAR(255),
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الحجوزات
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  service VARCHAR(255),
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
  preferred_date DATE,
  preferred_time TIME,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول نماذج الحجز
CREATE TABLE booking_forms (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول خدمات نماذج الحجز
CREATE TABLE booking_form_services (
  id SERIAL PRIMARY KEY,
  booking_form_id INTEGER REFERENCES booking_forms(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_form_id, service_id)
);

-- جدول معرض الصور
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255),
  title_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_doctors_active ON doctors(is_active);
CREATE INDEX idx_doctors_order ON doctors(order_index);
CREATE INDEX idx_doctor_cases_doctor ON doctor_cases(doctor_id);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_services_order ON services(order_index);
CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_order ON departments(order_index);
CREATE INDEX idx_offers_active ON offers(is_active);
CREATE INDEX idx_offers_dates ON offers(valid_from, valid_until);
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(preferred_date);
CREATE INDEX idx_booking_forms_active ON booking_forms(is_active);
CREATE INDEX idx_gallery_active ON gallery(is_active);
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);

-- إضافة مستخدم مدير افتراضي
-- اسم المستخدم: admin
-- كلمة المرور: admin123
-- (الهاش التالي هو bcrypt hash لكلمة المرور admin123)
INSERT INTO users (username, password, email, full_name, role, is_active)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin@rosesmile.com',
  'مدير النظام',
  'admin',
  true
)
ON CONFLICT (username) DO NOTHING;

-- إضافة بعض الإعدادات الافتراضية
INSERT INTO site_settings (setting_key, setting_value, setting_type, category) VALUES
  ('site_name_ar', 'روز سمايل', 'text', 'general'),
  ('site_name_en', 'Rose Smile', 'text', 'general'),
  ('site_description_ar', 'عيادة أسنان متخصصة', 'text', 'general'),
  ('site_description_en', 'Specialized Dental Clinic', 'text', 'general'),
  ('phone', '+966 XX XXX XXXX', 'text', 'contact'),
  ('email', 'info@rosesmile.com', 'text', 'contact'),
  ('address_ar', 'الرياض، المملكة العربية السعودية', 'text', 'contact'),
  ('address_en', 'Riyadh, Saudi Arabia', 'text', 'contact'),
  ('whatsapp', '+966 XX XXX XXXX', 'text', 'contact'),
  ('facebook', 'https://facebook.com/rosesmile', 'text', 'social'),
  ('twitter', 'https://twitter.com/rosesmile', 'text', 'social'),
  ('instagram', 'https://instagram.com/rosesmile', 'text', 'social'),
  ('working_hours_ar', 'السبت - الخميس: 9 صباحاً - 9 مساءً', 'text', 'general'),
  ('working_hours_en', 'Saturday - Thursday: 9 AM - 9 PM', 'text', 'general')
ON CONFLICT (setting_key) DO NOTHING;

SELECT 'تم إنشاء جميع الجداول والبيانات الافتراضية بنجاح!' as message;
