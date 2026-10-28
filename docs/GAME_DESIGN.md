# Conception du jeu Wordle français

> **Statut : conception de la version implémentée.** Le jeu fonctionne localement avec React, TypeScript et Vite. Les fichiers décrits ci-dessous correspondent à l’organisation actuelle ; les limites du dictionnaire sont précisées à la section 9.

## 1. Vue d’ensemble et objectifs

Créer un jeu de lettres en français, jouable dans le navigateur, où le joueur doit retrouver un mot secret de cinq lettres en six essais au maximum. La première version fonctionne sans serveur : les mots et la logique sont locaux au projet.

Objectifs du MVP :
- proposer une partie complète, du premier essai à la victoire ou à la défaite ;
- donner un retour vert, jaune ou gris pour chaque lettre ;
- traiter correctement les lettres répétées et les accents ;
- permettre la saisie au clavier virtuel et au clavier physique ;
- permettre de recommencer une partie ;
- rester compréhensible et testable, avec la logique de jeu séparée de l’interface.

Hors périmètre : comptes, sauvegarde en ligne, classement, API et fonctionnalités multijoueur.

## 2. Exigences fonctionnelles

- Choisir un mot secret de cinq lettres dans une liste locale.
- Autoriser au maximum six propositions valides.
- Accepter la saisie en majuscules ou minuscules.
- Accepter une proposition de cinq lettres reconnue dans le dictionnaire local ; les accents ne doivent pas empêcher une correspondance lorsqu’ils sont omis.
- Afficher les lettres saisies dans une grille de six rangées et cinq cases.
- À chaque proposition valide, afficher le résultat lettre par lettre : vert pour une position exacte, jaune pour une lettre présente ailleurs, gris pour une lettre absente.
- Bloquer les propositions et les saisies une fois la partie terminée.
- Afficher un résultat de victoire ou de défaite. En cas de défaite, révéler le mot secret.
- Offrir une action « Nouvelle partie » qui choisit un mot et réinitialise la grille, le clavier et le résultat.

Une proposition absente du dictionnaire ou qui n’a pas exactement cinq lettres ne consomme pas d’essai ; l’interface indique simplement qu’elle n’est pas acceptée.

## 3. Règles et algorithme de retour

La proposition est comparée au mot secret après normalisation. Le calcul se fait en deux passes afin qu’une occurrence de la réponse ne puisse être attribuée qu’une seule fois :

1. Comparer les lettres aux mêmes positions. Marquer les correspondances en vert et retirer ces occurrences du compte des lettres restantes de la réponse.
2. Pour chaque lettre non verte de la proposition, dans l’ordre, vérifier si le compte restant de cette lettre est supérieur à zéro. Si oui, marquer jaune et diminuer le compte ; sinon, marquer gris.

Exemple : réponse `BRUME`, proposition `EEEEE`. Le E de la dernière case est vert ; les quatre autres E sont gris. Ils ne deviennent pas jaunes, car la réponse ne contient qu’un seul E.

Les états du clavier virtuel doivent conserver le meilleur résultat rencontré pour chaque lettre : vert remplace jaune et gris, jaune remplace gris, et aucun résultat moins précis ne remplace un meilleur résultat. Cette règle évite qu’un essai ultérieur fasse régresser une touche.

## 4. Normalisation du français et gestion des accents

La normalisation doit être appliquée de façon identique à la réponse, aux propositions et aux mots du dictionnaire, aussi bien pour comparer les mots que pour noter les lettres.

Décision proposée :
- convertir en majuscules avec une locale française ;
- normaliser Unicode en NFC pour que les caractères accentués composés et décomposés aient la même représentation ;
- produire une forme de comparaison sans signes diacritiques (par exemple `ÉCOLE` et `ECOLE` deviennent tous deux `ECOLE`) ;
- valider la longueur sur la forme Unicode normalisée et limiter l’entrée aux lettres. Une lettre accentuée compte comme une lettre ;
- conserver la graphie française accentuée provenant du dictionnaire pour afficher les mots canoniques, notamment le mot révélé après une défaite.

