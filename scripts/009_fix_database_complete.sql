-- إضافة عمود phone إلى جدول profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- تعطيل RLS على جميع الجداول
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

DROP POLICY IF EXISTS "services_select_policy" ON services;
DROP POLICY IF EXISTS "services_insert_policy" ON services;
DROP POLICY IF EXISTS "services_update_policy" ON services;
DROP POLICY IF EXISTS "services_delete_policy" ON services;

DROP POLICY IF EXISTS "doctors_select_policy" ON doctors;
DROP POLICY IF EXISTS "doctors_insert_policy" ON doctors;
DROP POLICY IF EXISTS "doctors_update_policy" ON doctors;
DROP POLICY IF EXISTS "doctors_delete_policy" ON doctors;

DROP POLICY IF EXISTS "departments_select_policy" ON departments;
DROP POLICY IF EXISTS "departments_insert_policy" ON departments;
DROP POLICY IF EXISTS "departments_update_policy" ON departments;
DROP POLICY IF EXISTS "departments_delete_policy" ON departments;

DROP POLICY IF EXISTS "offers_select_policy" ON offers;
DROP POLICY IF EXISTS "offers_insert_policy" ON offers;
DROP POLICY IF EXISTS "offers_update_policy" ON offers;
DROP POLICY IF EXISTS "offers_delete_policy" ON offers;

DROP POLICY IF EXISTS "bookings_select_policy" ON bookings;
DROP POLICY IF EXISTS "bookings_insert_policy" ON bookings;
DROP POLICY IF EXISTS "bookings_update_policy" ON bookings;
DROP POLICY IF EXISTS "bookings_delete_policy" ON bookings;

DROP POLICY IF EXISTS "articles_select_policy" ON articles;
DROP POLICY IF EXISTS "articles_insert_policy" ON articles;
DROP POLICY IF EXISTS "articles_update_policy" ON articles;
DROP POLICY IF EXISTS "articles_delete_policy" ON articles;

DROP POLICY IF EXISTS "gallery_select_policy" ON gallery;
DROP POLICY IF EXISTS "gallery_insert_policy" ON gallery;
DROP POLICY IF EXISTS "gallery_update_policy" ON gallery;
DROP POLICY IF EXISTS "gallery_delete_policy" ON gallery;
