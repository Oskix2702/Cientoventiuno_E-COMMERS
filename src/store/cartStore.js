import { create } from 'zustand'

export const useCart = create((set, get) => ({
  items: [],
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  add: (product, selectedSize, selectedColor, selectedImage) =>
    set((state) => {
      const lineId = `${product.id}-${selectedSize}-${selectedColor}`
      const existing = state.items.find((i) => i.lineId === lineId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.lineId === lineId ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      const img = selectedImage
        || (product.variants?.[0]?.images?.[0])
        || (product.images && product.images.length > 0 ? product.images[0] : product.image)
      return {
        items: [
          ...state.items,
          {
            lineId,
            id: product.id,
            name: product.name,
            price: product.price,
            image: img,
            selectedSize,
            selectedColor,
            qty: 1,
          },
        ],
      }
    }),

  remove: (lineId) =>
    set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),

  inc: (lineId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.lineId === lineId ? { ...i, qty: i.qty + 1 } : i
      ),
    })),

  dec: (lineId) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.lineId === lineId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    })),

  clear: () => set({ items: [] }),

  count: () => get().items.reduce((n, i) => n + i.qty, 0),
  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}))
