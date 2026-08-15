import { create } from 'zustand'

export const useUI = create((set) => ({
  view: 'store',
  selectedProductId: null,

  openProduct: (id) => {
    set({ view: 'product', selectedProductId: id })
    window.scrollTo({ top: 0, behavior: 'instant' })
  },
  backToStore: () => set({ view: 'store', selectedProductId: null }),
  goAdmin: () => set({ view: 'admin' }),
  goLogin: () => set({ view: 'login' }),
}))
