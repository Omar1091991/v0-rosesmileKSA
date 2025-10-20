-- إضافة عمود is_public إلى جدول services
-- is_public = true: خدمات عامة (تظهر في صفحة الخدمات)
-- is_public = false: خدمات مخصصة (تُستخدم في نماذج الحجز فقط)

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- تحديث جميع الخدمات الموجودة لتكون عامة
UPDATE services SET is_public = true WHERE is_public IS NULL;

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_services_is_public ON services(is_public);

SELECT 'تم إضافة عمود is_public بنجاح!' as message;
