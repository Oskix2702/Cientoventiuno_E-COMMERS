import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToast } from '../store/toastStore'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'border-emerald-500/40 text-emerald-300',
  error: 'border-red-500/40 text-red-300',
  info: 'border-grape/40 text-grape',
}

export default function ToastContainer() {
  const toasts = useToast((s) => s.toasts)
  const dismiss = useToast((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 border bg-ink/95 px-5 py-4 shadow-2xl backdrop-blur-md animate-slideIn ${STYLES[t.type] || STYLES.info}`}
          >
            <Icon size={20} className="flex-shrink-0" />
            <p className="font-body text-sm text-chalk">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-2 flex-shrink-0 text-chalk/40 transition-colors hover:text-white"
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
