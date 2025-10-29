-- إصلاح جدول booking_forms بإضافة العمود المفقود
-- قم بتشغيل هذا السكريبت في Supabase SQL Editor

-- إضافة عمود services إلى جدول booking_forms
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;

-- إضافة عمود fields إذا لم يكن موجوداً
ALTER TABLE booking_forms 
ADD COLUMN IF NOT EXISTS fields JSONB DEFAULT '[]'::jsonb;

-- رسالة نجاح
SELECT 'تم إصلاح جدول booking_forms بنجاح!' AS message;
