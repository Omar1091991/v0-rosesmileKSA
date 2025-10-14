import { createClient } from '@supabase/supabase-js'

// بيانات المسؤول الجديد
const ADMIN_EMAIL = 'omar1091991@gmail.com'
const ADMIN_PASSWORD = 'omar@9270'
const ADMIN_NAME = 'Omar'

// إنشاء عميل Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createAdminUser() {
  try {
    console.log('🔄 جاري إنشاء حساب المسؤول...')
    
    // إنشاء المستخدم
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_NAME
      }
    })

    if (authError) {
      console.error('❌ خطأ في إنشاء المستخدم:', authError.message)
      return
    }

    console.log('✅ تم إنشاء المستخدم بنجاح:', authData.user.id)

    // تحديث البروفايل ليكون مسؤول
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: 'admin',
        full_name: ADMIN_NAME
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('❌ خطأ في تحديث البروفايل:', profileError.message)
      return
    }

    console.log('✅ تم تعيين صلاحيات المسؤول بنجاح')
    console.log('\n📧 البريد الإلكتروني:', ADMIN_EMAIL)
    console.log('🔑 كلمة المرور:', ADMIN_PASSWORD)
    console.log('\n🔗 يمكنك الآن تسجيل الدخول من: /auth/login')
    
  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error)
  }
}

createAdminUser()
