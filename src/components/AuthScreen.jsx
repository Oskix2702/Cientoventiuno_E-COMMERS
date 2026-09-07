import { useState } from 'react'
import { ShoppingBag, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../store/authStore'
import { useUI } from '../store/uiStore'

const ADMIN_EMAIL = 'estebarin123@gmail.com'

export default function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const backToStore = useUI((s) => s.backToStore)
  const goAdmin = useUI((s) => s.goAdmin)

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const result = await signIn(email, password)
        const isAdmin = result?.profile?.role === 'admin' || email.toLowerCase() === ADMIN_EMAIL
        if (isAdmin) {
          goAdmin()
        } else {
          backToStore()
        }
      } else {
        await signUp(email, password)
        setError('Cuenta creada. Inicia sesión para continuar.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 pt-20">
      <div className="w-full max-w-md">
        <button
          onClick={backToStore}
          className="mb-8 flex items-center gap-2 font-display text-lg uppercase tracking-widest2 text-chalk transition-colors hover:text-grape"
        >
          <ArrowLeft size={20} />
          Volver a la tienda
        </button>

        <div className="border border-white/10 bg-plum/20 p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-grape/20">
              <ShoppingBag size={28} className="text-grape" />
            </div>
            <h1 className="font-display text-4xl uppercase tracking-widest2 text-white">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>
            <p className="mt-2 font-body text-sm text-chalk/60">
              {mode === 'login'
                ? 'Accede a tu cuenta para continuar'
                : 'Regístrate para comprar en CIENTOVEINTIUNO'}
            </p>
          </div>

          {error && (
            <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-3">
              <p className="font-body text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block font-display text-sm uppercase tracking-widest2 text-chalk">
                Correo electrónico
              </label>
              <div className="flex items-center gap-2 border border-white/15 bg-ink/50 px-3 py-3 transition-colors focus-within:border-grape">
                <Mail size={18} className="text-chalk/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-transparent font-body text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-display text-sm uppercase tracking-widest2 text-chalk">
                Contraseña
              </label>
              <div className="flex items-center gap-2 border border-white/15 bg-ink/50 px-3 py-3 transition-colors focus-within:border-grape">
                <Lock size={18} className="text-chalk/50" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-transparent font-body text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 bg-grape px-8 py-4 font-display text-lg uppercase tracking-widest2 text-white transition-all duration-300 hover:bg-grapeDark hover:shadow-[0_8px_30px_rgba(138,43,226,0.45)] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError(null)
              }}
              className="font-body text-sm text-chalk/70 transition-colors hover:text-grape"
            >
              {mode === 'login'
                ? '¿No tienes cuenta? Regístrate aquí'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
