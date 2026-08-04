import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../store/cartStore'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Colecciones', href: '#colecciones' },
  { label: 'Quiénes Somos', href: '#quienes' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const openCart = useCart((s) => s.open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#inicio"
          className="font-display text-3xl uppercase tracking-widest3 text-white transition-colors hover:text-grape sm:text-4xl"
        >
          CientoVeintiuno
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative font-display text-lg uppercase tracking-widest2 text-chalk transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-grape after:transition-all hover:text-white hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative rounded-full p-2 text-white transition-colors hover:text-grape"
          >
            <ShoppingBag size={24} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-grape px-1 font-display text-xs text-white">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="rounded-full p-2 text-white md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 animate-fadeIn"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-ink p-6 shadow-2xl animate-slideIn">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-2xl uppercase tracking-widest2 text-white">
                Menú
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
                className="text-chalk hover:text-white"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-2xl uppercase tracking-widest2 text-chalk transition-colors hover:text-grape"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
