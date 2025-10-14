// هذا الملف موجود فقط لتجنب أخطاء الاستيراد
// يجب تحديث جميع الملفات التي تستورد منه لاستخدام lib/db.ts

export function createAdminClient() {
  throw new Error("Supabase is no longer used. Please use Railway PostgreSQL via lib/db.ts")
}
