"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { query } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DepartmentsPage() {
  let departments = []
  try {
    const result = await query("SELECT * FROM departments WHERE is_active = true ORDER BY order_index")
    departments = result.rows || []
  } catch (error) {
    console.error("[v0] Error fetching departments:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">أقسامنا الطبية</h1>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                أقسام طبية متخصصة مجهزة بأحدث التقنيات لتقديم أفضل رعاية صحية
              </p>
            </div>
          </div>
        </section>

        {/* Departments Grid */}
        <section className="py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {departments?.map((department) => (
                <Card key={department.id} className="hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                  <CardContent className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 p-2 sm:p-4 flex flex-col flex-1">
                    {department.image_url ? (
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={department.image_url || "/placeholder.svg"}
                          alt={department.name_ar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-3xl sm:text-4xl md:text-5xl">
                        {department.icon || "🏥"}
                      </div>
                    )}
                    <div className="space-y-1 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold line-clamp-2">{department.name_ar}</h3>
                      <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm line-clamp-2 hidden sm:block">
                        {department.description_ar}
                      </p>
                    </div>
                    <Link href="/booking/1">
                      <button className="w-full py-1.5 sm:py-2 px-2 sm:px-3 bg-primary text-primary-foreground text-xs sm:text-sm rounded-md hover:bg-primary/90 transition-colors mt-auto">
                        احجز موعد
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!departments || departments.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">لا توجد أقسام متاحة حالياً</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">نحن هنا لخدمتك</h2>
              <p className="text-lg text-muted-foreground">احجز موعدك في القسم المناسب لك</p>
              <Link href="/booking/1">
                <button
                  className="py-3 px-8 text-white rounded-lg transition-colors text-lg font-semibold"
                  style={{ backgroundColor: "#1a4f8b" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                >
                  احجز موعد
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
