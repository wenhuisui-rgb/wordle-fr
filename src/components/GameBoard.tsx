import { MAX_ATTEMPTS } from '../game/wordle'
import type { GameState } from '../game/wordle'
import { GameRow } from './GameRow'

interface GameBoardProps {
  game: GameState
  currentGuess: string
}

export function GameBoard({ game, currentGuess }: GameBoardProps) {
  return (
    <div className="game-board" role="grid" aria-label="Grille de jeu, six essais de cinq lettres">
      {Array.from({ length: MAX_ATTEMPTS }, (_, index) => {
        const guess = game.guesses[index]
        const isCurrentRow = !guess && index === game.guesses.length && game.status === 'playing'
        const letters = guess ? Array.from(guess.word) : isCurrentRow ? Array.from(currentGuess) : []

        return (
          <GameRow
            key={index}
            rowIndex={index}
            letters={letters}
            feedback={guess?.feedback}
            active={isCurrentRow}
          />
        )
      })}
    </div>
  )
}
