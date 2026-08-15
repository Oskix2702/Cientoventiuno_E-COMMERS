import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/authStore'
import { useUI } from '../store/uiStore'
import { formatCOP } from '../data/products'

export default function AdminDashboard() {
  const { user, profile, signOut } = useAuth()
  const backToStore = useUI((s) => s.backToStore)
  const [tab, setTab] = useState('inventory')

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-4 pt-20">
        <h1 className="font-display text-4xl uppercase tracking-widest2 text-white">
          Acceso Denegado
        </h1>
        <p className="font-body text-chalk/60">
          No tienes permisos de administrador para ver esta página.
        </p>
        <button onClick={backToStore} className="btn-primary mt-4">
          Volver a la tienda
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-4xl uppercase tracking-widest2 text-white">
              Panel de Administración
            </h1>
            <p className="mt-1 font-body text-sm text-chalk/60">
              Conectado como {user.email} · Rol: {profile?.role}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={backToStore} className="btn-ghost">
              Ver tienda
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 border border-red-500/40 px-6 py-3 font-display text-lg uppercase tracking-widest2 text-red-400 transition-all hover:bg-red-500/10"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-2 border-b border-white/10">
          <button
            onClick={() => setTab('inventory')}
            className={`px-6 py-3 font-display text-lg uppercase tracking-widest2 transition-colors ${
              tab === 'inventory' ? 'border-b-2 border-grape text-white' : 'text-chalk/50 hover:text-white'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setTab('create')}
            className={`px-6 py-3 font-display text-lg uppercase tracking-widest2 transition-colors ${
              tab === 'create' ? 'border-b-2 border-grape text-white' : 'text-chalk/50 hover:text-white'
            }`}
          >
            Crear Producto
          </button>
        </div>

        {tab === 'inventory' && <InventoryPanel />}
        {tab === 'create' && <CreateProductPanel onCreated={() => setTab('inventory')} />}
      </div>
    </div>
  )
}

function InventoryPanel() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editStock, setEditStock] = useState(0)

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSaveStock = async (id) => {
    await supabase.from('products').update({ stock: editStock }).eq('id', id)
    setEditingId(null)
    fetchProducts()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto del catálogo?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  if (loading) {
    return <div className="py-20 text-center font-display text-2xl uppercase tracking-widest2 text-chalk/50">Cargando inventario...</div>
  }

  if (products.length === 0) {
    return <div className="py-20 text-center font-display text-2xl uppercase tracking-widest2 text-chalk/50">No hay productos en el inventario</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-4 py-3 font-display text-sm uppercase tracking-widest2 text-chalk">Producto</th>
            <th className="px-4 py-3 font-display text-sm uppercase tracking-widest2 text-chalk">Precio</th>
            <th className="px-4 py-3 font-display text-sm uppercase tracking-widest2 text-chalk">Stock</th>
            <th className="px-4 py-3 font-display text-sm uppercase tracking-widest2 text-chalk">Estado</th>
            <th className="px-4 py-3 font-display text-sm uppercase tracking-widest2 text-chalk">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-white/5 transition-colors hover:bg-plum/20">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-14 w-12 flex-shrink-0 object-cover ring-1 ring-white/10" />
                  <div>
                    <p className="font-display text-base uppercase tracking-wide text-white">{p.name}</p>
                    <p className="font-body text-xs text-chalk/50">{p.category}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 font-display text-lg text-white">{formatCOP(p.price)}</td>
              <td className="px-4 py-4">
                {editingId === p.id ? (
                  <input
                    type="number" min="0" value={editStock}
                    onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                    className="w-20 border border-white/20 bg-ink px-2 py-1 font-body text-white focus:border-grape focus:outline-none"
                  />
                ) : (
                  <span className="font-body text-lg text-white">{p.stock}</span>
                )}
              </td>
              <td className="px-4 py-4">
                {p.stock > 0 ? (
                  <span className="inline-block border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-display text-xs uppercase tracking-widest2 text-emerald-400">En stock</span>
                ) : (
                  <span className="inline-block border border-red-500/40 bg-red-500/10 px-3 py-1 font-display text-xs uppercase tracking-widest2 text-red-400">Agotado</span>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  {editingId === p.id ? (
                    <>
                      <button onClick={() => handleSaveStock(p.id)} className="bg-grape px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-white hover:bg-grapeDark">Guardar</button>
                      <button onClick={() => setEditingId(null)} className="border border-white/20 px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-chalk hover:text-white">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(p.id); setEditStock(p.stock) }} className="border border-white/20 px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-chalk transition-colors hover:border-grape hover:text-grape">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="border border-red-500/30 px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-red-400 transition-colors hover:bg-red-500/10">Eliminar</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CreateProductPanel({ onCreated }) {
  const [form, setForm] = useState({
    name: '', category: '', description: '', price: '', image: '', stock: '', sizes: 'S, M, L, XL, XXL', material: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const sizes = form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
    const img = form.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'

    await supabase.from('products').insert({
      name: form.name,
      category: form.category,
      description: form.description,
      price: parseInt(form.price) || 0,
      image: img,
      gallery: [img],
      variants: [{ name: 'Único', color: '#1a1a1a', image: img }],
      sizes,
      material: form.material,
      reviews: [],
      stock: parseInt(form.stock) || 0,
    })

    setSaving(false)
    setSuccess(true)
    setForm({ name: '', category: '', description: '', price: '', image: '', stock: '', sizes: 'S, M, L, XL, XXL', material: '' })
    setTimeout(() => onCreated(), 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {success && (
        <div className="mb-4 border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
          <p className="font-body text-sm text-emerald-300">Producto creado exitosamente. Redirigiendo al inventario...</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nombre del producto" required>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
        <Field label="Categoría / Estilo">
          <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Ej: Camisetas · Oversize"
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
        <Field label="Precio (COP)" required>
          <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="75000"
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
        <Field label="Stock (unidades)" required>
          <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="50"
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
        <Field label="URL de imagen" full>
          <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
        <Field label="Tallas disponibles (separadas por coma)" full>
          <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
        <Field label="Descripción" full>
          <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
        <Field label="Material" full>
          <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
            placeholder="Ej: Algodón perchado 260 gr"
            className="w-full border border-white/15 bg-ink/50 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
        </Field>
      </div>

      <button type="submit" disabled={saving}
        className="mt-6 flex items-center justify-center gap-2 bg-grape px-8 py-4 font-display text-lg uppercase tracking-widest2 text-white transition-all hover:bg-grapeDark hover:shadow-[0_8px_30px_rgba(138,43,226,0.45)] active:scale-95 disabled:opacity-50">
        {saving ? 'Guardando...' : 'Crear Producto'}
      </button>
    </form>
  )
}

function Field({ label, required, full, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block font-display text-sm uppercase tracking-widest2 text-chalk">
        {label} {required && <span className="text-grape">*</span>}
      </label>
      {children}
    </div>
  )
}
