-- إضافة الأعمدة المفقودة لجدول الحجوزات

-- إضافة عمود booking_form_id للربط مع نماذج الحجز
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_form_id INTEGER REFERENCES booking_forms(id) ON DELETE SET NULL;

-- إضافة عمود service_id للربط مع الخدمات
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS service_id INTEGER REFERENCES services(id) ON DELETE SET NULL;

-- إضافة عمود service_name لتخزين اسم الخدمة
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS service_name VARCHAR(255);

-- إضافة عمود contacted لتتبع حالة التواصل
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT false;

-- إضافة عمود admin_notes لملاحظات الإدارة
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- إضافة عمود contact_attempts لتتبع محاولات التواصل
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contact_attempts INTEGER DEFAULT 0;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_bookings_form ON bookings(booking_form_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_contacted ON bookings(contacted);

SELECT 'تم إضافة الأعمدة المفقودة لجدول الحجوزات بنجاح!' as message;
