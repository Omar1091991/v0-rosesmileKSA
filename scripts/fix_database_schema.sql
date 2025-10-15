-- سكريبت إصلاح قاعدة البيانات
-- يضيف جميع الأعمدة المفقودة

-- إضافة عمود booking_form_id إلى جدول bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'booking_form_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN booking_form_id UUID REFERENCES booking_forms(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_bookings_form ON bookings(booking_form_id);
  END IF;
END $$;

-- إضافة عمود updated_at إلى جدول bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- إصلاح جدول site_settings
DO $$ 
BEGIN
  -- إضافة value_ar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'value_ar'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN value_ar TEXT;
  END IF;

  -- إضافة value_en
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'value_en'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN value_en TEXT;
  END IF;

  -- إضافة type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'type'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN type TEXT DEFAULT 'text';
  END IF;

  -- نقل البيانات من value إلى value_ar إذا كانت موجودة
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'value'
  ) THEN
    UPDATE site_settings SET value_ar = value WHERE value_ar IS NULL AND value IS NOT NULL;
    UPDATE site_settings SET value_en = value WHERE value_en IS NULL AND value IS NOT NULL;
  END IF;
END $$;

-- إضافة عمود is_active إلى جدول doctors
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'doctors' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE doctors ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- التأكد من وجود جدول booking_forms
CREATE TABLE IF NOT EXISTS booking_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج نموذج حجز رئيسي إذا لم يكن موجوداً
INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, is_main, is_active)
SELECT 'نموذج الحجز الرئيسي', 'Main Booking Form', 'نموذج الحجز الأساسي للموقع', 'Main booking form for the website', true, true
WHERE NOT EXISTS (SELECT 1 FROM booking_forms WHERE is_main = true);
