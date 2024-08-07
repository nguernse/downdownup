<script setup lang="ts">
defineProps<{
  displayNumber: number
}>()
</script>

<template>
  <h1 class="display-number">{{ displayNumber }}</h1>
</template>

<style scoped>
.display-number {
  font-size: 70px;
  font-weight: bold;
  margin: 0;
}
</style>
