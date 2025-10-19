-- إضافة عمود phone إلى جدول users إذا لم يكن موجوداً
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(50);
        RAISE NOTICE 'تم إضافة عمود phone بنجاح';
    ELSE
        RAISE NOTICE 'عمود phone موجود بالفعل';
    END IF;
END $$;

SELECT 'تم التحقق من عمود phone!' as message;
