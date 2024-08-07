<script setup lang="ts">
/******************************************************
 * IMPORTS
 ******************************************************/
import { onMounted, reactive, computed } from 'vue'
import type { GameStatistics } from '../utils/interfaces'

/******************************************************
 * STATE
 ******************************************************/
const state: GameStatistics = reactive({
  numGames: 0,
  perfectCount: 0,
  bestTime: 0,
  secretRun: 0
})

const percentPerfect = computed(() => {
  if (state.numGames === 0) return '0'

  const percent = (state.perfectCount / state.numGames) * 100

  return `${percent.toFixed(0)}%`
})

/******************************************************
 * LIFECYCLE HOOKS
 ******************************************************/
onMounted(() => {
  const combarrowStats: GameStatistics = JSON.parse(
    localStorage.getItem('combarrowStats') || 'null'
  )

  if (combarrowStats !== null) {
    state.numGames = combarrowStats.numGames
    state.perfectCount = combarrowStats.perfectCount
    state.bestTime = combarrowStats.bestTime
    state.secretRun = combarrowStats.secretRun
  }
})
</script>

<template>
  <div class="game-stats">
    <h5 class="stat-header">Stats</h5>

    <div class="stat-row">
      <div class="stat-block">
        <span class="stat-value">
          {{ state.numGames }}
        </span>
        <span class="stat-label"> Games </span>
      </div>
      <div class="stat-block">
        <span class="stat-value"> {{ percentPerfect }} </span>
        <span class="stat-label"> Perfect %</span>
      </div>
      <div class="stat-block">
        <span class="stat-value"> {{ state.bestTime.toFixed(2) }}s </span>
        <span class="stat-label"> Best Time </span>
      </div>
      <div class="stat-block">
        <span class="stat-value"
          >{{ state.secretRun ? state.secretRun.toFixed(2) + 's' : '🤫' }}
        </span>
        <span class="stat-label"> Secret Run </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-stats {
  border: 5px solid #ffffff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px 15px;
  display: flex;
  flex-direction: column;
}

.stat-header {
  text-align: center;
  margin: 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
}
.stat-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  font-size: 0.75em;
}
</style>