Le dictionnaire local devrait contenir des mots canoniques avec leur orthographe française. La validation peut comparer la forme normalisée de la proposition aux formes normalisées de la liste des mots acceptés. La forme saisie et la forme canonique sont ainsi distinctes : `ECOLE` peut être accepté pour `ÉCOLE` sans afficher une orthographe incorrecte comme réponse officielle.

Pour le MVP, exclure les mots comportant des espaces, apostrophes ou traits d’union. Le traitement des ligatures comme `Œ` et des lettres accentuées autres que les variantes de `E` reste à confirmer lors de la constitution du dictionnaire ; la règle choisie devra être appliquée uniformément aux données, à la validation et au calcul des couleurs.

## 5. États et transitions de partie

État minimal proposé :
- `playing` : la partie accepte la saisie ;
- `won` : le joueur a trouvé le mot ;
- `lost` : les six essais ont été utilisés.

Transitions :
- nouvelle partie → `playing`, avec une grille vide et un mot secret choisi ;
- proposition valide incorrecte avant le sixième essai → rester en `playing` et avancer à la rangée suivante ;
- proposition correcte → `won` ;
- sixième proposition valide incorrecte → `lost` ;
- proposition invalide → conserver l’état et le nombre d’essais ;
- action « Nouvelle partie » depuis n’importe quel état → réinitialiser et passer à `playing`.

Les touches du clavier et les boutons de l’interface ne modifient l’entrée que dans l’état `playing`.

## 6. Architecture React

`App` compose l’interface et installe l’écouteur du clavier physique. Le hook `useWordle` conserve l’état de partie, les lettres saisies et les messages d’erreur, puis appelle les fonctions du domaine. Les composants affichent cet état et transmettent les actions ; ils ne décident pas eux-mêmes des couleurs.

- `App` : initialise et réinitialise la partie, coordonne les entrées, la validation et l’état final.
- `GameBoard` : affiche les six rangées.
- `GuessRow` : affiche les cinq lettres et leur statut pour une rangée.
- `Keyboard` : affiche les touches et leur meilleur statut connu.
- `HelpDialog` : explique les règles dans une boîte de dialogue native.

Les mêmes actions du hook sont appelées par le clavier physique et le clavier virtuel pour éviter deux comportements différents. Les touches sont désactivées après la fin de partie ; l’action « Nouvelle partie » reste disponible.

## 7. Structure de fichiers proposée

Les fichiers suivants sont présents ou utilisés par le jeu :

```text
src/
  App.tsx
  App.css
  index.css
  main.tsx
  components/
    GameBoard.tsx
    GameRow.tsx
    Keyboard.tsx
    HelpDialog.tsx
  hooks/
    useWordle.ts
  game/
    wordle.ts
    words.ts
    wordle.test.ts
    words.test.ts
```

Vitest exécute les tests via `npm run test` (mode interactif) et `npm run test:run` (exécution unique). Les types de domaine et les fonctions sont regroupés dans `src/game/wordle.ts` pour garder le MVP lisible.

## 8. Fonctions principales et responsabilités

- `normalizeWord(word)` : uniformise la casse et les accents et produit une forme comparable ; la validation de la longueur et des caractères peut être séparée si elle devient plus claire ainsi.
- `isValidGuess(guess, acceptedWords)` : vérifie que l’entrée contient cinq lettres autorisées et qu’elle correspond à un mot de la liste après normalisation.
- `evaluateGuess(answer, guess)` : retourne cinq statuts (`correct`, `present`, `absent`) au moyen des deux passes décrites plus haut. Fonction pure, sans dépendance React.
- `chooseAnswer(answerWords)` : sélectionne un mot de la liste des solutions.
- `getUpdatedKeyboardStatus(previousStatus, guess, feedback)` : combine les retours du nouvel essai avec les meilleurs statuts déjà connus.
- `createGame(answer)` : prépare un état neuf avec une réponse, une grille vide et l’état `playing`.
- `submitGuess(gameState, guess)` : applique la validation, ajoute un essai valide et détermine si la partie continue, est gagnée ou est perdue. Une entrée invalide ne doit pas modifier l’état des essais.

