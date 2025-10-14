-- إنشاء جدول نماذج الحجز
CREATE TABLE IF NOT EXISTS booking_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  google_sheet_id TEXT,
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول ربط النماذج بالخدمات
CREATE TABLE IF NOT EXISTS booking_form_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_form_id, service_id)
);

-- إنشاء جدول حالات الأطباء
CREATE TABLE IF NOT EXISTS doctor_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تعطيل RLS على الجداول الجديدة
ALTER TABLE booking_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_form_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_cases DISABLE ROW LEVEL SECURITY;

-- إنشاء نموذج حجز رئيسي افتراضي
INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, is_main, is_active)
VALUES (
  'نموذج الحجز الرئيسي',
  'Main Booking Form',
  'نموذج الحجز الرئيسي للعيادة',
  'Main booking form for the clinic',
  true,
  true
)
ON CONFLICT DO NOTHING;

-- ربط جميع الخدمات بالنموذج الرئيسي
INSERT INTO booking_form_services (booking_form_id, service_id)
SELECT 
  (SELECT id FROM booking_forms WHERE is_main = true LIMIT 1),
  id
FROM services
ON CONFLICT DO NOTHING;
