-- سكريبت لتصدير البيانات من Neon
-- قم بتشغيل هذا السكريبت في Neon أولاً للحصول على البيانات

-- تصدير بيانات المستخدمين
COPY (SELECT * FROM users) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات الأطباء
COPY (SELECT * FROM doctors) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات حالات الأطباء
COPY (SELECT * FROM doctor_cases) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات الخدمات
COPY (SELECT * FROM services) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات الأقسام
COPY (SELECT * FROM departments) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات نماذج الحجز
COPY (SELECT * FROM booking_forms) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات ربط النماذج بالخدمات
COPY (SELECT * FROM booking_form_services) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات الحجوزات
COPY (SELECT * FROM bookings) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات العروض
COPY (SELECT * FROM offers) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات معرض الصور
COPY (SELECT * FROM gallery) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات المقالات
COPY (SELECT * FROM articles) TO STDOUT WITH CSV HEADER;

-- تصدير بيانات إعدادات الموقع
COPY (SELECT * FROM site_settings) TO STDOUT WITH CSV HEADER;
