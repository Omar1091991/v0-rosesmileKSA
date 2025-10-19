-- إضافة أعمدة التتبع والملاحظات لجدول الحجوزات
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS contact_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- تحديث القيم الافتراضية للصفوف الموجودة
UPDATE bookings 
SET contacted = FALSE 
WHERE contacted IS NULL;

UPDATE bookings 
SET contact_attempts = 0 
WHERE contact_attempts IS NULL;
