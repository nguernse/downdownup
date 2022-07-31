<script setup lang="ts">
defineProps<{
  dduMode: boolean;
}>();
</script>

<template>
  <h1 class="game-title">
    Down Down Down <span :class="{ ddu: dduMode }">Up</span>
  </h1>
</template>

<style scoped>
.game-title {
  position: absolute;
  color: white;
  top: 5px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.25px;
}
.ddu {
  display: inline-block;
  transform: translate(0, -10px);
  color: gold;
  transition: all ease-in 1s;
}
</style>
