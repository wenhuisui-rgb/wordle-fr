import { describe, expect, it } from 'vitest'
import {
  createGame,
  evaluateGuess,
  getKeyboardStatuses,
  isValidGuess,
  normalizeWord,
  submitGuess,
  type LetterStatus,
} from './wordle'

const acceptedWords = new Set(['BRUME', 'MAMIE', 'ECOLE', 'POMME', 'TABLE'])

const allCorrect: LetterStatus[] = Array(5).fill('correct')

describe('évaluation des propositions', () => {
  it('marque les lettres bien placées, présentes et absentes', () => {
    expect(evaluateGuess('BRUME', 'BERET')).toEqual([
      'correct',
      'present',
      'present',
      'absent',
      'absent',
    ])
  })

  it('ne donne pas plusieurs correspondances pour une seule occurrence', () => {
    expect(evaluateGuess('BRUME', 'EEEEE')).toEqual([
      'absent',
      'absent',
      'absent',
      'absent',
      'correct',
    ])
  })

  it('attribue les occurrences restantes quand la réponse en contient davantage', () => {
    expect(evaluateGuess('MAMIE', 'MMXXX')).toEqual([
      'correct',
      'present',
      'absent',
      'absent',
      'absent',
    ])
  })

  it('ne crée pas de jaune supplémentaire quand la proposition a moins de répétitions', () => {
    expect(evaluateGuess('MAMIE', 'AIMXX')).toEqual([
      'present',
      'present',
      'correct',
      'absent',
      'absent',
    ])
  })

  it('consomme d’abord toutes les occurrences déjà bien placées', () => {
    expect(evaluateGuess('MAMIE', 'MMMMM')).toEqual([
      'correct',
      'absent',
      'correct',
      'absent',
      'absent',
    ])
  })

  it('compare les accents et la casse sans les confondre avec des lettres en plus', () => {
    expect(evaluateGuess('ÉCOLE', 'ecole')).toEqual(allCorrect)
    expect(normalizeWord('E\u0301cole')).toBe('ECOLE')
    expect(normalizeWord('école')).toBe('ECOLE')
  })
})

describe('validation et transitions', () => {
  it('accepte les minuscules et les variantes accentuées d’un mot autorisé', () => {
    expect(isValidGuess('brume', acceptedWords)).toBe(true)
    expect(isValidGuess('ECOLE', acceptedWords)).toBe(true)
    expect(isValidGuess('École', acceptedWords)).toBe(true)
  })

  it('refuse les longueurs incorrectes, les caractères non alphabétiques et les mots inconnus', () => {
    expect(isValidGuess('BRUM', acceptedWords)).toBe(false)
    expect(isValidGuess('BRUMES', acceptedWords)).toBe(false)
    expect(isValidGuess('BRU!E', acceptedWords)).toBe(false)
    expect(isValidGuess('ZZZZZ', acceptedWords)).toBe(false)
  })

  it('termine une partie gagnée et ignore les propositions suivantes', () => {
    const result = submitGuess(createGame('ÉCOLE'), 'ecole', acceptedWords)

    expect(result.game.status).toBe('won')
    expect(result.game.guesses[0].feedback).toEqual(allCorrect)
    expect(submitGuess(result.game, 'BRUME', acceptedWords).game).toBe(result.game)
  })

  it('termine après six propositions valides incorrectes', () => {
    const guesses = ['TABLE', 'POMME', 'MAMIE', 'BRUME', 'TABLE', 'POMME']
    const words = new Set([...acceptedWords, 'TABLE', 'POMME'])
    const finalGame = guesses.reduce(
      (game, guess) => submitGuess(game, guess, words).game,
      createGame('ÉCOLE'),
    )

    expect(finalGame.status).toBe('lost')
    expect(finalGame.guesses).toHaveLength(6)
    expect(submitGuess(finalGame, 'ECOLE', words).game).toBe(finalGame)
  })

  it('ne consomme pas un essai pour une proposition invalide', () => {
    const game = createGame('BRUME')
    const result = submitGuess(game, 'ZZZZZ', acceptedWords)

    expect(result.error).toBe('unknown-word')
    expect(result.game).toBe(game)
    expect(result.game.guesses).toHaveLength(0)
  })

  it('garde le meilleur état connu pour chaque touche', () => {
    const game = submitGuess(createGame('BRUME'), 'TABLE', acceptedWords).game
    const statuses = getKeyboardStatuses(game.guesses)

    expect(statuses.get('B')).toBe('present')
    expect(statuses.get('T')).toBe('absent')
  })
})
