'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)

  const loadAdmins = async () => {
    setListLoading(true)

    const { data, error } = await supabase
      .from('admin_emails')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      alert(error.message)
    } else {
      setAdmins(data || [])
    }

    setListLoading(false)
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      setLoading(false)
      alert('Giriş tapılmadı')
      return
    }

    const res = await fetch('/api/admin/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    setLoading(false)

    if (!res.ok) {
      alert(data.error || 'Xəta baş verdi')
      return
    }

    alert('Admin yaradıldı')
    setEmail('')
    setPassword('')
    loadAdmins()
  }

  const toggleAdmin = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('admin_emails')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadAdmins()
  }

  const deleteAdmin = async (id: string) => {
    const ok = confirm('Bu admin email silinsin?')

    if (!ok) return

    const { error } = await supabase
      .from('admin_emails')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadAdmins()
  }

  return (
    <main className="p-4 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Adminlər
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Admin panelə giriş icazəsi olan email-ləri buradan idarə et.
        </p>
      </div>

      <form
        onSubmit={createAdmin}
        className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr_160px]"
      >
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
          required
        />

        <input
          type="password"
          placeholder="Şifrə"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
          required
        />

        <button
          disabled={loading}
          className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? 'Yaradılır...' : '+ Admin yarat'}
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1fr_120px_180px] border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 md:grid">
          <div>Email</div>
          <div>Status</div>
          <div>Əməliyyat</div>
        </div>

        {listLoading ? (
          <div className="p-6 text-sm text-slate-500">Yüklənir...</div>
        ) : admins.length > 0 ? (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="grid gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 md:grid-cols-[1fr_120px_180px] md:items-center"
            >
              <div className="font-semibold text-slate-900">
                {admin.email}
              </div>

              <div>
                {admin.is_active ? (
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
                <button
                  type="button"
                  onClick={() => toggleAdmin(admin.id, admin.is_active)}
                  className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                >
                  {admin.is_active ? 'Passiv et' : 'Aktiv et'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteAdmin(admin.id)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-sm text-slate-500">
            Hələ admin əlavə edilməyib.
          </div>
        )}
      </div>
    </main>
  )
}