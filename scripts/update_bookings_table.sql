-- إضافة حقول جديدة لجدول الحجوزات
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS contact_attempts INTEGER DEFAULT 0;
