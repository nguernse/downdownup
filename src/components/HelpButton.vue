<script setup lang="ts">
import type { GameStatistics } from "@/utils/interfaces";
import { reactive, onMounted } from "vue";
import IconQuestion from "./icons/IconQuestion.vue";
import HelpModal from "./HelpModal.vue";

const emits = defineEmits(["activeHelp", "resetStats"]);
const state = reactive({
  showHelp: false,
  firstTime: false,
});

function toggleHelp() {
  state.showHelp = !state.showHelp;

  emits("activeHelp", state.showHelp);
}

onMounted(() => {
  const combarrowStats: GameStatistics = JSON.parse(
    localStorage.getItem("combarrowStats") || "null"
  );

  if (combarrowStats === null) {
    console.log("first time player!!!");
    state.firstTime = true;
    toggleHelp();
  }
});
</script>

<template>
  <HelpModal
    v-if="state.showHelp"
    @closeModal="toggleHelp"
    @resetStats="emits('resetStats')"
  />
  <button class="help-btn" @click="toggleHelp">
    <IconQuestion />
  </button>
</template>

<style scoped>
.help-btn {
  position: absolute;
  top: 15px;
  right: 15px;
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

.help-btn:hover {
  cursor: pointer;
}
</style>
