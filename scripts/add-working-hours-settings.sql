-- إضافة إعدادات ساعات العمل إلى site_settings
INSERT INTO site_settings (key, value_ar, value_en, type) VALUES
('working_hours_start_ar', '9 صباحاً', '9 AM', 'text'),
('working_hours_end_ar', '10 مساءً', '10 PM', 'text'),
('working_days_ar', 'السبت - الخميس', 'Saturday - Thursday', 'text'),
('closed_day_ar', 'الجمعة: مغلق', 'Friday: Closed', 'text')
ON CONFLICT (key) DO UPDATE SET
  value_ar = EXCLUDED.value_ar,
  value_en = EXCLUDED.value_en;
