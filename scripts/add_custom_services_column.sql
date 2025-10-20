-- إضافة عمود custom_services إلى جدول booking_forms
-- هذا العمود يحفظ الخدمات المخصصة الخاصة بكل نموذج حجز

ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS custom_services JSONB DEFAULT '[]';

-- إضافة تعليق على العمود
COMMENT ON COLUMN booking_forms.custom_services IS 'الخدمات المخصصة الخاصة بالنموذج (لا تظهر في صفحة الخدمات العامة)';

SELECT 'تم إضافة عمود custom_services بنجاح!' as message;
