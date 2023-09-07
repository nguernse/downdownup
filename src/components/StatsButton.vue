<script setup lang="ts">
import type { GameStatistics } from "@/utils/interfaces";
import { reactive, onMounted } from "vue";
import IconAwards from "./icons/IconAwards.vue";
import StatsBar from "./StatsBar.vue";
import HelpModal from "./HelpModal.vue";

const emits = defineEmits(["activeStats"]);
const state = reactive({
  showStats: false,
});

function toggleStats() {
  state.showStats = !state.showStats;

  emits("activeStats", state.showStats);
}
</script>

<template>
  <HelpModal
    v-if="state.showStats"
    @closeModal="toggleStats"
    title="Game Statistics"
  >
    <StatsBar />
  </HelpModal>

  <button class="stats-btn" @click="toggleStats">
    <IconAwards />
  </button>
</template>

<style scoped>
.stats-btn {
  position: absolute;
  top: 15px;
  right: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  width: 25px;
  padding: 0;
  border: none;
  outline: none;
  border-radius: 50%;
  background-color: #fff;
}

.stats-btn:hover {
  cursor: pointer;
}
</style>
