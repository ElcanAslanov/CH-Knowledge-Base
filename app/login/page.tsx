'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const normalizedEmail = email.toLowerCase().trim()

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (loginError) {
      setLoading(false)
      alert(loginError.message)
      return
    }

    const { data: adminEmail, error: adminCheckError } = await supabase
      .from('admin_emails')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('is_active', true)
      .single()

    if (adminCheckError || !adminEmail) {
      await supabase.auth.signOut()
      setLoading(false)
      alert('Bu email üçün admin icazəsi yoxdur')
      return
    }

    setLoading(false)
    router.push('/admin')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f172a] p-4 text-slate-900">
      <div className="absolute left-[-80px] top-[-80px] h-64 w-64 animate-pulse rounded-full bg-red-600/30 blur-3xl" />
      <div className="absolute bottom-[-90px] right-[-90px] h-72 w-72 animate-pulse rounded-full bg-red-500/30 blur-3xl [animation-delay:1s]" />
      <div className="absolute left-[18%] top-[18%] h-12 w-12 animate-[float_6s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-white/10" />
      <div className="absolute bottom-[20%] right-[20%] h-16 w-16 animate-[floatReverse_7s_ease-in-out_infinite] rounded-full border border-white/10 bg-white/10" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 p-10 text-white md:block">
          <div className="absolute right-[-40px] top-[-40px] h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute bottom-[-50px] left-[-50px] h-44 w-44 rounded-full bg-black/10" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">
                <img
                  src="https://cahan.az/wp-content/uploads/elementor/thumbs/FOOTER-AZ.-png-rjko6zxaos7x3st6em3kzr2jg31x9jxnvnel33xxxk.png"
                  alt="Cahan Holding"
                  className="h-12 w-auto object-contain"
                />
              </div>

              <h1 className="mt-8 text-4xl font-extrabold leading-tight">
                Korporativ Bilik Bazası
              </h1>

              <p className="mt-4 text-sm leading-7 text-red-50">
                Şirkət məlumatları, qaydalar, prosedurlar və sənədlər üçün
                idarəetmə paneli.
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
              <p className="text-sm font-semibold">
                Admin panel yalnız icazəli istifadəçilər üçündür.
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 md:p-10">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 md:hidden">
            <img
              src="https://www.magna.az/assets/img/icons/logo_red.png"
              alt="Cahan Holding"
              className="h-12 w-auto object-contain"
            />
          </div>

          <p className="mb-3 inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600">
            Admin giriş
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Hesabınıza daxil olun
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Admin panelə daxil olmaq üçün icazəli email və şifrəni yazın.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cahan.az"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-4 focus:ring-red-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Şifrə
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-4 focus:ring-red-50"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? 'Yoxlanılır...' : 'Daxil ol'}
            </button>
          </form>
        </section>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(8deg); }
        }

        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(16px) rotate(-8deg); }
        }
      `}</style>
    </main>
  )
}