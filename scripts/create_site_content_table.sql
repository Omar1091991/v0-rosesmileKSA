-- إنشاء جدول محتوى الموقع
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج المحتوى الافتراضي
INSERT INTO site_content (key, title_ar, title_en, description_ar, description_en, image_url)
VALUES 
  ('hero', 'ابتسامة الورود ابتسامتك بتعود', 'Rose Smile - Your Smile Returns', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة', 'We provide the best medical services with the latest technologies in Makkah', '/placeholder.svg?height=400&width=400')
ON CONFLICT (key) DO NOTHING;

-- تعطيل RLS
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
