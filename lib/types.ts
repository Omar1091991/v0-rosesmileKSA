export interface Service {
  id: string
  title_ar: string
  title_en?: string
  description_ar?: string
  description_en?: string
  image_url?: string
  icon?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  name_ar: string
  name_en?: string
  specialty_ar: string
  specialty_en?: string
  bio_ar?: string
  bio_en?: string
  image_url?: string
  qualifications_ar?: string[]
  qualifications_en?: string[]
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name_ar: string
  name_en?: string
  description_ar?: string
  description_en?: string
  image_url?: string
  icon?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  title_ar: string
  title_en?: string
  description_ar?: string
  description_en?: string
  image_url?: string
  price_before?: number
  price_after?: number
  discount_percentage?: number
  valid_from?: string
  valid_until?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title_ar: string
  title_en?: string
  content_ar?: string
  content_en?: string
  excerpt_ar?: string
  excerpt_en?: string
  image_url?: string
  author_id?: string
  slug?: string
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  full_name: string
  phone: string
  service_id?: string
  service_name?: string
  notes?: string
  status: string
  created_at: string
}

export interface GalleryItem {
  id: string
  image_url: string
  title_ar?: string
  title_en?: string
  category?: string
  order_index: number
  is_active: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value_ar?: string
  value_en?: string
  type: string
  updated_at: string
}
