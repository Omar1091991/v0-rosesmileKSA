-- ============================================
-- سكريبت الإعداد الكامل لـ Google Sheets
-- ============================================
-- قم بنسخ هذا السكريبت كاملاً وتشغيله في Supabase SQL Editor
-- https://supabase.com/dashboard/project/ynspnyjdpjjdeqggmac/sql
-- ============================================

-- الخطوة 1: إضافة أعمدة Google Sheet إلى جدول booking_forms
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS google_sheet_id TEXT,
ADD COLUMN IF NOT EXISTS google_sheet_url TEXT;

-- إنشاء فهرس للبحث السريع (إذا لم يكن موجوداً)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_booking_forms_google_sheet_id'
  ) THEN
    CREATE INDEX idx_booking_forms_google_sheet_id ON booking_forms(google_sheet_id);
  END IF;
END $$;

-- الخطوة 2: عرض جميع النماذج الحالية مع حالة Google Sheet
SELECT 
  id,
  name_ar AS "اسم النموذج",
  name_en AS "Form Name",
  is_active AS "نشط",
  is_main AS "رئيسي",
  CASE 
    WHEN google_sheet_id IS NULL OR google_sheet_id = '' THEN '❌ غير مربوط'
    ELSE '✅ مربوط'
  END AS "حالة الربط",
  google_sheet_id AS "معرف Google Sheet",
  (SELECT COUNT(*) FROM bookings WHERE booking_form_id = booking_forms.id) AS "عدد الحجوزات",
  created_at AS "تاريخ الإنشاء"
FROM booking_forms
ORDER BY id DESC;

-- ============================================
-- رسالة نجاح
-- ============================================
SELECT '✅ تم الإعداد بنجاح! الآن يمكنك إنشاء نماذج حجز والعمل بشكل طبيعي.' AS "الحالة";

-- ============================================
-- خيارات إضافية (اختر ما تحتاجه وأزل -- من أوله)
-- ============================================

-- الخيار 1: إزالة ربط Google Sheet من جميع النماذج
-- UPDATE booking_forms 
-- SET google_sheet_id = NULL, 
--     google_sheet_url = NULL,
--     updated_at = NOW()
-- WHERE google_sheet_id IS NOT NULL;

-- الخيار 2: إزالة ربط Google Sheet من نموذج محدد
-- استبدل 1 بمعرف النموذج المطلوب
-- UPDATE booking_forms 
-- SET google_sheet_id = NULL, 
--     google_sheet_url = NULL,
--     updated_at = NOW()
-- WHERE id = 1;

-- الخيار 3: ربط نموذج موجود بـ Google Sheet يدوياً
-- استبدل 1 بمعرف النموذج و 'YOUR_SHEET_ID' بمعرف الجدول
-- UPDATE booking_forms 
-- SET google_sheet_id = 'YOUR_SHEET_ID',
--     google_sheet_url = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit',
--     updated_at = NOW()
-- WHERE id = 1;

-- الخيار 4: عرض آخر 20 حجز مع معلومات النموذج
-- SELECT 
--   b.id AS "رقم الحجز",
--   b.patient_name AS "اسم المريض",
--   b.phone AS "الهاتف",
--   b.service_name AS "الخدمة",
--   b.preferred_date AS "التاريخ المفضل",
--   b.status AS "الحالة",
--   bf.name_ar AS "نموذج الحجز",
--   b.created_at AS "تاريخ الإنشاء"
-- FROM bookings b
-- LEFT JOIN booking_forms bf ON b.booking_form_id = bf.id
-- ORDER BY b.created_at DESC
-- LIMIT 20;

-- الخيار 5: إنشاء نموذج تجريبي بدون Google Sheets
-- INSERT INTO booking_forms (
--   name_ar,
--   name_en,
--   description_ar,
--   description_en,
--   is_active,
--   is_main
-- ) VALUES (
--   'نموذج تجريبي - بدون Google Sheets',
--   'Test Form - Without Google Sheets',
--   'نموذج اختبار لا يتطلب Google Sheets',
--   'Test form that does not require Google Sheets',
--   true,
--   false
-- )
-- RETURNING id, name_ar, name_en, 'تم إنشاء النموذج بنجاح!' AS message;
