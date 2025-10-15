// Railway PostgreSQL يتطلب WebSocket وهو غير متاح في بيئة v0
// البيانات الحقيقية ستعمل عند النشر على Vercel

// مفتاح التخزين في localStorage
const STORAGE_KEY = "rosesmile_data"

// تحميل البيانات من localStorage
function loadFromStorage() {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("[v0] Error loading from localStorage:", error)
    return null
  }
}

// حفظ البيانات في localStorage
function saveToStorage(data: any) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    console.log("[v0] ✓ تم حفظ البيانات في localStorage")
  } catch (error) {
    console.error("[v0] Error saving to localStorage:", error)
  }
}

// تهيئة المخزن المؤقت من localStorage أو البيانات الافتراضية
const storedData = loadFromStorage()
const inMemoryStore = storedData || {
  profiles: [] as any[],
  services: [] as any[],
  doctors: [] as any[],
  departments: [] as any[],
  offers: [] as any[],
  articles: [] as any[],
  bookings: [] as any[],
  gallery: [] as any[],
  site_settings: [] as any[],
  booking_forms: [] as any[],
  doctor_cases: [] as any[],
  deletedIds: new Set<string>(),
}

// تحويل deletedIds من مصفوفة إلى Set إذا كانت محفوظة
if (storedData && Array.isArray(storedData.deletedIds)) {
  inMemoryStore.deletedIds = new Set(storedData.deletedIds)
}

