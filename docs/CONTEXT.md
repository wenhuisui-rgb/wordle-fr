# Project Context — Wordle Français

## 1. Project Overview
Build a French-language Wordle web game. The player must guess a hidden five-letter French word in a maximum of six attempts.

## 2. Technology Stack
- React
- TypeScript
- Vite
- ESLint
- GitHub for version control and hosting

## 3. Game Rules
- The hidden word contains exactly five letters.
- The player has at most six attempts.
- After each valid guess, display letter feedback:
  - Green: correct letter in the correct position.
  - Yellow: correct letter in the wrong position.
  - Gray: letter not present in the hidden word.
- Handle repeated letters correctly.
- Accept guesses without accents when appropriate, for example, ECOLE for ÉCOLE.
- Display valid French spelling where applicable.
- The game ends when the player guesses the word or uses all six attempts.

## 4. Initial Scope
- Single-player game.
- Local word list.
- No account system or backend for the MVP.
- A restart or new-game action.
- Responsive interface for desktop and mobile.

## 5. Development Principles
- Implement the project in small, verifiable steps.
- Keep game logic separate from React components.
- Avoid unnecessary dependencies.
- Add automated tests for core game rules.
- Use ESLint and a GitHub Actions CI pipeline.
- Do not claim a feature works until it has been tested.

## 6. Expected Deliverables
- A functional web game.
- Automated tests.
- A GitHub Actions pipeline.
- A deployed web version.
- A French-language project report describing the design, implementation, tests, pipeline, and deployment.

## 7. Current Implementation Status
- The browser game, local word lists, React components, and Vitest unit tests are implemented in this repository.
- The word list is a curated sample of common words, not a comprehensive French dictionary. It excludes ligatures and multiword forms.
- GitHub Actions runs lint, unit tests, and the production build on pushes and pull requests targeting `main`.
- No backend, account system, online leaderboard, or deployment workflow is configured. Deployment remains future work.
- The French project report records the commands actually run and any remaining limitations.