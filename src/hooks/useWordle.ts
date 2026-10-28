import { useState } from 'react'
import {
  createGame,
  getKeyboardStatuses,
  submitGuess,
  type GameState,
} from '../game/wordle'
import { ACCEPTED_WORDS, chooseAnswer } from '../game/words'

export function useWordle() {
  const [game, setGame] = useState<GameState>(() => createGame(chooseAnswer()))
  const [currentGuess, setCurrentGuess] = useState('')
  const [error, setError] = useState<string | null>(null)

  function addLetter(letter: string) {
    if (game.status !== 'playing' || Array.from(currentGuess).length >= 5) {
      return
    }

    setCurrentGuess((guess) => `${guess}${letter.normalize('NFC').toLocaleUpperCase('fr-FR')}`)
    setError(null)
  }

  function removeLetter() {
    if (game.status !== 'playing') {
      return
    }

    const letters = Array.from(currentGuess)
    letters.pop()
    setCurrentGuess(letters.join(''))
    setError(null)
  }

  function submitCurrentGuess() {
    if (game.status !== 'playing') {
      return
    }

    const result = submitGuess(game, currentGuess, ACCEPTED_WORDS)
    setError(
      result.error === 'incomplete'
        ? 'Il faut saisir cinq lettres.'
        : result.error === 'unknown-word'
          ? 'Ce mot ne figure pas dans notre liste.'
          : null,
    )

    if (result.game !== game) {
      setGame(result.game)
      setCurrentGuess('')
    }
  }

  function handleKey(key: string) {
    if (key === 'Enter') {
      submitCurrentGuess()
    } else if (key === 'Backspace' || key === 'Delete' || key === '⌫') {
      removeLetter()
    } else if (/^\p{L}$/u.test(key)) {
      addLetter(key)
    }
  }

  function startNewGame() {
    setGame(createGame(chooseAnswer(game.answer)))
    setCurrentGuess('')
    setError(null)
  }

  return {
    game,
    currentGuess,
    error,
    keyboardStatuses: getKeyboardStatuses(game.guesses),
    addLetter,
    removeLetter,
    submitCurrentGuess,
    handleKey,
    startNewGame,
  }
}
