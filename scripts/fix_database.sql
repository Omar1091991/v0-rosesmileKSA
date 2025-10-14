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
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow admins full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to delete profiles" ON profiles;

DROP POLICY IF EXISTS "Allow public to read services" ON services;
DROP POLICY IF EXISTS "Allow admins to manage services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to delete services" ON services;

DROP POLICY IF EXISTS "Allow public to read doctors" ON doctors;
DROP POLICY IF EXISTS "Allow admins to manage doctors" ON doctors;
DROP POLICY IF EXISTS "Allow authenticated users to insert doctors" ON doctors;
DROP POLICY IF EXISTS "Allow authenticated users to update doctors" ON doctors;
DROP POLICY IF EXISTS "Allow authenticated users to delete doctors" ON doctors;

DROP POLICY IF EXISTS "Allow public to read departments" ON departments;
DROP POLICY IF EXISTS "Allow admins to manage departments" ON departments;
DROP POLICY IF EXISTS "Allow authenticated users to insert departments" ON departments;
DROP POLICY IF EXISTS "Allow authenticated users to update departments" ON departments;
DROP POLICY IF EXISTS "Allow authenticated users to delete departments" ON departments;

DROP POLICY IF EXISTS "Allow public to read offers" ON offers;
DROP POLICY IF EXISTS "Allow admins to manage offers" ON offers;
DROP POLICY IF EXISTS "Allow authenticated users to insert offers" ON offers;
DROP POLICY IF EXISTS "Allow authenticated users to update offers" ON offers;
DROP POLICY IF EXISTS "Allow authenticated users to delete offers" ON offers;

DROP POLICY IF EXISTS "Allow public to read bookings" ON bookings;
DROP POLICY IF EXISTS "Allow users to manage own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow admins to manage all bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated users to insert bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated users to update bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated users to delete bookings" ON bookings;

DROP POLICY IF EXISTS "Allow public to read articles" ON articles;
DROP POLICY IF EXISTS "Allow admins to manage articles" ON articles;
DROP POLICY IF EXISTS "Allow authenticated users to insert articles" ON articles;
DROP POLICY IF EXISTS "Allow authenticated users to update articles" ON articles;
DROP POLICY IF EXISTS "Allow authenticated users to delete articles" ON articles;

DROP POLICY IF EXISTS "Allow public to read gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admins to manage gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery" ON gallery;

DROP POLICY IF EXISTS "Allow public to read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admins to manage site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete site_settings" ON site_settings;

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

-- تحديث trigger لإنشاء profile تلقائياً عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user',
    COALESCE(new.raw_user_meta_data->>'phone', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إعادة إنشاء trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
