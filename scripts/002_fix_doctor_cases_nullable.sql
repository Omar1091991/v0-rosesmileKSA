-- Make title and description fields nullable in doctor_cases table
ALTER TABLE doctor_cases 
  ALTER COLUMN title_ar DROP NOT NULL,
  ALTER COLUMN title_en DROP NOT NULL,
  ALTER COLUMN description_ar DROP NOT NULL,
  ALTER COLUMN description_en DROP NOT NULL;
