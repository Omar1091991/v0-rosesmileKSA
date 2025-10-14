# إعداد تكامل Google Sheets

## الخطوات المطلوبة:

### 1. إنشاء مشروع Google Cloud

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Sheets API من قائمة APIs & Services

### 2. إنشاء Service Account

1. اذهب إلى IAM & Admin > Service Accounts
2. أنشئ Service Account جديد
3. امنحه دور "Editor"
4. أنشئ مفتاح JSON وحمّله

### 3. إعداد Google Sheet

1. أنشئ Google Sheet جديد
2. أنشئ ورقة باسم "الحجوزات"
3. أضف العناوين في الصف الأول:
   - التاريخ والوقت
   - الاسم الكامل
   - رقم الهاتف
   - الخدمة
   - ملاحظات
4. شارك الورقة مع البريد الإلكتروني للـ Service Account (من ملف JSON)

### 4. إضافة المتغيرات البيئية

أضف المتغيرات التالية في Vercel أو ملف `.env.local`:

\`\`\`env
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"..."}
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here
\`\`\`

**ملاحظة:** 
- `GOOGLE_SHEETS_CREDENTIALS` هو محتوى ملف JSON كاملاً
- `GOOGLE_SHEETS_SPREADSHEET_ID` هو المعرف من رابط Google Sheet (الجزء بين `/d/` و `/edit`)

### 5. إعادة المصادقة من لوحة التحكم

بعد تسجيل الدخول كمسؤول، يمكنك:
1. الذهاب إلى إعدادات Google Sheets في لوحة التحكم
2. إدخال بيانات الاعتماد الجديدة
3. اختبار الاتصال

## استكشاف الأخطاء

- تأكد من أن Service Account لديه صلاحيات الوصول للورقة
- تأكد من أن اسم الورقة "الحجوزات" مطابق تماماً
- تحقق من صحة تنسيق JSON في المتغيرات البيئية
