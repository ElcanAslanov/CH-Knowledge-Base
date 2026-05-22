'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewCompanyPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let logoUrl = ''

    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${slug || Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('company_logos')
        .upload(filePath, logoFile, {
          upsert: true,
        })

      if (uploadError) {
        alert(uploadError.message)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('company_logos')
        .getPublicUrl(filePath)

      logoUrl = data.publicUrl
    }

    const { error } = await supabase.from('knowledge_companies').insert([
      {
        name,
        slug,
        description,
        logo_url: logoUrl,
        is_active: true,
      },
    ])

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Şirkət əlavə olundu')
    router.push('/admin/companies')
  }

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
          Yeni Şirkət
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Şirkət məlumatlarını daxil et və logosunu yüklə.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5">
          <input
            placeholder="Şirkət adı"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Slug (məs: cahan-motors)"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <textarea
            placeholder="Şirkət haqqında məlumat"
            rows={5}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

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

            {logoFile && (
              <div className="mt-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Preview"
                  className="h-14 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? 'Yüklənir...' : 'Əlavə et'}
        </button>
      </form>
    </main>
  )
}