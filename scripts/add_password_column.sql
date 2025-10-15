-- إضافة عمود كلمة المرور إلى جدول profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password TEXT;

-- تحديث المستخدم الإداري الافتراضي بكلمة مرور مشفرة
-- كلمة المرور الافتراضية: admin123
UPDATE profiles 
SET password = '$2a$10$rOvHPZYRvKE7LZ5FqJxLOeqKZxGxJxvXqYxQxYxQxYxQxYxQxYxQxO'
WHERE email = 'admin@rosesmile.com' AND password IS NULL;
