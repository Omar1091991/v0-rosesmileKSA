// نظام قاعدة البيانات مع التخزين الدائم
const STORAGE_KEY = "rosesmile_database"

// تعريف أنواع البيانات
interface InMemoryStore {
  profiles: any[]
  bookings: any[]
  booking_forms: any[]
  booking_form_services: any[]
  site_settings: any[]
  services: any[]
  doctors: any[]
  departments: any[]
  offers: any[]
  articles: any[]
  gallery: any[]
}

// تحميل البيانات من localStorage
function loadFromStorage(): InMemoryStore | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// حفظ البيانات في localStorage
function saveToStorage(data: InMemoryStore) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to storage:", error)
  }
}

import bcrypt from "bcryptjs"

// تهيئة المخزن
const storedData = loadFromStorage()
const inMemoryStore: InMemoryStore = storedData || {
  profiles: [],
  bookings: [],
  booking_forms: [],
  booking_form_services: [],
  site_settings: [],
  services: [],
  doctors: [],
  departments: [],
  offers: [],
  articles: [],
  gallery: [],
}

// التأكد من وجود booking_form_services
if (!inMemoryStore.booking_form_services) {
  inMemoryStore.booking_form_services = []
}

if (!storedData || inMemoryStore.profiles.length === 0) {
  try {
    // استخدام hashSync للتشفير المتزامن
    const defaultAdminPassword = bcrypt.hashSync("admin123", 10)
    const defaultAdmin = {
      id: "1",
      full_name: "مدير النظام",
      email: "admin@rosesmile.com",
      phone: "+966500000000",
      role: "admin",
      password: defaultAdminPassword,
      created_at: new Date().toISOString(),
    }
    inMemoryStore.profiles.push(defaultAdmin)
    saveToStorage(inMemoryStore)
    console.log("[v0] تم إنشاء مستخدم المدير الافتراضي بنجاح")
  } catch (error) {
    console.error("[v0] خطأ في إنشاء المستخدم الافتراضي:", error)
  }
}

