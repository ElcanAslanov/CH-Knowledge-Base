import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type PageProps = {
  params: Promise<{
    slug: string
    category: string
  }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug, category } = await params

  const { data: company, error: companyError } = await supabase
    .from('knowledge_companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (companyError || !company) {
    notFound()
  }

  const { data: selectedCategory, error: categoryError } = await supabase
    .from('knowledge_categories')
    .select('*')
    .eq('slug', category)
    .single()

  if (categoryError || !selectedCategory) {
    notFound()
  }

  const { data: articles, error: articlesError } = await supabase
    .from('knowledge_articles')
    .select(`
      *,
      files:knowledge_article_files(*),
      article_companies:knowledge_article_companies(company_id)
    `)
    .eq('category_id', selectedCategory.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (articlesError) {
    return <div>Error: {articlesError.message}</div>
  }

  const filteredArticles =
    articles?.filter((article: any) =>
      article.article_companies?.some(
        (ac: any) => ac.company_id === company.id
      )
    ) || []

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white">
        <div className="absolute left-[8%] top-8 h-12 w-12 animate-pulse rounded-full bg-white/10" />
        <div className="absolute bottom-8 right-[10%] h-16 w-16 animate-bounce rounded-full bg-white/10 [animation-duration:4s]" />

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
              <h1 className="text-3xl font-extrabold md:text-5xl">
                {selectedCategory.name}
              </h1>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href={`/companies/${company.slug}`}
              className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              ← Geri
            </Link>

            <Link
              href="/"
              className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              Ana səhifə
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {filteredArticles.length > 0 ? (
          <div className="grid gap-6">
            {filteredArticles.map((article: any) => (
              <article
                key={article.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold">
                  {article.title}
                </h3>

                <div
                  className="article-content mt-5"
                  dangerouslySetInnerHTML={{
                    __html: article.content || '',
                  }}
                />

                {article.files && article.files.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <p className="mb-2 text-sm font-semibold">
                      Əlavə fayllar:
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {article.files.map((file: any) => (
                        <a
                          key={file.id}
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        >
                          📄 {file.file_name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p>Bu bölmə üçün məlumat yoxdur</p>
        )}
      </section>

      <style>{`
        .article-content {
          line-height: 2;
        }
      `}</style>
      
    </main>
  )
}