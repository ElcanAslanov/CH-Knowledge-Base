'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewArticlePage() {
  const router = useRouter()

  const [companies, setCompanies] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')

  const [files, setFiles] = useState<FileList | null>(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: comp } = await supabase
      .from('knowledge_companies')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const { data: cat } = await supabase
      .from('knowledge_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    setCompanies(comp || [])
    setCategories(cat || [])
  }

  const toggleCompany = (id: string) => {
    setSelectedCompanyIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }

  const uploadFiles = async (articleId: string) => {
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`

      const filePath = `articles/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('article_files')
        .upload(filePath, file, {
          upsert: true,
        })

      if (uploadError) {
        alert(uploadError.message)
        continue
      }

      const { data } = supabase.storage
        .from('article_files')
        .getPublicUrl(filePath)

      await supabase.from('knowledge_article_files').insert([
        {
          article_id: articleId,
          file_name: file.name,
          file_url: data.publicUrl,
        },
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCompanyIds.length === 0) {
      alert('Ən azı bir şirkət seçilməlidir')
      return
    }

    setLoading(true)

    const { data: article, error } = await supabase
      .from('knowledge_articles')
      .insert([
        {
          category_id: categoryId,
          title,
          slug,
          content,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error || !article) {
      setLoading(false)
      alert(error?.message || 'Məqalə əlavə olunmadı')
      return
    }

    const relations = selectedCompanyIds.map((companyId) => ({
      article_id: article.id,
      company_id: companyId,
    }))

    const { error: relationError } = await supabase
      .from('knowledge_article_companies')
      .insert(relations)

    if (relationError) {
      setLoading(false)
      alert(relationError.message)
      return
    }

    await uploadFiles(article.id)

    setLoading(false)

    alert('Məqalə əlavə olundu')
    router.push('/admin/articles')
  }

  return (
    <main className="p-4 md:p-10">
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:text-red-600"
        >
          ← Məqalələrə qayıt
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold">
          Yeni Məqalə
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Məqaləni bir və ya bir neçə şirkətə aid edə bilərsən.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-3xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Şirkətlər
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            {companies.map((company) => {
              const active = selectedCompanyIds.includes(company.id)

              return (
                <button
                  type="button"
                  key={company.id}
                  onClick={() => toggleCompany(company.id)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {company.name}
                </button>
              )
            })}
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Seçilən şirkət sayı: {selectedCompanyIds.length}
          </p>
        </div>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border p-3"
          required
        >
          <option value="">Bölmə seç</option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Başlıq"
          className="w-full rounded-xl border p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Slug (məs: is-saatlari)"
          className="w-full rounded-xl border p-3"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />

        <textarea
          placeholder="Məqalə mətni"
          rows={10}
          className="w-full rounded-xl border p-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Fayl əlavə et
          </label>

          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full rounded-xl border p-3"
          />

          <p className="mt-2 text-xs text-slate-400">
            PDF, DOCX, XLSX və digər faylları əlavə edə bilərsən.
          </p>
        </div>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white"
        >
          {loading ? 'Yüklənir...' : 'Əlavə et'}
        </button>
      </form>
    </main>
  )
}