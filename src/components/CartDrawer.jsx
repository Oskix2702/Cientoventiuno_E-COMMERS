import { useEffect } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../store/cartStore'
import { formatCOP } from '../data/products'

export default function CartDrawer() {
  const { isOpen, close, items, inc, dec, remove, subtotal } = useCart()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const total = subtotal()

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/70 animate-fadeIn"
        onClick={close}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ink shadow-2xl animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-grape" />
            <h2 className="font-display text-2xl uppercase tracking-widest2 text-white">
              Carrito
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Cerrar carrito"
            className="rounded-full p-2 text-chalk transition-colors hover:text-grape"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={48} className="text-white/20" />
              <p className="font-display text-2xl uppercase tracking-widest2 text-chalk/60">
                Tu carrito está vacío
              </p>
              <button onClick={close} className="btn-ghost">
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-white/10 pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 flex-shrink-0 object-cover ring-1 ring-white/10"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg uppercase tracking-wide text-white">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label="Eliminar"
                        className="text-chalk/50 transition-colors hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <span className="font-body text-sm text-chalk/60">
                      {formatCOP(item.price)}
                    </span>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3 ring-1 ring-white/15">
                        <button
                          onClick={() => dec(item.id)}
                          aria-label="Disminuir"
                          className="p-1.5 text-chalk transition-colors hover:text-grape"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-[24px] text-center font-display text-lg text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => inc(item.id)}
                          aria-label="Aumentar"
                          className="p-1.5 text-chalk transition-colors hover:text-grape"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-display text-xl text-white">
                        {formatCOP(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-xl uppercase tracking-widest2 text-chalk">
                Subtotal
              </span>
              <span className="font-display text-3xl text-white">
                {formatCOP(total)}
              </span>
            </div>
            <p className="mb-4 font-body text-xs text-chalk/50">
              Impuestos incluidos. Envío calculado al pagar.
            </p>
            <button className="btn-primary w-full">
              Proceder al Pago
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
