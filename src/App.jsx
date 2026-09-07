import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Collections from './components/Collections'
import About from './components/About'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProductDetail from './components/ProductDetail'
import AuthScreen from './components/AuthScreen'
import AdminDashboard from './components/AdminDashboard'
import { useUI } from './store/uiStore'
import { useAuth } from './store/authStore'

const ADMIN_EMAIL = 'estebarin123@gmail.com'

export default function App() {
  const view = useUI((s) => s.view)
  const backToStore = useUI((s) => s.backToStore)
  const goLogin = useUI((s) => s.goLogin)
  const { init, user, profile, loading } = useAuth()

  useEffect(() => { init() }, [])

  const isAdmin = profile?.role === 'admin' || (user?.email?.toLowerCase() === ADMIN_EMAIL)

  // Route protection: block non-admins from /admin
  useEffect(() => {
    if (view === 'admin' && !loading) {
      if (!isAdmin) {
        if (user) { backToStore() } else { goLogin() }
      }
    }
  }, [view, loading, profile, user, backToStore, goLogin, isAdmin])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="font-display text-2xl uppercase tracking-widest2 text-chalk/50">Cargando...</p>
      </div>
    )
  }

  // Admin gets its own standalone layout — no store header/footer/cart
  if (view === 'admin') {
    return isAdmin ? <AdminDashboard /> : <AuthScreen />
  }

  // Login screen also gets a minimal layout
  if (view === 'login') {
    return <AuthScreen />
  }

  // Store layout: header + content + footer + cart
  let content
  if (view === 'product') {
    content = <ProductDetail />
  } else {
    content = (
      <>
        <Hero />
        <Collections />
        <About />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>{content}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
