-- حذف المستخدم omar1091991@gmail.com من قاعدة البيانات
DELETE FROM auth.users WHERE email = 'omar1091991@gmail.com';
DELETE FROM public.profiles WHERE email = 'omar1091991@gmail.com';

-- إنشاء جدول لإدارة محتوى الموقع
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,
  title_ar TEXT,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة محتوى افتراضي للصفحة الرئيسية
INSERT INTO public.site_content (section, title_ar, description_ar, image_url)
VALUES 
  ('hero', 'ابتسامة الورود ابتسامتك بتعود', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة', '/placeholder.svg?height=400&width=400')
ON CONFLICT (section) DO NOTHING;

-- تعطيل RLS على جدول site_content
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;
