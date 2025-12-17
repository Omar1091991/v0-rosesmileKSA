# ROSESMILE

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/omar-rabies-projects/v0-rosesmile)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/nyKkxlxFw4G)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/omar-rabies-projects/v0-rosesmile](https://vercel.com/omar-rabies-projects/v0-rosesmile)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/nyKkxlxFw4G](https://v0.app/chat/projects/nyKkxlxFw4G)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

---

## 🔄 Database Migration: Neon → Supabase

تم نقل قاعدة البيانات من **Neon** إلى **Supabase** بنجاح!

### ✅ ما تم إنجازه:

1. **إنشاء البنية الكاملة في Supabase** - جميع الجداول والفهارس والقيود
2. **تحديث ملفات الاتصال** - استخدام `pg` Pool بدلاً من `@neondatabase/serverless`
3. **إضافة Supabase Clients** - دعم كامل لـ SSR مع Next.js
4. **سكريبتات النقل التلقائي** - نقل جميع البيانات بدون فقدان

### 📋 خطوات التشغيل:

#### 1. إنشاء الجداول في Supabase
قم بتشغيل السكريبت في Supabase SQL Editor:
```bash
scripts/002_create_supabase_schema.sql
```

#### 2. نقل البيانات تلقائياً
```bash
npm run migrate
```

#### 3. تحديث متغيرات البيئة في Vercel
تأكد من إضافة المتغيرات التالية:
- `SUPABASE_POSTGRES_URL` - رابط PostgreSQL من Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - رابط API من Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - المفتاح العام من Supabase

### 📁 الملفات المحدثة:

- ✅ `lib/db.tsx` - تحديث الاتصال لاستخدام Supabase
- ✅ `lib/supabase/client.ts` - Supabase client للعميل
- ✅ `lib/supabase/server.ts` - Supabase client للخادم
- ✅ `package.json` - إضافة مكتبات Supabase
- ✅ `scripts/002_create_supabase_schema.sql` - إنشاء البنية
- ✅ `scripts/003_migrate_data.mjs` - نقل البيانات

### 🎯 المميزات:

- ✅ **لا حاجة لتعديل API routes** - جميع الاستعلامات تعمل كما هي
- ✅ **أمان محسّن** - استخدام parameterized queries
- ✅ **أداء أفضل** - Connection pooling
- ✅ **دعم كامل لـ SSR** - مع Next.js 15

للمزيد من التفاصيل، راجع `MIGRATION_GUIDE.md`
