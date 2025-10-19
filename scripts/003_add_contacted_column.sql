-- إضافة عمود contacted لجدول الحجوزات
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT false;

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_bookings_contacted ON bookings(contacted);

SELECT 'تم إضافة عمود contacted بنجاح!' as message;
