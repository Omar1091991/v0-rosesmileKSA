-- إضافة أعمدة Google Sheet لجدول نماذج الحجز
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS google_sheet_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS google_sheet_url TEXT;

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_booking_forms_google_sheet_id ON booking_forms(google_sheet_id);
