-- سكريبت إزالة جميع الأعمدة المرتبطة بـ Google Sheets من قاعدة البيانات

-- إزالة الأعمدة من جدول booking_forms
ALTER TABLE booking_forms
DROP COLUMN IF EXISTS google_sheet_id,
DROP COLUMN IF EXISTS google_sheet_url;

-- إزالة الفهارس المرتبطة بـ Google Sheets
DROP INDEX IF EXISTS idx_booking_forms_google_sheet_id;

-- عرض البنية النهائية للجدول
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'booking_forms'
ORDER BY ordinal_position;

-- التحقق من النماذج الموجودة
SELECT 
  id,
  name_ar,
  name_en,
  is_active,
  created_at
FROM booking_forms
ORDER BY id;
