import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type PageProps = {
  params: Promise<{
    slug: string
    category: string
    article: string
  }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug, category, article } = await params

  const { data: company } = await supabase
    .from('knowledge_companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!company) notFound()

  const { data: selectedCategory } = await supabase
    .from('knowledge_categories')
    .select('*')
    .eq('slug', category)
    .single()

  if (!selectedCategory) notFound()

  const { data: selectedArticle } = await supabase
    .from('knowledge_articles')
    .select('*')
    .eq('company_id', company.id)
    .eq('category_id', selectedCategory.id)
    .eq('slug', article)
    .eq('is_active', true)
    .single()

  if (!selectedArticle) notFound()

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white">
        <div className="absolute left-[8%] top-8 h-12 w-12 animate-pulse rounded-full bg-white/10" />
        <div className="absolute bottom-8 right-[10%] h-16 w-16 animate-bounce rounded-full bg-white/10 [animation-duration:4s]" />
        <div className="absolute right-1/3 top-1/2 h-3 w-3 animate-ping rounded-full bg-white/40" />

        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <Link
            href={`/companies/${company.slug}/${selectedCategory.slug}`}
            className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
          >
            ← Geri qayıt
          </Link>

          <p className="mt-8 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
            {company.name} / {selectedCategory.name}
          </p>

          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl">
            {selectedArticle.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }}
          />
        </article>
      </section>

      <style>{`
        .article-content {
          color: #334155;
          font-size: 15px;
          line-height: 2;
        }

        .article-content h1 {
          font-size: 30px;
          font-weight: 800;
          color: #0f172a;
          margin: 24px 0 14px;
        }

        .article-content h2 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 22px 0 12px;
        }

        .article-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 18px 0 10px;
        }

        .article-content p {
          margin: 12px 0;
        }

        .article-content ul,
        .article-content ol {
          padding-left: 24px;
          margin: 14px 0;
        }

        .article-content ul {
          list-style: disc;
        }

        .article-content ol {
          list-style: decimal;
        }

        .article-content li {
          margin: 8px 0;
        }

        .article-content b,
        .article-content strong {
          font-weight: 800;
          color: #111827;
        }

        .article-content a {
          color: #dc2626;
          font-weight: 600;
          text-decoration: underline;
        }
      `}</style>
      
    </main>
  )
}