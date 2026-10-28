export const WORD_LENGTH = 5
export const MAX_ATTEMPTS = 6

export type LetterStatus = 'correct' | 'present' | 'absent'
export type GameStatus = 'playing' | 'won' | 'lost'

export interface GuessResult {
  word: string
  feedback: LetterStatus[]
}

export interface GameState {
  answer: string
  guesses: GuessResult[]
  status: GameStatus
}

export interface SubmitResult {
  game: GameState
  error?: 'incomplete' | 'unknown-word'
}

export function normalizeWord(word: string): string {
  return word
    .normalize('NFC')
    .toLocaleUpperCase('fr-FR')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .normalize('NFC')
}

export function isValidGuess(
  guess: string,
  acceptedWords: ReadonlySet<string>,
): boolean {
  const normalizedInput = guess.normalize('NFC')

  if (!/^\p{L}{5}$/u.test(normalizedInput)) {
    return false
  }

  const comparableGuess = normalizeWord(normalizedInput)

  return /^[A-Z]{5}$/.test(comparableGuess) && acceptedWords.has(comparableGuess)
}

export function evaluateGuess(answer: string, guess: string): LetterStatus[] {
  const answerLetters = Array.from(normalizeWord(answer))
  const guessLetters = Array.from(normalizeWord(guess))

  if (answerLetters.length !== WORD_LENGTH || guessLetters.length !== WORD_LENGTH) {
    throw new Error('La réponse et la proposition doivent contenir cinq lettres.')
  }

  const feedback: LetterStatus[] = Array(WORD_LENGTH).fill('absent')
  const remainingLetters = new Map<string, number>()

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (guessLetters[index] === answerLetters[index]) {
      feedback[index] = 'correct'
    } else {
      const letter = answerLetters[index]
      remainingLetters.set(letter, (remainingLetters.get(letter) ?? 0) + 1)
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (feedback[index] === 'correct') {
      continue
    }

    const letter = guessLetters[index]
    const remaining = remainingLetters.get(letter) ?? 0

    if (remaining > 0) {
      feedback[index] = 'present'
      remainingLetters.set(letter, remaining - 1)
    }
  }

  return feedback
}

export function createGame(answer: string): GameState {
  return { answer, guesses: [], status: 'playing' }
}

export function submitGuess(
  game: GameState,
  guess: string,
  acceptedWords: ReadonlySet<string>,
): SubmitResult {
  if (game.status !== 'playing') {
    return { game }
  }

  if (!isValidGuess(guess, acceptedWords)) {
    const letterCount = Array.from(guess.normalize('NFC')).length
    return {
      game,
      error: letterCount === WORD_LENGTH ? 'unknown-word' : 'incomplete',
    }
  }

  const word = guess.normalize('NFC').toLocaleUpperCase('fr-FR')
  const feedback = evaluateGuess(game.answer, word)
  const guesses = [...game.guesses, { word, feedback }]
  const isCorrect = feedback.every((status) => status === 'correct')
  const status: GameStatus = isCorrect
    ? 'won'
    : guesses.length >= MAX_ATTEMPTS
      ? 'lost'
      : 'playing'

  return { game: { ...game, guesses, status } }
}

export function getKeyboardStatuses(
  guesses: GuessResult[],
): Map<string, LetterStatus> {
  const priority: Record<LetterStatus, number> = {
    absent: 0,
    present: 1,
    correct: 2,
  }
  const statuses = new Map<string, LetterStatus>()

  for (const guess of guesses) {
    const letters = Array.from(normalizeWord(guess.word))

    letters.forEach((letter, index) => {
      const nextStatus = guess.feedback[index]
      const previousStatus = statuses.get(letter)

      if (!previousStatus || priority[nextStatus] > priority[previousStatus]) {
        statuses.set(letter, nextStatus)
      }
    })
  }

  return statuses
}
