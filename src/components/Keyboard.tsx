import type { LetterStatus } from '../game/wordle'

interface KeyboardProps {
  statuses: Map<string, LetterStatus>
  onKey: (key: string) => void
  disabled: boolean
}

const keyboardRows = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'DELETE'],
]

const symbols: Record<LetterStatus, string> = {
  correct: '✓',
  present: '↗',
  absent: '×',
}

export function Keyboard({ statuses, onKey, disabled }: KeyboardProps) {
  return (
    <div className="keyboard" aria-label="Clavier AZERTY">
      {keyboardRows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => {
            const status = statuses.get(key)
            const isAction = key === 'ENTER' || key === 'DELETE'
            const label = key === 'ENTER' ? 'Entrée' : key === 'DELETE' ? 'Effacer la dernière lettre' : key

            return (
              <button
                className={`key${isAction ? ' key-action' : ''}${status ? ` status-${status}` : ''}`}
                key={key}
                type="button"
                aria-label={label}
                title={label}
                disabled={disabled}
                onClick={() => onKey(key === 'ENTER' ? 'Enter' : key === 'DELETE' ? 'Backspace' : key)}
              >
                {key === 'ENTER' ? 'Entrée' : key === 'DELETE' ? '⌫' : key}
                {status && <span className="key-symbol" aria-hidden="true">{symbols[status]}</span>}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
