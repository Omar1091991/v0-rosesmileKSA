import { neon } from "@neondatabase/serverless"

const connectionString = process.env.STORAGE_DATABASE_URL

if (!connectionString) {
  console.error("❌ STORAGE_DATABASE_URL غير متاح")
  console.error("تأكد من إضافة متغير البيئة في Vercel")
  process.exit(1)
}

console.log("🔄 الاتصال بقاعدة بيانات Neon...")

const sql = neon(connectionString)

async function initDatabase() {
  try {
    console.log("🔄 حذف الجداول القديمة إذا كانت موجودة...")
    await sql`DROP TABLE IF EXISTS doctor_cases CASCADE`
    await sql`DROP TABLE IF EXISTS booking_form_services CASCADE`
    await sql`DROP TABLE IF EXISTS gallery CASCADE`
    await sql`DROP TABLE IF EXISTS articles CASCADE`
    await sql`DROP TABLE IF EXISTS offers CASCADE`
    await sql`DROP TABLE IF EXISTS bookings CASCADE`
    await sql`DROP TABLE IF EXISTS booking_forms CASCADE`
    await sql`DROP TABLE IF EXISTS departments CASCADE`
    await sql`DROP TABLE IF EXISTS services CASCADE`
    await sql`DROP TABLE IF EXISTS doctors CASCADE`
    await sql`DROP TABLE IF EXISTS site_settings CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`
    console.log("✅ تم حذف الجداول القديمة")

    console.log("🔄 إنشاء جدول المستخدمين...")
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول إعدادات الموقع...")
    await sql`
      CREATE TABLE site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(50) DEFAULT 'text',
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول الأطباء...")
    await sql`
      CREATE TABLE doctors (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        specialty_ar VARCHAR(255) NOT NULL,
        specialty_en VARCHAR(255),
        bio_ar TEXT,
        bio_en TEXT,
        qualifications_ar TEXT[],
        qualifications_en TEXT[],
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول حالات الأطباء...")
    await sql`
      CREATE TABLE doctor_cases (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول الخدمات...")
    await sql`
      CREATE TABLE services (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        icon VARCHAR(100),
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول الأقسام...")
    await sql`
      CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        icon VARCHAR(100),
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول العروض...")
    await sql`
      CREATE TABLE offers (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        original_price DECIMAL(10, 2),
        discounted_price DECIMAL(10, 2),
        discount_percentage INTEGER,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        valid_from DATE,
        valid_until DATE,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول المقالات...")
    await sql`
      CREATE TABLE articles (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        content_ar TEXT NOT NULL,
        content_en TEXT,
        excerpt_ar TEXT,
        excerpt_en TEXT,
        author_ar VARCHAR(255),
        author_en VARCHAR(255),
        image_url TEXT,
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول الحجوزات...")
    await sql`
      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        patient_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        service VARCHAR(255),
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
        preferred_date DATE,
        preferred_time TIME,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول نماذج الحجز...")
    await sql`
      CREATE TABLE booking_forms (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        fields JSONB NOT NULL DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("🔄 إنشاء جدول خدمات نماذج الحجز...")
    await sql`
      CREATE TABLE booking_form_services (
        id SERIAL PRIMARY KEY,
        booking_form_id INTEGER REFERENCES booking_forms(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(booking_form_id, service_id)
      )
    `

    console.log("🔄 إنشاء جدول معرض الصور...")
    await sql`
      CREATE TABLE gallery (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255),
        title_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT NOT NULL,
        category VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ تم إنشاء جميع الجداول بنجاح")

    console.log("🔄 إنشاء الفهارس...")
    await sql`CREATE INDEX idx_users_username ON users(username)`
    await sql`CREATE INDEX idx_users_email ON users(email)`
    await sql`CREATE INDEX idx_users_role ON users(role)`
    await sql`CREATE INDEX idx_doctors_active ON doctors(is_active)`
    await sql`CREATE INDEX idx_doctors_order ON doctors(order_index)`
    await sql`CREATE INDEX idx_services_active ON services(is_active)`
    await sql`CREATE INDEX idx_bookings_status ON bookings(status)`
    await sql`CREATE INDEX idx_site_settings_key ON site_settings(setting_key)`
    console.log("✅ تم إنشاء الفهارس بنجاح")

    console.log("🔄 إضافة مستخدم المدير...")
    await sql`
      INSERT INTO users (username, password, email, full_name, role, is_active)
      VALUES (
        'admin',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'admin@rosesmile.com',
        'مدير النظام',
        'admin',
        true
      )
    `
    console.log("✅ تم إضافة مستخدم المدير")

    console.log("🔄 إضافة الإعدادات الأساسية...")
    await sql`
      INSERT INTO site_settings (setting_key, setting_value, setting_type, category) VALUES
        ('site_name_ar', 'روز سمايل', 'text', 'general'),
        ('site_name_en', 'Rose Smile', 'text', 'general'),
        ('site_description_ar', 'عيادة أسنان متخصصة', 'text', 'general'),
        ('site_description_en', 'Specialized Dental Clinic', 'text', 'general'),
        ('phone', '+966 XX XXX XXXX', 'text', 'contact'),
        ('email', 'info@rosesmile.com', 'text', 'contact'),
        ('whatsapp', '+966 XX XXX XXXX', 'text', 'contact')
    `
    console.log("✅ تم إضافة الإعدادات الأساسية")

    console.log("\n✅✅✅ تم تهيئة قاعدة البيانات بنجاح! ✅✅✅\n")
    console.log("📧 بيانات تسجيل الدخول:")
    console.log("   البريد الإلكتروني: admin@rosesmile.com")
    console.log("   كلمة المرور: admin123")
    console.log("\n🌐 يمكنك الآن:")
    console.log("   1. تسجيل الدخول إلى لوحة التحكم")
    console.log("   2. إضافة الخدمات والأطباء والعروض من لوحة التحكم")
    console.log("   3. ستظهر البيانات مباشرة على الموقع العام")
    console.log("\n📊 الجداول الجاهزة:")
    console.log("   ✅ المستخدمين (users)")
    console.log("   ✅ الخدمات (services)")
    console.log("   ✅ الأطباء (doctors)")
    console.log("   ✅ العروض (offers)")
    console.log("   ✅ المقالات (articles)")
    console.log("   ✅ الحجوزات (bookings)")
    console.log("   ✅ الأقسام (departments)")
    console.log("   ✅ معرض الصور (gallery)")
    console.log("\n🎉 قاعدة البيانات جاهزة لإضافة البيانات الحقيقية!\n")

  } catch (error) {
    console.error("❌ خطأ في تهيئة قاعدة البيانات:", error)
    throw error
  }
}

initDatabase()
