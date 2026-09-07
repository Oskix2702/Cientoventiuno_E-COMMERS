import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Truck,
  ChevronDown,
  Star,
  ImageOff,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatCOP } from '../data/products'
import { useCart } from '../store/cartStore'
import { useUI } from '../store/uiStore'
import { useToast } from '../store/toastStore'

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= rating ? 'fill-grape text-grape' : 'text-white/20'} />
      ))}
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-white/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-5 text-left">
        <span className="font-display text-xl uppercase tracking-widest2 text-white">{title}</span>
        <ChevronDown size={20} className={`text-chalk transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

function normalizeVariants(product) {
  if (!product.variants || product.variants.length === 0) {
    const fallbackImages = (product.images && product.images.length > 0)
      ? product.images
      : (product.image ? [product.image] : [])
    return [{ colorName: 'Único', color: '#1a1a1a', images: fallbackImages }]
  }
  return product.variants.map((v) => ({
    colorName: v.colorName || v.name || 'Único',
    color: v.color || '#1a1a1a',
    images: (v.images && v.images.length > 0)
      ? v.images
      : (v.image ? [v.image] : (product.image ? [product.image] : [])),
  }))
}

export default function ProductDetail() {
  const productId = useUI((s) => s.selectedProductId)
  const backToStore = useUI((s) => s.backToStore)
  const openProduct = useUI((s) => s.openProduct)
  const add = useCart((s) => s.add)
  const openCart = useCart((s) => s.open)
  const toast = useToast()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeVariant, setActiveVariant] = useState(0)
  const [activeImage, setActiveImage] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setActiveVariant(0)
    setActiveImage(null)
    setSelectedSize(null)
    setAdded(false)
    setImgError(false)
    setShowWarning(false)
    setLoading(true)

    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', productId).maybeSingle()
      setProduct(data)
      const { data: rel } = await supabase.from('products').select('*').neq('id', productId).limit(4)
      setRelated(rel || [])
      setLoading(false)
    }
    if (productId) fetchProduct()

    const channel = supabase
      .channel(`product-${productId}-realtime`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'DELETE' && payload.old?.id === productId) {
          backToStore()
          return
        }
        fetchProduct()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [productId, backToStore])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink pt-20">
        <p className="font-display text-2xl uppercase tracking-widest2 text-chalk/50">Cargando producto...</p>
      </div>
    )
  }

  if (!product) return null

  const variants = normalizeVariants(product)
  const currentVariant = variants[activeVariant]
  const gallery = currentVariant.images.length > 0 ? currentVariant.images : (product.image ? [product.image] : [])
  const resolvedActiveImage = activeImage || gallery[0] || product.image
  const selectedColor = currentVariant.colorName
  const agotado = product.stock <= 0
  const reviews = product.reviews || []
  const hasMultipleVariants = variants.length > 1 || variants[0].colorName !== 'Único'

  const handleVariantChange = (i) => {
    setActiveVariant(i)
    setActiveImage(null)
    setImgError(false)
  }

  const handleAdd = () => {
    if (agotado) return
    if (!selectedSize) {
      setShowWarning(true)
      toast.error('Debes seleccionar una talla antes de agregar a la bolsa')
      setTimeout(() => setShowWarning(false), 3000)
      return
    }
    add(product, selectedSize, selectedColor, resolvedActiveImage)
    toast.success('Producto añadido a la bolsa')
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleViewCart = () => {
    if (agotado) return
    if (!selectedSize) {
      setShowWarning(true)
      toast.error('Debes seleccionar una talla antes de agregar a la bolsa')
      setTimeout(() => setShowWarning(false), 3000)
      return
    }
    add(product, selectedSize, selectedColor, resolvedActiveImage)
    toast.success('Producto añadido a la bolsa')
    openCart()
  }

  return (
    <div className="min-h-screen bg-ink pt-20">
      <div className="mx-auto max-w-[1920px] px-4 py-6 lg:px-[100px] xl:px-[200px]">
        <button onClick={backToStore} className="flex items-center gap-2 font-display text-lg uppercase tracking-widest2 text-chalk transition-colors hover:text-grape">
          <ArrowLeft size={20} />
          Volver a la tienda
        </button>
      </div>

      <div className="mx-auto max-w-[1920px] px-4 pb-20 lg:px-[100px] xl:px-[200px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: gallery */}
          <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-6">
            <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-neutral-900 ring-1 ring-white/10">
              {imgError || !resolvedActiveImage ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-plum/40">
                  <ImageOff size={48} className="text-white/30" />
                  <span className="font-display text-xl uppercase tracking-widest2 text-white/40">CIENTOVEINTIUNO</span>
                </div>
              ) : (
                <img src={resolvedActiveImage} alt={product.name} onError={() => setImgError(true)} className="h-full w-full object-cover" />
              )}
              {agotado && (
                <div className="absolute left-4 top-4 z-10 bg-red-500/90 px-4 py-2 font-display text-base uppercase tracking-widest2 text-white">
                  Agotado
                </div>
              )}
            </div>
            <div className="flex gap-3 lg:flex-col lg:gap-4">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => { setActiveImage(img); setImgError(false) }}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden ring-2 transition-all lg:h-24 lg:w-24 ${
                    resolvedActiveImage === img ? 'ring-grape' : 'ring-white/10 hover:ring-white/40'
                  }`}>
                  <img src={img} alt={`${product.name} vista ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: purchase info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="font-script text-2xl text-grape">{product.category}</span>
              <h1 className="mt-1 font-display text-4xl uppercase tracking-widest2 text-white sm:text-5xl">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-4xl tracking-wide text-white">{formatCOP(product.price)}</span>
              <span className="font-body text-sm text-chalk/50">· Precio con IVA incluido</span>
            </div>

            {agotado && (
              <div className="border border-red-500/40 bg-red-500/10 px-4 py-3">
                <p className="font-display text-base uppercase tracking-widest2 text-red-400">
                  Producto agotado · No disponible para compra
                </p>
              </div>
            )}

            {/* Variants / Designs */}
            {hasMultipleVariants && (
              <div>
                <p className="mb-3 font-display text-lg uppercase tracking-widest2 text-chalk">
                  Diseño: <span className="text-white">{currentVariant.colorName}</span>
                </p>
                <div className="flex gap-3">
                  {variants.map((v, i) => {
                    const vThumb = v.images[0]
                    return (
                      <button key={i} onClick={() => handleVariantChange(i)}
                        aria-label={v.colorName}
                        className={`relative h-14 w-14 overflow-hidden ring-2 transition-all hover:scale-110 ${
                          activeVariant === i ? 'ring-grape' : 'ring-white/10 hover:ring-white/40'
                        }`}>
                        {vThumb ? (
                          <img src={vThumb} alt={v.colorName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-plum/40">
                            <ImageOff size={16} className="text-white/30" />
                          </div>
                        )}
                        <span className="absolute bottom-0 left-0 h-1.5 w-full" style={{ backgroundColor: v.color }} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <p className="mb-3 font-display text-lg uppercase tracking-widest2 text-chalk">Talla</p>
              <div className="flex flex-wrap gap-3">
                {(product.sizes || []).map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} disabled={agotado}
                    className={`min-w-[3.5rem] px-4 py-3 font-display text-lg uppercase tracking-widest2 transition-all duration-200 ${
                      agotado
                        ? 'cursor-not-allowed bg-white/5 text-white/20 ring-1 ring-white/10'
                        : selectedSize === size
                        ? 'bg-grape text-white ring-2 ring-grape ring-offset-2 ring-offset-ink'
                        : 'bg-transparent text-white ring-1 ring-white/20 hover:ring-grape hover:text-grape'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to bag */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleAdd} disabled={agotado || !selectedSize}
                className={`flex flex-1 items-center justify-center gap-2 px-8 py-4 font-display text-xl uppercase tracking-widest2 transition-all duration-300 ${
                  agotado || !selectedSize
                    ? 'cursor-not-allowed bg-white/10 text-white/30'
                    : added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-grape text-white hover:scale-[1.02] hover:bg-grapeDark hover:shadow-[0_8px_30px_rgba(138,43,226,0.45)] active:scale-95'
                }`}>
                {added ? <Check size={22} /> : <ShoppingBag size={22} />}
                {agotado ? 'Agotado' : added ? 'Añadido a la bolsa' : 'Agregar a la bolsa'}
              </button>
              <button onClick={handleViewCart} disabled={agotado || !selectedSize}
                className={`flex items-center justify-center gap-2 border px-6 py-4 font-display text-xl uppercase tracking-widest2 transition-all duration-300 ${
                  agotado || !selectedSize
                    ? 'cursor-not-allowed border-white/10 text-white/30'
                    : 'border-white/20 text-white hover:border-grape hover:text-grape'
                }`}>
                Ver bolsa
              </button>
            </div>
            {showWarning && (
              <div className="flex items-center gap-2 rounded border border-red-500/40 bg-red-500/10 px-4 py-3">
                <span className="font-body text-sm text-red-300">Debes seleccionar una talla antes de agregar a la bolsa</span>
              </div>
            )}

            {/* Shipping */}
            <div className="flex items-center gap-3 border border-white/10 bg-plum/20 px-5 py-4">
              <Truck size={24} className="flex-shrink-0 text-grape" />
              <div>
                <p className="font-display text-base uppercase tracking-widest2 text-white">Envíos nacionales disponibles</p>
                <p className="font-body text-sm text-chalk/60">Despacho en 2-3 días hábiles · Bogotá misma día</p>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-2">
              <Accordion title="Descripción" defaultOpen>
                <p className="font-body text-base leading-relaxed text-chalk/80">{product.description}</p>
              </Accordion>
              <Accordion title="Material y fabricación">
                <p className="font-body text-base leading-relaxed text-chalk/80">{product.material}</p>
              </Accordion>
              <Accordion title="Reseñas y calificaciones">
                {reviews.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="font-display text-5xl text-white">
                          {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                        </span>
                        <Stars rating={Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)} size={16} />
                        <span className="mt-1 font-body text-xs text-chalk/50">{reviews.length} reseñas</span>
                      </div>
                      <div className="flex flex-1 flex-col gap-3">
                        {reviews.map((r, i) => (
                          <div key={i} className="border-l-2 border-grape/40 pl-4">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-base uppercase tracking-widest2 text-white">{r.author}</span>
                              <Stars rating={r.rating} />
                            </div>
                            <p className="mt-1 font-body text-sm leading-relaxed text-chalk/70">{r.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="font-body text-base text-chalk/60">Aún no hay reseñas para este producto.</p>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-white/10 bg-ink py-20">
          <div className="mx-auto max-w-[1920px] px-4 lg:px-[100px] xl:px-[200px]">
            <h2 className="mb-10 text-center font-display text-4xl uppercase tracking-widest2 text-white sm:text-5xl">Más opciones</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((p) => {
                const pVariants = normalizeVariants(p)
                const thumb = pVariants[0]?.images?.[0] || p.image
                return (
                  <article key={p.id} onClick={() => openProduct(p.id)}
                    className="group cursor-pointer overflow-hidden bg-plum/30 ring-1 ring-white/10 transition-all duration-500 hover:ring-grape/60">
                    <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                      {thumb ? (
                        <img src={thumb} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-plum/40"><ImageOff size={32} className="text-white/30" /></div>
                      )}
                      {p.stock <= 0 && (
                        <div className="absolute left-0 top-0 bg-red-500/90 px-3 py-1.5 font-display text-xs uppercase tracking-widest2 text-white">Agotado</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 p-5">
                      <h3 className="font-display text-xl uppercase tracking-widest2 text-white">{p.name}</h3>
                      <span className="font-display text-lg tracking-wide text-grape">{formatCOP(p.price)}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
