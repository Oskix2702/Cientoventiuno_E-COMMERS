import Header from './components/Header'
import Hero from './components/Hero'
import Collections from './components/Collections'
import About from './components/About'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProductDetail from './components/ProductDetail'
import { useUI } from './store/uiStore'

export default function App() {
  const view = useUI((s) => s.view)

  return (
    <>
      <Header />
      <main>
        {view === 'product' ? (
          <ProductDetail />
        ) : (
          <>
            <Hero />
            <Collections />
            <About />
          </>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
