# دليل ربط Railway بالمشروع

## الخطوة 1: إنشاء قاعدة بيانات PostgreSQL على Railway

1. اذهب إلى: https://railway.app
2. سجل دخول أو أنشئ حساب جديد
3. اضغط **"New Project"**
4. اختر **"Provision PostgreSQL"**
5. انتظر حتى يتم إنشاء قاعدة البيانات (حوالي دقيقة)

## الخطوة 2: الحصول على DATABASE_URL

1. افتح مشروع PostgreSQL في Railway
2. اذهب إلى تبويب **"Variables"**
3. انسخ قيمة **`DATABASE_URL`**
   - يجب أن تبدأ بـ: `postgresql://postgres:...`

## الخطوة 3: تشغيل سكريبت إنشاء الجداول

### الطريقة 1: من Railway Dashboard (الأسهل)

1. في مشروع PostgreSQL، اذهب إلى تبويب **"Query"**
2. افتح ملف `scripts/railway_complete_setup.sql` من المشروع
3. انسخ **جميع** محتوى الملف
4. الصقه في Query Editor في Railway
5. اضغط **"Execute"** أو **Ctrl+Enter**
6. انتظر حتى تظهر رسالة النجاح

### الطريقة 2: من Terminal (للمتقدمين)

\`\`\`bash
# تثبيت PostgreSQL client إذا لم يكن مثبتاً
# ثم شغل:
psql "postgresql://postgres:...@...railway.app:5432/railway" -f scripts/railway_complete_setup.sql
\`\`\`

## الخطوة 4: تحديث متغيرات البيئة في v0

1. في v0، افتح الشريط الجانبي
2. اذهب إلى **"Vars"** (المتغيرات)
3. احذف جميع متغيرات Supabase القديمة:
   - `SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - وجميع متغيرات POSTGRES القديمة

4. أضف متغير واحد فقط:
   - **الاسم:** `DATABASE_URL`
   - **القيمة:** الصق `DATABASE_URL` من Railway

## الخطوة 5: تحديث الكود للاتصال بـ Railway

الكود الحالي يستخدم Supabase client. يجب تحديثه لاستخدام PostgreSQL مباشرة.

سأقوم بتحديث الملفات المطلوبة تلقائياً.

## الخطوة 6: التحقق من نجاح الاتصال

بعد تحديث الكود:
1. افتح الموقع
2. اذهب إلى لوحة التحكم
3. حاول إضافة خدمة أو طبيب جديد
4. إذا نجحت العملية، فقد تم الربط بنجاح!

## ملاحظات مهمة

- **الخطة المجانية في Railway:** توفر $5 رصيد شهري
- **إذا نفد الرصيد:** ستحتاج للترقية إلى خطة مدفوعة ($5/شهر)
- **النسخ الاحتياطي:** Railway يوفر نسخ احتياطية تلقائية في الخطة المدفوعة

## استكشاف الأخطاء

### خطأ: "Connection refused"
- تأكد من أن `DATABASE_URL` صحيح
- تأكد من أن قاعدة البيانات في Railway تعمل

### خطأ: "Table does not exist"
- تأكد من تشغيل سكريبت `railway_complete_setup.sql` بالكامل
- تحقق من عدم وجود أخطاء في Query Editor

### خطأ: "Authentication failed"
- تأكد من نسخ `DATABASE_URL` الكامل بدون مسافات إضافية
