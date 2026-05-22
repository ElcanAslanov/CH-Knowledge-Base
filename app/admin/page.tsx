import Link from 'next/link'

export default function AdminPage() {
  const cards = [
    {
      title: 'Şirkətlər',
      desc: 'Holding daxilindəki şirkətləri əlavə et və idarə et.',
      href: '/admin/companies',
      count: '01',
    },
    {
      title: 'Bölmələr',
      desc: 'Qaydalar, təlimatlar, məzuniyyət və digər bölmələr.',
      href: '/admin/categories',
      count: '02',
    },
    {
      title: 'Məqalələr',
      desc: 'Şirkətlərə aid qayda və məlumat mətnlərini idarə et.',
      href: '/admin/articles',
      count: '03',
    },
    
  ]

  return (
    <main className="p-4 md:p-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-700 via-red-600 to-red-500 p-6 text-white shadow-xl md:p-10">
        <div className="absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute bottom-[-70px] left-[-60px] h-48 w-48 rounded-full bg-black/10" />

        <div className="relative">
          <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
            İdarəetmə paneli
          </p>

          <h1 className="text-3xl font-extrabold md:text-5xl">
            Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-red-50">
            Şirkətlər, bölmələr, məqalələr və fayllar buradan idarə olunacaq.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
          >
            <div className="absolute right-[-35px] top-[-35px] h-28 w-28 rounded-full bg-red-50 transition group-hover:bg-red-100" />

            <div className="relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/20">
                {card.count}
              </div>

              <h2 className="text-xl font-extrabold text-slate-900">
                {card.title}
              </h2>

              <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                {card.desc}
              </p>

              <div className="mt-6 text-sm font-semibold text-red-600">
                İdarə et →
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">
            Növbəti addımlar
          </h2>

          <div className="mt-5 space-y-4">
            {[
              'Şirkət əlavə etmə və redaktə funksiyası',
              'Məqalə əlavə etmə formu',
              'Fayl upload sistemi',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                  ✓
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">
            Status
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            Public səhifələr, şirkət səhifələri, bölmə səhifələri, məqalə mətni
            və fayl göstərmə sistemi artıq işlək vəziyyətdədir.
          </p>
        </div>
      </section>
    </main>
  )
}