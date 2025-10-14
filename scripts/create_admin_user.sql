-- إنشاء حساب المسؤول مباشرة في قاعدة البيانات
-- البريد: omar1091991@gmail.com
-- كلمة المرور: omar9270

-- ملاحظة: يجب تشغيل هذا السكريبت من لوحة تحكم Supabase SQL Editor
-- أو استخدام Supabase CLI

-- إنشاء المستخدم في Supabase Auth
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'omar1091991@gmail.com',
  crypt('omar9270', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Omar"}',
  false,
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- إنشاء البروفايل في جدول profiles
-- استبدل USER_ID_HERE بالـ ID الذي تم إرجاعه من الاستعلام السابق
INSERT INTO profiles (
  id,
  full_name,
  email,
  phone,
  role,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'omar1091991@gmail.com'),
  'Omar',
  'omar1091991@gmail.com',
  '',
  'admin',
  now(),
  now()
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';
