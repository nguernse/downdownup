<script setup lang="ts">
defineProps<{
  isEnd: boolean
}>()
</script>

<template>
  <button @click="$emit('onClick')" class="custom-btn" :class="{ end: isEnd }">
    <slot></slot>
  </button>
</template>

<style scoped>
.custom-btn {
  border-radius: 5px;
  padding: 25px 50px;
  outline: none;
  border: none;
  font-weight: bold;
  font-size: 50px;
  background-color: #ffffff;
  border: 5px solid #ffffff;
}

.custom-btn.end {
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
  border: 5px solid #ffffff;
}

.custom-btn:hover {
  border-color: #ffffff;
  background-color: #ffffffe0;
}
</style>
