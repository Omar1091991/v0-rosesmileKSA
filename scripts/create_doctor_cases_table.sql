-- Create doctor_cases table for before/after images
CREATE TABLE IF NOT EXISTS doctor_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  title_ar TEXT,
  title_en TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  description_ar TEXT,
  description_en TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for doctor_cases
ALTER TABLE doctor_cases DISABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_doctor_cases_doctor_id ON doctor_cases(doctor_id);
