# دليل ربط الحجوزات مع Google Sheets

## الخطوة 1: إعداد Google Sheet ✅ (تم)

لقد قمت بالفعل بإنشاء Google Sheet مع الأعمدة التالية:
- التاريخ
- الوقت
- الاسم
- رقم الجوال
- الخدمة
- النموذج
- التفاصيل

## الخطوة 2: الحصول على معرف الجدول (Spreadsheet ID)

1. افتح Google Sheet الذي أنشأته
2. انظر إلى عنوان URL في المتصفح، سيكون بهذا الشكل:
   \`\`\`
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   \`\`\`
3. انسخ الجزء الموجود بين `/d/` و `/edit` - هذا هو الـ Spreadsheet ID

**مثال:**
\`\`\`
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
\`\`\`
الـ ID هو: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## الخطوة 3: مشاركة الجدول مع Service Account

1. في Google Sheet، اضغط على زر "مشاركة" (Share) في الأعلى
2. أضف البريد الإلكتروني التالي:
   \`\`\`
   v0-rosesmile-vercel@v0-rosesmile-vercel.iam.gserviceaccount.com
   \`\`\`
3. اختر صلاحية "محرر" (Editor)
4. اضغط "إرسال" (Send)

## الخطوة 4: إضافة المتغيرات في Vercel

الآن تحتاج إلى إضافة 3 متغيرات بيئة في Vercel:

### 1. GOOGLE_SHEETS_CLIENT_EMAIL
\`\`\`
v0-rosesmile-vercel@v0-rosesmile-vercel.iam.gserviceaccount.com
\`\`\`

### 2. GOOGLE_SHEETS_PRIVATE_KEY
\`\`\`
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvzwRUgI1+meh1
VdEz6JrFe/DhADWmW6JmQKy42pcMXPE16g0/1T46vrKp6g3+BZg2062ZAInCIJ9h
KN25nxZsiAAO5T1E1qswoStTfdm2xFxNReozdZZdBwLvdFnz7h0DfD8g4FRwt4aw
bdd/b59zJCavh3iu38WwekpsPmYjeiqD41SkBmMG/w/5TWYpEDrBb0czuusjFyIF
GrS/HmLLaeaD9LmMQMoLU/+M5crbDBOn8feV7W2aFRlKVIc7h+EHGYTkVZitWUK2
SfRCu5M7ECtwY7xbWKVLxLcj+GI1Jtceq7mzsAg8GePwov+A9+Cy7aB2qxbbm/6d
/6Yuffl1AgMBAAECggEABOuoHR5Y93diym/rskZ7GHZi1EVPexe6+J4sR2M00Y+D
X8UseEIlYvsF4JwQprCs5THw/KSHdoO3uj4s0H5rn/+BculHGPdiJLMKFaTi1Er0
I2SGzMhofDOPSTjqMJnUPY37bVXh/yKf1i3I14P+BDi5jXWe8tQIAiu2DAgGD02W
5Wv3sJxltjZzaLujeLbSFBaM3wFx2VpkL7CVknvwHemdaV8bzKdDlMpiJthrBU+X
90si8XeoKFxkHT1qd3vLCMRO7m8OHOP4TBgUOkRYKWRAVsmu1hIBim+2dhEb72+8
B1veMPm/oW771Ehp4M3cIFc3/TGFQX/6otahQbBmYQKBgQDUk5QlC/bpgu9urec0
bTuLdMV4Mpjoiz5Wt35TtJPrCCzjxxacsBF015TI1Is9QjC8BHCWTPl2/9UpFSH/
zZ9/tfUfxZm/CWJEzvBfP9iW327q9zOa9X9ol6qL57z4NBeRXDX6HIG5KrXvK9me
BKVOkqPxGdSnp6YIJgii6fdv4QKBgQDTuLYH6UapwXKZxGWSlB5D6mzku+774yT1
BbJBJAKny17hUD9DGYP7axcLSHJMUVkNnUfGmIbf4raA64lzPbiTe5emOp01cq+u
lgjnECKsSJdYZ1IHH70Hd4ejZeIFeZYrH889DEAxhjEVE3fi5ztyhWzqGPjYOVYR
/RvzI1tMFQKBgQCGv9HtterbVMN/rj7cDc3r9aZjLfedmP54K7KpTtNg7fq+nGnq
AvXd0fYfZBOrTjTkShAwRjTwSPWPKDU4GNjdNLNgY3q1DTa8lUzro+YgpRuDWBXf
SXVtEI7sRoaT8zlpTEFu/PkCLl/Lb0lwEFPVPcEsSQpzCCOIEMvysUrHIQKBgHJ2
Tvsx88D8058sHZnEOCSRjXOP4uEM6UMKZFdxR3o9qbr4LmtxVPhM6jVwYlK+O/3v
RQmqFmjd4bsLG9FQ0gPx8oes8qcdrLsfZAq/n28zA5eIrEEruH9b8Nm20B4ToMsJ
tHmVsPLVUJ3LW6oxRuNgHQTmoUoMnWq2QzEMsWQNAoGAIyjGEVguE+2QWOy9b7Sv
63A4npwOluZ1+9DWr6ecKMlnDeCjL2abczGkWyC49pGp0zZVQd/CY9te7pLHz2NF
JSGcR4H6y4y3RiwWGB1zRvnWfPp/O9OTau9zLVdL776DkIWwNIQ3szrA4RbxW90P
JmrPms64gLMlsO/pAPeDrwI=
-----END PRIVATE KEY-----
\`\`\`

**⚠️ مهم جداً:** عند إضافة GOOGLE_SHEETS_PRIVATE_KEY في Vercel:
- انسخ المفتاح كاملاً بما في ذلك `-----BEGIN PRIVATE KEY-----` و `-----END PRIVATE KEY-----`
- تأكد من عدم وجود مسافات إضافية في البداية أو النهاية

### 3. GOOGLE_SHEETS_SPREADSHEET_ID
\`\`\`
[ضع هنا معرف الجدول الذي نسخته من الخطوة 2]
\`\`\`

## كيفية إضافة المتغيرات في Vercel:

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروع ROSESMILE
3. اذهب إلى Settings → Environment Variables
4. أضف كل متغير على حدة:
   - اكتب اسم المتغير في حقل "Key"
   - الصق القيمة في حقل "Value"
   - اختر "Production, Preview, and Development"
   - اضغط "Save"

## الخطوة 5: إعادة نشر المشروع

بعد إضافة جميع المتغيرات:
1. اذهب إلى تبويب "Deployments"
2. اضغط على النقاط الثلاث بجانب آخر deployment
3. اختر "Redeploy"
4. انتظر حتى ينتهي النشر

## الخطوة 6: الاختبار

1. اذهب إلى صفحة الحجز في موقعك
2. قم بإنشاء حجز تجريبي
3. تحقق من Google Sheet - يجب أن يظهر الحجز الجديد تلقائياً!

## استكشاف الأخطاء

إذا لم تظهر البيانات في Google Sheet:

1. **تحقق من المشاركة:** تأكد أنك شاركت الجدول مع البريد الإلكتروني الصحيح
2. **تحقق من المتغيرات:** تأكد أن جميع المتغيرات الثلاثة موجودة في Vercel
3. **تحقق من الـ ID:** تأكد أن GOOGLE_SHEETS_SPREADSHEET_ID صحيح
4. **تحقق من اسم الورقة:** تأكد أن اسم الورقة في Google Sheet هو "Sheet1" (أو قم بتغييره في الكود)

## ملاحظات مهمة

- ✅ البيانات تُرسل تلقائياً عند كل حجز جديد
- ✅ التاريخ والوقت يتم تسجيلهما بتوقيت القاهرة
- ✅ إذا فشل الإرسال لـ Google Sheets، الحجز سيُحفظ في قاعدة البيانات على أي حال
- ✅ يمكنك رؤية رسائل النجاح/الفشل في سجلات Vercel

---

**تم إعداد هذا الدليل خصيصاً لمشروع ROSESMILE** 🌹
