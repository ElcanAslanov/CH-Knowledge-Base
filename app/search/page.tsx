import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  let results: any[] = []

  if (query) {
    const { data, error } = await supabase
      .from('knowledge_articles')
      .select(`
        *,
        category:knowledge_categories(name, slug),
        article_companies:knowledge_article_companies(
          company:knowledge_companies(name, slug)
        )
      `)
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)

    if (!error) {
      results = data || []
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <section className="bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <Link
            href="/"
            className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
          >
            ← Ana səhifə
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold md:text-5xl">
            Axtarış
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-red-50">
            Qayda, prosedur, təlimat və sənədləri axtar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <form className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            name="q"
            defaultValue={query}
            placeholder="Məs: məzuniyyət, ezamiyyət, iş saatları..."
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
          />
        </form>

        <div className="mt-8">
          {!query ? (
            <p className="text-sm text-slate-500">
              Axtarış üçün yuxarıdakı xanaya söz yaz.
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-slate-500">
              “{query}” üzrə nəticə tapılmadı.
            </p>
          ) : (
            <div className="grid gap-4">
              {results.map((article: any) => (
                <div
                  key={article.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-slate-900">
                    {article.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {article.content?.replace(/<[^>]*>/g, '').slice(0, 180)}...
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.article_companies?.map((rel: any, index: number) => (
                      <Link
                        key={index}
                        href={`/companies/${rel.company.slug}/${article.category.slug}`}
                        className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        {rel.company.name} / {article.category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}