# إعداد قاعدة بيانات Railway PostgreSQL

## نظرة عامة

هذا الدليل يشرح كيفية إعداد قاعدة بيانات Railway PostgreSQL لموقع عيادات ابتسامة الورود.

## ⚠️ ملاحظة مهمة

**في بيئة v0 (المعاينة):**
- يستخدم الموقع بيانات تجريبية (Mock Data) للمعاينة
- قاعدة البيانات الحقيقية لن تعمل في v0 لأن Railway PostgreSQL يتطلب اتصال WebSocket غير متاح في بيئة المتصفح

**عند النشر على Vercel:**
- ستعمل قاعدة البيانات الحقيقية بشكل كامل
- جميع العمليات (قراءة/كتابة) ستعمل بشكل صحيح

## خطوات الإعداد

### 1. إنشاء قاعدة بيانات Railway

1. سجل الدخول إلى [Railway.app](https://railway.app)
2. أنشئ مشروع جديد (New Project)
3. اختر "Provision PostgreSQL"
4. انتظر حتى يتم إنشاء قاعدة البيانات

### 2. الحصول على بيانات الاتصال

من لوحة تحكم Railway، احصل على:
- `DATABASE_URL` - رابط الاتصال الكامل
- `POSTGRES_URL` - رابط بديل
- `PGHOST` - عنوان الخادم
- `PGPORT` - المنفذ (عادة 5432)
- `PGUSER` - اسم المستخدم
- `PGPASSWORD` - كلمة المرور
- `PGDATABASE` - اسم قاعدة البيانات

### 3. تشغيل سكريبت التهيئة

#### الطريقة الأولى: من لوحة تحكم Railway

1. افتح قاعدة البيانات في Railway
2. اذهب إلى تبويب "Query"
3. انسخ محتوى ملف `scripts/railway_init.sql`
4. الصق المحتوى في محرر الاستعلامات
5. اضغط "Execute" لتشغيل السكريبت

#### الطريقة الثانية: باستخدام psql

\`\`\`bash
# قم بتثبيت PostgreSQL client إذا لم يكن مثبتاً
# على macOS: brew install postgresql
# على Ubuntu: sudo apt-get install postgresql-client

# قم بتشغيل السكريبت
psql $DATABASE_URL -f scripts/railway_init.sql
\`\`\`

#### الطريقة الثالثة: باستخدام أداة إدارة قواعد البيانات

استخدم أي أداة مثل:
- pgAdmin
- DBeaver
- TablePlus
- DataGrip

وقم بتشغيل محتوى ملف `railway_init.sql`

### 4. إضافة متغيرات البيئة إلى Vercel

عند نشر الموقع على Vercel:

1. اذهب إلى إعدادات المشروع في Vercel
2. اذهب إلى "Environment Variables"
3. أضف المتغيرات التالية من Railway:

\`\`\`env
DATABASE_URL=postgresql://user:password@host:port/database
POSTGRES_URL=postgresql://user:password@host:port/database
PGHOST=host
PGPORT=5432
PGUSER=user
PGPASSWORD=password
PGDATABASE=database
\`\`\`

### 5. التحقق من الإعداد

بعد تشغيل السكريبت، تحقق من أن الجداول تم إنشاؤها:

\`\`\`sql
-- عرض جميع الجداول
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- عرض عدد السجلات في كل جدول
SELECT 'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'offers', COUNT(*) FROM offers
UNION ALL
SELECT 'articles', COUNT(*) FROM articles
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings;
\`\`\`

## هيكل قاعدة البيانات

### الجداول الرئيسية

1. **users** - المستخدمين والمسؤولين
2. **site_settings** - إعدادات الموقع
3. **services** - الخدمات الطبية
4. **departments** - الأقسام الطبية
5. **doctors** - الأطباء
6. **offers** - العروض الخاصة
7. **articles** - المقالات الطبية
8. **bookings** - الحجوزات
9. **gallery** - معرض الصور
10. **booking_forms** - نماذج الحجز
11. **booking_form_services** - ربط النماذج بالخدمات
12. **doctor_cases** - حالات الأطباء

### البيانات الافتراضية

السكريبت يقوم بإدراج:
- مستخدم مدير افتراضي (admin@rosesmile.com)
- إعدادات الموقع الأساسية
- 3 أقسام طبية
- 5 خدمات طبية
- 3 أطباء
- 2 عروض خاصة
- 2 مقالات طبية

## الأمان

⚠️ **مهم جداً:**

1. **غيّر كلمة مرور المدير الافتراضية** فوراً بعد أول تسجيل دخول
2. **لا تشارك بيانات الاتصال** بقاعدة البيانات
3. **استخدم متغيرات البيئة** ولا تضع بيانات الاتصال في الكود
4. **فعّل SSL** للاتصال بقاعدة البيانات في الإنتاج

## استكشاف الأخطاء

### خطأ: "relation does not exist"
- تأكد من تشغيل سكريبت التهيئة بالكامل
- تحقق من أن جميع الجداول تم إنشاؤها

### خطأ: "connection refused"
- تحقق من صحة بيانات الاتصال
- تأكد من أن قاعدة البيانات تعمل في Railway

### خطأ: "permission denied"
- تحقق من صلاحيات المستخدم
- تأكد من استخدام المستخدم الصحيح

## الدعم

للمساعدة أو الاستفسارات:
- راجع [وثائق Railway](https://docs.railway.app/databases/postgresql)
- راجع [وثائق Vercel](https://vercel.com/docs/storage/vercel-postgres)
- تواصل مع فريق الدعم الفني
