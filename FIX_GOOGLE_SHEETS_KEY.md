# إصلاح مشكلة Google Sheets - المفتاح الخاص

## المشكلة
الخطأ: `error:1E08010C:DECODER routines::unsupported`

هذا يعني أن المفتاح الخاص (GOOGLE_PRIVATE_KEY) في Vercel غير صحيح أو تالف.

## الحل

### الخطوة 1: احصل على المفتاح الصحيح
1. افتح ملف JSON الذي حصلت عليه من Google Service Account
2. ابحث عن حقل `"private_key"`
3. انسخ القيمة **بالكامل** (يجب أن تبدأ بـ `-----BEGIN PRIVATE KEY-----` وتنتهي بـ `-----END PRIVATE KEY-----`)

### الخطوة 2: تنسيق المفتاح
المفتاح يجب أن يكون على هذا الشكل:
\`\`\`
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
(عدة أسطر من الأحرف والأرقام)
...xyz123
-----END PRIVATE KEY-----
\`\`\`

**مهم جداً:**
- يجب أن يحتوي على `\n` (backslash + n) بين كل سطر
- **ليس** أسطر جديدة فعلية، بل النص الحرفي `\n`

### الخطوة 3: أضف المفتاح في Vercel
1. اذهب إلى: https://vercel.com/your-project/settings/environment-variables
2. ابحث عن `GOOGLE_PRIVATE_KEY`
3. احذف القيمة القديمة
4. الصق المفتاح الجديد **كما هو** من ملف JSON (مع `\n`)
5. احفظ التغييرات
6. أعد نشر المشروع (Redeploy)

### الخطوة 4: تحقق من الإعداد
بعد إعادة النشر، افتح: `/api/diagnose-sheets`

يجب أن ترى:
- `"success": true`
- `"privateKeyLength"` حوالي 1700-1800 حرف (وليس 31974!)

### مثال على المفتاح الصحيح في Vercel
\`\`\`
-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASC...\n...xyz\n-----END PRIVATE KEY-----\n
\`\`\`

## ملاحظات
- طول المفتاح الطبيعي: 1700-1800 حرف
- إذا كان طول المفتاح أكثر من 10000 حرف، فهو خاطئ
- تأكد من عدم وجود مسافات إضافية في البداية أو النهاية
- تأكد من مشاركة Google Sheet مع: `rosesmile-vercel@rosesmile-vercel.iam.gserviceaccount.com`
