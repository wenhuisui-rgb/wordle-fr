import { describe, expect, it } from 'vitest'
import { ACCEPTED_WORDS, ANSWER_WORDS } from './words'
import { normalizeWord } from './wordle'

describe('liste locale de mots', () => {
  it('ne contient que des réponses de cinq lettres comparables', () => {
    for (const answer of ANSWER_WORDS) {
      expect(normalizeWord(answer), answer).toMatch(/^[A-Z]{5}$/)
    }
  })

  it('accepte chaque réponse possible comme proposition', () => {
    for (const answer of ANSWER_WORDS) {
      expect(ACCEPTED_WORDS.has(normalizeWord(answer)), answer).toBe(true)
    }
  })

  it('ne contient que des propositions de cinq lettres comparables', () => {
    for (const word of ACCEPTED_WORDS) {
      expect(word).toMatch(/^[A-Z]{5}$/)
    }
  })

  it('propose plusieurs centaines de réponses sans prétendre être un dictionnaire complet', () => {
    expect(ANSWER_WORDS.length).toBeGreaterThan(200)
  })
})
