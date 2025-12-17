# دليل نقل قاعدة البيانات من Neon إلى Supabase

## الخطوة 1: التحقق من الاتصال بـ Supabase

تأكد من أن متغيرات البيئة التالية موجودة في Vercel:
- `SUPABASE_POSTGRES_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## الخطوة 2: إنشاء الجداول في Supabase

1. افتح Supabase SQL Editor من لوحة تحكم Supabase
2. انسخ محتوى ملف `scripts/002_create_supabase_schema.sql`
3. الصق الكود في SQL Editor
4. اضغط على "Run" لتنفيذ السكريبت

هذا سينشئ جميع الجداول المطلوبة في Supabase.

## الخطوة 3: نقل البيانات من Neon إلى Supabase

### الطريقة الأولى: استخدام سكريبت النقل التلقائي

```bash
# تأكد من وجود متغيرات البيئة
export STORAGE_DATABASE_URL="your_neon_connection_string"
export SUPABASE_POSTGRES_URL="your_supabase_connection_string"

# تشغيل سكريبت النقل
node scripts/003_migrate_data.mjs
```

### الطريقة الثانية: استخدام صفحة النقل في الموقع

1. اذهب إلى `/migration` في المتصفح
2. اضغط على "بدء النقل التلقائي"
3. انتظر حتى تكتمل جميع الخطوات

## الخطوة 4: تحديث ملف الاتصال بقاعدة البيانات

بعد نقل البيانات بنجاح، يجب تحديث `lib/db.tsx` ليستخدم Supabase:

```typescript
import { Pool } from '@neondatabase/serverless'

const connectionString = process.env.SUPABASE_POSTGRES_URL

if (!connectionString) {
  throw new Error('SUPABASE_POSTGRES_URL is not defined')
}

const pool = new Pool({ connectionString })

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('[v0] الاستعلام:', text)
  console.log('[v0] المدة:', duration, 'ms')
  return res
}
```

## الخطوة 5: التحقق من النقل

1. افتح الموقع وتأكد من ظهور جميع البيانات
2. تحقق من:
   - الأطباء
   - الخدمات
   - المقالات
   - العروض
   - نماذج الحجز
   - إعدادات الموقع

## الخطوة 6: حذف متغيرات Neon القديمة (اختياري)

بعد التأكد من أن كل شيء يعمل بشكل صحيح، يمكنك حذف متغيرات Neon القديمة:
- `STORAGE_DATABASE_URL`
- `STORAGE_POSTGRES_URL`
- وجميع متغيرات `STORAGE_*` الأخرى

## استكشاف الأخطاء

### خطأ: "relation does not exist"
- تأكد من تشغيل سكريبت إنشاء الجداول أولاً (الخطوة 2)

### خطأ: "connection timeout"
- تأكد من أن عنوان الاتصال صحيح
- تحقق من إعدادات الشبكة في Supabase

### خطأ: "duplicate key value"
- هذا طبيعي إذا كانت البيانات موجودة بالفعل
- السكريبت يستخدم `ON CONFLICT DO NOTHING` لتجنب التكرار

## ملاحظات مهمة

1. **النسخ الاحتياطي**: احتفظ بنسخة احتياطية من قاعدة Neon حتى تتأكد من نجاح النقل
2. **الوقت**: قد يستغرق النقل بضع دقائق حسب حجم البيانات
3. **التوقف**: لا تغلق المتصفح أو توقف السكريبت أثناء النقل
4. **التحقق**: تحقق من جميع الصفحات بعد النقل للتأكد من عمل كل شيء

## الدعم

إذا واجهت أي مشاكل، تحقق من:
1. سجلات الأخطاء في Console
2. سجلات Vercel
3. سجلات Supabase
