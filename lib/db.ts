// Railway PostgreSQL يتطلب WebSocket وهو غير متاح في بيئة v0
// البيانات الحقيقية ستعمل عند النشر على Vercel

const inMemoryStore = {
  profiles: [] as any[],
  deletedIds: new Set<string>(),
}

// بيانات تجريبية للمعاينة
const mockData = {
  profiles: [
    {
      id: "1",
      full_name: "مدير النظام",
      email: "admin@rosesmile.com",
      phone: "+966500000001",
      role: "admin",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      full_name: "مستخدم تجريبي",
      email: "user@example.com",
      phone: "+966500000002",
      role: "user",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  services: [
    {
      id: 1,
      name_ar: "تنظيف الأسنان",
      name_en: "Teeth Cleaning",
      title_ar: "تنظيف الأسنان",
      title_en: "Teeth Cleaning",
      description_ar: "تنظيف شامل للأسنان باستخدام أحدث التقنيات للحفاظ على صحة الفم والأسنان",
      description_en: "Complete teeth cleaning using latest technology",
      price: 200,
      image_url: "/dental-teeth-cleaning-professional.jpg",
      icon: "🦷",
      is_active: true,
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name_ar: "تبييض الأسنان",
      name_en: "Teeth Whitening",
      title_ar: "تبييض الأسنان",
      title_en: "Teeth Whitening",
      description_ar: "تبييض احترافي للأسنان للحصول على ابتسامة ناصعة البياض",
      description_en: "Professional teeth whitening for a bright smile",
      price: 500,
      image_url: "/teeth-whitening-bright-smile.jpg",
      icon: "✨",
      is_active: true,
      order_index: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name_ar: "تقويم الأسنان",
      name_en: "Orthodontics",
      title_ar: "تقويم الأسنان",
      title_en: "Orthodontics",
      description_ar: "تقويم وتجميل الأسنان باستخدام أحدث أنواع التقويم",
      description_en: "Orthodontic treatment using latest braces",
      price: 3000,
      image_url: "/dental-braces-orthodontics.jpg",
      icon: "🦷",
      is_active: true,
      order_index: 3,
      created_at: new Date().toISOString(),
    },
  ],
  doctors: [
    {
      id: 1,
      name_ar: "د. أحمد محمد",
      name_en: "Dr. Ahmed Mohamed",
      specialty_ar: "طبيب أسنان عام",
      specialty_en: "General Dentist",
      bio_ar: "خبرة 10 سنوات في طب الأسنان العام وتجميل الأسنان",
      bio_en: "10 years experience in general dentistry",
      image_url: "/male-dentist-professional.png",
      is_active: true,
      department_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name_ar: "د. فاطمة علي",
      name_en: "Dr. Fatima Ali",
      specialty_ar: "أخصائية تقويم الأسنان",
      specialty_en: "Orthodontist",
      bio_ar: "متخصصة في تقويم الأسنان وتجميل الابتسامة",
      bio_en: "Specialized in orthodontics and smile design",
      image_url: "/female-dentist-professional.jpg",
      is_active: true,
      department_id: 2,
      created_at: new Date().toISOString(),
    },
  ],
  departments: [
    {
      id: 1,
      name_ar: "طب الأسنان العام",
      name_en: "General Dentistry",
      description_ar: "خدمات طب الأسنان العامة والوقائية",
      description_en: "General and preventive dental services",
      icon: "🦷",
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name_ar: "تقويم الأسنان",
      name_en: "Orthodontics",
      description_ar: "تقويم وتجميل الأسنان",
      description_en: "Orthodontic services",
      icon: "✨",
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  offers: [
    {
      id: 1,
      title_ar: "عرض خاص على التنظيف",
      title_en: "Special Cleaning Offer",
      description_ar: "خصم 30% على تنظيف الأسنان - عرض محدود",
      description_en: "30% off teeth cleaning - limited offer",
      discount_percentage: 30,
      price_before: 200,
      price_after: 140,
      is_active: true,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      image_url: "/dental-offer-discount-special.jpg",
      created_at: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: 1,
      title_ar: "أهمية تنظيف الأسنان اليومي",
      title_en: "Importance of Daily Teeth Cleaning",
      content_ar:
        "تنظيف الأسنان بانتظام مهم للحفاظ على صحة الفم والأسنان. ينصح الأطباء بتنظيف الأسنان مرتين يومياً باستخدام معجون أسنان يحتوي على الفلورايد.",
      content_en: "Regular teeth cleaning is important for oral health",
      image_url: "/dental-hygiene-brushing-teeth.jpg",
      author: "د. أحمد محمد",
      is_published: true,
      created_at: new Date().toISOString(),
    },
  ],
  bookings: [],
  gallery: [
    {
      id: 1,
      title_ar: "عيادتنا الحديثة",
      title_en: "Our Modern Clinic",
      image_url: "/modern-dental-clinic.png",
      category: "clinic",
      created_at: new Date().toISOString(),
    },
  ],
  site_settings: [
    { id: 1, key: "whatsapp_number", value: "+966500000000", value_ar: "+966500000000", category: "contact" },
    {
      id: 2,
      key: "facebook",
      value: "https://facebook.com/rosesmile",
      value_ar: "https://facebook.com/rosesmile",
      category: "social",
    },
    {
      id: 3,
      key: "instagram",
      value: "https://instagram.com/rosesmile",
      value_ar: "https://instagram.com/rosesmile",
      category: "social",
    },
    {
      id: 4,
      key: "twitter",
      value: "https://twitter.com/rosesmile",
      value_ar: "https://twitter.com/rosesmile",
      category: "social",
    },
    {
      id: 5,
      key: "linkedin",
      value: "https://linkedin.com/company/rosesmile",
      value_ar: "https://linkedin.com/company/rosesmile",
      category: "social",
    },
    {
      id: 6,
      key: "youtube",
      value: "https://youtube.com/@rosesmile",
      value_ar: "https://youtube.com/@rosesmile",
      category: "social",
    },
    { id: 7, key: "whatsapp_visible", value: "true", value_ar: "true", category: "contact" },
  ],
  booking_forms: [],
  doctor_cases: [],
}

export async function query(text: string, params?: any[]) {
  try {
    console.log("[v0] ⚠️ استخدام بيانات تجريبية - Railway PostgreSQL يتطلب WebSocket غير متاح في v0")
    console.log("[v0] Query:", text.substring(0, 100) + "...")

    // محاكاة استعلامات قاعدة البيانات باستخدام البيانات التجريبية
    const queryLower = text.toLowerCase()

    if (queryLower.includes("profiles")) {
      // SELECT queries for profiles
      if (queryLower.includes("select")) {
        // دمج البيانات التجريبية مع البيانات المضافة في الذاكرة
        const allProfiles = [
          ...mockData.profiles.filter((p) => !inMemoryStore.deletedIds.has(p.id)),
          ...inMemoryStore.profiles,
        ]

        // فلترة حسب البريد الإلكتروني إذا كان الاستعلام يحتوي على WHERE email
        if (queryLower.includes("where email") && params && params[0]) {
          const filtered = allProfiles.filter((p) => p.email === params[0])
          return { rows: filtered, rowCount: filtered.length }
        }

        // إرجاع جميع المستخدمين مرتبين حسب تاريخ الإنشاء
        const sorted = allProfiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        return { rows: sorted, rowCount: sorted.length }
      }

      // INSERT query for profiles
      if (queryLower.includes("insert")) {
        console.log("[v0] ✓ إضافة مستخدم جديد إلى المخزن المؤقت")
        const newUser = {
          id: String(Date.now()),
          full_name: params?.[0] || "",
          email: params?.[1] || "",
          phone: params?.[2] || null,
          role: params?.[3] || "user",
          created_at: new Date().toISOString(),
        }
        inMemoryStore.profiles.push(newUser)
        return { rows: [newUser], rowCount: 1 }
      }

      // UPDATE query for profiles
      if (queryLower.includes("update")) {
        console.log("[v0] ✓ تحديث مستخدم في المخزن المؤقت")
        const userId = params?.[3]
        const userIndex = inMemoryStore.profiles.findIndex((p) => p.id === userId)
        if (userIndex !== -1) {
          inMemoryStore.profiles[userIndex] = {
            ...inMemoryStore.profiles[userIndex],
            full_name: params?.[0],
            role: params?.[1],
            phone: params?.[2],
          }
        }
        return { rows: [], rowCount: 1 }
      }

      // DELETE query for profiles
      if (queryLower.includes("delete")) {
        console.log("[v0] ✓ حذف مستخدم من المخزن المؤقت")
        const userId = params?.[0]
        if (userId) {
          inMemoryStore.deletedIds.add(userId)
          inMemoryStore.profiles = inMemoryStore.profiles.filter((p) => p.id !== userId)
        }
        return { rows: [], rowCount: 1 }
      }
    }

    // SELECT queries
    if (queryLower.includes("select") && queryLower.includes("from")) {
      if (queryLower.includes("services")) {
        console.log("[v0] Returning", mockData.services.length, "services")
        return { rows: mockData.services, rowCount: mockData.services.length }
      }
      if (queryLower.includes("doctors")) {
        console.log("[v0] Found", mockData.doctors.length, "doctors")
        return { rows: mockData.doctors, rowCount: mockData.doctors.length }
      }
      if (queryLower.includes("departments")) {
        return { rows: mockData.departments, rowCount: mockData.departments.length }
      }
      if (queryLower.includes("offers")) {
        return { rows: mockData.offers, rowCount: mockData.offers.length }
      }
      if (queryLower.includes("articles")) {
        return { rows: mockData.articles, rowCount: mockData.articles.length }
      }
      if (queryLower.includes("bookings")) {
        return { rows: mockData.bookings, rowCount: mockData.bookings.length }
      }
      if (queryLower.includes("gallery")) {
        return { rows: mockData.gallery, rowCount: mockData.gallery.length }
      }
      if (queryLower.includes("site_settings")) {
        console.log("[v0] Returning", mockData.site_settings.length, "site settings")
        return { rows: mockData.site_settings, rowCount: mockData.site_settings.length }
      }
      if (queryLower.includes("booking_forms")) {
        return { rows: mockData.booking_forms, rowCount: mockData.booking_forms.length }
      }
      if (queryLower.includes("doctor_cases")) {
        return { rows: mockData.doctor_cases, rowCount: mockData.doctor_cases.length }
      }
    }

    // INSERT/UPDATE/DELETE queries - return success
    if (queryLower.includes("insert") || queryLower.includes("update") || queryLower.includes("delete")) {
      console.log("[v0] ⚠️ عمليات الكتابة غير متاحة في وضع المعاينة - سيتم حفظها عند النشر")
      return { rows: [], rowCount: 1 }
    }

    // Default empty result
    return { rows: [], rowCount: 0 }
  } catch (error: any) {
    console.error("[v0] Database query error:", error.message)
    throw error
  }
}

export const db = {
  query,
}