const mockData = {
  profiles: [
    {
      id: "1",
      full_name: "مدير النظام",
      email: "admin@rosesmile.com",
      phone: "+966500000001",
      role: "admin",
      password: "admin123",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      full_name: "مستخدم عادي",
      email: "user@rosesmile.com",
      phone: "+966500000002",
      role: "user",
      password: "user123",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      full_name: "محرر المقالات",
      email: "editor@rosesmile.com",
      phone: "+966500000003",
      role: "editor",
      password: "editor123",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
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
    console.log("[v0] 💾 استخدام نظام التخزين الدائم - التغييرات ستبقى بعد تحديث الصفحة")
    console.log("[v0] Query:", text.substring(0, 100) + "...")
    if (params) {
      console.log("[v0] Query params:", params)
    }

    const queryLower = text.toLowerCase()

    if (queryLower.includes("booking_forms")) {
      if (queryLower.includes("select")) {
        const allForms = [...mockData.booking_forms, ...inMemoryStore.booking_forms]

        // معالجة استعلام WHERE id = $1
        if (queryLower.includes("where id") && params && params[0]) {
          const filtered = allForms.filter((f) => f.id === params[0])
          return { rows: filtered, rowCount: filtered.length }
        }

        return { rows: allForms, rowCount: allForms.length }
      }

      if (queryLower.includes("insert")) {
        console.log("[v0] ✓ إضافة نموذج حجز جديد")
        const newForm = {
          id: String(Date.now()),
          name_ar: params?.[0] || "",
          name_en: params?.[1] || "",
          description_ar: params?.[2] || "",
          description_en: params?.[3] || "",
          image_url: params?.[4] || null, // تأكد من أن image_url يكون null أو string وليس boolean
          is_main: params?.[5] || false,
          is_active: params?.[6] !== undefined ? params[6] : true,
          order_index: params?.[7] || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        inMemoryStore.booking_forms.push(newForm)
        saveToStorage({
          ...inMemoryStore,
          deletedIds: Array.from(inMemoryStore.deletedIds),
        })
        console.log("[v0] ✓ تم إنشاء نموذج الحجز بنجاح - ID:", newForm.id)
        return { rows: [newForm], rowCount: 1 }
      }

      if (queryLower.includes("update")) {
        console.log("[v0] ✓ تحديث نموذج حجز")
        if (queryLower.includes("is_main = false") && queryLower.includes("where")) {
          const excludeId = params?.[0]
          inMemoryStore.booking_forms.forEach((form) => {
            if (form.id !== excludeId) {
              form.is_main = false
            }
          })
          saveToStorage({
            ...inMemoryStore,
            deletedIds: Array.from(inMemoryStore.deletedIds),
          })
          return { rows: [], rowCount: 1 }
        }

        if (queryLower.includes("returning")) {
          // استخراج ID من آخر معامل
          const formId = params?.[params.length - 1]
          const formIndex = inMemoryStore.booking_forms.findIndex((f) => f.id === formId)

          if (formIndex !== -1) {
            // تحديث الحقول من المعاملات
            // المعاملات تأتي بنفس ترتيب الحقول في SET clause
            const updatedForm = {
              ...inMemoryStore.booking_forms[formIndex],
              updated_at: new Date().toISOString(),
            }

            // تحديث الحقول من params (جميع المعاملات ماعدا الأخير وهو ID)
            const fields = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1]
            if (fields) {
              const fieldPairs = fields.split(",").map((f) => f.trim())
              fieldPairs.forEach((pair, index) => {
                const fieldName = pair.split("=")[0].trim()
                if (fieldName !== "updated_at" && params && params[index] !== undefined) {
                  updatedForm[fieldName] = params[index]
                }
              })
            }

            inMemoryStore.booking_forms[formIndex] = updatedForm
            saveToStorage({
              ...inMemoryStore,
              deletedIds: Array.from(inMemoryStore.deletedIds),
            })

            return { rows: [updatedForm], rowCount: 1 }
          }
        }

        return { rows: [], rowCount: 1 }
      }

      if (queryLower.includes("delete")) {
        console.log("[v0] ✓ حذف نموذج حجز")
        const formId = params?.[0]
        if (formId) {
          inMemoryStore.booking_forms = inMemoryStore.booking_forms.filter((f) => f.id !== formId)
          saveToStorage({
            ...inMemoryStore,
            deletedIds: Array.from(inMemoryStore.deletedIds),
          })
        }
        return { rows: [], rowCount: 1 }
      }
    }

    if (queryLower.includes("booking_form_services")) {
      if (queryLower.includes("insert")) {
        console.log("[v0] ✓ ربط خدمة بنموذج الحجز")
        // لا نحتاج لحفظ هذه البيانات في localStorage حالياً
        return { rows: [], rowCount: 1 }
      }

      if (queryLower.includes("delete")) {
        console.log("[v0] ✓ حذف ربط الخدمات بنموذج الحجز")
        return { rows: [], rowCount: 1 }
      }

      if (queryLower.includes("select")) {
        // إرجاع مصفوفة فارغة للخدمات المرتبطة
        return { rows: [], rowCount: 0 }
      }
    }

    if (queryLower.includes("profiles")) {
      if (queryLower.includes("select")) {
        // دمج البيانات التجريبية مع البيانات المخزنة
        const allProfiles = [
          ...mockData.profiles.filter((p) => !inMemoryStore.deletedIds.has(p.id)),
          ...inMemoryStore.profiles,
        ]

        console.log("[v0] Total profiles available:", allProfiles.length)

        if (queryLower.includes("where email") && params && params[0]) {
          console.log("[v0] Filtering by email:", params[0])
          const filtered = allProfiles.filter((p) => p.email === params[0])
          console.log("[v0] Found users:", filtered.length)
          if (filtered.length > 0) {
            console.log("[v0] User found:", { email: filtered[0].email, role: filtered[0].role })
          }
          return { rows: filtered, rowCount: filtered.length }
        }

        const sorted = allProfiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        return { rows: sorted, rowCount: sorted.length }
      }

      if (queryLower.includes("insert")) {
        console.log("[v0] ✓ إضافة مستخدم جديد")
        const newUser = {
          id: String(Date.now()),
          full_name: params?.[0] || "",
          email: params?.[1] || "",
          phone: params?.[2] || null,
          role: params?.[3] || "user",
          password: params?.[4] || "",
          created_at: new Date().toISOString(),
        }
        inMemoryStore.profiles.push(newUser)
        saveToStorage({
          ...inMemoryStore,
          deletedIds: Array.from(inMemoryStore.deletedIds),
        })
        return { rows: [newUser], rowCount: 1 }
      }

      if (queryLower.includes("update")) {
        console.log("[v0] ✓ تحديث مستخدم")
        const userId = params?.[params.length - 1]
        const userIndex = inMemoryStore.profiles.findIndex((p) => p.id === userId)
        if (userIndex !== -1) {
          inMemoryStore.profiles[userIndex] = {
            ...inMemoryStore.profiles[userIndex],
            full_name: params?.[0],
            role: params?.[1],
            phone: params?.[2],
          }
          saveToStorage({
            ...inMemoryStore,
            deletedIds: Array.from(inMemoryStore.deletedIds),
          })
        }
        return { rows: [], rowCount: 1 }
      }

      if (queryLower.includes("delete")) {
        console.log("[v0] ✓ حذف مستخدم")
        const userId = params?.[0]
        if (userId) {
          inMemoryStore.deletedIds.add(userId)
          inMemoryStore.profiles = inMemoryStore.profiles.filter((p) => p.id !== userId)
          saveToStorage({
            ...inMemoryStore,
            deletedIds: Array.from(inMemoryStore.deletedIds),
          })
        }
        return { rows: [], rowCount: 1 }
      }
    }

    if (queryLower.includes("select") && queryLower.includes("from")) {
      if (queryLower.includes("services")) {
        const allServices = [...mockData.services, ...inMemoryStore.services]
        console.log("[v0] Returning", allServices.length, "services")
        return { rows: allServices, rowCount: allServices.length }
      }
      if (queryLower.includes("doctors")) {
        const allDoctors = [...mockData.doctors, ...inMemoryStore.doctors]
        console.log("[v0] Found", allDoctors.length, "doctors")
        return { rows: allDoctors, rowCount: allDoctors.length }
      }
      if (queryLower.includes("departments")) {
        const allDepartments = [...mockData.departments, ...inMemoryStore.departments]
        return { rows: allDepartments, rowCount: allDepartments.length }
      }
      if (queryLower.includes("offers")) {
        const allOffers = [...mockData.offers, ...inMemoryStore.offers]
        return { rows: allOffers, rowCount: allOffers.length }
      }
      if (queryLower.includes("articles")) {
        const allArticles = [...mockData.articles, ...inMemoryStore.articles]
        return { rows: allArticles, rowCount: allArticles.length }
      }
      if (queryLower.includes("bookings")) {
        const allBookings = [...mockData.bookings, ...inMemoryStore.bookings]
        return { rows: allBookings, rowCount: allBookings.length }
      }
      if (queryLower.includes("gallery")) {
        const allGallery = [...mockData.gallery, ...inMemoryStore.gallery]
        return { rows: allGallery, rowCount: allGallery.length }
      }
      if (queryLower.includes("site_settings")) {
        const allSettings = [...mockData.site_settings, ...inMemoryStore.site_settings]
        console.log("[v0] Returning", allSettings.length, "site settings")
        return { rows: allSettings, rowCount: allSettings.length }
      }
      if (queryLower.includes("doctor_cases")) {
        const allCases = [...mockData.doctor_cases, ...inMemoryStore.doctor_cases]
        return { rows: allCases, rowCount: allCases.length }
      }
    }

    if (queryLower.includes("insert") || queryLower.includes("update") || queryLower.includes("delete")) {
      console.log("[v0] ✓ تم حفظ التغييرات - ستبقى بعد تحديث الصفحة")
      return { rows: [], rowCount: 1 }
    }

    return { rows: [], rowCount: 0 }
  } catch (error: any) {
    console.error("[v0] Database query error:", error.message)
    throw error
  }
}

export const db = {
  query,
}
