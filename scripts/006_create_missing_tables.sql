-- إنشاء الجداول المفقودة في Supabase
-- قم بتشغيل هذا السكريبت في Supabase SQL Editor

-- جدول الشهادات (Testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  title_ar VARCHAR(255),
  title_en VARCHAR(255),
  content_ar TEXT NOT NULL,
  content_en TEXT,
  image_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأسئلة الشائعة (FAQs)
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question_ar TEXT NOT NULL,
  question_en TEXT,
  answer_ar TEXT NOT NULL,
  answer_en TEXT,
  category_ar VARCHAR(255),
  category_en VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول معرض الصور (Gallery Images)
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  title_ar VARCHAR(255),
  title_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category_ar VARCHAR(255),
  category_en VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول رسائل الاتصال (Contact Messages)
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المشتركين في النشرة البريدية (Newsletter Subscribers)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس (Indexes) لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials (is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials (order_index);

CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs (is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs (category_ar);

CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery_images (is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images (category_ar);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages (is_read);

CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers (email);

-- رسالة نجاح
SELECT 'تم إنشاء جميع الجداول المفقودة بنجاح!' AS message;
