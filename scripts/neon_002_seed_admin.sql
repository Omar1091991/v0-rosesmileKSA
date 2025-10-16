-- إضافة مستخدم مدير افتراضي
-- كلمة المرور: admin123 (مشفرة باستخدام bcrypt)

INSERT INTO profiles (full_name, email, phone, role, password)
VALUES (
  'مدير النظام',
  'admin@rosesmile.com',
  '+966500000000',
  'admin',
  '$2a$10$YourBcryptHashHere'
)
ON CONFLICT (email) DO NOTHING;

-- ملاحظة: يجب تشغيل هذا السكريبت بعد إنشاء الجداول
-- كلمة المرور المشفرة يجب أن تكون hash صحيح لـ "admin123"
