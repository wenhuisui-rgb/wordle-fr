import { useEffect, useRef } from 'react'

interface HelpDialogProps {
  open: boolean
  onClose: () => void
}

export function HelpDialog({ open, onClose }: HelpDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="help-dialog"
      aria-labelledby="help-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose()
        }
      }}
    >
      <div className="dialog-heading">
        <h2 id="help-title">Comment jouer</h2>
        <button className="icon-button" type="button" aria-label="Fermer les règles" onClick={onClose}>
          ×
        </button>
      </div>
      <p>Trouvez le mot français de cinq lettres en six essais maximum.</p>
      <ul className="help-list">
        <li><span className="legend-mark status-correct">✓</span><span>La lettre est à la bonne place.</span></li>
        <li><span className="legend-mark status-present">↗</span><span>La lettre est dans le mot, ailleurs.</span></li>
        <li><span className="legend-mark status-absent">×</span><span>La lettre n’apparaît pas dans le mot.</span></li>
      </ul>
      <p>Les accents sont facultatifs. Validez avec Entrée ; effacez avec Retour arrière ou la touche ⌫.</p>
      <button className="dialog-close" type="button" onClick={onClose}>J’ai compris</button>
    </dialog>
  )
}
