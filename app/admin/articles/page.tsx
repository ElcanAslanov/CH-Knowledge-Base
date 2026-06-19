'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadArticles = async () => {
    setLoading(true)

    const { data: articleData, error: articleError } = await supabase
      .from('knowledge_articles')
      .select(`
        *,
        category:knowledge_categories(name, slug)
      `)
      .order('created_at', { ascending: false })

    if (articleError) {
      alert(articleError.message)
      setLoading(false)
      return
    }

    const articleIds = (articleData || []).map((article: any) => article.id)

    if (articleIds.length === 0) {
      setArticles([])
      setLoading(false)
      return
    }

    const { data: relationData, error: relationError } = await supabase
      .from('knowledge_article_companies')
      .select('article_id, company_id')
      .in('article_id', articleIds)

    if (relationError) {
      alert(relationError.message)
      setArticles(articleData || [])
      setLoading(false)
      return
    }

    const companyIds = Array.from(
      new Set((relationData || []).map((item: any) => item.company_id))
    ).filter(Boolean)

    let companyMap: Record<string, any> = {}

    if (companyIds.length > 0) {
      const { data: companyData, error: companyError } = await supabase
        .from('knowledge_companies')
        .select('id, name, slug')
        .in('id', companyIds)

      if (companyError) {
        alert(companyError.message)
      } else {
        companyMap = (companyData || []).reduce((acc: any, company: any) => {
          acc[company.id] = company
          return acc
        }, {})
      }
    }

    const finalArticles = (articleData || []).map((article: any) => {
      const articleRelations = (relationData || []).filter(
        (relation: any) => relation.article_id === article.id
      )

      const companies = articleRelations
        .map((relation: any) => companyMap[relation.company_id])
        .filter(Boolean)

      return {
        ...article,
        companies,
      }
    })

    setArticles(finalArticles)
    setLoading(false)
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const deleteArticle = async (id: string) => {
    const ok = confirm('Bu məqaləni silmək istədiyinizə əminsiniz?')

    if (!ok) return

    await supabase
      .from('knowledge_article_companies')
      .delete()
      .eq('article_id', id)

    await supabase
      .from('knowledge_article_files')
      .delete()
      .eq('article_id', id)

    const { error } = await supabase
      .from('knowledge_articles')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    alert('Məqalə silindi')
    loadArticles()
  }

  return (
    <main className="p-4 md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Məqalələr
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Şirkətlərə və bölmələrə aid məlumatları buradan idarə edə bilərsiniz.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
        >
          + Yeni məqalə
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.3fr_1fr_1fr_120px_180px] border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 md:grid">
          <div>Başlıq</div>
          <div>Şirkət</div>
          <div>Bölmə</div>
          <div>Status</div>
          <div>Əməliyyat</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Yüklənir...</div>
        ) : articles.length > 0 ? (
          articles.map((article: any) => (
            <div
              key={article.id}
              className="grid gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 md:grid-cols-[1.3fr_1fr_1fr_120px_180px] md:items-center"
            >
              <div>
                <h2 className="font-bold text-slate-900">
                  {article.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {article.slug}
                </p>
              </div>

              <div className="text-sm text-slate-600">
                {article.companies?.length
                  ? article.companies
                      .map((company: any) => company.name)
                      .join(', ')
                  : '—'}
              </div>

              <div className="text-sm text-slate-600">
                {article.category?.name || '—'}
              </div>

              <div>
                {article.is_active ? (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Aktiv
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    Passiv
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  Düzəlt
                </Link>

                <button
                  onClick={() => deleteArticle(article.id)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-sm text-slate-500">
            Hələ məqalə əlavə edilməyib.
          </div>
        )}
      </div>
    </main>
  )
}