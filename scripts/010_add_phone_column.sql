-- إضافة عمود phone إلى جدول profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- إضافة تعليق على العمود
COMMENT ON COLUMN profiles.phone IS 'رقم هاتف المستخدم';
