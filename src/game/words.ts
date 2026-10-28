import { normalizeWord } from './wordle'

export const ANSWER_WORDS = [
  'ABIME', 'ABRIS', 'ACIDE', 'AIGLE', 'AIGRE', 'AIMER', 'ALBUM', 'ALLÉE',
  'AMOUR', 'ANGLE', 'ANIME', 'APPEL', 'ARBRE', 'ARGOT', 'ARMÉE', 'ASILE',
  'ASTRE', 'ATLAS', 'AVION', 'AVOIR', 'BAINS', 'BALAI', 'BALLE', 'BANDE',
  'BARBE', 'BASSE', 'BATTE', 'BELLE', 'BIÈRE', 'BILAN', 'BILLE', 'BLANC',
  'BLEUE', 'BOCAL', 'BOIRE', 'BONTÉ', 'BORNE', 'BOULE', 'BRAVE', 'BRUME',
  'BRUNE', 'BRUIT', 'CALME', 'CANAL', 'CANNE', 'CARTE', 'CHAIR', 'CHAMP',
  'CHANT', 'CHAOS', 'CHIEN', 'CHOIX', 'CHOSE', 'CHUTE', 'CIBLE', 'CIEUX',
  'CITER', 'CLAIR', 'COCHE', 'COLLE', 'COMTE', 'CONTE', 'CORDE',
  'COUDE', 'COULE', 'COURT', 'COURS', 'CRÂNE', 'CRIER', 'CROIX', 'CUIRE',
  'DANSE', 'DÉBUT', 'DENTS', 'DENSE', 'DEUIL', 'DOUCE', 'DOUZE', 'DROIT',
  'DURER', 'ÉCLAT', 'ÉCOLE', 'ÉCRAN', 'ÉCRIT', 'EFFET', 'ÉLITE', 'ENCRE',
  'ENVIE', 'ÉPOUX', 'ESSAI', 'ÉTAGE', 'ÉTOLE', 'ÉTUDE', 'EXACT', 'EXCÈS',
  'FABLE', 'FAIRE', 'FAUTE', 'FEMME', 'FERME', 'FIBRE', 'FILET', 'FILLE',
  'FLEUR', 'FOIRE', 'FONTE', 'FORCE', 'FORTE', 'FOSSE', 'FRAIS', 'FREIN',
  'FROID', 'FRONT', 'GAGNE', 'GARDE', 'GAZON', 'GENRE', 'GESTE', 'GILET',
  'GLOBE', 'GOÛTS', 'GRÂCE', 'GRAIN', 'GRAND', 'GRAVE', 'GRISE', 'GROIN',
  'HABIT', 'HAUTE', 'HERBE', 'HÉROS', 'HEURE', 'HIVER', 'HOMME', 'HONTE',
  'IMAGE', 'IMPÔT', 'INDEX', 'ISSUE', 'JADIS', 'JAUNE', 'JEUDI', 'JOINT',
  'JOUER', 'JOUET', 'JUGER', 'LAIDE', 'LAINE', 'LARGE', 'LARME', 'LAVER',
  'LENTE', 'LEVER', 'LIBRE', 'LIEUX', 'LIGNE', 'LIGUE', 'LISTE', 'LIVRE',
  'LOCAL', 'LOGER', 'LOUER', 'LOURD', 'LUTTE', 'MAGIE', 'MAINS', 'MAIRE',
  'MALIN', 'MAMAN', 'MANGE', 'MANIE', 'MARIE', 'MASSE', 'MATIN', 'MAUVE',
  'MÈCHE', 'MÉDIA', 'MELON', 'MERCI', 'MERLE', 'MÉTAL', 'MÉTRO', 'METTE',
  'MIEUX', 'MINCE', 'MONDE', 'MORAL', 'MOTIF', 'MOULE', 'MOYEN', 'MUSÉE',
  'MUTER', 'NAGER', 'NEIGE', 'NEUFS', 'NOIRE', 'NOTER', 'NUAGE', 'NULLE',
  'OBJET', 'OCÉAN', 'OMBRE', 'ONCLE', 'ONDES', 'OPÉRA', 'ORAGE', 'ORNER',
  'OUEST', 'OURSE', 'OUTIL', 'PAIRE', 'PARIS', 'PARLE', 'PARTI', 'PASSE',
  'PATTE', 'PAUSE', 'PAYER', 'PÊCHE', 'PERDU', 'PÉRIL', 'PETIT', 'PHOTO',
  'PIÈCE', 'PILOT', 'PISTE', 'PIVOT', 'PLACE', 'PLAIE', 'PLAGE', 'PLEIN',
  'PLUIE', 'PLUME', 'POÈME', 'POING', 'POINT', 'POMME', 'PORTE', 'POSER',
  'POSTE', 'POULE', 'POUCE', 'PRIER', 'PRIME', 'PRISE', 'PRIVÉ', 'PROIE',
  'PROSE', 'PROUE', 'PRUNE', 'QUAND', 'QUANT', 'QUART', 'QUASI', 'QUÊTE',
  'RADAR', 'RADIO', 'RAIDE', 'RAYON', 'REINE', 'REINS', 'REPOS', 'RESTE',
  'REVUE', 'RICHE', 'ROBOT', 'ROCHE', 'ROMAN', 'ROUGE', 'ROUTE', 'ROYAL',
  'SABLE', 'SACRE', 'SAINE', 'SAINT', 'SALLE', 'SALON', 'SAUCE', 'SAUVE',
  'SAVON', 'SCÈNE', 'SEIZE', 'SELON', 'SENSÉ', 'SÉRIE', 'SERRE', 'SEUIL',
  'SEULE', 'SIÈGE', 'SIGNE', 'SITUE', 'SOIRS', 'SOLDE', 'SOMME',
  'SONDE', 'SONNE', 'SORTE', 'SORTI', 'SOUCI', 'SOUDE', 'SOUPE', 'SOURD',
  'SUCRE', 'SUITE', 'SUPER', 'TABLE', 'TALON', 'TANTE', 'TARIF', 'TASSE',
  'TEMPS', 'TENIR', 'TERRE', 'TEXTE', 'THÈME', 'TIGRE', 'TIRER', 'TITRE',
  'TOMBE', 'TONNE', 'TOTAL', 'TRACE', 'TRAIN', 'TRAIT', 'TRAME', 'TRIER',
  'TROIS', 'TROUE', 'TUBES', 'TUILE', 'UNION', 'USAGE', 'VALET', 'VASTE',
  'VEAUX', 'VEINE', 'VENIR', 'VENTE', 'VERBE', 'VERRE',
  'VERSO', 'VERTU', 'VESTE', 'VIEUX', 'VIGNE', 'VILLE', 'VIOLE', 'VIRER',
  'VISER', 'VITRE', 'VIVRE', 'VOILE', 'VOLER', 'VOTRE', 'ZÈBRE', 'ZONES',
] as const

