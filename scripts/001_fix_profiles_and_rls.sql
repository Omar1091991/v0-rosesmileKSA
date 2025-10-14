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
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Anyone can view active doctors" ON doctors;
DROP POLICY IF EXISTS "Admins can manage doctors" ON doctors;
DROP POLICY IF EXISTS "Anyone can view active departments" ON departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON departments;
DROP POLICY IF EXISTS "Anyone can view active offers" ON offers;
DROP POLICY IF EXISTS "Admins can manage offers" ON offers;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
DROP POLICY IF EXISTS "Anyone can view active gallery items" ON gallery;
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

-- منح الصلاحيات الكاملة للجميع
GRANT ALL ON profiles TO anon, authenticated;
GRANT ALL ON services TO anon, authenticated;
GRANT ALL ON doctors TO anon, authenticated;
GRANT ALL ON departments TO anon, authenticated;
GRANT ALL ON offers TO anon, authenticated;
GRANT ALL ON bookings TO anon, authenticated;
GRANT ALL ON articles TO anon, authenticated;
GRANT ALL ON gallery TO anon, authenticated;
GRANT ALL ON site_settings TO anon, authenticated;
