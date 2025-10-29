# دليل ربط Google Sheets مع نظام الحجوزات

## الخطوة 1: إنشاء مشروع في Google Cloud Console

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. قم بإنشاء مشروع جديد أو اختر مشروع موجود
3. اضغط على "Enable APIs and Services"
4. ابحث عن "Google Sheets API" وقم بتفعيله

## الخطوة 2: إنشاء Service Account

1. في Google Cloud Console، اذهب إلى **IAM & Admin** > **Service Accounts**
2. اضغط على **Create Service Account**
3. أدخل اسم للحساب (مثل: `rosesmile-bookings`)
4. اضغط **Create and Continue**
5. اختر Role: **Editor** (أو يمكنك اختيار Basic > Editor)
6. اضغط **Continue** ثم **Done**

## الخطوة 3: إنشاء مفتاح JSON

1. في قائمة Service Accounts، اضغط على الحساب الذي أنشأته
2. اذهب إلى تبويب **Keys**
3. اضغط **Add Key** > **Create new key**
4. اختر **JSON** كنوع المفتاح
5. سيتم تنزيل ملف JSON - احتفظ به في مكان آمن

## الخطوة 4: إعداد Google Sheet

1. افتح [Google Sheets](https://sheets.google.com)
2. أنشئ جدول جديد أو افتح جدول موجود
3. في الصف الأول، أضف العناوين التالية:

\`\`\`
التاريخ والوقت | الاسم | رقم الهاتف | البريد الإلكتروني | الخدمة | التاريخ المفضل | الوقت المفضل | ملاحظات | الحالة | نموذج الحجز
\`\`\`

4. انسخ **Spreadsheet ID** من URL الجدول:
   - URL مثال: `https://docs.google.com/spreadsheets/d/1ABC123xyz/edit`
   - الـ ID هو: `1ABC123xyz`

5. شارك الجدول مع Service Account:
   - اضغط على زر **Share** في أعلى يمين الجدول
   - الصق البريد الإلكتروني للـ Service Account (من ملف JSON: `client_email`)
   - أعطه صلاحية **Editor**
   - اضغط **Send**

## الخطوة 5: إضافة المتغيرات في Vercel

1. افتح مشروعك في [Vercel Dashboard](https://vercel.com/dashboard)
2. اذهب إلى **Settings** > **Environment Variables**
3. أضف المتغيرات التالية:

### GOOGLE_SHEETS_CLIENT_EMAIL
- القيمة: انسخ قيمة `client_email` من ملف JSON
- مثال: `rosesmile-bookings@project-id.iam.gserviceaccount.com`

### GOOGLE_SHEETS_PRIVATE_KEY
- القيمة: انسخ قيمة `private_key` من ملف JSON **بالكامل**
- **مهم**: يجب أن تحتفظ بـ `\n` في النص
- مثال: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n`

### GOOGLE_SHEETS_SPREADSHEET_ID
- القيمة: الـ ID الذي نسخته من URL الجدول
- مثال: `1ABC123xyz`

4. اضغط **Save** لكل متغير

## الخطوة 6: إعادة نشر المشروع

1. في Vercel Dashboard، اذهب إلى تبويب **Deployments**
2. اضغط على **Redeploy** للنشر الأخير
3. أو قم بعمل commit جديد في GitHub لتشغيل نشر تلقائي

## الخطوة 7: اختبار الربط

1. افتح موقعك
2. قم بإنشاء حجز جديد من نموذج الحجز العام
3. تحقق من Google Sheet - يجب أن يظهر الحجز الجديد تلقائياً!

## استكشاف الأخطاء

### الخطأ: "Credentials not configured"
- تأكد من إضافة جميع المتغيرات الثلاثة في Vercel
- تأكد من إعادة نشر المشروع بعد إضافة المتغيرات

### الخطأ: "Permission denied"
- تأكد من مشاركة Google Sheet مع Service Account email
- تأكد من إعطاء صلاحية Editor

### الخطأ: "Invalid private key"
- تأكد من نسخ `private_key` بالكامل مع `-----BEGIN` و `-----END`
- تأكد من الحفاظ على `\n` في النص

### البيانات لا تظهر في الجدول
- تحقق من اسم الورقة في الجدول (يجب أن يكون `Sheet1`)
- أو قم بتعديل الكود في `lib/google-sheets.ts` لتغيير اسم الورقة

## ملاحظات مهمة

- ✅ الربط يعمل تلقائياً عند كل حجز جديد
- ✅ إذا فشل الربط مع Google Sheets، لن يؤثر على عملية الحجز
- ✅ يمكنك تعطيل الربط بحذف المتغيرات من Vercel
- ✅ البيانات تُحفظ في قاعدة البيانات أولاً، ثم تُرسل إلى Google Sheets

## دعم إضافي

إذا واجهت أي مشاكل، تحقق من:
1. سجلات Vercel (Logs) لرؤية الأخطاء
2. تأكد من تفعيل Google Sheets API في Google Cloud Console
3. تأكد من صلاحيات Service Account
