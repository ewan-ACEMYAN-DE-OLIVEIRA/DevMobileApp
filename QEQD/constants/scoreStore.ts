type ScoreState = {
  [category: string]: { score: number; total: number };
};

// Les scores de départ (à zéro !)
let scores: ScoreState = {
  'Personnalités': { score: 0, total: 0 },
  'Géographie': { score: 0, total: 0 },
  'Cinéma': { score: 0, total: 0 },
  'Sport': { score: 0, total: 0 },
};

type Listener = () => void;
const listeners = new Set<Listener>();

export const scoreStore = {
  // Ajoute les points gagnés à la fin d'une partie
  addScore(category: string, points: number, totalQuestions: number) {
    scores = {
      ...scores,
      [category]: {
        score: (scores[category]?.score || 0) + points,
        total: (scores[category]?.total || 0) + totalQuestions,
      }
    };
    listeners.forEach(listener => listener());
  },
  
  // Permet au Dashboard d'écouter les changements en direct
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  // Renvoie les scores actuels
  getSnapshot() {
    return scores;
  }
};