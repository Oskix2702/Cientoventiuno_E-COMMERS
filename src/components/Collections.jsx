import { useState } from 'react'
import { Plus, Check, ImageOff } from 'lucide-react'
import { products, formatCOP } from '../data/products'
import { useCart } from '../store/cartStore'

function ProductCard({ product }) {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAdd = () => {
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="group relative flex flex-col overflow-hidden bg-plum/30 ring-1 ring-white/10 transition-all duration-500 hover:ring-grape/60">
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
          <button
            onClick={handleAdd}
            aria-label={`Añadir ${product.name}`}
            className={`flex items-center gap-2 px-4 py-2 font-display text-base uppercase tracking-widest2 transition-all duration-300 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-grape text-white hover:scale-110 hover:bg-grapeDark hover:shadow-[0_6px_24px_rgba(138,43,226,0.45)]'
            }`}
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
            {added ? 'Añadido' : 'Añadir'}
          </button>
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
