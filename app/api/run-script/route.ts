import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json()

    if (script !== "init-database.mjs") {
      return NextResponse.json({ error: "سكريبت غير مسموح به" }, { status: 400 })
    }

    const connectionString = process.env.STORAGE_DATABASE_URL

    if (!connectionString) {
      return NextResponse.json(
        {
          error: "STORAGE_DATABASE_URL غير متاح. تأكد من إضافة متغير البيئة في Vercel",
        },
        { status: 500 },
      )
    }

    const sql = neon(connectionString)
    const output: string[] = []

    output.push("🔄 الاتصال بقاعدة بيانات Neon...")
    output.push("")

    // Drop existing tables
    output.push("🔄 حذف الجداول القديمة إذا كانت موجودة...")
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
    output.push("✅ تم حذف الجداول القديمة")
    output.push("")

    // Create users table
    output.push("🔄 إنشاء جدول المستخدمين...")
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
    output.push("✅ تم إنشاء جدول المستخدمين")

    // Create site_settings table
    output.push("🔄 إنشاء جدول إعدادات الموقع...")
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
    output.push("✅ تم إنشاء جدول إعدادات الموقع")

    // Create doctors table
    output.push("🔄 إنشاء جدول الأطباء...")
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
    output.push("✅ تم إنشاء جدول الأطباء")

    // Create doctor_cases table
    output.push("🔄 إنشاء جدول حالات الأطباء...")
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
    output.push("✅ تم إنشاء جدول حالات الأطباء")

    // Create services table
    output.push("🔄 إنشاء جدول الخدمات...")
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
    output.push("✅ تم إنشاء جدول الخدمات")

    // Create departments table
    output.push("🔄 إنشاء جدول الأقسام...")
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
    output.push("✅ تم إنشاء جدول الأقسام")

    // Create offers table
    output.push("🔄 إنشاء جدول العروض...")
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
    output.push("✅ تم إنشاء جدول العروض")

    // Create articles table
    output.push("🔄 إنشاء جدول المقالات...")
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
    output.push("✅ تم إنشاء جدول المقالات")

    // Create bookings table
    output.push("🔄 إنشاء جدول الحجوزات...")
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
    output.push("✅ تم إنشاء جدول الحجوزات")

    // Create booking_forms table
    output.push("🔄 إنشاء جدول نماذج الحجز...")
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
    output.push("✅ تم إنشاء جدول نماذج الحجز")

    // Create booking_form_services table
    output.push("🔄 إنشاء جدول خدمات نماذج الحجز...")
    await sql`
      CREATE TABLE booking_form_services (
        id SERIAL PRIMARY KEY,
        booking_form_id INTEGER REFERENCES booking_forms(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(booking_form_id, service_id)
      )
    `
    output.push("✅ تم إنشاء جدول خدمات نماذج الحجز")

    // Create gallery table
    output.push("🔄 إنشاء جدول معرض الصور...")
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
    output.push("✅ تم إنشاء جدول معرض الصور")
    output.push("")

    // Create indexes
    output.push("🔄 إنشاء الفهارس...")
    await sql`CREATE INDEX idx_users_username ON users(username)`
    await sql`CREATE INDEX idx_users_email ON users(email)`
    await sql`CREATE INDEX idx_users_role ON users(role)`
    await sql`CREATE INDEX idx_doctors_active ON doctors(is_active)`
    await sql`CREATE INDEX idx_doctors_order ON doctors(order_index)`
    await sql`CREATE INDEX idx_services_active ON services(is_active)`
    await sql`CREATE INDEX idx_bookings_status ON bookings(status)`
    await sql`CREATE INDEX idx_site_settings_key ON site_settings(setting_key)`
    output.push("✅ تم إنشاء الفهارس بنجاح")
    output.push("")

    // Insert admin user
    output.push("🔄 إضافة مستخدم المدير...")
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
    output.push("✅ تم إضافة مستخدم المدير")
    output.push("")

    // Insert default settings
    output.push("🔄 إضافة الإعدادات الافتراضية...")
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
    output.push("✅ تم إضافة الإعدادات الافتراضية")
    output.push("")

    output.push("✅✅✅ تم تهيئة قاعدة البيانات بنجاح! ✅✅✅")
    output.push("")
    output.push("📧 بيانات تسجيل الدخول:")
    output.push("   البريد الإلكتروني: admin@rosesmile.com")
    output.push("   كلمة المرور: admin123")
    output.push("")
    output.push("🌐 يمكنك الآن تسجيل الدخول إلى لوحة التحكم")

    return NextResponse.json({ output, success: true })
  } catch (error) {
    console.error("[v0] Error running script:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "حدث خطأ غير معروف",
      },
      { status: 500 },
    )
  }
}
