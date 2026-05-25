import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const { data: companies, error } = await supabase
    .from('knowledge_companies')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-[70px_1fr_70px] items-center px-4 py-5 md:grid-cols-[90px_1fr_90px] md:px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src="https://www.magna.az/assets/img/icons/logo_red.png"
              alt="Cahan Holding"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-extrabold tracking-[0.18em] text-slate-900 md:text-3xl">
              CAHAN HOLDING
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-slate-500 md:text-sm">
              Şirkətin strukturu və fəaliyyət prinsipləri haqqında məlumat platforması
            </p>
          </div>

          <div />
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white">
        <div className="absolute left-[8%] top-10 h-16 w-16 animate-pulse rounded-full bg-white/10" />
        <div className="absolute bottom-12 right-[10%] h-24 w-24 animate-bounce rounded-full bg-white/10 [animation-duration:4s]" />
        <div className="absolute right-1/3 top-1/2 h-3 w-3 animate-ping rounded-full bg-white/40" />
        <div className="absolute left-1/4 top-24 h-2 w-2 animate-ping rounded-full bg-white/50 [animation-delay:1s]" />
        <div className="absolute bottom-24 left-[12%] h-20 w-20 animate-[float_6s_ease-in-out_infinite] rounded-3xl border border-white/20 bg-white/10" />
        <div className="absolute right-[18%] top-20 h-14 w-14 animate-[floatReverse_7s_ease-in-out_infinite] rounded-full border border-white/20 bg-white/10" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:px-6 md:py-24">
          <p className="mx-auto mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold md:text-sm">
            Korporativ Bilik Bazası
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight md:text-6xl">
            Cahan Holding məlumatları bir platformada
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-red-50 md:text-base md:leading-8">
            Şirkət haqqında ümumi məlumatlar, daxili qaydalar, prosedurlar,
            təlimatlar və şirkətlər üzrə məlumatlar əməkdaşlar üçün rahat və
            sistemli formada təqdim olunur.
          </p>

          <form action="/search" className="mx-auto mt-8 max-w-2xl">
            <input
              name="q"
              type="text"
              placeholder="Qayda, prosedur və ya şirkət adı axtar..."
              className="w-full rounded-2xl border border-white/20 bg-white px-5 py-4 text-sm text-slate-900 shadow-xl outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/30"
            />
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-red-600">
              Cahan Holding
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Şirkət haqqında ümumi məlumat
            </h2>
            <p className="mt-5 text-sm leading-8 text-slate-600 md:text-base">
              Bu bölmədə Cahan Holding-in tarixi, vizyonu, fəaliyyət istiqamətləri,
              idarəetmə prinsipləri və daxili korporativ yanaşması haqqında əsas
              məlumatlar təqdim olunacaq.
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="absolute -right-4 -top-4 h-20 w-20 animate-[float_6s_ease-in-out_infinite] rounded-full bg-red-100" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 animate-[floatReverse_7s_ease-in-out_infinite] rounded-3xl bg-slate-100" />

            <div className="relative space-y-6">
              {[
                ['Tarix', 'Cahan Holding-in yaranma tarixi, inkişaf mərhələləri və əsas fəaliyyət istiqamətləri burada yerləşdiriləcək.'],
                ['Vizyon', 'Şirkətin gələcəyə baxışı, strateji hədəfləri və inkişaf prioritetləri haqqında məlumat veriləcək.'],
                ['Fəaliyyət prinsipləri', 'Peşəkarlıq, məsuliyyət, şəffaflıq, əməkdaşlıq və davamlı inkişaf prinsipləri bu bölmədə izah olunacaq.'],
              ].map(([title, desc]) => (
                <div key={title} className="border-l-4 border-red-600 pl-5">
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="companies" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-red-600">
              Şirkətlər
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Holding daxili şirkətlər
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Hər şirkətin öz qaydaları, prosedurları, təlimatları və sənədləri
              ayrıca bölmədə göstəriləcək.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies?.map((company) => (
              <div
                key={company.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfbfc] p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-red-100 transition group-hover:bg-red-200" />

                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <img
                      src={
                        company.logo_url ||
                        'https://www.magna.az/assets/img/icons/logo_red.png'
                      }
                      alt={company.name}
                      className="h-10 w-auto object-contain"
                    />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-slate-900">
                    {company.name}
                  </h3>

                  <p className="min-h-[48px] text-sm leading-6 text-slate-600">
                    {company.name} haqqında ümumi məlumat
                  </p>

                  <div className="mt-6 text-sm font-semibold text-red-600">
                    <Link
                      href={`/companies/${company.slug}`}
                      className="mt-6 inline-flex text-sm font-semibold text-red-600 transition hover:text-red-700"
                    >
                      Ətraflı bax →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

            <span style={{ backgroundColor: '#E7000B' }} className="absolute left-1/2 z-20 animate-[footerSlide_4s_ease-in-out_infinite] whitespace-nowrap font-semibold text-white">
              Bütün hüquqlar qorunur.
            </span>
          </div>
        </div>

        <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-18px) rotate(8deg); }
    }

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