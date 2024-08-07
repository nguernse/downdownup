interface GameStatistics {
  numGames: number
  perfectCount: number
  bestTime: number
  secretRun: number
}

interface Combination {
  id: number
  direction: number
  active: boolean
}

interface AppState {
  stage: string // current mode of the game: ["waiting", "countdown", "playing", "end"]
  combination: Array<Combination> // sequence of arrow blocks
  countdownClock: number // displays a 3-2-1 go sequence to start of game
  comboIndex: number // index of the combo sequence arrow, how to traverse to the next sequence after a match
  guessCount: number // how many times someone has guessed during one round
  bestCombo: number // highest number of sequence matches in one round
  currentStreak: number // the most recent streak of sequence matches
  missedCount: number // number of misses in a round
  startTime: number // start timestamp (milliseconds) of a round
  endTime: number // end timestamp (milliseconds) of a round
  durationTime: number // time it takes to complete a round (seconds) - shorter is better
  isMissed: boolean // flag of whether a miss happened in a round
  isDelay: boolean // flag to pause key input and starting rounds during countdown and animations
  secretCombo: number // count of combo guesses, help to unlock secret mode
  secretScore: number // starting score of secret game
  secretPerfectRoundCount: number // number of consecutive secret rounds without a miss, used for calculating bonus scores
  secretRoundCount: number // number of secret rounds played
  secretStartTime: number // start timestamp (milliseconds) of secret round - used to calculate bonus scores
  secretEndTime: number // end timestamp (milliseconds) of secret round - used to calculate bonus scores
  secretDurationTime: number // time it takes to complete a secret round (seconds) - used to calculate bonus scores
  secretInterval: ReturnType<typeof setInterval> | undefined // Interval used to decrement the starting secret score. It's a race to add points versus losing points
  finalSecretStartTime: number // start timestamp (milliseconds) of secret round
  finalSecretEndTime: number // end timestamp (milliseconds) of secret round
  finalSecretDuration: number // time it takes to complete a secret round (seconds) - longer is better
}

export type { AppState, Combination, GameStatistics }
