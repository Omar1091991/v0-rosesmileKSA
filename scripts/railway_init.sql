-- Railway PostgreSQL Database Initialization Script
-- عيادات ابتسامة الورود - مكة المكرمة

-- Drop existing tables if they exist
DROP TABLE IF EXISTS doctor_cases CASCADE;
DROP TABLE IF EXISTS booking_form_services CASCADE;
DROP TABLE IF EXISTS booking_forms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site_settings table
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    value_ar TEXT,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    title_ar VARCHAR(255),
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    price DECIMAL(10, 2),
    duration INTEGER,
    icon VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create departments table
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    specialty_ar VARCHAR(255),
    specialty_en VARCHAR(255),
    bio_ar TEXT,
    bio_en TEXT,
    qualifications_ar TEXT,
    qualifications_en TEXT,
    experience_years INTEGER,
    image_url TEXT,
    department_id INTEGER REFERENCES departments(id),
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create offers table
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    discount_percentage INTEGER,
    price_before DECIMAL(10, 2),
    price_after DECIMAL(10, 2),
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create articles table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    content_ar TEXT,
    content_en TEXT,
    excerpt_ar TEXT,
    excerpt_en TEXT,
    image_url TEXT,
    author VARCHAR(255),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
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
);

-- Create bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    patient_email VARCHAR(255),
    service_id INTEGER REFERENCES services(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE,
    appointment_time TIME,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create booking_forms table
CREATE TABLE booking_forms (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    is_main BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create booking_form_services table (many-to-many relationship)
CREATE TABLE booking_form_services (
    id SERIAL PRIMARY KEY,
    booking_form_id INTEGER REFERENCES booking_forms(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor_cases table
CREATE TABLE doctor_cases (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    before_image_url TEXT,
    after_image_url TEXT,
    treatment_date DATE,
    is_published BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123 - يجب تغييره بعد أول تسجيل دخول)
INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES
('admin@rosesmile.com', '$2a$10$rOzJQjYqYqYqYqYqYqYqYuO', 'مدير النظام', 'admin', true);

-- Insert default site settings
INSERT INTO site_settings (key, value, value_ar, category) VALUES
('site_name_ar', 'عيادات ابتسامة الورود', 'عيادات ابتسامة الورود', 'general'),
('site_name_en', 'Rose Smile Clinics', 'Rose Smile Clinics', 'general'),
('whatsapp_number', '+966500000000', '+966500000000', 'contact'),
('whatsapp_visible', 'true', 'true', 'contact'),
('phone_number', '+966123456789', '+966123456789', 'contact'),
('email', 'info@rosesmile.com', 'info@rosesmile.com', 'contact'),
('address_ar', 'مكة المكرمة، المملكة العربية السعودية', 'مكة المكرمة، المملكة العربية السعودية', 'contact'),
('address_en', 'Makkah, Saudi Arabia', 'Makkah, Saudi Arabia', 'contact'),
('facebook', 'https://facebook.com/rosesmile', 'https://facebook.com/rosesmile', 'social'),
('instagram', 'https://instagram.com/rosesmile', 'https://instagram.com/rosesmile', 'social'),
('twitter', 'https://twitter.com/rosesmile', 'https://twitter.com/rosesmile', 'social'),
('linkedin', 'https://linkedin.com/company/rosesmile', 'https://linkedin.com/company/rosesmile', 'social'),
('youtube', 'https://youtube.com/@rosesmile', 'https://youtube.com/@rosesmile', 'social');

-- Insert sample departments
INSERT INTO departments (name_ar, name_en, description_ar, description_en, icon, is_active, order_index) VALUES
('طب الأسنان العام', 'General Dentistry', 'خدمات طب الأسنان العامة والوقائية', 'General and preventive dental services', '🦷', true, 1),
('تقويم الأسنان', 'Orthodontics', 'تقويم وتجميل الأسنان', 'Orthodontic and cosmetic dentistry', '😁', true, 2),
('جراحة الفم والأسنان', 'Oral Surgery', 'جراحة الفم والفكين', 'Oral and maxillofacial surgery', '🏥', true, 3);

-- Insert sample services
INSERT INTO services (name_ar, name_en, title_ar, title_en, description_ar, description_en, price, duration, icon, is_active, order_index) VALUES
('تنظيف الأسنان', 'Teeth Cleaning', 'تنظيف شامل للأسنان', 'Complete Teeth Cleaning', 'تنظيف احترافي للأسنان وإزالة الجير والبلاك', 'Professional teeth cleaning and plaque removal', 200.00, 30, '🦷', true, 1),
('تبييض الأسنان', 'Teeth Whitening', 'تبييض احترافي للأسنان', 'Professional Teeth Whitening', 'تبييض الأسنان بأحدث التقنيات', 'Teeth whitening with latest technology', 500.00, 60, '✨', true, 2),
('تقويم الأسنان', 'Orthodontics', 'تقويم وتجميل الأسنان', 'Orthodontic Treatment', 'تقويم الأسنان بأحدث الأجهزة', 'Orthodontic treatment with modern appliances', 3000.00, 120, '😁', true, 3),
('حشو الأسنان', 'Dental Filling', 'حشو تجميلي للأسنان', 'Cosmetic Dental Filling', 'حشو الأسنان بمواد تجميلية عالية الجودة', 'Dental filling with high-quality cosmetic materials', 300.00, 45, '🦷', true, 4),
('زراعة الأسنان', 'Dental Implants', 'زراعة الأسنان المفقودة', 'Dental Implant Surgery', 'زراعة الأسنان بأحدث التقنيات', 'Dental implants with latest technology', 5000.00, 180, '🦷', true, 5);

-- Insert sample doctors
INSERT INTO doctors (name_ar, name_en, specialty_ar, specialty_en, bio_ar, bio_en, experience_years, department_id, is_active, order_index) VALUES
('د. أحمد محمد السعيد', 'Dr. Ahmed Mohamed Al-Saeed', 'طبيب أسنان عام', 'General Dentist', 'خبرة 10 سنوات في طب الأسنان العام والتجميلي', '10 years experience in general and cosmetic dentistry', 10, 1, true, 1),
('د. فاطمة علي الزهراني', 'Dr. Fatima Ali Al-Zahrani', 'أخصائية تقويم أسنان', 'Orthodontist', 'متخصصة في تقويم الأسنان للأطفال والكبار', 'Specialized in orthodontics for children and adults', 8, 2, true, 2),
('د. محمد عبدالله القحطاني', 'Dr. Mohammed Abdullah Al-Qahtani', 'جراح فم وأسنان', 'Oral Surgeon', 'خبرة في جراحة الفم والفكين وزراعة الأسنان', 'Experienced in oral surgery and dental implants', 12, 3, true, 3);

-- Insert sample offers
INSERT INTO offers (title_ar, title_en, description_ar, description_en, discount_percentage, price_before, price_after, valid_until, is_active) VALUES
('عرض خاص على التنظيف', 'Special Cleaning Offer', 'خصم 30% على تنظيف الأسنان لفترة محدودة', '30% off teeth cleaning for limited time', 30, 200.00, 140.00, CURRENT_TIMESTAMP + INTERVAL '30 days', true),
('عرض تبييض الأسنان', 'Teeth Whitening Offer', 'احصل على ابتسامة مشرقة بخصم 25%', 'Get a bright smile with 25% discount', 25, 500.00, 375.00, CURRENT_TIMESTAMP + INTERVAL '30 days', true);

-- Insert sample articles
INSERT INTO articles (title_ar, title_en, content_ar, content_en, author, is_published, published_at) VALUES
('أهمية تنظيف الأسنان بانتظام', 'Importance of Regular Teeth Cleaning', 'تنظيف الأسنان بانتظام مهم جداً للحفاظ على صحة الفم والأسنان...', 'Regular teeth cleaning is very important for maintaining oral health...', 'د. أحمد محمد', true, CURRENT_TIMESTAMP),
('كيف تحافظ على أسنانك بيضاء', 'How to Keep Your Teeth White', 'للحفاظ على أسنان بيضاء ومشرقة، اتبع هذه النصائح...', 'To maintain white and bright teeth, follow these tips...', 'د. فاطمة علي', true, CURRENT_TIMESTAMP);

-- Create indexes for better performance
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_doctors_active ON doctors(is_active);
CREATE INDEX idx_doctors_department ON doctors(department_id);
CREATE INDEX idx_offers_active ON offers(is_active);
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_category ON site_settings(category);

-- Grant permissions (adjust as needed for your Railway setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_railway_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_railway_user;

-- Database initialization completed successfully
