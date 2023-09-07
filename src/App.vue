<script setup lang="ts">
/******************************************************
 * IMPORTS
 ******************************************************/
import checkMatch from "./utils/checkMatch";
import { generateComboSet } from "./utils/generateCombos";
import { DirectionCodes, KeyCodes } from "./utils/enums";
import type { GameStatistics, AppState } from "./utils/interfaces";
import { onMounted, onUnmounted, reactive, computed } from "vue";
import HelpButton from "./components/HelpButton.vue";
import StatsButton from "./components/StatsButton.vue";
import ComboSquare from "./components/ComboSquare.vue";
import OneRow from "./components/OneRow.vue";
import TheGrid from "./components/TheGrid.vue";
import CustomButton from "./components/CustomButton.vue";
import DisplayNumber from "./components/DisplayNumber.vue";
import ScoreCard from "./components/ScoreCard.vue";
import GameTitle from "./components/GameTitle.vue";

/******************************************************
 * STATE
 ******************************************************/

const state: AppState = reactive({
  stage: "waiting",
  combination: generateComboSet(),
  countdownClock: 3,
  comboIndex: 0,
  guessCount: 0,
  bestCombo: 0,
  currentStreak: 0,
  missedCount: 0,
  startTime: 0,
  endTime: 0,
  durationTime: Infinity,
  isMissed: false,
  isDelay: false,
  secretCombo: 0,
  secretScore: 5000,
  secretPerfectRoundCount: 0,
  secretRoundCount: 0,
  secretStartTime: 0,
  secretEndTime: 0,
  secretDurationTime: Infinity,
  secretInterval: null,
  finalSecretStartTime: 0,
  finalSecretEndTime: 0,
  finalSecretDuration: 0,
});

const isDduMode = computed(() => {
  return state.secretCombo > 2;
});

/******************************************************
 * METHODS
 ******************************************************/

/**
 * Resets the Game's state to a clean slate for next round.
 */
function resetState() {
  state.stage = "waiting";
  state.guessCount = 0;
  state.comboIndex = 0;
  state.bestCombo = 0;
  state.currentStreak = 0;
  state.startTime = 0;
  state.endTime = 0;
  state.durationTime = Infinity;
  state.missedCount = 0;
  state.isMissed = false;
  state.isDelay = false;
  state.combination = generateComboSet();

  if (!isDduMode.value) {
    state.secretCombo = 0;
    state.secretScore = 5000;
    state.secretPerfectRoundCount = 0;
    state.secretRoundCount = 0;
    state.secretStartTime = 0;
    state.secretEndTime = 0;
    state.secretDurationTime = Infinity;
    state.secretInterval = null;
    state.finalSecretStartTime = 0;
    state.finalSecretEndTime = 0;
    state.finalSecretDuration = 0;
  }
}

/**
 * Function to restart the state of the game.
 */
function restartGame() {
  resetState();
  startGame();
}

/**
 * Starts the combination game. Steps:
 * 1. Countdown to start of game
 * 2. Display sequence of combination directions
 * 3. Monitor user input
 */
function startGame() {
  state.stage = "countdown";

  // Trigger countdownClock
  const countdownInterval = setInterval(function () {
    state.countdownClock -= 1;

    if (state.countdownClock === 0) {
      state.countdownClock = 3;
      state.stage = "playing";
      state.startTime = new Date().getTime();

      if (isDduMode.value) {
        state.secretStartTime = new Date().getTime();
        state.finalSecretStartTime = new Date().getTime();
        state.secretInterval = startSecretTimer();
      }

      clearInterval(countdownInterval);
    }
  }, 1000);
}

/**
 * Event Listener to observe what the user types on the keyboard.
 * This is how we monitor the game.
 *
 * @param keyCode {number} - Keycode value for keystroke
 * @param shiftKey {boolean} - Flag for if shift key is used during entering a keycode.
 */
