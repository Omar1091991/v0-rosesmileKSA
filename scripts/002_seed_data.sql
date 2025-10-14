-- Insert default site settings
INSERT INTO public.site_settings (key, value_ar, value_en, type) VALUES
  ('site_name', 'عيادات ابتسامة الورود', 'Rose Smile Clinics', 'text'),
  ('site_description', 'عيادات طبية متخصصة في مكة المكرمة', 'Specialized Medical Clinics in Makkah', 'text'),
  ('phone', '+966 12 345 6789', '+966 12 345 6789', 'text'),
  ('email', 'info@rosesmileksa.com', 'info@rosesmileksa.com', 'text'),
  ('address_ar', 'مكة المكرمة، المملكة العربية السعودية', 'Makkah, Saudi Arabia', 'text'),
  ('working_hours_ar', 'السبت - الخميس: 9 صباحاً - 10 مساءً', 'Saturday - Thursday: 9 AM - 10 PM', 'text'),
  ('hero_title_ar', 'ابتسامتك هي عنوان صحتك', 'Your Smile is Your Health', 'text'),
  ('hero_subtitle_ar', 'نقدم أفضل الخدمات الطبية بأحدث التقنيات', 'We provide the best medical services with the latest technology', 'text')
ON CONFLICT (key) DO NOTHING;

-- Insert sample services
INSERT INTO public.services (title_ar, title_en, description_ar, description_en, icon, order_index) VALUES
  ('طب الأسنان', 'Dentistry', 'خدمات طب الأسنان الشاملة', 'Comprehensive dental services', '🦷', 1),
  ('تجميل الأسنان', 'Cosmetic Dentistry', 'تبييض وتجميل الأسنان', 'Teeth whitening and cosmetic procedures', '✨', 2),
  ('تقويم الأسنان', 'Orthodontics', 'تقويم الأسنان بأحدث التقنيات', 'Modern orthodontic treatments', '🦷', 3),
  ('زراعة الأسنان', 'Dental Implants', 'زراعة الأسنان بتقنيات متقدمة', 'Advanced dental implant procedures', '🦷', 4),
  ('علاج اللثة', 'Periodontics', 'علاج أمراض اللثة', 'Gum disease treatment', '🦷', 5),
  ('طب الأطفال', 'Pediatric Dentistry', 'رعاية أسنان الأطفال', 'Children dental care', '👶', 6)
ON CONFLICT DO NOTHING;

-- Insert sample doctors
INSERT INTO public.doctors (name_ar, name_en, specialty_ar, specialty_en, bio_ar, bio_en, order_index) VALUES
  ('د. محمد أحمد', 'Dr. Mohammed Ahmed', 'استشاري طب الأسنان', 'Dental Consultant', 'خبرة 15 عاماً في طب الأسنان', '15 years experience in dentistry', 1),
  ('د. فاطمة علي', 'Dr. Fatima Ali', 'أخصائية تجميل الأسنان', 'Cosmetic Dentistry Specialist', 'متخصصة في تجميل وتبييض الأسنان', 'Specialized in cosmetic dentistry and whitening', 2),
  ('د. عبدالله سعيد', 'Dr. Abdullah Saeed', 'استشاري تقويم الأسنان', 'Orthodontics Consultant', 'خبير في تقويم الأسنان الحديث', 'Expert in modern orthodontics', 3)
ON CONFLICT DO NOTHING;

-- Insert sample departments
INSERT INTO public.departments (name_ar, name_en, description_ar, description_en, icon, order_index) VALUES
  ('قسم الأسنان', 'Dental Department', 'قسم متخصص في جميع خدمات الأسنان', 'Specialized department for all dental services', '🦷', 1),
  ('قسم التجميل', 'Cosmetic Department', 'قسم التجميل والعناية بالبشرة', 'Cosmetic and skincare department', '✨', 2),
  ('قسم الطوارئ', 'Emergency Department', 'قسم الطوارئ على مدار الساعة', '24/7 emergency department', '🚑', 3)
ON CONFLICT DO NOTHING;

-- Insert sample offers
INSERT INTO public.offers (title_ar, title_en, description_ar, description_en, price_before, price_after, discount_percentage, valid_from, valid_until) VALUES
  ('عرض تبييض الأسنان', 'Teeth Whitening Offer', 'احصل على ابتسامة مشرقة بخصم 30%', 'Get a bright smile with 30% discount', 1500.00, 1050.00, 30, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'),
  ('عرض الفحص الشامل', 'Complete Checkup Offer', 'فحص شامل للأسنان بسعر مخفض', 'Complete dental checkup at reduced price', 500.00, 350.00, 30, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days')
ON CONFLICT DO NOTHING;
