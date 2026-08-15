import { useState, useEffect, useCallback } from 'react'
import {
  Package, Boxes, AlertOctagon, Plus, Pencil, Trash2, X, LogOut,
  Store, Shield, Save,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/authStore'
import { useUI } from '../store/uiStore'
import { formatCOP } from '../data/products'

export default function AdminDashboard() {
  const { user, profile, signOut } = useAuth()
  const backToStore = useUI((s) => s.backToStore)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | { type: 'edit', product }

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()

    const channel = supabase
      .channel('products-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchProducts])

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const agotados = products.filter((p) => p.stock <= 0).length

  return (
    <div className="min-h-screen bg-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-grape/20">
              <Shield size={20} className="text-grape" />
            </div>
            <div>
              <h1 className="font-display text-xl uppercase tracking-widest2 text-white">CIENTOVEINTIUNO</h1>
              <p className="font-body text-xs text-chalk/50">Panel de Administración</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-body text-sm text-chalk/60 sm:block">{user?.email}</span>
            <button onClick={backToStore} className="flex items-center gap-1.5 border border-white/20 px-4 py-2 font-display text-sm uppercase tracking-widest2 text-chalk transition-colors hover:border-grape hover:text-grape">
              <Store size={16} />
              Tienda
            </button>
            <button onClick={signOut} aria-label="Cerrar sesión" className="flex items-center gap-1.5 border border-red-500/40 px-4 py-2 font-display text-sm uppercase tracking-widest2 text-red-400 transition-all hover:bg-red-500/10">
              <LogOut size={16} />
              <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard icon={Package} label="Total Productos" value={totalProducts} color="grape" />
          <MetricCard icon={Boxes} label="Unidades en Stock" value={totalStock} color="emerald" />
          <MetricCard icon={AlertOctagon} label="Productos Agotados" value={agotados} color="red" />
        </div>

        {/* Inventory header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-widest2 text-white">Gestión de Inventario</h2>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 bg-grape px-5 py-2.5 font-display text-sm uppercase tracking-widest2 text-white transition-all hover:bg-grapeDark hover:shadow-[0_6px_24px_rgba(138,43,226,0.45)] active:scale-95"
          >
            <Plus size={18} />
            Añadir Producto
          </button>
        </div>

        {/* Inventory table */}
        {loading ? (
          <div className="py-20 text-center font-display text-xl uppercase tracking-widest2 text-chalk/50">Cargando inventario...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center font-display text-xl uppercase tracking-widest2 text-chalk/50">No hay productos en el inventario</div>
        ) : (
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
                    <td className="px-4 py-4 font-body text-lg text-white">{p.stock}</td>
                    <td className="px-4 py-4">
                      {p.stock > 0 ? (
                        <span className="inline-block border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-display text-xs uppercase tracking-widest2 text-emerald-400">En stock</span>
                      ) : (
                        <span className="inline-block border border-red-500/40 bg-red-500/10 px-3 py-1 font-display text-xs uppercase tracking-widest2 text-red-400">Agotado</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ type: 'edit', product: p })} className="flex items-center gap-1 border border-white/20 px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-chalk transition-colors hover:border-grape hover:text-grape">
                          <Pencil size={14} />
                          Editar
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="flex items-center gap-1 border border-red-500/30 px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-red-400 transition-colors hover:bg-red-500/10">
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          mode={modal.type}
          product={modal.type === 'edit' ? modal.product : null}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchProducts() }}
        />
      )}
    </div>
  )

  async function handleDelete(id, name) {
    if (!confirm(`¿Eliminar "${name}" del catálogo? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      fetchProducts()
    }
  }
}

function MetricCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    grape: 'border-grape/30 bg-grape/5 text-grape',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    red: 'border-red-500/30 bg-red-500/5 text-red-400',
  }
  return (
    <div className={`flex items-center gap-4 border p-5 ${colorMap[color]}`}>
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
        <Icon size={24} />
      </div>
      <div>
        <p className="font-body text-sm text-chalk/60">{label}</p>
        <p className="font-display text-3xl text-white">{value}</p>
      </div>
    </div>
  )
}

function ProductModal({ mode, product, onClose, onSaved }) {
  const isEdit = mode === 'edit'
  const [form, setForm] = useState(() => {
    if (product) {
      return {
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        price: String(product.price || ''),
        image: product.image || '',
        stock: String(product.stock || 0),
        sizes: (product.sizes || []).join(', '),
        material: product.material || '',
        variants: product.variants || [],
      }
    }
    return {
      name: '', category: '', description: '', price: '', image: '', stock: '', sizes: 'S, M, L, XL, XXL', material: '', variants: [],
    }
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const sizes = form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
    const img = form.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: parseInt(form.price) || 0,
      image: img,
      gallery: [img],
      variants: form.variants.length > 0 ? form.variants : [{ name: 'Único', color: '#1a1a1a', image: img }],
      sizes,
      material: form.material,
      stock: parseInt(form.stock) || 0,
    }

    let result
    if (isEdit) {
      result = await supabase.from('products').update(payload).eq('id', product.id)
    } else {
      payload.reviews = []
      result = await supabase.from('products').insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
    } else {
      onSaved()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 animate-fadeIn" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/10 bg-ink p-6 shadow-2xl animate-slideIn">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-widest2 text-white">
            {isEdit ? 'Editar Producto' : 'Crear Producto'}
          </h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-2 text-chalk transition-colors hover:text-white">
            <X size={22} />
          </button>
        </div>

        {error && (
          <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-3">
            <p className="font-body text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Nombre del producto" required>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Categoría / Estilo">
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ej: Camisetas · Oversize"
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Precio (COP)" required>
              <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="75000"
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Stock (unidades)" required>
              <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="50"
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="URL de imagen" full>
              <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Tallas (separadas por coma)" full>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Descripción" full>
              <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Material" full>
              <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="Ej: Algodón perchado 260 gr"
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 bg-grape px-8 py-3.5 font-display text-lg uppercase tracking-widest2 text-white transition-all hover:bg-grapeDark hover:shadow-[0_8px_30px_rgba(138,43,226,0.45)] active:scale-95 disabled:opacity-50">
              {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Producto'}
              <Save size={18} />
            </button>
            <button type="button" onClick={onClose}
              className="border border-white/20 px-6 py-3.5 font-display text-lg uppercase tracking-widest2 text-chalk transition-colors hover:text-white">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
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
