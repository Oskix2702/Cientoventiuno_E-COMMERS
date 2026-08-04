const aboutImg =
  'https://images.pexels.com/photos/35005242/pexels-photo-35005242.jpeg?auto=compress&cs=tinysrgb&w=900'

export default function About() {
  return (
    <section
      id="quienes"
      className="bg-plum/40 px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative order-2 md:order-1">
          <div className="overflow-hidden ring-1 ring-white/15">
            <img
              src={aboutImg}
              alt="Retrato urbano CIENTOVEINTIUNO"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 hidden bg-grape px-6 py-4 sm:block">
            <span className="font-display text-2xl uppercase tracking-widest2 text-white">
              Bogotá · 121
            </span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="font-script text-3xl text-grape">Quiénes somos</span>
          <h2 className="section-title mt-2">Streetwear con propósito</h2>
          <div className="mt-6 space-y-4 font-body text-chalk/85">
            <p>
              CIENTOVEINTIUNO nace en el corazón de Bogotá, entre el asfalto de
              la Avenida 26 y el ritmo de una ciudad que no duerme. No hacemos
              ropa: hacemos testimonios que se llevan puestos.
            </p>
            <p>
              Cada pieza es una declaración. Viste con propósito, camina con
              gracia y deja que tu estilo hable por ti antes que las palabras.
              Somos streetwear premium, hecho en Colombia para el mundo.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#colecciones" className="btn-primary">
              Ver Colección
            </a>
            <a href="#inicio" className="btn-ghost">
              Inicio
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
