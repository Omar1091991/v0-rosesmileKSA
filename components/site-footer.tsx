import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">ابتسامة الورود</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              عيادات طبية متخصصة في مكة المكرمة نقدم أفضل الخدمات الطبية بأحدث التقنيات
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                الخدمات
              </Link>
              <Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                الأطباء
              </Link>
              <Link href="/departments" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                الأقسام
              </Link>
              <Link href="/offers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                العروض
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تواصل معنا</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+966 12 345 6789</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@rosesmileksa.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>مكة المكرمة، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ساعات العمل</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>السبت - الخميس</p>
              <p className="font-medium text-foreground">9 صباحاً - 10 مساءً</p>
              <p className="text-xs mt-4">الجمعة: مغلق</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© 2025 عيادات ابتسامة الورود. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
