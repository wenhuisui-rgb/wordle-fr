import { useEffect, useState } from 'react'
import './App.css'
import { GameBoard } from './components/GameBoard'
import { HelpDialog } from './components/HelpDialog'
import { Keyboard } from './components/Keyboard'
import { useWordle } from './hooks/useWordle'

function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const {
    game,
    currentGuess,
    error,
    keyboardStatuses,
    handleKey,
    startNewGame,
  } = useWordle()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (helpOpen || event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      if (event.key === 'Enter' || event.key === 'Backspace' || event.key === 'Delete' || /^\p{L}$/u.test(event.key)) {
        event.preventDefault()
        handleKey(event.key)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey, helpOpen])

  const lastGuess = game.guesses.at(-1)
  const announcement = error
    ?? (game.status === 'won'
      ? `Bravo, le mot est trouvé en ${game.guesses.length} essai${game.guesses.length > 1 ? 's' : ''}.`
      : game.status === 'lost'
        ? `La partie est terminée. Le mot était ${game.answer}.`
        : lastGuess
          ? `Essai ${game.guesses.length} : ${lastGuess.feedback.map((status) => ({ correct: 'bien placée', present: 'présente ailleurs', absent: 'absente' })[status]).join(', ')}.`
          : '')

  const resultMessage = game.status === 'won'
    ? `Bravo ! Trouvé en ${game.guesses.length} essai${game.guesses.length > 1 ? 's' : ''}.`
    : game.status === 'lost'
      ? `La partie est terminée. Le mot était ${game.answer}.`
      : null

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#accueil" aria-label="Le Mot Mystère, accueil">
          <span className="brand-mark" aria-hidden="true"><i>V</i><i>O</i><i>M</i></span>
          <span>Le Mot Mystère</span>
        </a>
        <div className="top-actions">
          <button className="text-button" type="button" onClick={() => setHelpOpen(true)}>
            <span aria-hidden="true">?</span> Règles
          </button>
          <button className="new-game-button" type="button" onClick={startNewGame}>
            Nouvelle partie
          </button>
        </div>
      </header>

      <main id="accueil" className="game-main">
        <section className="game-intro" aria-labelledby="page-title">
          <p className="eyebrow">LE RENDEZ-VOUS DES MOTS</p>
          <h1 id="page-title">Le Mot Mystère</h1>
          <p className="instructions">Un mot français de cinq lettres. Six essais pour le trouver.</p>
          <p className="color-guide">
            <span><b className="guide-dot dot-correct" aria-hidden="true">✓</b> Bien placée</span>
            <span><b className="guide-dot dot-present" aria-hidden="true">↗</b> Présente ailleurs</span>
            <span><b className="guide-dot dot-absent" aria-hidden="true">×</b> Absente</span>
          </p>
        </section>

        <section className="game-panel" aria-label="Partie en cours">
          <div className="board-meta">
            <span>VOTRE GRILLE</span>
            <span className="attempt-count">{game.guesses.length} <span>/ 6 essais</span></span>
          </div>
          <GameBoard game={game} currentGuess={currentGuess} />
          <p className={`game-message${error ? ' is-error' : ''}${resultMessage ? ' is-result' : ''}`} role="status">
            {error ?? resultMessage ?? 'À vous de jouer'}
          </p>
          <p className="screen-reader-only" aria-live="polite" aria-atomic="true">{announcement}</p>
          <Keyboard
            statuses={keyboardStatuses}
            onKey={handleKey}
            disabled={game.status !== 'playing'}
          />
          {resultMessage && (
            <button className="play-again-button" type="button" onClick={startNewGame}>
              Jouer à nouveau <span aria-hidden="true">↗</span>
            </button>
          )}
        </section>

        <p className="word-list-note">Liste locale de mots français · Sans classement ni compte</p>
      </main>

      <footer className="page-footer">
        <span>Un petit jeu de lettres, tout simplement.</span>
        <button className="footer-help" type="button" onClick={() => setHelpOpen(true)}>Comment jouer</button>
      </footer>

      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}

export default App