// دالة الاستعلام الرئيسية
export async function query(text: string, params?: any[]) {
  const queryLower = text.toLowerCase().trim()

  // معالجة استعلامات profiles (المستخدمين)
  if (queryLower.includes("from profiles") || queryLower.includes("insert into profiles")) {
    if (queryLower.includes("insert")) {
      console.log("[v0] Creating new user with params:", params)
      const newUser = {
        id: String(Date.now()),
        full_name: params?.[0] || "",
        email: params?.[1] || "",
        phone: params?.[2] || null,
        role: params?.[3] || "user",
        password: params?.[4] || "",
        created_at: new Date().toISOString(),
      }
      console.log("[v0] New user object:", newUser)
      inMemoryStore.profiles.push(newUser)
      console.log("[v0] Total users after insert:", inMemoryStore.profiles.length)
      saveToStorage(inMemoryStore)
      console.log("[v0] User saved to localStorage")
      return { rows: [newUser], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      console.log("[v0] UPDATE profiles query:", text)
      console.log("[v0] UPDATE params:", params)
      console.log("[v0] Current profiles count:", inMemoryStore.profiles.length)

      const userId = params?.[params.length - 1]
      console.log("[v0] Looking for user with ID:", userId)

      const user = inMemoryStore.profiles.find((u) => u.id === userId)

      if (user) {
        console.log("[v0] Found user:", user.email, "- Current role:", user.role)

        // التحقق من عدد المعاملات لتحديد نوع التحديث
        if (params && params.length === 5) {
          // تحديث مع كلمة المرور: full_name, role, phone, password, id
          console.log("[v0] Updating with password (5 params)")
          user.full_name = params[0]
          user.role = params[1]
          user.phone = params[2]
          user.password = params[3]
        } else if (params && params.length === 4) {
          // تحديث بدون كلمة المرور: full_name, role, phone, id
          console.log("[v0] Updating without password (4 params)")
          user.full_name = params[0]
          user.role = params[1]
          user.phone = params[2]
        }

        console.log("[v0] Updated user data:", {
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          phone: user.phone,
        })

        saveToStorage(inMemoryStore)
        console.log("[v0] User saved to localStorage")
        console.log("[v0] Returning updated user")

        return { rows: [user], rowCount: 1 }
      }

      console.log("[v0] User not found for update:", userId)
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const userId = params?.[0]
      const index = inMemoryStore.profiles.findIndex((u) => u.id === userId)
      if (index !== -1) {
        inMemoryStore.profiles.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("where email")) {
      const email = params?.[0]
      const user = inMemoryStore.profiles.find((u) => u.email === email)
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 }
    }

    return { rows: inMemoryStore.profiles, rowCount: inMemoryStore.profiles.length }
  }

  // معالجة استعلامات bookings
  if (queryLower.includes("from bookings")) {
    if (queryLower.includes("insert")) {
      const newBooking = {
        id: String(Date.now()),
        full_name: params?.[0] || "",
        phone: params?.[1] || "",
        service_name: params?.[2] || "",
        service_id: params?.[3] || null,
        notes: params?.[4] || null,
        status: params?.[5] || "pending",
        booking_form_id: params?.[6] || null,
        contacted: false,
        contact_attempts: 0,
        admin_notes: null,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.bookings.push(newBooking)
      saveToStorage(inMemoryStore)
      return { rows: [newBooking], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const bookingId = params?.[params.length - 1]
      const booking = inMemoryStore.bookings.find((b) => b.id === bookingId)
      if (booking) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        if (setClause.includes("status")) booking.status = params?.[0]
        if (setClause.includes("contacted")) booking.contacted = params?.[0]
        if (setClause.includes("contact_attempts")) booking.contact_attempts = params?.[0]
        if (setClause.includes("admin_notes")) booking.admin_notes = params?.[0]
        saveToStorage(inMemoryStore)
        return { rows: [booking], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const bookingId = params?.[0]
      const index = inMemoryStore.bookings.findIndex((b) => b.id === bookingId)
      if (index !== -1) {
        inMemoryStore.bookings.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.bookings, rowCount: inMemoryStore.bookings.length }
  }

  // معالجة استعلامات booking_forms
  if (queryLower.includes("from booking_forms")) {
    if (queryLower.includes("insert")) {
      const newForm = {
        id: String(Date.now()),
        name_ar: params?.[0] || "",
        name_en: params?.[1] || "",
        description_ar: params?.[2] || "",
        description_en: params?.[3] || "",
        image_url: params?.[4] || null,
        is_main: params?.[5] || false,
        order_index: params?.[6] || 0,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.booking_forms.push(newForm)
      saveToStorage(inMemoryStore)
      return { rows: [newForm], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      if (queryLower.includes("is_main = false")) {
        inMemoryStore.booking_forms.forEach((form) => {
          form.is_main = false
        })
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }

      const formId = params?.[params.length - 1]
      const form = inMemoryStore.booking_forms.find((f) => f.id === formId)
      if (form) {
        if (params?.[0] !== undefined) form.name_ar = params[0]
        if (params?.[1] !== undefined) form.name_en = params[1]
        if (params?.[2] !== undefined) form.description_ar = params[2]
        if (params?.[3] !== undefined) form.description_en = params[3]
        if (params?.[4] !== undefined) form.image_url = params[4]
        if (params?.[5] !== undefined) form.is_main = params[5]
        if (params?.[6] !== undefined) form.order_index = params[6]
        saveToStorage(inMemoryStore)
        return { rows: [form], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const formId = params?.[0]
      const index = inMemoryStore.booking_forms.findIndex((f) => f.id === formId)
      if (index !== -1) {
        inMemoryStore.booking_forms.splice(index, 1)
        inMemoryStore.booking_form_services = inMemoryStore.booking_form_services.filter(
          (bfs) => bfs.booking_form_id !== formId,
        )
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.booking_forms, rowCount: inMemoryStore.booking_forms.length }
  }

  // معالجة استعلامات booking_form_services
  if (queryLower.includes("from booking_form_services") || queryLower.includes("booking_form_services bfs")) {
    if (queryLower.includes("insert")) {
      const newRelation = {
        booking_form_id: params?.[0],
        service_id: params?.[1],
      }
      inMemoryStore.booking_form_services.push(newRelation)
      saveToStorage(inMemoryStore)
      return { rows: [newRelation], rowCount: 1 }
    }

    if (queryLower.includes("delete")) {
      const formId = params?.[0]
      inMemoryStore.booking_form_services = inMemoryStore.booking_form_services.filter(
        (bfs) => bfs.booking_form_id !== formId,
      )
      saveToStorage(inMemoryStore)
      return { rows: [], rowCount: 1 }
    }

    if (queryLower.includes("join services")) {
      const formId = params?.[0]
      const formServices = inMemoryStore.booking_form_services.filter((bfs) => bfs.booking_form_id === formId)
      const services = formServices
        .map((bfs) => {
          const service = inMemoryStore.services.find((s) => s.id === bfs.service_id)
          return service ? { id: service.id, title_ar: service.title_ar, title_en: service.title_en } : null
        })
        .filter(Boolean)
      return { rows: services, rowCount: services.length }
    }

    return { rows: inMemoryStore.booking_form_services, rowCount: inMemoryStore.booking_form_services.length }
  }

  // معالجة استعلامات site_settings
  if (queryLower.includes("from site_settings")) {
    if (queryLower.includes("insert")) {
      const newSetting = {
        id: String(Date.now()),
        key: params?.[0] || "",
        value: params?.[1] || "",
        created_at: new Date().toISOString(),
      }
      inMemoryStore.site_settings.push(newSetting)
      saveToStorage(inMemoryStore)
      return { rows: [newSetting], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const key = params?.[params.length - 1]
      const setting = inMemoryStore.site_settings.find((s) => s.key === key)
      if (setting) {
        setting.value = params?.[0] || ""
        saveToStorage(inMemoryStore)
        return { rows: [setting], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const key = params?.[0]
      const index = inMemoryStore.site_settings.findIndex((s) => s.key === key)
      if (index !== -1) {
        inMemoryStore.site_settings.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("where key")) {
      const key = params?.[0]
      const setting = inMemoryStore.site_settings.find((s) => s.key === key)
      return { rows: setting ? [setting] : [], rowCount: setting ? 1 : 0 }
    }

    return { rows: inMemoryStore.site_settings, rowCount: inMemoryStore.site_settings.length }
  }

  // معالجة استعلامات services
  if (queryLower.includes("from services") || queryLower.includes("into services")) {
    if (queryLower.includes("insert")) {
      const newService = {
        id: String(Date.now()),
        title_ar: params?.[0] || "",
        title_en: params?.[1] || "",
        description_ar: params?.[2] || "",
        description_en: params?.[3] || "",
        image_url: params?.[4] || null,
        icon: params?.[5] || null,
        is_active: params?.[6] !== undefined ? params[6] : true,
        order_index: params?.[7] || 0,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.services.push(newService)
      saveToStorage(inMemoryStore)
      return { rows: [newService], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const serviceId = params?.[params.length - 1]
      const service = inMemoryStore.services.find((s) => s.id === serviceId)
      if (service) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            service[field] = params[index]
          }
        })

        saveToStorage(inMemoryStore)
        return { rows: [service], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const serviceId = params?.[0]
      const index = inMemoryStore.services.findIndex((s) => s.id === serviceId)
      if (index !== -1) {
        inMemoryStore.services.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.services, rowCount: inMemoryStore.services.length }
  }

  // معالجة استعلامات doctors
  if (queryLower.includes("from doctors") || queryLower.includes("into doctors")) {
    if (queryLower.includes("insert")) {
      const newDoctor = {
        id: String(Date.now()),
        name_ar: params?.[0] || "",
        name_en: params?.[1] || "",
        specialty_ar: params?.[2] || "",
        specialty_en: params?.[3] || "",
        bio_ar: params?.[4] || "",
        bio_en: params?.[5] || "",
        image_url: params?.[6] || null,
        is_active: params?.[7] !== undefined ? params[7] : true,
        order_index: params?.[8] || 0,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.doctors.push(newDoctor)
      saveToStorage(inMemoryStore)
      return { rows: [newDoctor], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const doctorId = params?.[params.length - 1]
      const doctor = inMemoryStore.doctors.find((d) => d.id === doctorId)
      if (doctor) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            doctor[field] = params[index]
          }
        })

        saveToStorage(inMemoryStore)
        return { rows: [doctor], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const doctorId = params?.[0]
      const index = inMemoryStore.doctors.findIndex((d) => d.id === doctorId)
      if (index !== -1) {
        inMemoryStore.doctors.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.doctors, rowCount: inMemoryStore.doctors.length }
  }

  // معالجة استعلامات departments
  if (queryLower.includes("from departments") || queryLower.includes("into departments")) {
    if (queryLower.includes("insert")) {
      const newDepartment = {
        id: String(Date.now()),
        name_ar: params?.[0] || "",
        name_en: params?.[1] || "",
        description_ar: params?.[2] || "",
        description_en: params?.[3] || "",
        image_url: params?.[4] || null,
        icon: params?.[5] || null,
        is_active: params?.[6] !== undefined ? params[6] : true,
        order_index: params?.[7] || 0,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.departments.push(newDepartment)
      saveToStorage(inMemoryStore)
      return { rows: [newDepartment], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const deptId = params?.[params.length - 1]
      const dept = inMemoryStore.departments.find((d) => d.id === deptId)
      if (dept) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            dept[field] = params[index]
          }
        })

        saveToStorage(inMemoryStore)
        return { rows: [dept], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const deptId = params?.[0]
      const index = inMemoryStore.departments.findIndex((d) => d.id === deptId)
      if (index !== -1) {
        inMemoryStore.departments.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.departments, rowCount: inMemoryStore.departments.length }
  }

  // معالجة استعلامات offers
  if (queryLower.includes("from offers") || queryLower.includes("into offers")) {
    if (queryLower.includes("insert")) {
      const newOffer = {
        id: String(Date.now()),
        title_ar: params?.[0] || "",
        title_en: params?.[1] || "",
        description_ar: params?.[2] || "",
        description_en: params?.[3] || "",
        image_url: params?.[4] || null,
        price_before: params?.[5] || null,
        price_after: params?.[6] || null,
        discount_percentage: params?.[7] || null,
        is_active: params?.[8] !== undefined ? params[8] : true,
        valid_until: params?.[9] || null,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.offers.push(newOffer)
      saveToStorage(inMemoryStore)
      return { rows: [newOffer], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const offerId = params?.[params.length - 1]
      const offer = inMemoryStore.offers.find((o) => o.id === offerId)
      if (offer) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            offer[field] = params[index]
          }
        })

        saveToStorage(inMemoryStore)
        return { rows: [offer], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const offerId = params?.[0]
      const index = inMemoryStore.offers.findIndex((o) => o.id === offerId)
      if (index !== -1) {
        inMemoryStore.offers.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.offers, rowCount: inMemoryStore.offers.length }
  }

  // معالجة استعلامات articles
  if (queryLower.includes("from articles") || queryLower.includes("into articles")) {
    if (queryLower.includes("insert")) {
      const newArticle = {
        id: String(Date.now()),
        title_ar: params?.[0] || "",
        title_en: params?.[1] || "",
        content_ar: params?.[2] || "",
        content_en: params?.[3] || "",
        image_url: params?.[4] || null,
        is_published: params?.[5] !== undefined ? params[5] : true,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.articles.push(newArticle)
      saveToStorage(inMemoryStore)
      return { rows: [newArticle], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const articleId = params?.[params.length - 1]
      const article = inMemoryStore.articles.find((a) => a.id === articleId)
      if (article) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            article[field] = params[index]
          }
        })

        saveToStorage(inMemoryStore)
        return { rows: [article], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const articleId = params?.[0]
      const index = inMemoryStore.articles.findIndex((a) => a.id === articleId)
      if (index !== -1) {
        inMemoryStore.articles.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.articles, rowCount: inMemoryStore.articles.length }
  }

  // معالجة استعلامات gallery
  if (queryLower.includes("from gallery") || queryLower.includes("into gallery")) {
    if (queryLower.includes("insert")) {
      const newGalleryItem = {
        id: String(Date.now()),
        title_ar: params?.[0] || "",
        title_en: params?.[1] || "",
        image_url: params?.[2] || "",
        order_index: params?.[3] || 0,
        created_at: new Date().toISOString(),
      }
      inMemoryStore.gallery.push(newGalleryItem)
      saveToStorage(inMemoryStore)
      return { rows: [newGalleryItem], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const galleryId = params?.[params.length - 1]
      const item = inMemoryStore.gallery.find((g) => g.id === galleryId)
      if (item) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            item[field] = params[index]
          }
        })

        saveToStorage(inMemoryStore)
        return { rows: [item], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const galleryId = params?.[0]
      const index = inMemoryStore.gallery.findIndex((g) => g.id === galleryId)
      if (index !== -1) {
        inMemoryStore.gallery.splice(index, 1)
        saveToStorage(inMemoryStore)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: inMemoryStore.gallery, rowCount: inMemoryStore.gallery.length }
  }

  // معالجة استعلامات COUNT
  if (queryLower.includes("count(*)")) {
    let count = 0
    if (queryLower.includes("from profiles")) count = inMemoryStore.profiles.length
    else if (queryLower.includes("from bookings")) count = inMemoryStore.bookings.length
    else if (queryLower.includes("from services")) count = inMemoryStore.services.length
    else if (queryLower.includes("from doctors")) count = inMemoryStore.doctors.length
    else if (queryLower.includes("from offers")) count = inMemoryStore.offers.length
    else if (queryLower.includes("from articles")) count = inMemoryStore.articles.length
    else if (queryLower.includes("from gallery")) count = inMemoryStore.gallery.length
    return { rows: [{ count }], rowCount: 1 }
  }

  // استعلام افتراضي
  return { rows: [], rowCount: 0 }
}

export const db = {
  query,
}
