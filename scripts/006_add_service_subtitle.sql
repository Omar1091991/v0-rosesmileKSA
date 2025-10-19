-- إضافة حقل العنوان الفرعي لجدول الخدمات
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS subtitle_ar VARCHAR(500),
ADD COLUMN IF NOT EXISTS subtitle_en VARCHAR(500);

SELECT 'تم إضافة حقل العنوان الفرعي للخدمات بنجاح!' as message;
