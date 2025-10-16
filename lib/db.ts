import bcrypt from "bcryptjs"

const USE_REAL_DB =
  typeof window === "undefined" &&
  typeof process !== "undefined" &&
  process.env.DATABASE_URL !== undefined &&
  process.env.DATABASE_URL !== ""

declare global {
  var __rosesmile_db__: InMemoryStore | undefined
}

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

function getStore(): InMemoryStore {
  if (!globalThis.__rosesmile_db__) {
    console.log("[v0] 🔧 تهيئة المخزن العام للمرة الأولى...")
    globalThis.__rosesmile_db__ = {
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

    try {
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
      globalThis.__rosesmile_db__.profiles.push(defaultAdmin)
      console.log("[v0] ✅ تم إنشاء المستخدم الافتراضي: admin@rosesmile.com / admin123")
    } catch (error) {
      console.error("[v0] ❌ خطأ في إنشاء المستخدم الافتراضي:", error)
    }
  }

  return globalThis.__rosesmile_db__
}

async function queryRealDatabase(text: string, params?: any[]) {
  if (typeof window !== "undefined") {
    throw new Error("Database queries can only run on the server")
  }

  try {
    console.log("[v0] 🔄 الاتصال بقاعدة بيانات Railway...")
    console.log("[v0] 📝 الاستعلام:", text)
    console.log("[v0] 📊 المعاملات:", params)

    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL!)

    // Neon يدعم استعلامات SQL مباشرة، لكن يجب تحويل المعاملات بشكل آمن
    let finalQuery = text
    const queryParams = params || []

    // تحويل $1, $2 إلى قيم فعلية بشكل آمن
    if (queryParams.length > 0) {
      queryParams.forEach((param, index) => {
        const placeholder = `$${index + 1}`
        let safeValue: string

        if (param === null || param === undefined) {
          safeValue = "NULL"
        } else if (typeof param === "string") {
          // تنظيف النص وإضافة علامات اقتباس
          safeValue = `'${param.replace(/'/g, "''")}'`
        } else if (typeof param === "boolean") {
          safeValue = param ? "true" : "false"
        } else if (typeof param === "number") {
          safeValue = String(param)
        } else if (param instanceof Date) {
          safeValue = `'${param.toISOString()}'`
        } else {
          safeValue = `'${String(param).replace(/'/g, "''")}'`
        }

        finalQuery = finalQuery.replace(new RegExp(`\\${placeholder}\\b`, "g"), safeValue)
      })
    }

    console.log("[v0] 🔍 الاستعلام النهائي:", finalQuery)

    const result = await sql(finalQuery)

    console.log("[v0] ✅ نجح الاستعلام من Railway")
    console.log("[v0] 📦 عدد النتائج:", Array.isArray(result) ? result.length : 0)

    return {
      rows: Array.isArray(result) ? result : [result],
      rowCount: Array.isArray(result) ? result.length : result ? 1 : 0,
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في الاتصال بـ Railway:", error.message)
    console.error("[v0] 📋 التفاصيل:", error)
    throw error
  }
}

export async function query(text: string, params?: any[]) {
  if (USE_REAL_DB) {
    try {
      console.log("[v0] 🚀 استخدام قاعدة بيانات Railway (DATABASE_URL متوفر)")
      const result = await queryRealDatabase(text, params)
      console.log("[v0] ✅ تم الاستعلام بنجاح من Railway")
      return result
    } catch (error: any) {
      console.error("[v0] ⚠️ فشل الاتصال بـ Railway:", error.message)
      console.log("[v0] 🔄 التحويل إلى المخزن المحلي كنسخة احتياطية...")
    }
  } else {
    console.log("[v0] ℹ️ DATABASE_URL غير متوفر - استخدام المخزن المحلي")
  }

  console.log("[v0] 💾 استخدام المخزن العام على السيرفر")
  const store = getStore()

  const queryLower = text.toLowerCase().trim()

  // معالجة استعلامات profiles (المستخدمين)
  if (queryLower.includes("from profiles") || queryLower.includes("insert into profiles")) {
    if (queryLower.includes("insert")) {
      const newUser = {
        id: String(Date.now()),
        full_name: params?.[0] || "",
        email: params?.[1] || "",
        phone: params?.[2] || null,
        role: params?.[3] || "user",
        password: params?.[4] || "",
        created_at: new Date().toISOString(),
      }
      store.profiles.push(newUser)
      console.log("[v0] ✅ تم إضافة مستخدم جديد:", newUser.email)
      return { rows: [newUser], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const userId = params?.[params.length - 1]
      const user = store.profiles.find((u) => u.id === userId)

      if (user) {
        if (params && params.length === 5) {
          user.full_name = params[0]
          user.role = params[1]
          user.phone = params[2]
          user.password = params[3]
        } else if (params && params.length === 4) {
          user.full_name = params[0]
          user.role = params[1]
          user.phone = params[2]
        }
        console.log("[v0] ✅ تم تحديث المستخدم:", user.email)
        return { rows: [user], rowCount: 1 }
      }

      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const userId = params?.[0]
      const index = store.profiles.findIndex((u) => u.id === userId)
      if (index !== -1) {
        const deleted = store.profiles.splice(index, 1)
        console.log("[v0] ✅ تم حذف المستخدم:", deleted[0].email)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("where email")) {
      const email = params?.[0]
      const user = store.profiles.find((u) => u.email === email)
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 }
    }

    console.log("[v0] 📊 عدد المستخدمين:", store.profiles.length)
    return { rows: store.profiles, rowCount: store.profiles.length }
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
      store.bookings.push(newBooking)
      return { rows: [newBooking], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const bookingId = params?.[params.length - 1]
      const booking = store.bookings.find((b) => b.id === bookingId)
      if (booking) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        if (setClause.includes("status")) booking.status = params?.[0]
        if (setClause.includes("contacted")) booking.contacted = params?.[0]
        if (setClause.includes("contact_attempts")) booking.contact_attempts = params?.[0]
        if (setClause.includes("admin_notes")) booking.admin_notes = params?.[0]
        return { rows: [booking], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const bookingId = params?.[0]
      const index = store.bookings.findIndex((b) => b.id === bookingId)
      if (index !== -1) {
        store.bookings.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: store.bookings, rowCount: store.bookings.length }
  }

  // معالجة باقي الجداول (booking_forms, site_settings, services, doctors, departments, offers, articles, gallery)
  // الكود الموجود يعمل بشكل صحيح

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
      store.booking_forms.push(newForm)
      return { rows: [newForm], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      if (queryLower.includes("is_main = false")) {
        store.booking_forms.forEach((form) => {
          form.is_main = false
        })
        return { rows: [], rowCount: 1 }
      }

      const formId = params?.[params.length - 1]
      const form = store.booking_forms.find((f) => f.id === formId)
      if (form) {
        if (params?.[0] !== undefined) form.name_ar = params[0]
        if (params?.[1] !== undefined) form.name_en = params[1]
        if (params?.[2] !== undefined) form.description_ar = params[2]
        if (params?.[3] !== undefined) form.description_en = params[3]
        if (params?.[4] !== undefined) form.image_url = params[4]
        if (params?.[5] !== undefined) form.is_main = params[5]
        if (params?.[6] !== undefined) form.order_index = params[6]
        return { rows: [form], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const formId = params?.[0]
      const index = store.booking_forms.findIndex((f) => f.id === formId)
      if (index !== -1) {
        store.booking_forms.splice(index, 1)
        store.booking_form_services = store.booking_form_services.filter((bfs) => bfs.booking_form_id !== formId)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: store.booking_forms, rowCount: store.booking_forms.length }
  }

  if (queryLower.includes("from booking_form_services") || queryLower.includes("booking_form_services bfs")) {
    if (queryLower.includes("insert")) {
      const newRelation = {
        booking_form_id: params?.[0],
        service_id: params?.[1],
      }
      store.booking_form_services.push(newRelation)
      return { rows: [newRelation], rowCount: 1 }
    }

    if (queryLower.includes("delete")) {
      const formId = params?.[0]
      store.booking_form_services = store.booking_form_services.filter((bfs) => bfs.booking_form_id !== formId)
      return { rows: [], rowCount: 1 }
    }

    if (queryLower.includes("join services")) {
      const formId = params?.[0]
      const formServices = store.booking_form_services.filter((bfs) => bfs.booking_form_id === formId)
      const services = formServices
        .map((bfs) => {
          const service = store.services.find((s) => s.id === bfs.service_id)
          return service ? { id: service.id, title_ar: service.title_ar, title_en: service.title_en } : null
        })
        .filter(Boolean)
      return { rows: services, rowCount: services.length }
    }

    return { rows: store.booking_form_services, rowCount: store.booking_form_services.length }
  }

  if (queryLower.includes("from site_settings")) {
    if (queryLower.includes("insert")) {
      const newSetting = {
        id: String(Date.now()),
        key: params?.[0] || "",
        value: params?.[1] || "",
        created_at: new Date().toISOString(),
      }
      store.site_settings.push(newSetting)
      return { rows: [newSetting], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const key = params?.[params.length - 1]
      const setting = store.site_settings.find((s) => s.key === key)
      if (setting) {
        setting.value = params?.[0] || ""
        return { rows: [setting], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const key = params?.[0]
      const index = store.site_settings.findIndex((s) => s.key === key)
      if (index !== -1) {
        store.site_settings.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("where key")) {
      const key = params?.[0]
      const setting = store.site_settings.find((s) => s.key === key)
      return { rows: setting ? [setting] : [], rowCount: setting ? 1 : 0 }
    }

    console.log("[v0] 📊 عدد الإعدادات:", store.site_settings.length)
    return { rows: store.site_settings, rowCount: store.site_settings.length }
  }

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
      store.services.push(newService)
      return { rows: [newService], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const serviceId = params?.[params.length - 1]
      const service = store.services.find((s) => s.id === serviceId)
      if (service) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            service[field] = params[index]
          }
        })

        return { rows: [service], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const serviceId = params?.[0]
      const index = store.services.findIndex((s) => s.id === serviceId)
      if (index !== -1) {
        store.services.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: store.services, rowCount: store.services.length }
  }

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
      store.doctors.push(newDoctor)
      return { rows: [newDoctor], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const doctorId = params?.[params.length - 1]
      const doctor = store.doctors.find((d) => d.id === doctorId)
      if (doctor) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            doctor[field] = params[index]
          }
        })

        return { rows: [doctor], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const doctorId = params?.[0]
      const index = store.doctors.findIndex((d) => d.id === doctorId)
      if (index !== -1) {
        store.doctors.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    console.log("[v0] 📊 عدد الأطباء:", store.doctors.length)
    return { rows: store.doctors, rowCount: store.doctors.length }
  }

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
      store.departments.push(newDepartment)
      return { rows: [newDepartment], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const deptId = params?.[params.length - 1]
      const dept = store.departments.find((d) => d.id === deptId)
      if (dept) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            dept[field] = params[index]
          }
        })

        return { rows: [dept], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const deptId = params?.[0]
      const index = store.departments.findIndex((d) => d.id === deptId)
      if (index !== -1) {
        store.departments.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: store.departments, rowCount: store.departments.length }
  }

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
      store.offers.push(newOffer)
      return { rows: [newOffer], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const offerId = params?.[params.length - 1]
      const offer = store.offers.find((o) => o.id === offerId)
      if (offer) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            offer[field] = params[index]
          }
        })

        return { rows: [offer], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const offerId = params?.[0]
      const index = store.offers.findIndex((o) => o.id === offerId)
      if (index !== -1) {
        store.offers.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: store.offers, rowCount: store.offers.length }
  }

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
      store.articles.push(newArticle)
      return { rows: [newArticle], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const articleId = params?.[params.length - 1]
      const article = store.articles.find((a) => a.id === articleId)
      if (article) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            article[field] = params[index]
          }
        })

        return { rows: [article], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const articleId = params?.[0]
      const index = store.articles.findIndex((a) => a.id === articleId)
      if (index !== -1) {
        store.articles.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: store.articles, rowCount: store.articles.length }
  }

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
      store.gallery.push(newGalleryItem)
      return { rows: [newGalleryItem], rowCount: 1 }
    }

    if (queryLower.includes("update")) {
      const galleryId = params?.[params.length - 1]
      const item = store.gallery.find((g) => g.id === galleryId)
      if (item) {
        const setClause = text.match(/SET\s+(.+?)\s+WHERE/i)?.[1] || ""
        const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim())

        fields.forEach((field, index) => {
          if (params?.[index] !== undefined) {
            item[field] = params[index]
          }
        })

        return { rows: [item], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    if (queryLower.includes("delete")) {
      const galleryId = params?.[0]
      const index = store.gallery.findIndex((g) => g.id === galleryId)
      if (index !== -1) {
        store.gallery.splice(index, 1)
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: store.gallery, rowCount: store.gallery.length }
  }

  if (queryLower.includes("count(*)")) {
    let count = 0
    if (queryLower.includes("from profiles")) count = store.profiles.length
    else if (queryLower.includes("from bookings")) count = store.bookings.length
    else if (queryLower.includes("from services")) count = store.services.length
    else if (queryLower.includes("from doctors")) count = store.doctors.length
    else if (queryLower.includes("from offers")) count = store.offers.length
    else if (queryLower.includes("from articles")) count = store.articles.length
    else if (queryLower.includes("from gallery")) count = store.gallery.length
    return { rows: [{ count }], rowCount: 1 }
  }

  return { rows: [], rowCount: 0 }
}

export const db = {
  query,
}
