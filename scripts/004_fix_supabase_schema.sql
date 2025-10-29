-- إصلاح وإكمال schema Supabase ليطابق Neon تماماً
-- قم بتشغيل هذا السكريبت في Supabase SQL Editor

-- إضافة الأعمدة المفقودة في booking_forms
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS title_ar VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS fields JSONB DEFAULT '[]';

-- إنشاء جدول testimonials (الشهادات)
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  title_ar VARCHAR(255),
  title_en VARCHAR(255),
  content_ar TEXT NOT NULL,
  content_en TEXT,
  image_url TEXT,
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول faqs (الأسئلة الشائعة)
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question_ar TEXT NOT NULL,
  question_en TEXT,
  answer_ar TEXT NOT NULL,
  answer_en TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول gallery_images (صور المعرض)
CREATE TABLE IF NOT EXISTS gallery_images (
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

-- إنشاء جدول contact_messages (رسائل التواصل)
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  reply_message TEXT,
  replied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول newsletter_subscribers (مشتركي النشرة البريدية)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP
);

-- إنشاء الفهارس للجداول الجديدة
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

SELECT 'تم إصلاح وإكمال schema Supabase بنجاح!' as message;
