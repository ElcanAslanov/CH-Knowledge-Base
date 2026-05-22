'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  const menuItems = [
    ['Dashboard', '/admin'],
    ['Şirkətlər', '/admin/companies'],
    ['Bölmələr', '/admin/categories'],
    ['Məqalələr', '/admin/articles'],
    ['Adminlər', '/admin/admins'],
  ]

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    const email = data.user?.email?.toLowerCase().trim() || ''

    if (!data.user) {
      router.push('/login')
      return
    }

    const { data: adminEmail, error } = await supabase
      .from('admin_emails')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !adminEmail) {
      await supabase.auth.signOut()
      router.push('/login')
      return
    }

    setChecking(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
        <p className="text-sm text-slate-500">Yoxlanılır...</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 md:flex md:flex-col">
        <div className="mb-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-extrabold text-white">
            A
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Korporativ bilik bazası
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map(([title, href]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              {title}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-slate-50 p-4">
          <Link
            href="/"
            className="block text-sm font-semibold text-red-600 hover:text-red-700"
          >
            ← Sayta qayıt
          </Link>

          <button
            onClick={logout}
            className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Çıxış et
          </button>
        </div>
      </aside>

      <div className="md:pl-72">
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden">
          <h1 className="text-lg font-extrabold text-red-600">Admin Panel</h1>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {menuItems.map(([title, href]) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                {title}
              </Link>
            ))}

            <button
              onClick={logout}
              className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Çıxış
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}