function listenKey({
  keyCode,
  shiftKey,
}: {
  keyCode: number;
  shiftKey: boolean;
}) {
  if (state.stage !== "playing" && state.stage !== "countdown") {
    checkSecretCombo(keyCode, shiftKey);
  }

  if (state.isDelay) {
    return;
  }

  /**
   * LISTEN DURING GAME
   */
  if (state.stage === "playing") {
    // Ignore non-arrow keystrokes during game play
    // Do not want accidental hits to count towards score
    if (!(keyCode in DirectionCodes)) {
      return;
    }

    state.guessCount += 1;
    const { direction } = state.combination[state.comboIndex];

    if (checkMatch(keyCode, [direction])) {
      handleMatch();
    } else {
      handleMiss();
    }

    handleFinishCheck();
    /**
     * LISTEN AFTER GAME
     */
  } else if (
    state.stage === "end" &&
    checkMatch(keyCode, [KeyCodes.Return, KeyCodes.Space])
  ) {
    restartGame();
  } else if (
    state.stage === "waiting" &&
    checkMatch(keyCode, [KeyCodes.Return, KeyCodes.Space])
  ) {
    startGame();
  }
}

/**
 * Ends the current game and displays your score
 */
function endGame() {
  state.isDelay = true;
  state.endTime = new Date().getTime();
  state.durationTime = (state.endTime - state.startTime) / 1000;

  setTimeout(() => {
    state.stage = "end";
    state.isDelay = false;

    saveGameStats();
  }, 500); // sync ending to color fill transition of last block 0.5s
}

/**
 * Method to handle calculating end game stats in normal mode.
 * If in secret mode it calculates durations for bonus point structure and continues the game.
 */
function handleFinishCheck() {
  state.bestCombo = Math.max(state.currentStreak, state.bestCombo);

  if (!isDduMode.value && state.comboIndex > 4) {
    endGame();
  } else if (isDduMode.value && state.comboIndex > 4) {
    state.secretEndTime = new Date().getTime();
    state.secretDurationTime =
      (state.secretEndTime - state.secretStartTime) / 1000;

    checkForSecretBonus();
    regenerateGame();
  }
}

/**
 * Function to handle record keeping for matching a combo.
 */
function handleMatch() {
  state.combination[state.comboIndex++].active = true;
  state.currentStreak += 1;
  state.isMissed = false;

  if (isDduMode.value) {
    state.secretScore += 1;
  }
}

/**
 * Function to handle record keeping for missing a combo
 */
function handleMiss() {
  state.currentStreak = 0;
  state.missedCount += 1;
  state.isMissed = true;

  if (isDduMode.value) {
    state.secretScore -= 1 + 100 * state.secretRoundCount;
    state.secretPerfectRoundCount = 0;
  }

  setTimeout(() => {
    state.isMissed = false;
  }, 300); // sync toggling missed flag to time of shake animation 0.3s
}

/**
 * Method to store a user's game stats to persist in localStorage
 */
function saveGameStats() {
  let combarrowStats: GameStatistics = JSON.parse(
    localStorage.getItem("combarrowStats") || "null"
  );

  if (combarrowStats === null) {
    combarrowStats = {
      numGames: isDduMode.value ? 0 : 1,
      perfectCount: isDduMode.value ? 0 : state.bestCombo === 5 ? 1 : 0,
      bestTime: isDduMode.value ? 0 : state.durationTime,
      secretRun: isDduMode.value ? state.finalSecretDuration : 0,
    };
  } else if (isDduMode.value) {
    combarrowStats.secretRun = Math.max(
      combarrowStats.secretRun,
      state.finalSecretDuration
    );
  } else {
    combarrowStats.numGames += 1;
    combarrowStats.perfectCount =
      state.bestCombo === 5
        ? combarrowStats.perfectCount + 1
        : combarrowStats.perfectCount;
    combarrowStats.bestTime = Math.min(
      combarrowStats.bestTime,
      state.durationTime
    );
    combarrowStats.secretRun = Math.max(
      combarrowStats.secretRun,
      state.finalSecretDuration
    );
  }

  localStorage.setItem("combarrowStats", JSON.stringify(combarrowStats));
}

/**
 * Handle when help modal is visible. Prevent starting the game.
 *
 * @param value flag to turn off key listening
 */
function activateHelp(value: boolean) {
  state.isDelay = value;
}

/******************************************************
 * LIFECYCLE HOOKS
 ******************************************************/
onMounted(() => {
  window.addEventListener("keyup", listenKey);
});

onUnmounted(() => {
  window.removeEventListener("keyup", listenKey);
});

/******************************************************
 * SECRET GAME HELPERS
 ******************************************************/
/**
 * Method to start interval that decrements secretScore until it hits zero
 */
function startSecretTimer() {
  return setInterval(function () {
    state.secretScore -= state.missedCount + 1;

    if (state.secretScore <= 0) {
      endSecretGame();
    }
  });
}

