-- سكريبت إنشاء حجز جديد بدون Google Sheets
-- استخدم هذا السكريبت لإنشاء حجوزات مباشرة في قاعدة البيانات

-- مثال على إنشاء حجز جديد
INSERT INTO bookings (
    id,
    booking_form_id,
    customer_name,
    customer_phone,
    customer_email,
    service_id,
    booking_date,
    booking_time,
    notes,
    status,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'basic-booking', -- معرف النموذج
    'اسم العميل التجريبي',
    '0501234567',
    'test@example.com',
    NULL, -- يمكن إضافة معرف الخدمة إذا كانت موجودة
    CURRENT_DATE + INTERVAL '7 days', -- تاريخ الحجز (بعد أسبوع من الآن)
    '10:00', -- وقت الحجز
    'ملاحظات تجريبية',
    'pending', -- الحالة: pending, confirmed, cancelled, completed
    NOW(),
    NOW()
)
RETURNING 
    id,
    customer_name,
    booking_date,
    booking_time,
    status;

-- عرض آخر 10 حجوزات
SELECT 
    b.id,
    b.customer_name,
    b.customer_phone,
    bf.name as form_name,
    b.booking_date,
    b.booking_time,
    b.status,
    b.created_at
FROM bookings b
LEFT JOIN booking_forms bf ON b.booking_form_id = bf.id
ORDER BY b.created_at DESC
LIMIT 10;
