import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
export function Dialog({
  title,
  description,
  children,
  onClose,
  busy = false,
  compact = false,
}: {
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  busy?: boolean
  compact?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    dialog.showModal()
    dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      dialog.close()
      if (returnFocus?.isConnected) returnFocus.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`dialog ${compact ? 'dialog-compact' : ''}`}
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onClose()
      }}
    >
      <div className="dialog-header">
        <div>
          <h2 id="dialog-title">{title}</h2>
          {description && <p id="dialog-description">{description}</p>}
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
          disabled={busy}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  )
}
