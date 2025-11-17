-- سكريبت إعداد نماذج الحجز بدون Google Sheets
-- هذا السكريبت يسمح لك بالعمل مع النماذج بدون الحاجة إلى Google Sheets

-- التحقق من وجود جدول نماذج الحجز
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'booking_forms') THEN
        RAISE EXCEPTION 'جدول booking_forms غير موجود. يرجى تشغيل سكريبت إنشاء الجداول أولاً.';
    END IF;
END $$;

-- إضافة نماذج حجز تجريبية إذا لم تكن موجودة
INSERT INTO booking_forms (
    id,
    name,
    slug,
    description,
    status,
    services,
    google_sheet_id,
    created_at,
    updated_at
) VALUES 
(
    'basic-booking',
    'نموذج أساسي',
    'basic-booking',
    'نموذج حجز أساسي للخدمات العامة',
    'active',
    '[]'::jsonb,
    NULL, -- لا يوجد Google Sheet مرتبط
    NOW(),
    NOW()
),
(
    'advanced-booking',
    'نموذج متقدم',
    'advanced-booking',
    'نموذج حجز متقدم مع خيارات إضافية',
    'active',
    '[]'::jsonb,
    NULL, -- لا يوجد Google Sheet مرتبط
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW();

-- تحديث النماذج الموجودة لإزالة Google Sheet IDs غير الصالحة
UPDATE booking_forms 
SET google_sheet_id = NULL, updated_at = NOW()
WHERE google_sheet_id IS NOT NULL 
AND NOT EXISTS (
    SELECT 1 FROM booking_forms bf2 
    WHERE bf2.google_sheet_id = booking_forms.google_sheet_id 
    AND bf2.id != booking_forms.id
);

-- عرض النماذج المتاحة
SELECT 
    id,
    name,
    slug,
    status,
    CASE 
        WHEN google_sheet_id IS NULL THEN 'لا يوجد ربط'
        ELSE google_sheet_id 
    END as google_sheet_status,
    created_at
FROM booking_forms
ORDER BY created_at DESC;

-- إحصائيات
SELECT 
    COUNT(*) as total_forms,
    COUNT(CASE WHEN google_sheet_id IS NOT NULL THEN 1 END) as forms_with_sheets,
    COUNT(CASE WHEN google_sheet_id IS NULL THEN 1 END) as forms_without_sheets,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_forms
FROM booking_forms;
