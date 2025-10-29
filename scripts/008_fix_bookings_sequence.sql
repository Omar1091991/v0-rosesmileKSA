-- إصلاح sequence الخاص بجدول bookings
-- هذا السكريبت يعيد تعيين sequence ليبدأ من آخر ID موجود + 1

-- إعادة تعيين sequence لجدول bookings
SELECT setval('bookings_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM bookings), false);

-- التحقق من القيمة الجديدة
SELECT last_value FROM bookings_id_seq;
