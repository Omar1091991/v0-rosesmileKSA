-- إصلاح sequence جدول site_settings
-- Fix site_settings table sequence synchronization

-- تحديث sequence ليبدأ من أكبر ID موجود + 1
-- Update sequence to start from max existing ID + 1
SELECT setval(
  pg_get_serial_sequence('site_settings', 'id'),
  COALESCE((SELECT MAX(id) FROM site_settings), 0) + 1,
  false
);

-- التحقق من النتيجة
-- Verify the result
SELECT 
  'site_settings' as table_name,
  last_value as current_sequence_value,
  (SELECT MAX(id) FROM site_settings) as max_id_in_table
FROM pg_sequences 
WHERE sequencename = 'site_settings_id_seq';
