# Rapport de projet — Le Mot Mystère

## Présentation du projet

Le Mot Mystère est un jeu de lettres en français exécuté dans le navigateur. Le joueur découvre un mot de cinq lettres en six essais au maximum. L’application fonctionne avec des données et une logique embarquées ; aucun serveur ni accès réseau n’est requis pour jouer.

## Objectifs

- Fournir une partie complète avec clavier physique et clavier virtuel AZERTY.
- Indiquer les lettres correctes, présentes ailleurs ou absentes sans erreur sur les répétitions.
- Accepter la casse et les accents de façon cohérente.
- Rendre le jeu utilisable sur ordinateur et mobile, avec des contrôles accessibles.
- Garder le domaine de jeu séparé des composants React.

**État :** le jeu, les tests automatisés, la documentation et le workflow CI sont présents. Aucun déploiement n’a été réalisé dans le cadre de ce travail.

## Technologies utilisées

- React 19 et TypeScript pour l’interface et les types.
- Vite 8 pour le serveur de développement et le build.
- ESLint pour l’analyse statique.
- Vitest comme dépendance de développement pour les tests unitaires.
- GitHub Actions pour lancer les contrôles sur les changements ciblant `main`.

## Architecture

- `src/App.tsx` compose l’écran et raccorde le clavier physique.
- `src/hooks/useWordle.ts` gère les états, la saisie et les actions d’une partie.
- `src/components/GameBoard.tsx` et `GameRow.tsx` affichent les six lignes et les statuts.
- `src/components/Keyboard.tsx` affiche le clavier AZERTY et les meilleurs statuts connus.
- `src/components/HelpDialog.tsx` présente les règles.
- `src/game/wordle.ts` contient les types et la logique pure de normalisation, validation, évaluation et transitions.
- `src/game/words.ts` contient les réponses possibles et les propositions supplémentaires.
- `src/game/wordle.test.ts` teste les règles ; `src/game/words.test.ts` vérifie le corpus.
- `.github/workflows/ci.yml` exécute l’installation, ESLint, les tests et le build.

## Règles du jeu

La partie propose six essais de cinq lettres. La validation accepte uniquement un mot présent dans la liste locale. Un essai invalide ne consomme pas de tentative. Une réponse trouvée termine la partie par une victoire ; six propositions valides incorrectes terminent la partie par une défaite et révèlent la réponse. Les saisies sont ignorées après la fin. Le bouton « Nouvelle partie » remet l’état à zéro et choisit une nouvelle réponse.

Le retour est calculé en deux passes : les correspondances exactes sont marquées en premier, puis chaque lettre restante de la proposition reçoit le statut « présente ailleurs » uniquement s’il reste une occurrence correspondante dans la réponse. Les occurrences déjà utilisées sont retirées du compte. Pour le clavier, un statut vert ne peut pas être remplacé par jaune ou gris, et jaune ne peut pas être remplacé par gris.

## Gestion des accents et des lettres répétées

Les mots sont normalisés en Unicode NFC, convertis en majuscules françaises, puis comparés sans signes diacritiques. Ainsi, `ECOLE`, `ecole` et `ÉCOLE` correspondent à la même forme de comparaison. Les caractères accentués sont composés en une lettre par NFC et les entrées sont ensuite validées comme cinq lettres Unicode. La forme accentuée du mot secret demeure séparée et est conservée à l’affichage.

La validation vérifie à la fois que l’entrée contient cinq lettres et que sa forme normalisée se trouve dans la liste acceptée. Une chaîne arbitraire ne devient donc pas valide uniquement parce qu’elle peut être normalisée en cinq lettres.

L’algorithme de notation consomme chaque occurrence au plus une fois. Les tests couvrent les doublons présents dans la réponse, les doublons excédentaires dans une proposition et les correspondances exactes qui consomment une occurrence avant la seconde passe.

## Tests automatisés

Vitest exécute deux fichiers de tests, soit **16 tests passés** lors de la vérification finale. Ils couvrent les statuts vert/jaune/gris, les lettres répétées dans les deux sens, les accents et la casse, les mots incomplets ou non autorisés, les victoires et défaites, le blocage après la fin, les statuts du clavier et la validité de toutes les réponses du corpus.

## Pipeline CI

`.github/workflows/ci.yml` cible les pushes et les pull requests vers `main`. Il utilise Node.js 24 et `npm ci`, puis exécute `npm run lint`, `npm run test:run` et `npm run build`. Le workflow a été ajouté au dépôt, mais n’a pas été exécuté par un runner GitHub dans ce travail.

## Installation et lancement

Prérequis : Node.js 24 et npm. Depuis la racine du dépôt :

```bash
npm ci
npm run dev
```

Pour exécuter les contrôles localement :

```bash
npm run lint
npm run test:run
npm run build
```

`npm run test` lance Vitest en mode interactif ; `npm run test:run` exécute les tests une seule fois.

## Limites connues

- La liste contient plus de 200 réponses sélectionnées manuellement et des propositions supplémentaires. Ce corpus est volontairement borné, n’est pas un dictionnaire français complet et peut refuser des mots pourtant corrects.
- Les mots avec ligature `Œ`, espaces, apostrophes ou traits d’union ne sont pas inclus.
- Les accents sont ignorés pour la comparaison ; la liste ne distingue donc pas les mots qui ne diffèrent que par un accent.
- La partie n’est pas conservée après le rechargement de la page.
- Aucun compte, classement, backend, service externe, pipeline de déploiement ou site publié n’est fourni.
- Les vérifications exécutées sont des tests unitaires, ESLint et un build de production ; aucun test navigateur automatisé ni audit d’accessibilité spécialisé n’a été effectué.

## Améliorations possibles

- Élargir et revoir la liste avec une source documentée et une licence compatible, puis faire relire les entrées.
- Ajouter des tests d’interaction de composants et des parcours navigateur sur ordinateur et mobile.
- Ajouter une option de saisie explicite pour les accents si l’expérience le nécessite.
- Ajouter une persistance locale facultative ou un mode de partie quotidienne, sans introduire de backend.
- Mettre en place et observer une procédure de déploiement après décision sur l’hébergement.

## Résultats réellement exécutés

- `npm install --save-dev vitest` : terminé ; npm a signalé zéro vulnérabilité lors de l’installation.
- `npm run build` : réussi ; TypeScript et Vite ont produit le bundle de production.
- `npm run lint` : réussi sans erreur.
- `npm run test:run` : réussi, 2 fichiers de tests et 16 tests.
- Les commandes `npm ci` et le workflow GitHub Actions ne sont pas rapportés comme exécutés localement.
