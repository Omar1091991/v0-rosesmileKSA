-- إصلاح جدول booking_forms
-- هذا السكريبت يتأكد من وجود الجدول والأعمدة المطلوبة

-- إنشاء الجدول إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS booking_forms (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL DEFAULT 'نموذج حجز',
  name_en VARCHAR(255) DEFAULT 'Booking Form',
  title_ar VARCHAR(255),
  title_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة الأعمدة إذا لم تكن موجودة (في حالة وجود الجدول بدون هذه الأعمدة)
DO $$ 
BEGIN
  -- إضافة name_ar إذا لم يكن موجوداً
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'booking_forms' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE booking_forms ADD COLUMN name_ar VARCHAR(255) NOT NULL DEFAULT 'نموذج حجز';
  END IF;

  -- إضافة name_en إذا لم يكن موجوداً
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'booking_forms' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE booking_forms ADD COLUMN name_en VARCHAR(255) DEFAULT 'Booking Form';
  END IF;

  -- إضافة title_ar إذا لم يكن موجوداً
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'booking_forms' AND column_name = 'title_ar'
  ) THEN
    ALTER TABLE booking_forms ADD COLUMN title_ar VARCHAR(255);
  END IF;

  -- إضافة title_en إذا لم يكن موجوداً
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'booking_forms' AND column_name = 'title_en'
  ) THEN
    ALTER TABLE booking_forms ADD COLUMN title_en VARCHAR(255);
  END IF;
END $$;

-- إنشاء index إذا لم يكن موجوداً
CREATE INDEX IF NOT EXISTS idx_booking_forms_active ON booking_forms(is_active);
CREATE INDEX IF NOT EXISTS idx_booking_forms_is_main ON booking_forms(is_main);

-- إضافة نموذج حجز افتراضي إذا كان الجدول فارغاً
INSERT INTO booking_forms (name_ar, name_en, title_ar, title_en, is_main, is_active, fields)
SELECT 
  'نموذج الحجز الرئيسي',
  'Main Booking Form',
  'احجز موعدك الآن',
  'Book Your Appointment Now',
  true,
  true,
  '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM booking_forms WHERE is_main = true);

SELECT 'تم إصلاح جدول booking_forms بنجاح!' as message;
