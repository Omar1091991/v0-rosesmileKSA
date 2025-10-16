-- إضافة بيانات تجريبية للخدمات

INSERT INTO services (title_ar, title_en, description_ar, description_en, icon, is_active, order_index)
VALUES
  ('تبييض الأسنان', 'Teeth Whitening', 'خدمة تبييض الأسنان المتقدمة', 'Advanced teeth whitening service', 'Sparkles', TRUE, 1),
  ('تقويم الأسنان', 'Orthodontics', 'تقويم الأسنان بأحدث التقنيات', 'Orthodontics with latest technology', 'Smile', TRUE, 2),
  ('زراعة الأسنان', 'Dental Implants', 'زراعة الأسنان بجودة عالية', 'High quality dental implants', 'Plus', TRUE, 3),
  ('علاج الجذور', 'Root Canal', 'علاج جذور الأسنان بدون ألم', 'Painless root canal treatment', 'Heart', TRUE, 4)
ON CONFLICT DO NOTHING;

-- إضافة بيانات تجريبية للأطباء

INSERT INTO doctors (name_ar, name_en, specialty_ar, specialty_en, bio_ar, bio_en, is_active, order_index)
VALUES
  ('د. أحمد محمد', 'Dr. Ahmed Mohammed', 'أخصائي تقويم الأسنان', 'Orthodontist', 'خبرة 15 عام في تقويم الأسنان', '15 years experience in orthodontics', TRUE, 1),
  ('د. فاطمة علي', 'Dr. Fatima Ali', 'أخصائية تجميل الأسنان', 'Cosmetic Dentist', 'خبرة 10 سنوات في تجميل الأسنان', '10 years experience in cosmetic dentistry', TRUE, 2),
  ('د. محمد حسن', 'Dr. Mohammed Hassan', 'جراح الفم والأسنان', 'Oral Surgeon', 'خبرة 20 عام في جراحة الفم', '20 years experience in oral surgery', TRUE, 3)
ON CONFLICT DO NOTHING;

-- إضافة نموذج حجز رئيسي

INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, is_main, order_index)
VALUES
  ('حجز موعد عام', 'General Appointment', 'احجز موعدك الآن', 'Book your appointment now', TRUE, 1)
ON CONFLICT DO NOTHING;
