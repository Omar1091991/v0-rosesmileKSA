# خطوات إكمال ربط Google Sheets - النهائية

## ✅ ما تم إنجازه:
1. ✅ إنشاء Service Account في Google Cloud
2. ✅ إنشاء Google Sheet مع الأعمدة الصحيحة
3. ✅ الحصول على Sheet ID من الرابط
4. ✅ إضافة المتغيرات في Vercel

## 📋 الخطوات المتبقية:

### 1. مشاركة Google Sheet مع Service Account
افتح Google Sheet الخاص بك وشارك الملف مع البريد الإلكتروني:
```
rosesmile-vercel@rosesmile-vercel.iam.gserviceaccount.com
```

**كيفية المشاركة:**
1. افتح Google Sheet: https://docs.google.com/spreadsheets/d/1aULNHz7f3WC33mWYWMCzt8BL2Mc0O3NR00tpFRaIFBU/edit
2. اضغط على زر "مشاركة" (Share) في الأعلى
3. أضف البريد الإلكتروني: `rosesmile-vercel@rosesmile-vercel.iam.gserviceaccount.com`
4. اختر صلاحية "محرر" (Editor)
5. اضغط "إرسال" (Send)

### 2. التأكد من المتغيرات في Vercel

تأكد أن المتغيرات الثلاثة موجودة في Vercel:

**GOOGLE_SERVICE_ACCOUNT_EMAIL:**
```
rosesmile-vercel@rosesmile-vercel.iam.gserviceaccount.com
```

**GOOGLE_SHEET_ID:**
```
1aULNHz7f3WC33mWYWMCzt8BL2Mc0O3NR00tpFRaIFBU
```

**GOOGLE_PRIVATE_KEY:**
```
-----BEGIN PRIVATE KEY-----
[المفتاح الخاص الكامل من ملف JSON]
-----END PRIVATE KEY-----
```

⚠️ **مهم جداً:** عند إضافة GOOGLE_PRIVATE_KEY في Vercel:
- انسخ المفتاح كاملاً من ملف JSON (من `private_key`)
- الصقه مباشرة في Vercel (مع `\n` الموجودة في النص)
- Vercel سيتعامل مع الأسطر الجديدة تلقائياً

### 3. اختبار الربط

بعد إضافة جميع المتغيرات ومشاركة الملف، اختبر الربط:

**الطريقة الأولى - عبر المتصفح:**
1. افتح: `https://your-domain.vercel.app/api/test-sheets`
2. إذا نجح الاختبار، ستظهر رسالة نجاح
3. تحقق من Google Sheet - يجب أن تجد صف جديد بالبيانات التجريبية

**الطريقة الثانية - حجز فعلي:**
1. اذهب إلى صفحة الحجز في الموقع
2. املأ النموذج وأرسله
3. تحقق من Google Sheet - يجب أن يظهر الحجز الجديد فوراً

### 4. استكشاف الأخطاء

إذا لم يعمل الربط، تحقق من:

**خطأ: "Error: No access, refresh token, API key or refresh handler callback is set"**
- تأكد أن GOOGLE_PRIVATE_KEY يحتوي على المفتاح الكامل
- تأكد أن المفتاح يبدأ بـ `-----BEGIN PRIVATE KEY-----`
- تأكد أن المفتاح ينتهي بـ `-----END PRIVATE KEY-----`

**خطأ: "The caller does not have permission"**
- تأكد أنك شاركت Google Sheet مع Service Account Email
- تأكد أن الصلاحية "محرر" (Editor)

**خطأ: "Unable to parse range"**
- تأكد أن اسم الورقة في Google Sheet هو "Sheet1"
- أو غير اسم الورقة في الكود إلى الاسم الصحيح

## 🎉 بعد نجاح الاختبار:

عند كل حجز جديد من الموقع، سيتم إرساله تلقائياً إلى Google Sheet مع:
- التاريخ والوقت
- اسم العميل
- رقم الجوال
- الخدمة المطلوبة
- النموذج المستخدم
- التفاصيل/الملاحظات

---

**للدعم:** إذا واجهت أي مشكلة، تحقق من السجلات (logs) في Vercel Dashboard.
