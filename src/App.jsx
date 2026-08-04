import Header from './components/Header'
import Hero from './components/Hero'
import Collections from './components/Collections'
import About from './components/About'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Collections />
        <About />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
