'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadCompanies = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('knowledge_companies')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      alert(error.message)
    } else {
      setCompanies(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  const deleteCompany = async (id: string) => {
    const ok = confirm('Bu şirkəti silmək istədiyinizə əminsiniz?')

    if (!ok) return

    const { error } = await supabase
      .from('knowledge_companies')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    alert('Şirkət silindi')
    loadCompanies()
  }

  return (
    <main className="p-4 md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Şirkətlər
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Holding daxilindəki şirkətləri buradan idarə edə bilərsiniz.
          </p>
        </div>

        <Link
          href="/admin/companies/new"
          className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
        >
          + Yeni şirkət
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[80px_1fr_1fr_120px_180px] border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 md:grid">
          <div>Logo</div>
          <div>Şirkət adı</div>
          <div>Slug</div>
          <div>Status</div>
          <div>Əməliyyat</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Yüklənir...</div>
        ) : companies.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            Hələ şirkət əlavə edilməyib.
          </div>
        ) : (
          companies.map((company) => (
            <div
              key={company.id}
              className="grid gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 md:grid-cols-[80px_1fr_1fr_120px_180px] md:items-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <img
                  src={
                    company.logo_url ||
                    'https://www.magna.az/assets/img/icons/logo_red.png'
                  }
                  alt={company.name}
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">{company.name}</h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {company.description}
                </p>
              </div>

              <div className="text-sm text-slate-500">
                {company.slug}
              </div>

              <div>
                {company.is_active ? (
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
                  href={`/admin/companies/${company.id}/edit`}
                  className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  Düzəlt
                </Link>

                <button
                  onClick={() => deleteCompany(company.id)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}