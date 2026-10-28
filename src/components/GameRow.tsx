import type { LetterStatus } from '../game/wordle'

interface GameRowProps {
  letters: string[]
  feedback?: LetterStatus[]
  rowIndex: number
  active?: boolean
}

const statusLabels: Record<LetterStatus, string> = {
  correct: 'bien placée',
  present: 'présente ailleurs',
  absent: 'absente',
}

const statusSymbols: Record<LetterStatus, string> = {
  correct: '✓',
  present: '↗',
  absent: '×',
}

export function GameRow({ letters, feedback, rowIndex, active = false }: GameRowProps) {
  return (
    <div role="row" className={`game-row${active ? ' is-active' : ''}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const letter = letters[index] ?? ''
        const status = feedback?.[index]
        const label = status ? statusLabels[status] : letter ? 'à vérifier' : 'vide'

        return (
          <div
            key={`${rowIndex}-${index}`}
            role="gridcell"
            className={`game-tile${status ? ` status-${status}` : ''}${letter && !status ? ' has-letter' : ''}`}
            aria-label={`Ligne ${rowIndex + 1}, case ${index + 1} : ${letter || 'vide'}, ${label}`}
          >
            <span>{letter}</span>
            {status && <span className="tile-symbol" aria-hidden="true">{statusSymbols[status]}</span>}
          </div>
        )
      })}
    </div>
  )
}