Ces fonctions et types doivent rester indépendants de React autant que possible pour pouvoir être testés sans rendre de composants.

## 9. Stratégie de tests unitaires

Vitest est configuré comme dépendance de développement, compatible avec Vite. Les fonctions pures et le corpus sont testés sans rendre de composants React et sans dépendance de test à l’exécution du jeu.

Cas à couvrir :
- lettre correcte à la bonne place, lettre présente à une autre place et lettre absente ;
- réponse `BRUME` avec proposition `EEEEE` : un seul E vert, les autres gris ;
- réponse `POMME` avec proposition `MMMMM` : seules les occurrences M effectivement présentes et positionnées sont vertes, les occurrences supplémentaires sont grises ;
- lettres répétées dans la réponse et la proposition avec un nombre d’occurrences différent, y compris les occurrences vertes déjà consommées ;
- `ECOLE`, `ecole` et `ÉCOLE` comparés à la même réponse canonique ;
- accents précomposés et caractères décomposés normalisés de façon équivalente ;
- longueur incorrecte, caractère non alphabétique et mot absent de la liste ;
- mot de cinq lettres avec accent compté comme cinq lettres ;
- victoire, défaite au sixième essai, proposition invalide sans consommation d’essai et réinitialisation d’une partie ;
- statut clavier qui ne régresse pas de vert à jaune ou gris, ni de jaune à gris.

## 10. Accessibilité et responsive design

- Rendre les touches du clavier virtuel avec des éléments bouton, un nom accessible et un ordre de tabulation logique.
- Garder la saisie clavier physique disponible, avec Entrée pour valider et Retour arrière pour effacer.
- Ne pas communiquer les résultats uniquement par la couleur : associer aux cases un libellé ou une représentation accessible de leur état.
- Annoncer les messages importants et les résultats d’un essai via une région `aria-live` appropriée, sans relire toute la grille à chaque frappe.
- Prévoir un focus visible, un contraste suffisant et des cibles tactiles assez grandes.
- Sur mobile, garder la grille lisible sans défilement horizontal ; adapter les espacements et la taille des cases et maintenir le clavier virtuel dans la zone visible autant que possible.
- Respecter les préférences de réduction des animations si des transitions visuelles sont ajoutées.

## 11. Jalons d’implémentation

1. **Terminé :** définir la normalisation et constituer une liste locale bornée avec graphies accentuées.
2. **Terminé :** implémenter et tester les fonctions pures de validation, d’évaluation, de clavier et de transition.
3. **Terminé :** remplacer l’écran de démonstration Vite par la grille et l’affichage de partie.
4. **Terminé :** ajouter le clavier virtuel AZERTY, le clavier physique, l’aide et le redémarrage.
5. **Terminé :** ajouter les états visuels, les annonces accessibles et les styles responsive avec réduction des animations.
6. **Terminé :** configurer Vitest, ESLint, le build et GitHub Actions. Le déploiement reste hors de l’implémentation actuelle.

## 12. Limites connues

- La liste de mots est locale et sélectionnée manuellement ; elle n’est ni exhaustive ni garantie comme dictionnaire général. Certains mots rares, variantes, conjugaisons ou noms propres peuvent manquer.
- Les mots avec ligature `Œ`, espaces, apostrophes ou traits d’union sont exclus. L’accentuation est ignorée pour la comparaison, mais la graphie d’origine est conservée pour l’affichage de la réponse.
- L’écran utilise un clavier latin AZERTY simplifié ; les lettres accentuées peuvent être saisies avec le clavier physique ou sans accent.
- La partie n’est pas persistée après rechargement. Il n’y a ni serveur, ni classement, ni déploiement automatique.