/**
 * Method to identify when the secret combo has been entered.
 *
 * @param keyCode {number} - Keycode value for keystroke
 * @param shiftKey {boolean} - Flag for if shift key is used during entering a keycode.
 * This is important to unlocking the secret mode
 */
function checkSecretCombo(keyCode: number, shiftKey = false) {
  if (!shiftKey) {
    return;
  }

  // Check for secret mode
  if (state.secretCombo === 0 && keyCode === DirectionCodes.Down) {
    state.secretCombo += 1;
    return;
  }
  if (state.secretCombo === 1 && keyCode === DirectionCodes.Down) {
    state.secretCombo += 1;
    return;
  }
  // If you hit here, you have found the secret!
  if (state.secretCombo === 2 && keyCode === DirectionCodes.Up) {
    state.secretCombo += 1;
    state.secretScore = 5000;
    return;
  }
}

/**
 * Method to continually re-create a new row of arrow combinations.
 */
function regenerateGame() {
  // increment perfect round counts
  if (!state.isMissed && state.comboIndex > 4) {
    state.secretPerfectRoundCount += 1;
  } else {
    state.secretPerfectRoundCount = 0;
  }

  state.comboIndex = 0;
  state.isDelay = true;
  state.secretRoundCount += 1;

  setTimeout(() => {
    state.missedCount = 0;
    state.isDelay = false;
    state.combination = generateComboSet();
    state.secretStartTime = new Date().getTime();
    state.secretEndTime = 0;
    state.secretDurationTime = 0;
    state.secretStartTime = new Date().getTime();
  }, 500);
}

/**
 * Method to add bonus scores to the secret score:
 * 1. If you get a perfect combo add points!
 * 2. If you get a duration under 1 second mega points!
 * 3. If you get a duration between 1-1.5 seconds big points!
 * 4. If you get a duration under 2 seconds some points!
 */
function checkForSecretBonus() {
  if (!state.isMissed && state.comboIndex > 4) {
    state.secretScore += 5 * state.secretPerfectRoundCount;
  }

  if (state.secretDurationTime < 1) {
    state.secretScore += 5000;
  } else if (state.secretDurationTime >= 1 && state.secretDurationTime <= 1.5) {
    state.secretScore += 3000;
  } else if (state.secretDurationTime > 1.5 && state.secretDurationTime < 2.0) {
    state.secretScore += 1500;
  }
}

/**
 * Method to stop the secret game and go back to normal mode.
 */
function endSecretGame() {
  clearInterval(state.secretInterval);
  state.finalSecretEndTime = new Date().getTime();
  state.finalSecretDuration =
    (state.finalSecretEndTime - state.finalSecretStartTime) / 1000;
  saveGameStats();
  resetState();
  state.secretCombo = 0;
}
</script>

<template>
  <HelpButton @activeHelp="activateHelp" @resetStats="resetState" />
  <StatsButton @activeStats="activateHelp" />

  <GameTitle :ddu-mode="isDduMode" />

  <section>
    <div class="secret-score" :class="{ hide: !isDduMode }">
      {{ state.secretScore.toLocaleString() }}
    </div>
    <TheGrid>
      <OneRow>
        <template v-if="state.stage === 'playing'">
          <ComboSquare
            v-for="(item, index) in state.combination"
            :key="item.id"
            :direction="item.direction"
            :active="item.active"
            :is-perfect="state.missedCount === 0 && state.isDelay"
            :class="{ shake: state.isMissed && index === state.comboIndex }"
          ></ComboSquare>
        </template>

        <CustomButton
          v-else-if="state.stage === 'waiting'"
          @on-click="startGame"
          :is-end="false"
        >
          START
        </CustomButton>

        <DisplayNumber
          v-else-if="state.stage === 'countdown'"
          :display-number="state.countdownClock"
        />

        <div v-else-if="state.stage === 'end'">
          <ScoreCard
            :best-combo="state.bestCombo"
            :duration-time="state.durationTime"
            :guess-count="state.guessCount"
            :miss-count="state.missedCount"
          />

          <CustomButton @on-click="restartGame" :is-end="true">
            RESTART
          </CustomButton>
        </div>
      </OneRow>
    </TheGrid>
  </section>
</template>

<style scoped>
.secret-score.hide {
  visibility: hidden;
}
.secret-score {
  visibility: visible;
  font-size: 48px;
  font-weight: bold;
  color: gold;
  text-align: center;
}

.shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.3s;

  /* When the animation is finished, start again */
  animation-iteration-count: 1;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
