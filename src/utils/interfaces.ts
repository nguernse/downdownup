interface GameStatistics {
  numGames: number;
  perfectCount: number;
  bestTime: number;
  secretRun: number;
}

interface Combination {
  id: number;
  direction: number;
  active: boolean;
}

interface AppState {
  stage: string;
  combination: Array<Combination>;
  timer: number;
  comboIndex: number;
  guessCount: number;
  bestCombo: number;
  currentStreak: number;
  missedCount: number;
  startTime: number;
  endTime: number;
  durationTime: number;
  isMissed: boolean;
  isDelay: boolean;
  secretCombo: number;
  secretScore: number;
  secretCount: number;
  secretStartTime: number;
  secretEndTime: number;
  secretDurationTime: number;
  secretInterval: any;
  finalSecretStartTime: number;
  finalSecretEndTime: number;
  finalSecretDuration: number;
}

export type { AppState, Combination, GameStatistics };
