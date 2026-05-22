import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params

  const { data: company, error } = await supabase
    .from('knowledge_companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !company) {
    notFound()
  }

  const { data: categories, error: categoriesError } = await supabase
    .from('knowledge_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (categoriesError) {
    return <div>Error: {categoriesError.message}</div>
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white">
        <div className="absolute left-[8%] top-8 h-12 w-12 animate-pulse rounded-full bg-white/10" />
        <div className="absolute bottom-8 right-[10%] h-16 w-16 animate-bounce rounded-full bg-white/10 [animation-duration:4s]" />
        <div className="absolute right-1/3 top-1/2 h-3 w-3 animate-ping rounded-full bg-white/40" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center text-center md:relative md:block">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl md:absolute md:left-0 md:top-1/2 md:mb-0 md:h-20 md:w-20 md:-translate-y-1/2">
              <img
                src={company.logo_url || 'https://www.magna.az/assets/img/icons/logo_red.png'}
                alt={company.name}
                className="h-11 w-auto object-contain md:h-14"
              />
            </div>

            <div className="mx-auto max-w-4xl">
              <p className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                Şirkət məlumatları
              </p>

              <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
                {company.name}
              </h1>

              <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-red-50 md:text-sm">
                Şirkətə aid qaydalar, öhdəliklər, məsuliyyətlər, təlimatlar və daxili məlumatlar.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center md:justify-start">
            <Link
              href="/"
              className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              ← Ana səhifəyə qayıt
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="absolute right-8 top-12 hidden h-20 w-20 animate-[float_7s_ease-in-out_infinite] rounded-full bg-red-100 md:block" />

        <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-red-600">
            Şirkət haqqında
          </p>

          <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
            Qısa məlumat
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-600 md:text-base">
            {company.description ||
              'Bu bölmədə şirkət haqqında qısa məlumat, fəaliyyət istiqamətləri və daxili iş prinsipləri təqdim olunacaq.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-red-600">
            Bölmələr
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            {company.name} üzrə məlumatlar
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Aşağıdakı bölmələrdə şirkətə aid qaydalar və məlumatlar yerləşdiriləcək.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((item, index) => (
            <Link
              key={item.id}
              href={`/companies/${company.slug}/${item.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
            >
              <div className="absolute right-[-35px] top-[-35px] h-28 w-28 rounded-full bg-red-50 transition group-hover:bg-red-100" />

              <div className="relative">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.name} üzrə məlumatlara bax
                </p>

                <div className="mt-5 text-sm font-semibold text-red-600">
                  Aç →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(8deg); }
        }
      `}</style>

      <footer className="bg-red-600 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
          <div>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white">
              <img
                src="https://www.magna.az/assets/img/icons/logo_red.png"
                alt="Cahan Holding"
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>

          <div className="space-y-4 text-sm leading-6">
            <p>📍 Bakı AZ1031, Azərbaycan, Babək pr. 21/99</p>
            <p>✉️ office@cahan.az</p>
            <p>☎ +994 12 310 00 85</p>
          </div>

          <div className="flex gap-3 md:justify-end">
            {['f', 'X', '◎', 'in'].map((item) => (
              <a
                key={item}
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 font-bold text-red-600 transition hover:scale-110 hover:bg-white"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/20 py-6">
          <div className="relative mx-auto flex h-8 w-full max-w-xl items-center justify-center overflow-hidden text-sm">
            <span className="relative z-10 whitespace-nowrap font-semibold text-white">
              © 1995 – 2026 <span style={{ color: '#000000' }}>Cahan Holding.</span>
            </span>

            <span
              style={{ backgroundColor: '#E7000B' }}
              className="absolute left-1/2 z-20 animate-[footerSlide_4s_ease-in-out_infinite] whitespace-nowrap font-semibold text-white"
            >
              Bütün hüquqlar qorunur.
            </span>
          </div>
        </div>

        <style>{`
          @keyframes floatReverse {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(16px) rotate(-8deg); }
          }

          @keyframes footerSlide {
            0% {
              transform: translateX(110px);
            }
            80% {
              transform: translateX(-6px);
            }
            100% {
              transform: translateX(110px);
            }
          }
        `}</style>
      </footer>
    </main>
  )
}