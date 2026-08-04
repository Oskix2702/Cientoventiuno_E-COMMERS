import { Instagram, Twitter, Youtube } from 'lucide-react'

const cols = [
  { title: 'Tienda', links: ['Colecciones', 'Novedades', 'Envíos', 'Devoluciones'] },
  { title: 'Legal', links: ['Términos', 'Privacidad', 'Cookies', 'Aviso legal'] },
  { title: 'Contacto', links: ['Bogotá, Colombia', 'hola@cientoventiuno.co', '+57 320 000 0000'] },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <span className="font-display text-3xl uppercase tracking-widest3 text-white">
              CientoVeintiuno
            </span>
            <p className="mt-4 font-script text-2xl text-grape">
              Viste con propósito
            </p>
            <p className="mt-3 font-body text-sm text-chalk/60">
              Streetwear premium desde Bogotá, Colombia.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-lg uppercase tracking-widest2 text-white">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="font-body text-sm text-chalk/60 transition-colors hover:text-grape"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-body text-xs text-chalk/50">
            © {new Date().getFullYear()} CIENTOVEINTIUNO. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Instagram" className="text-chalk/60 transition-colors hover:text-grape">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-chalk/60 transition-colors hover:text-grape">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="text-chalk/60 transition-colors hover:text-grape">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
