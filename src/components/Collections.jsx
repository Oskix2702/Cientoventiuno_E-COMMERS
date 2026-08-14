import { useState } from 'react'
import { ImageOff, Eye, ArrowRight } from 'lucide-react'
import { products, formatCOP } from '../data/products'
import { useUI } from '../store/uiStore'

function ProductCard({ product }) {
  const openProduct = useUI((s) => s.openProduct)
  const [imgError, setImgError] = useState(false)

  return (
    <article
      onClick={() => openProduct(product.id)}
      className="group relative flex cursor-pointer flex-col overflow-hidden bg-plum/30 ring-1 ring-white/10 transition-all duration-500 hover:ring-grape/60"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink">
        {imgError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-plum/40">
            <ImageOff size={40} className="text-white/30" />
            <span className="font-display text-xl uppercase tracking-widest2 text-white/40">
              CIENTOVEINTIUNO
            </span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/40">
          <span className="flex items-center gap-2 font-display text-lg uppercase tracking-widest2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Eye size={20} />
            Ver detalle
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl uppercase tracking-widest2 text-white">
          {product.name}
        </h3>
        <p className="font-body text-sm leading-relaxed text-chalk/80">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-2xl tracking-wide text-white">
            {formatCOP(product.price)}
          </span>
          <span className="flex items-center gap-2 bg-grape px-4 py-2 font-display text-base uppercase tracking-widest2 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-grapeDark group-hover:shadow-[0_6px_24px_rgba(138,43,226,0.45)]">
            Ver
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </article>
  )
}

export default function Collections() {
  return (
    <section id="colecciones" className="bg-ink px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="font-script text-3xl text-grape">Colecciones</span>
          <h2 className="section-title mt-2">La Tienda</h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-chalk/70">
            Piezas diseñadas en Bogotá. Ediciones limitadas, cortes oversize y
            tejidos premium.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
