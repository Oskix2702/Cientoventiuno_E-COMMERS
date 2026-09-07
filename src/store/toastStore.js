import { create } from 'zustand'

let nextId = 0

export const useToast = create((set, get) => ({
  toasts: [],

  push: (opts) => {
    const id = ++nextId
    const toast = {
      id,
      message: typeof opts === 'string' ? opts : opts.message,
      type: typeof opts === 'string' ? 'info' : (opts.type || 'info'),
      duration: typeof opts === 'object' && opts.duration != null ? opts.duration : 3500,
    }
    set((s) => ({ toasts: [...s.toasts, toast] }))
    if (toast.duration > 0) {
      setTimeout(() => get().dismiss(id), toast.duration)
    }
    return id
  },

  success: (message, duration) => get().push({ message, type: 'success', duration }),
  error: (message, duration) => get().push({ message, type: 'error', duration }),
  info: (message, duration) => get().push({ message, type: 'info', duration }),

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
