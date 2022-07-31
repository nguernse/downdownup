<script setup lang="ts">
import StatsBar from "./StatsBar.vue";

defineProps<{
  bestCombo: number;
  durationTime: number;
  guessCount: number;
  missCount: number;
}>();
</script>

<template>
  <StatsBar />

  <ul class="score-card">
    <li>
      <span class="label">Streak</span>
      <span class="value"
        >{{ bestCombo }}
        {{ bestCombo === 5 && missCount === 0 ? "🏅" : "" }}</span
      >
    </li>

    <li>
      <span class="label">Time</span>
      <span class="value"
        >{{ durationTime.toFixed(2) }}s
        {{
          durationTime < 1.25
            ? "🤯"
            : durationTime < 1.5
            ? "🔥🔥"
            : durationTime < 1.75
            ? "🔥"
            : durationTime < 2
            ? "🏃"
            : ""
        }}</span
      >
    </li>

    <li>
      <span class="label">Guesses</span>
      <span class="value">{{ guessCount }}</span>
    </li>

    <li>
      <span class="label">Missed</span>
      <span class="value">{{ missCount }}</span>
    </li>
  </ul>
</template>

<style scoped>
.score-card {
  border: 5px solid #ffffff;
  padding: 10px;
  border-top: none;
  list-style: none;
  margin: 0;
}

.score-card li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dotted white;
  margin-bottom: 15px;
  font-weight: bold;
}
</style>
