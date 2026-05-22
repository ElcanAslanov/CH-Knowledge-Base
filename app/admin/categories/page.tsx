'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editSortOrder, setEditSortOrder] = useState('0')

  const loadCategories = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('knowledge_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      alert(error.message)
    } else {
      setCategories(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase.from('knowledge_categories').insert([
      {
        name,
        slug,
        sort_order: Number(sortOrder) || 0,
        is_active: true,
      },
    ])

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    setName('')
    setSlug('')
    setSortOrder('0')
    loadCategories()
  }

  const startEdit = (category: any) => {
    setEditingId(category.id)
    setEditName(category.name || '')
    setEditSlug(category.slug || '')
    setEditSortOrder(String(category.sort_order ?? 0))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditSlug('')
    setEditSortOrder('0')
  }

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from('knowledge_categories')
      .update({
        name: editName,
        slug: editSlug,
        sort_order: Number(editSortOrder) || 0,
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    cancelEdit()
    loadCategories()
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('knowledge_categories')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadCategories()
  }

  const deleteCategory = async (id: string) => {
    const ok = confirm('Bu bölməni silmək istədiyinizə əminsiniz?')

    if (!ok) return

    const { error } = await supabase
      .from('knowledge_categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadCategories()
  }

  return (
    <main className="p-4 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Bölmələr
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Qaydalar, öhdəliklər, məzuniyyət və digər bölmələri buradan idarə et.
        </p>
      </div>

      <form
        onSubmit={addCategory}
        className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr_120px_140px]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bölmə adı"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
          required
        />

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug (mes: qaydalar)"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
          required
        />

        <input
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          placeholder="Sıra"
          type="number"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
        />

        <button
          disabled={saving}
          className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Yüklənir...' : '+ Əlavə et'}
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1fr_1fr_100px_120px_240px] border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 md:grid">
          <div>Ad</div>
          <div>Slug</div>
          <div>Sıra</div>
          <div>Status</div>
          <div>Əməliyyat</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Yüklənir...</div>
        ) : categories.length > 0 ? (
          categories.map((category) => {
            const isEditing = editingId === category.id

            return (
              <div
                key={category.id}
                className="grid gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 md:grid-cols-[1fr_1fr_100px_120px_240px] md:items-center"
              >
                <div>
                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
                    />
                  ) : (
                    <span className="font-bold text-slate-900">
                      {category.name}
                    </span>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
                    />
                  ) : (
                    <span className="text-sm text-slate-500">
                      {category.slug}
                    </span>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <input
                      value={editSortOrder}
                      onChange={(e) => setEditSortOrder(e.target.value)}
                      type="number"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
                    />
                  ) : (
                    <span className="text-sm text-slate-500">
                      {category.sort_order}
                    </span>
                  )}
                </div>

                <div>
                  {category.is_active ? (
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
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveEdit(category.id)}
                        className="rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                      >
                        Yadda saxla
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        Ləğv et
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        Düzəlt
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(category.id, category.is_active)
                        }
                        className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        {category.is_active ? 'Passiv et' : 'Aktiv et'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(category.id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Sil
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-6 text-sm text-slate-500">
            Hələ bölmə əlavə edilməyib.
          </div>
        )}
      </div>
    </main>
  )
}