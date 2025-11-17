-- سكريبت إعداد سريع لـ Google Sheets
-- هذا السكريبت يتيح لك العمل مع النماذج بدون Google Sheets

-- ═══════════════════════════════════════════════════════════
-- الخيار 1: عرض جميع نماذج الحجز مع معلوماتها
-- ═══════════════════════════════════════════════════════════
SELECT 
  id,
  name_ar AS "اسم النموذج",
  name_en AS "Form Name",
  is_active AS "نشط؟",
  is_main AS "رئيسي؟",
  google_sheet_id AS "معرف Google Sheet",
  CASE 
    WHEN google_sheet_id IS NULL THEN 'لا يوجد'
    ELSE 'موجود'
  END AS "حالة الربط",
  (SELECT COUNT(*) FROM bookings WHERE booking_form_id = booking_forms.id) AS "عدد الحجوزات",
  created_at AS "تاريخ الإنشاء"
FROM booking_forms
ORDER BY id DESC;

-- ═══════════════════════════════════════════════════════════
-- الخيار 2: إزالة روابط Google Sheets من جميع النماذج
-- ═══════════════════════════════════════════════════════════
-- أزل التعليق من السطر التالي إذا أردت إزالة جميع روابط Google Sheets
-- UPDATE booking_forms SET google_sheet_id = NULL, updated_at = NOW();

-- ═══════════════════════════════════════════════════════════
-- الخيار 3: ربط نموذج محدد بـ Google Sheet جديد
-- ═══════════════════════════════════════════════════════════
-- استبدل 'YOUR_FORM_ID' بمعرف النموذج الذي تريد ربطه
-- استبدل 'YOUR_SHEET_ID' بمعرف Google Sheet الجديد

-- UPDATE booking_forms 
-- SET google_sheet_id = 'YOUR_SHEET_ID', updated_at = NOW()
-- WHERE id = YOUR_FORM_ID;

-- ═══════════════════════════════════════════════════════════
-- الخيار 4: عرض آخر 20 حجز مع معلومات النموذج
-- ═══════════════════════════════════════════════════════════
SELECT 
  b.id AS "رقم الحجز",
  b.patient_name AS "اسم المريض",
  b.phone AS "الهاتف",
  b.email AS "البريد",
  b.service_name AS "الخدمة",
  b.preferred_date AS "التاريخ المفضل",
  b.preferred_time AS "الوقت المفضل",
  b.status AS "الحالة",
  b.contacted AS "تم الاتصال؟",
  bf.name_ar AS "نموذج الحجز",
  bf.google_sheet_id AS "معرف Google Sheet",
  b.created_at AS "تاريخ الإنشاء"
FROM bookings b
LEFT JOIN booking_forms bf ON b.booking_form_id = bf.id
ORDER BY b.created_at DESC
LIMIT 20;

-- ═══════════════════════════════════════════════════════════
-- الخيار 5: إنشاء نموذج حجز جديد بدون Google Sheet
-- ═══════════════════════════════════════════════════════════
-- أزل التعليق من الأسطر التالية وعدّل البيانات حسب الحاجة

-- INSERT INTO booking_forms (
--   name_ar,
--   name_en,
--   description_ar,
--   description_en,
--   is_active,
--   is_main,
--   is_public,
--   google_sheet_id
-- ) VALUES (
--   'نموذج تجريبي',
--   'Test Form',
--   'نموذج حجز تجريبي بدون ربط Google Sheets',
--   'Test booking form without Google Sheets',
--   true,
--   false,
--   true,
--   NULL
-- )
-- RETURNING id, name_ar, name_en, created_at;

-- ═══════════════════════════════════════════════════════════
-- الخيار 6: إحصائيات شاملة
-- ═══════════════════════════════════════════════════════════
SELECT 
  'إجمالي النماذج' AS "الإحصائية",
  COUNT(*) AS "العدد"
FROM booking_forms
UNION ALL
SELECT 
  'نماذج نشطة',
  COUNT(*) 
FROM booking_forms WHERE is_active = true
UNION ALL
SELECT 
  'نماذج مرتبطة بـ Google Sheets',
  COUNT(*)
FROM booking_forms WHERE google_sheet_id IS NOT NULL
UNION ALL
SELECT 
  'إجمالي الحجوزات',
  COUNT(*)
FROM bookings
UNION ALL
SELECT 
  'حجوزات قيد الانتظار',
  COUNT(*)
FROM bookings WHERE status = 'pending'
UNION ALL
SELECT 
  'حجوزات تم الاتصال بها',
  COUNT(*)
FROM bookings WHERE contacted = true;

-- ═══════════════════════════════════════════════════════════
-- نصائح للاستخدام:
-- ═══════════════════════════════════════════════════════════
-- 1. لعرض النماذج: نفذ السكريبت كما هو
-- 2. لإزالة روابط Google Sheets: أزل التعليق من الخيار 2
-- 3. لربط نموذج بـ Google Sheet: أزل التعليق من الخيار 3 واستبدل القيم
-- 4. لإنشاء نموذج جديد: أزل التعليق من الخيار 5 وعدّل البيانات
