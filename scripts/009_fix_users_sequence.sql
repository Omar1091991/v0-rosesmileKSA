-- إصلاح sequence جدول المستخدمين
-- المشكلة: sequence غير متزامن مع البيانات الموجودة مما يسبب خطأ duplicate key

-- إعادة تعيين sequence ليبدأ من أكبر ID موجود + 1
SELECT setval(
  pg_get_serial_sequence('users', 'id'),
  COALESCE((SELECT MAX(id) FROM users), 0) + 1,
  false
);

-- التحقق من النتيجة
SELECT 
  'users' as table_name,
  COALESCE((SELECT MAX(id) FROM users), 0) as max_id,
  nextval(pg_get_serial_sequence('users', 'id')) - 1 as next_sequence_value;
