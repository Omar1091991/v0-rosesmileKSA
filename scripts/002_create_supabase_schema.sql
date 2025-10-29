-- إنشاء الجداول في Supabase
-- هذا السكريبت يُنشئ نفس البنية الموجودة في Neon

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
DROP TABLE IF EXISTS users CASCADE;

-- جدول المستخدمين
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
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
  subtitle_ar VARCHAR(255),
  subtitle_en VARCHAR(255),
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
  service_id INTEGER,
  service_name VARCHAR(255),
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
  preferred_date DATE,
  preferred_time TIME,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  contacted BOOLEAN DEFAULT false,
  contact_attempts INTEGER DEFAULT 0,
  admin_notes TEXT,
  booking_form_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول نماذج الحجز
CREATE TABLE booking_forms (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  custom_services TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول ربط نماذج الحجز بالخدمات
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

-- إنشاء الفهارس
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_doctors_active ON doctors(is_active);
CREATE INDEX idx_doctors_order ON doctors(order_index);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_doctor_id ON bookings(doctor_id);
CREATE INDEX idx_bookings_booking_form_id ON bookings(booking_form_id);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_doctor_cases_doctor_id ON doctor_cases(doctor_id);
CREATE INDEX idx_booking_form_services_form_id ON booking_form_services(booking_form_id);
CREATE INDEX idx_booking_form_services_service_id ON booking_form_services(service_id);

-- إضافة قيود إضافية للحجوزات
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_booking_form FOREIGN KEY (booking_form_id) REFERENCES booking_forms(id) ON DELETE SET NULL;
