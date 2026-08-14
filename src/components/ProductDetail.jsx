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
import { products, formatCOP } from '../data/products'
import { useCart } from '../store/cartStore'
import { useUI } from '../store/uiStore'

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= rating ? 'fill-grape text-grape' : 'text-white/20'}
        />
      ))}
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-display text-xl uppercase tracking-widest2 text-white">
          {title}
        </span>
        <ChevronDown
          size={20}
          className={`text-chalk transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const productId = useUI((s) => s.selectedProductId)
  const backToStore = useUI((s) => s.backToStore)
  const openProduct = useUI((s) => s.openProduct)
  const add = useCart((s) => s.add)
  const openCart = useCart((s) => s.open)

  const product = products.find((p) => p.id === productId)
  const related = products.filter((p) => p.id !== productId)

  const [activeImage, setActiveImage] = useState(0)
  const [activeVariant, setActiveVariant] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setActiveImage(0)
    setActiveVariant(0)
    setSelectedSize(null)
    setAdded(false)
    setImgError(false)
    setShowWarning(false)
  }, [productId])

  if (!product) return null

  const gallery = product.gallery || [product.image]
  const currentImage = product.variants?.[activeVariant]?.image || gallery[activeImage] || product.image

  const selectedColor = product.variants?.[activeVariant]?.name || 'Único'

  const handleAdd = () => {
    if (!selectedSize) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
      return
    }
    add(product, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleViewCart = () => {
    if (!selectedSize) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
      return
    }
    add(product, selectedSize, selectedColor)
    openCart()
  }

  return (
    <div className="min-h-screen bg-ink pt-20">
      {/* Breadcrumb / back */}
      <div className="mx-auto max-w-[1920px] px-4 py-6 lg:px-[100px] xl:px-[200px]">
        <button
          onClick={backToStore}
          className="flex items-center gap-2 font-display text-lg uppercase tracking-widest2 text-chalk transition-colors hover:text-grape"
        >
          <ArrowLeft size={20} />
          Volver a la tienda
        </button>
      </div>

      {/* Main PDP layout */}
      <div className="mx-auto max-w-[1920px] px-4 pb-20 lg:px-[100px] xl:px-[200px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column: gallery */}
          <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-6">
            <div className="relative aspect-square flex-1 overflow-hidden bg-plum/30 ring-1 ring-white/10">
              {imgError ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-plum/40">
                  <ImageOff size={48} className="text-white/30" />
                  <span className="font-display text-xl uppercase tracking-widest2 text-white/40">
                    CIENTOVEINTIUNO
                  </span>
                </div>
              ) : (
                <img
                  src={currentImage}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 lg:flex-col lg:gap-4">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(i)
                    setImgError(false)
                  }}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden ring-2 transition-all lg:h-24 lg:w-24 ${
                    activeImage === i && activeVariant === 0
                      ? 'ring-grape'
                      : 'ring-white/10 hover:ring-white/40'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} vista ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right column: purchase info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="font-script text-2xl text-grape">
                {product.category}
              </span>
              <h1 className="mt-1 font-display text-4xl uppercase tracking-widest2 text-white sm:text-5xl">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-4xl tracking-wide text-white">
                {formatCOP(product.price)}
              </span>
              <span className="font-body text-sm text-chalk/50">
                · Precio con IVA incluido
              </span>
            </div>

            {/* Variant selector */}
            {product.variants && (
              <div>
                <p className="mb-3 font-display text-lg uppercase tracking-widest2 text-chalk">
                  Diseño:{' '}
                  <span className="text-white">
                    {product.variants[activeVariant].name}
                  </span>
                </p>
                <div className="flex gap-3">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.name}
                      onClick={() => {
                        setActiveVariant(i)
                        setActiveImage(0)
                        setImgError(false)
                      }}
                      aria-label={v.name}
                      className={`relative h-14 w-14 overflow-hidden ring-2 transition-all hover:scale-110 ${
                        activeVariant === i
                          ? 'ring-grape'
                          : 'ring-white/10 hover:ring-white/40'
                      }`}
                    >
                      <img
                        src={v.image}
                        alt={v.name}
                        className="h-full w-full object-cover"
                      />
                      <span
                        className="absolute bottom-0 left-0 h-1.5 w-full"
                        style={{ backgroundColor: v.color }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div>
              <p className="mb-3 font-display text-lg uppercase tracking-widest2 text-chalk">
                Talla
              </p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3.5rem] px-4 py-3 font-display text-lg uppercase tracking-widest2 transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-grape text-white ring-2 ring-grape ring-offset-2 ring-offset-ink'
                        : 'bg-transparent text-white ring-1 ring-white/20 hover:ring-grape hover:text-grape'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to bag */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAdd}
                disabled={!selectedSize}
                className={`flex flex-1 items-center justify-center gap-2 px-8 py-4 font-display text-xl uppercase tracking-widest2 transition-all duration-300 ${
                  !selectedSize
                    ? 'cursor-not-allowed bg-white/10 text-white/30'
                    : added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-grape text-white hover:scale-[1.02] hover:bg-grapeDark hover:shadow-[0_8px_30px_rgba(138,43,226,0.45)] active:scale-95'
                }`}
              >
                {added ? <Check size={22} /> : <ShoppingBag size={22} />}
                {added ? 'Añadido a la bolsa' : 'Agregar a la bolsa'}
              </button>
              <button
                onClick={handleViewCart}
                disabled={!selectedSize}
                className={`flex items-center justify-center gap-2 border px-6 py-4 font-display text-xl uppercase tracking-widest2 transition-all duration-300 ${
                  !selectedSize
                    ? 'cursor-not-allowed border-white/10 text-white/30'
                    : 'border-white/20 text-white hover:border-grape hover:text-grape'
                }`}
              >
                Ver bolsa
              </button>
            </div>
            {showWarning && (
              <div className="flex items-center gap-2 rounded border border-red-500/40 bg-red-500/10 px-4 py-3">
                <span className="font-body text-sm text-red-300">
                  Debes seleccionar una talla antes de agregar a la bolsa
                </span>
              </div>
            )}

            {/* Shipping info */}
            <div className="flex items-center gap-3 border border-white/10 bg-plum/20 px-5 py-4">
              <Truck size={24} className="flex-shrink-0 text-grape" />
              <div>
                <p className="font-display text-base uppercase tracking-widest2 text-white">
                  Envíos nacionales disponibles
                </p>
                <p className="font-body text-sm text-chalk/60">
                  Despacho en 2-3 días hábiles · Bogotá misma día
                </p>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-2">
              <Accordion title="Descripción" defaultOpen>
                <p className="font-body text-base leading-relaxed text-chalk/80">
                  {product.description}
                </p>
              </Accordion>

              <Accordion title="Material y fabricación">
                <p className="font-body text-base leading-relaxed text-chalk/80">
                  {product.material}
                </p>
              </Accordion>

              <Accordion title="Reseñas y calificaciones">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="font-display text-5xl text-white">
                        {(
                          product.reviews.reduce((s, r) => s + r.rating, 0) /
                          product.reviews.length
                        ).toFixed(1)}
                      </span>
                      <Stars
                        rating={Math.round(
                          product.reviews.reduce((s, r) => s + r.rating, 0) /
                            product.reviews.length
                        )}
                        size={16}
                      />
                      <span className="mt-1 font-body text-xs text-chalk/50">
                        {product.reviews.length} reseñas
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      {product.reviews.map((r, i) => (
                        <div
                          key={i}
                          className="border-l-2 border-grape/40 pl-4"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-display text-base uppercase tracking-widest2 text-white">
                              {r.author}
                            </span>
                            <Stars rating={r.rating} />
                          </div>
                          <p className="mt-1 font-body text-sm leading-relaxed text-chalk/70">
                            {r.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="border-t border-white/10 bg-ink py-20">
        <div className="mx-auto max-w-[1920px] px-4 lg:px-[100px] xl:px-[200px]">
          <h2 className="mb-10 text-center font-display text-4xl uppercase tracking-widest2 text-white sm:text-5xl">
            Más opciones
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
              <article
                key={p.id}
                onClick={() => openProduct(p.id)}
                className="group cursor-pointer overflow-hidden bg-plum/30 ring-1 ring-white/10 transition-all duration-500 hover:ring-grape/60"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-ink">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col gap-1 p-5">
                  <h3 className="font-display text-xl uppercase tracking-widest2 text-white">
                    {p.name}
                  </h3>
                  <span className="font-display text-lg tracking-wide text-grape">
                    {formatCOP(p.price)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
