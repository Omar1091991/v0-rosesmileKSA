# دليل إعداد قاعدة بيانات Railway

## الخطوات المطلوبة لربط Railway مع Vercel

### 1. إعداد قاعدة البيانات في Railway

#### الطريقة الأولى: استخدام Railway Dashboard
1. افتح مشروعك في [Railway Dashboard](https://railway.app)
2. اذهب إلى قاعدة البيانات PostgreSQL
3. اضغط على "Query" أو "Data"
4. انسخ محتوى ملف `scripts/init_railway_database.sql`
5. الصق السكريبت في محرر الاستعلامات
6. اضغط "Run" لتنفيذ السكريبت

#### الطريقة الثانية: استخدام Railway CLI
\`\`\`bash
# تثبيت Railway CLI
curl -fsSL https://railway.com/install.sh | sh

# تسجيل الدخول
railway login

# الاتصال بالمشروع
railway link -p d3afd36c-2a55-4e76-a475-d38bce707154

# تشغيل السكريبت
railway run psql -f scripts/init_railway_database.sql
\`\`\`

### 2. إضافة DATABASE_URL في Vercel

1. افتح مشروعك في [Vercel Dashboard](https://vercel.com)
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف متغير جديد:
   - **Name**: `DATABASE_URL`
   - **Value**: انسخ قيمة DATABASE_URL من Railway
   - **Environments**: حدد Production, Preview, Development

### 3. الحصول على DATABASE_URL من Railway

1. افتح مشروعك في Railway Dashboard
2. اذهب إلى قاعدة البيانات PostgreSQL
3. اضغط على "Connect"
4. انسخ قيمة **DATABASE_URL**
5. يجب أن تكون بالشكل التالي:
   \`\`\`
   postgresql://postgres:PASSWORD@HOST:5432/railway
   \`\`\`

### 4. التحقق من الإعداد

بعد إضافة DATABASE_URL في Vercel:
1. انشر الموقع على Vercel (Deploy)
2. افتح الموقع المنشور
3. سجل الدخول باستخدام:
   - **البريد الإلكتروني**: admin@rosesmile.com
   - **كلمة المرور**: admin123
4. تحقق من أن جميع الأقسام تعمل بشكل صحيح

### 5. ملاحظات مهمة

#### كلمة مرور المدير الافتراضية
- **البريد الإلكتروني**: admin@rosesmile.com
- **كلمة المرور**: admin123
- **مهم**: قم بتغيير كلمة المرور فوراً بعد أول تسجيل دخول!

#### الفرق بين البيئات
- **v0 Preview**: يستخدم localStorage (تخزين محلي في المتصفح)
- **Vercel Production**: يستخدم Railway PostgreSQL (قاعدة بيانات حقيقية)

#### استكشاف الأخطاء
إذا واجهت مشاكل:
1. تحقق من أن DATABASE_URL صحيح في Vercel
2. تأكد من تشغيل سكريبت التهيئة في Railway
3. تحقق من أن قاعدة البيانات تعمل في Railway Dashboard
4. راجع سجلات الأخطاء (Logs) في Vercel

### 6. الجداول المُنشأة

السكريبت يقوم بإنشاء الجداول التالية:
- ✅ `profiles` - المستخدمين
- ✅ `site_settings` - إعدادات الموقع
- ✅ `services` - الخدمات
- ✅ `doctors` - الأطباء
- ✅ `departments` - الأقسام
- ✅ `offers` - العروض
- ✅ `articles` - المقالات
- ✅ `gallery` - معرض الصور
- ✅ `booking_forms` - نماذج الحجز
- ✅ `booking_form_services` - ربط النماذج بالخدمات
- ✅ `bookings` - الحجوزات

### 7. البيانات الافتراضية

السكريبت يضيف:
- مستخدم مدير واحد (admin@rosesmile.com)
- 13 إعداد افتراضي للموقع
- فهارس لتحسين الأداء

### 8. الخطوات التالية

بعد إتمام الإعداد:
1. سجل الدخول إلى لوحة التحكم
2. أضف الخدمات والأطباء من لوحة التحكم
3. خصص إعدادات الموقع من قسم "محتوى الموقع"
4. أنشئ نماذج الحجز المطلوبة
5. ابدأ باستقبال الحجوزات!

---

## الدعم الفني

إذا واجهت أي مشاكل:
1. راجع سجلات الأخطاء في Vercel
2. تحقق من حالة قاعدة البيانات في Railway
3. تأكد من صحة DATABASE_URL
