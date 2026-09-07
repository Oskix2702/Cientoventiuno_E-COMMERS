import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 animate-fadeIn" onClick={onCancel} />
      <div className="relative w-full max-w-md border border-white/10 bg-ink p-6 shadow-2xl animate-riseUp">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/15">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl uppercase tracking-widest2 text-white">{title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-chalk/70">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center bg-grape px-6 py-3 font-display text-base uppercase tracking-widest2 text-white transition-all hover:bg-grapeDark hover:shadow-[0_6px_24px_rgba(138,43,226,0.45)] active:scale-95"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="border border-white/20 px-6 py-3 font-display text-base uppercase tracking-widest2 text-chalk transition-colors hover:border-white/40 hover:text-white"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
