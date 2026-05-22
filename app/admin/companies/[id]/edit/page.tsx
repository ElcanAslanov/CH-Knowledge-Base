'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCompany()
  }, [])

  const loadCompany = async () => {
    const { data, error } = await supabase
      .from('knowledge_companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setName(data.name || '')
    setSlug(data.slug || '')
    setDescription(data.description || '')
    setLogoUrl(data.logo_url || '')
    setIsActive(data.is_active ?? true)
    setLoading(false)
  }

  const uploadLogoIfNeeded = async () => {
    if (!logoFile) {
      return logoUrl
    }

    const fileExt = logoFile.name.split('.').pop()
    const fileName = `${slug || id}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('company_logos')
      .upload(filePath, logoFile, {
        upsert: true,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('company_logos')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const finalLogoUrl = await uploadLogoIfNeeded()

      const { error } = await supabase
        .from('knowledge_companies')
        .update({
          name,
          slug,
          description,
          logo_url: finalLogoUrl,
          is_active: isActive,
        })
        .eq('id', id)

      if (error) {
        alert(error.message)
        setSaving(false)
        return
      }

      alert('Şirkət məlumatları yeniləndi')
      router.push('/admin/companies')
    } catch (err: any) {
      alert(err.message || 'Logo yüklənərkən xəta baş verdi')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="p-4 md:p-10">
        <p className="text-sm text-slate-500">Yüklənir...</p>
      </main>
    )
  }

  const previewLogo = logoFile ? URL.createObjectURL(logoFile) : logoUrl

  return (
    <main className="p-4 md:p-10">
      <div className="mb-8">
        <Link
          href="/admin/companies"
          className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-red-600"
        >
          ← Şirkətlərə qayıt
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          Şirkəti düzəlt
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Şirkət adı, logo, slug və açıqlama məlumatlarını yenilə.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Şirkət adı
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
              placeholder="Məs: Cahan Motors"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
              placeholder="Məs: cahan-motors"
            />
            <p className="mt-2 text-xs text-slate-400">
              URL üçün istifadə olunur. Məs: /companies/cahan-motors
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Şirkət haqqında məlumat
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
              placeholder="Şirkət haqqında qısa məlumat..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Logo yüklə
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            {previewLogo && (
              <div className="mt-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={previewLogo}
                  alt={name}
                  className="h-14 w-auto object-contain"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Aktiv şirkət kimi göstər
          </label>
        </div>

        <button
          disabled={saving}
          className="mt-8 w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
        </button>
      </form>
    </main>
  )
}