import { create } from 'zustand'

function readHash() {
  const hash = window.location.hash.replace(/^#/, '')
  if (hash === '/admin') return { view: 'admin', selectedProductId: null }
  if (hash === '/login') return { view: 'login', selectedProductId: null }
  if (hash.startsWith('/product/')) {
    const id = hash.replace('/product/', '')
    return { view: 'product', selectedProductId: id }
  }
  return { view: 'store', selectedProductId: null }
}

function writeHash(view, selectedProductId) {
  let hash = '#/'
  if (view === 'admin') hash = '#/admin'
  else if (view === 'login') hash = '#/login'
  else if (view === 'product' && selectedProductId) hash = `#/product/${selectedProductId}`
  if (window.location.hash !== hash) {
    window.history.replaceState(null, '', hash)
  }
}

const initial = readHash()

export const useUI = create((set, get) => ({
  view: initial.view,
  selectedProductId: initial.selectedProductId,

  openProduct: (id) => {
    set({ view: 'product', selectedProductId: id })
    writeHash('product', id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  },
  backToStore: () => {
    set({ view: 'store', selectedProductId: null })
    writeHash('store', null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  },
  goAdmin: () => {
    set({ view: 'admin' })
    writeHash('admin', null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  },
  goLogin: () => {
    set({ view: 'login' })
    writeHash('login', null)
  },
  syncFromHash: () => {
    const { view, selectedProductId } = readHash()
    set({ view, selectedProductId })
  },
}))

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => useUI.getState().syncFromHash())
}