const additionalGuesses = [
  'ABOIE', 'ADORE', 'AGILE', 'AINSI', 'AUNES', 'AVOUE',
  'BÉTON', 'BLOND', 'BONUS', 'BOUTS', 'BRISA', 'BRISE', 'CACHÉ',
  'CADRE', 'CAMPÉ', 'CARRÉ', 'CAUSE', 'CÈDRE', 'CELLE', 'CERNE', 'CETTE',
  'CIVIL', 'CLONE', 'CORPS', 'COUPE', 'CRÉER', 'CUISE',
  'DÉCOR', 'DÉLIT', 'DÉPÔT', 'DÎNER', 'DOIGT', 'DONNE', 'ÉGALE', 'ÉGARD',
  'ÉLUDE', 'ÉPICE', 'ÉTÉES', 'FAÇON', 'FÉLON', 'FÊTER', 'FONDU',
  'GAMME', 'GÉANT', 'GÉRER', 'GLACE', 'GRAAL', 'GRAND', 'HÂTER', 'HÉLAS',
  'JOLIE', 'JONCS', 'JOUES', 'LÂCHE', 'LÉGER', 'MÊLER', 'NACRE',
  'PÂLES', 'PÂTIR', 'PÉAGE', 'PÉRIR', 'PÔLES', 'RÊVER', 'RÉCIT',
  'RÔDER', 'TÂCHE', 'VÉRIN', 'VÊTIR',
] as const

export const ACCEPTED_WORDS: ReadonlySet<string> = new Set(
  [...ANSWER_WORDS, ...additionalGuesses].map(normalizeWord),
)

export function chooseAnswer(previousAnswer?: string): string {
  const choices = ANSWER_WORDS.filter((answer) => answer !== previousAnswer)
  const index = Math.floor(Math.random() * choices.length)

  return choices[index] ?? ANSWER_WORDS[0]
}
