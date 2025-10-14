-- إنشاء جدول نماذج الحجز
CREATE TABLE IF NOT EXISTS booking_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  google_sheet_id TEXT,
  is_active BOOLEAN DEFAULT true,
  is_main BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول ربط نماذج الحجز بالخدمات
CREATE TABLE IF NOT EXISTS booking_form_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_form_id, service_id)
);

-- تعطيل RLS على الجداول الجديدة
ALTER TABLE booking_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_form_services DISABLE ROW LEVEL SECURITY;

-- إضافة نموذج الحجز الرئيسي
INSERT INTO booking_forms (name_ar, name_en, description_ar, is_main, is_active)
VALUES ('نموذج الحجز الرئيسي', 'Main Booking Form', 'نموذج الحجز الافتراضي للموقع', true, true)
ON CONFLICT DO NOTHING;
