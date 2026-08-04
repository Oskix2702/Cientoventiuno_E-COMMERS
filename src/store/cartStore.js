import { create } from 'zustand'

export const useCart = create((set, get) => ({
  items: [],
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  add: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...product, qty: 1 }] }
    }),

  remove: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  inc: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      ),
    })),

  dec: (id) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    })),

  clear: () => set({ items: [] }),

  count: () => get().items.reduce((n, i) => n + i.qty, 0),
  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}))
