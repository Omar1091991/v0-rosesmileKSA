-- Add custom daily working hours settings
INSERT INTO site_settings (setting_key, value_ar, value_en) VALUES
('working_hours_title_ar', 'ساعات العمل', 'Working Hours'),
('working_hours_title_en', 'Working Hours', 'Working Hours'),

('saturday_hours_ar', '1 م - 9 م', '1 PM - 9 PM'),
('saturday_hours_en', '1 PM - 9 PM', '1 PM - 9 PM'),
('saturday_closed', 'false', 'false'),

('sunday_hours_ar', '1 م - 9 م', '1 PM - 9 PM'),
('sunday_hours_en', '1 PM - 9 PM', '1 PM - 9 PM'),
('sunday_closed', 'false', 'false'),

('monday_hours_ar', '1 م - 9 م', '1 PM - 9 PM'),
('monday_hours_en', '1 PM - 9 PM', '1 PM - 9 PM'),
('monday_closed', 'false', 'false'),

('tuesday_hours_ar', '1 م - 9 م', '1 PM - 9 PM'),
('tuesday_hours_en', '1 PM - 9 PM', '1 PM - 9 PM'),
('tuesday_closed', 'false', 'false'),

('wednesday_hours_ar', '1 م - 9 م', '1 PM - 9 PM'),
('wednesday_hours_en', '1 PM - 9 PM', '1 PM - 9 PM'),
('wednesday_closed', 'false', 'false'),

('thursday_hours_ar', '2 م - 8 م', '2 PM - 8 PM'),
('thursday_hours_en', '2 PM - 8 PM', '2 PM - 8 PM'),
('thursday_closed', 'false', 'false'),

('friday_hours_ar', 'مغلق', 'Closed'),
('friday_hours_en', 'Closed', 'Closed'),
('friday_closed', 'true', 'true')

ON CONFLICT (setting_key) DO UPDATE SET
  value_ar = EXCLUDED.value_ar,
  value_en = EXCLUDED.value_en;
