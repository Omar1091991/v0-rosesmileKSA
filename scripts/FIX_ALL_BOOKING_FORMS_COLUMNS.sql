-- ═══════════════════════════════════════════════════════════════
-- إصلاح شامل لجدول booking_forms - ROSESMILE
-- ═══════════════════════════════════════════════════════════════
-- هذا السكريبت يضيف جميع الأعمدة المطلوبة لعمل نماذج الحجز بشكل صحيح
-- يمكن تشغيله عدة مرات بدون مشاكل (يستخدم IF NOT EXISTS)
--
-- 📋 التعليمات:
-- 1. افتح Supabase SQL Editor
-- 2. انسخ هذا السكريبت بالكامل
-- 3. الصقه في SQL Editor
-- 4. اضغط Run (CTRL + Enter)
-- 5. انتظر رسالة النجاح
-- ═══════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────
-- 1️⃣ إضافة أعمدة العناوين (title_ar, title_en)
-- ───────────────────────────────────────────────────────────────
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS title_ar VARCHAR(500),
ADD COLUMN IF NOT EXISTS title_en VARCHAR(500);

-- ───────────────────────────────────────────────────────────────
-- 2️⃣ إضافة أعمدة الخدمات والحقول (services, fields)
-- ───────────────────────────────────────────────────────────────
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS fields JSONB DEFAULT '{}'::jsonb;

-- ───────────────────────────────────────────────────────────────
-- 3️⃣ إضافة أعمدة Google Sheets (google_sheet_id, google_sheet_url)
-- ───────────────────────────────────────────────────────────────
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS google_sheet_id TEXT,
ADD COLUMN IF NOT EXISTS google_sheet_url TEXT;

-- ───────────────────────────────────────────────────────────────
-- 4️⃣ إنشاء الفهارس للأداء الأفضل
-- ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_booking_forms_google_sheet_id 
  ON booking_forms(google_sheet_id);

CREATE INDEX IF NOT EXISTS idx_booking_forms_is_active 
  ON booking_forms(is_active);

CREATE INDEX IF NOT EXISTS idx_booking_forms_is_main 
  ON booking_forms(is_main);

-- ───────────────────────────────────────────────────────────────
-- 5️⃣ إزالة القيد الفريد من google_sheet_id (إذا كان موجوداً)
-- ───────────────────────────────────────────────────────────────
-- هذا يسمح بربط أكثر من نموذج بنفس الجدول إذا لزم الأمر
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'booking_forms_google_sheet_id_key'
  ) THEN
    ALTER TABLE booking_forms DROP CONSTRAINT booking_forms_google_sheet_id_key;
  END IF;
END $$;

-- ───────────────────────────────────────────────────────────────
-- 6️⃣ تحديث البيانات الموجودة (نسخ name إلى title إذا كان فارغاً)
-- ───────────────────────────────────────────────────────────────
UPDATE booking_forms 
SET title_ar = name_ar 
WHERE title_ar IS NULL;

UPDATE booking_forms 
SET title_en = name_en 
WHERE title_en IS NULL AND name_en IS NOT NULL;

-- ───────────────────────────────────────────────────────────────
-- 7️⃣ عرض البنية النهائية للجدول
-- ───────────────────────────────────────────────────────────────
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'booking_forms'
ORDER BY ordinal_position;

-- ───────────────────────────────────────────────────────────────
-- 8️⃣ عرض جميع النماذج الموجودة حالياً
-- ───────────────────────────────────────────────────────────────
SELECT 
  id,
  name_ar AS "اسم النموذج",
  title_ar AS "العنوان",
  is_active AS "نشط",
  is_main AS "رئيسي",
  CASE 
    WHEN google_sheet_id IS NOT NULL THEN '✅ مربوط'
    ELSE '❌ غير مربوط'
  END AS "حالة Google Sheet",
  google_sheet_url AS "رابط الجدول",
  created_at AS "تاريخ الإنشاء"
FROM booking_forms
ORDER BY order_index, created_at DESC;

-- ═══════════════════════════════════════════════════════════════
-- ✅ تم إصلاح جدول booking_forms بنجاح!
-- ═══════════════════════════════════════════════════════════════
-- الآن يمكنك:
-- 1. إنشاء نماذج حجز جديدة من لوحة التحكم ✓
-- 2. ربط النماذج بـ Google Sheets (اختياري) ✓
-- 3. استقبال الحجوزات من النماذج ✓
-- ═══════════════════════════════════════════════════════════════
