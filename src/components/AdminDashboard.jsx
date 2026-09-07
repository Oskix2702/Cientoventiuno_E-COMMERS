import { useState, useEffect, useCallback } from 'react'
import {
  Package, Boxes, AlertOctagon, Plus, Pencil, Trash2, X, LogOut,
  Store, Shield, Save, Upload, ImageIcon,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/authStore'
import { useUI } from '../store/uiStore'
import { formatCOP } from '../data/products'

function getProductImage(product) {
  if (product.images && product.images.length > 0) return product.images[0]
  if (product.image) return product.image
  return null
}

export default function AdminDashboard() {
  const { user, profile, signOut } = useAuth()
  const backToStore = useUI((s) => s.backToStore)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

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

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}" del catálogo? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { alert('Error al eliminar: ' + error.message); return }
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-ink">
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
              <Store size={16} /> Tienda
            </button>
            <button onClick={signOut} aria-label="Cerrar sesión" className="flex items-center gap-1.5 border border-red-500/40 px-4 py-2 font-display text-sm uppercase tracking-widest2 text-red-400 transition-all hover:bg-red-500/10">
              <LogOut size={16} /> <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard icon={Package} label="Total Productos" value={totalProducts} color="grape" />
          <MetricCard icon={Boxes} label="Unidades en Stock" value={totalStock} color="emerald" />
          <MetricCard icon={AlertOctagon} label="Productos Agotados" value={agotados} color="red" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-widest2 text-white">Gestión de Inventario</h2>
          <button onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 bg-grape px-5 py-2.5 font-display text-sm uppercase tracking-widest2 text-white transition-all hover:bg-grapeDark hover:shadow-[0_6px_24px_rgba(138,43,226,0.45)] active:scale-95">
            <Plus size={18} /> Añadir Producto
          </button>
        </div>

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
                {products.map((p) => {
                  const thumb = getProductImage(p)
                  return (
                    <tr key={p.id} className="border-b border-white/5 transition-colors hover:bg-plum/20">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            <img src={thumb} alt={p.name} className="h-14 w-12 flex-shrink-0 object-cover ring-1 ring-white/10" />
                          ) : (
                            <div className="flex h-14 w-12 flex-shrink-0 items-center justify-center bg-plum/30 ring-1 ring-white/10">
                              <ImageIcon size={18} className="text-white/30" />
                            </div>
                          )}
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
                            <Pencil size={14} /> Editar
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="flex items-center gap-1 border border-red-500/30 px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-red-400 transition-colors hover:bg-red-500/10">
                            <Trash2 size={14} /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ProductModal({ mode, product, onClose, onSaved }) {
  const isEdit = mode === 'edit'
  const [form, setForm] = useState(() => {
    if (product) {
      const existingImages = (product.images && product.images.length > 0)
        ? product.images
        : (product.gallery && product.gallery.length > 0)
          ? product.gallery
          : (product.image ? [product.image] : [])
      return {
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        price: String(product.price || ''),
        images: existingImages,
        stock: String(product.stock || 0),
        sizes: (product.sizes || []).join(', '),
        material: product.material || '',
        variants: product.variants || [],
      }
    }
    return {
      name: '', category: '', description: '', price: '', images: [], stock: '', sizes: 'S, M, L, XL, XXL', material: '', variants: [],
    }
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      const base64Images = await Promise.all(files.map(fileToBase64))
      setForm((prev) => ({ ...prev, images: [...prev.images, ...base64Images] }))
    } catch (err) {
      setError('Error al procesar las imágenes: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const moveImage = (index, dir) => {
    setForm((prev) => {
      const imgs = [...prev.images]
      const target = index + dir
      if (target < 0 || target >= imgs.length) return prev
      ;[imgs[index], imgs[target]] = [imgs[target], imgs[index]]
      return { ...prev, images: imgs }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (form.images.length === 0) {
      setError('Debes subir al menos una imagen del producto')
      setSaving(false)
      return
    }

    const sizes = form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
    const firstImage = form.images[0]

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: parseInt(form.price) || 0,
      image: firstImage,
      gallery: form.images,
      images: form.images,
      variants: form.variants.length > 0 ? form.variants : [{ name: 'Único', color: '#1a1a1a', image: firstImage }],
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
                placeholder="75000" className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Stock (unidades)" required>
              <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="50" className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
          </div>

          {/* Image upload section */}
          <div className="mt-5">
            <label className="mb-1.5 block font-display text-sm uppercase tracking-widest2 text-chalk">
              Imágenes del producto <span className="text-grape">*</span>
            </label>
            <p className="mb-3 font-body text-xs text-chalk/50">
              La primera imagen será la foto principal. Puedes subir múltiples fotos y reordenarlas.
            </p>
            <label className="flex cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-white/20 bg-plum/20 px-4 py-8 transition-colors hover:border-grape hover:bg-grape/5">
              <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
              <Upload size={22} className="text-chalk/60" />
              <span className="font-display text-base uppercase tracking-widest2 text-chalk/70">
                {uploading ? 'Procesando...' : 'Seleccionar imágenes'}
              </span>
            </label>

            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {form.images.map((img, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden ring-1 ring-white/10">
                    <img src={img} alt={`Vista previa ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 bg-grape px-1.5 py-0.5 font-display text-[10px] uppercase tracking-widest2 text-white">
                        Principal
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink/70 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                        className="rounded bg-white/10 px-1.5 py-1 text-white transition-colors hover:bg-grape disabled:opacity-30" aria-label="Mover izquierda">
                        ←
                      </button>
                      <button type="button" onClick={() => removeImage(i)}
                        className="rounded bg-red-500/40 p-1 text-white transition-colors hover:bg-red-500" aria-label="Eliminar imagen">
                        <Trash2 size={14} />
                      </button>
                      <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1}
                        className="rounded bg-white/10 px-1.5 py-1 text-white transition-colors hover:bg-grape disabled:opacity-30" aria-label="Mover derecha">
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Tallas (separadas por coma)" full>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Descripción" full>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
            </Field>
            <Field label="Material" full>
              <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="Ej: Algodón perchado 260 gr" className="w-full border border-white/15 bg-plum/20 px-3 py-2.5 font-body text-white focus:border-grape focus:outline-none" />
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
