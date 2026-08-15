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

export default function App() {
  const view = useUI((s) => s.view)
  const { init, user, profile, loading } = useAuth()

  useEffect(() => { init() }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="font-display text-2xl uppercase tracking-widest2 text-chalk/50">Cargando...</p>
      </div>
    )
  }

  const isAdmin = profile?.role === 'admin'

  let content
  if (view === 'login') {
    content = <AuthScreen />
  } else if (view === 'admin') {
    content = isAdmin ? <AdminDashboard /> : <AuthScreen />
  } else if (view === 'product') {
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
