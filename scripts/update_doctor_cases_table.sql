-- تحديث جدول doctor_cases ليكون أبسط - صور الحالات فقط بدون قبل/بعد
ALTER TABLE doctor_cases DROP COLUMN IF EXISTS title_ar;
ALTER TABLE doctor_cases DROP COLUMN IF EXISTS title_en;
ALTER TABLE doctor_cases DROP COLUMN IF EXISTS before_image_url;
ALTER TABLE doctor_cases DROP COLUMN IF EXISTS after_image_url;
ALTER TABLE doctor_cases DROP COLUMN IF EXISTS description_ar;
ALTER TABLE doctor_cases DROP COLUMN IF EXISTS description_en;

-- إضافة عمود واحد فقط للصورة
ALTER TABLE doctor_cases ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE doctor_cases ADD COLUMN IF NOT EXISTS caption_ar TEXT;
ALTER TABLE doctor_cases ADD COLUMN IF NOT EXISTS caption_en TEXT;
