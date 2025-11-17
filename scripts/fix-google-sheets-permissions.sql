-- سكريبت تشخيص وإصلاح مشاكل Google Sheets

-- 1. عرض جميع النماذج ومعلومات Google Sheets المرتبطة
SELECT 
    id,
    name,
    slug,
    google_sheet_id,
    CASE 
        WHEN google_sheet_id IS NULL THEN '❌ لا يوجد ربط'
        WHEN google_sheet_id = '' THEN '⚠️ معرف فارغ'
        ELSE '✅ مرتبط'
    END as sheet_status,
    status as form_status,
    created_at
FROM booking_forms
ORDER BY created_at DESC;

-- 2. إحصائيات الحجوزات حسب النموذج
SELECT 
    bf.name as form_name,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed,
    COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed
FROM booking_forms bf
LEFT JOIN bookings b ON b.booking_form_id = bf.id
GROUP BY bf.id, bf.name
ORDER BY total_bookings DESC;

-- 3. إزالة جميع روابط Google Sheets (استخدم هذا فقط إذا كنت تريد البدء من جديد)
-- قم بإلغاء التعليق على السطر التالي لتنفيذه
-- UPDATE booking_forms SET google_sheet_id = NULL, updated_at = NOW();

-- 4. إضافة معرف Google Sheet يدوياً لنموذج معين
-- استبدل 'YOUR_FORM_ID' و 'YOUR_SHEET_ID' بالقيم الصحيحة
-- UPDATE booking_forms 
-- SET google_sheet_id = 'YOUR_SHEET_ID', updated_at = NOW()
-- WHERE id = 'YOUR_FORM_ID';

-- 5. عرض معلومات تفصيلية عن نموذج معين
-- استبدل 'YOUR_FORM_ID' بمعرف النموذج الذي تريد فحصه
-- SELECT * FROM booking_forms WHERE id = 'YOUR_FORM_ID';
