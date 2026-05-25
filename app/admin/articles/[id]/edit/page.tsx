'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [companies, setCompanies] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [existingFiles, setExistingFiles] = useState<any[]>([])
  const [newFiles, setNewFiles] = useState<FileList | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: comp } = await supabase
      .from('knowledge_companies')
      .select('*')
      .order('sort_order', { ascending: true })

    const { data: cat } = await supabase
      .from('knowledge_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    const { data: article, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .eq('id', id)
      .single()

    const { data: relations } = await supabase
      .from('knowledge_article_companies')
      .select('company_id')
      .eq('article_id', id)

    const { data: files } = await supabase
      .from('knowledge_article_files')
      .select('*')
      .eq('article_id', id)

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setCompanies(comp || [])
    setCategories(cat || [])
    setExistingFiles(files || [])

    setSelectedCompanyIds((relations || []).map((r: any) => r.company_id))
    setCategoryId(article.category_id || '')
    setTitle(article.title || '')
    setSlug(article.slug || '')
    setContent(article.content || '')
    setIsActive(article.is_active ?? true)

    setLoading(false)
  }

  const toggleCompany = (companyId: string) => {
    setSelectedCompanyIds((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    )
  }

  const uploadFiles = async () => {
    if (!newFiles || newFiles.length === 0) return

    for (const file of Array.from(newFiles)) {
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
          article_id: id,
          file_name: file.name,
          file_url: data.publicUrl,
        },
      ])
    }
  }

  const deleteFile = async (fileId: string) => {
    const ok = confirm('Faylı silmək istəyirsiniz?')

    if (!ok) return

    const { error } = await supabase
      .from('knowledge_article_files')
      .delete()
      .eq('id', fileId)

    if (error) {
      alert(error.message)
      return
    }

    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCompanyIds.length === 0) {
      alert('Ən azı bir şirkət seçilməlidir')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('knowledge_articles')
      .update({
        category_id: categoryId,
        title,
        slug,
        content,
        is_active: isActive,
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      setSaving(false)
      return
    }

    await supabase
      .from('knowledge_article_companies')
      .delete()
      .eq('article_id', id)

    const relations = selectedCompanyIds.map((companyId) => ({
      article_id: id,
      company_id: companyId,
    }))

    await supabase
      .from('knowledge_article_companies')
      .insert(relations)

    await uploadFiles()

    setSaving(false)

    alert('Məqalə yeniləndi')
    router.push('/admin/articles')
  }

  if (loading) {
    return (
      <main className="p-4 md:p-10">
        <p className="text-sm text-slate-500">Yüklənir...</p>
      </main>
    )
  }

  return (
    <main className="p-4 md:p-10">
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-red-600"
        >
          ← Məqalələrə qayıt
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          Məqaləni düzəlt
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
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
        </div>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        >
          <option value="">Bölmə seç</option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlıq"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        />

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder="Məqalə mətni"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 leading-7"
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Yeni fayl əlavə et
          </label>

          <input
            type="file"
            multiple
            onChange={(e) => setNewFiles(e.target.files)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </div>

        {existingFiles.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Mövcud fayllar
            </p>

            <div className="space-y-3">
              {existingFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <a
                    href={file.file_url}
                    target="_blank"
                    className="text-sm font-semibold text-red-600"
                  >
                    📄 {file.file_name}
                  </a>

                  <button
                    type="button"
                    onClick={() => deleteFile(file.id)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Aktiv məqalə kimi göstər
        </label>

        <button
          disabled={saving}
          className="w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
        </button>
      </form>
    </main>
  )
}