<script setup lang="ts">
import IconUp from './icons/IconUp.vue'
import IconRight from './icons/IconRight.vue'
import IconDown from './icons/IconDown.vue'
import IconLeft from './icons/IconLeft.vue'

defineProps<{
  direction: number
  active?: boolean
  isPerfect?: boolean
  size?: string
}>()
</script>

<template>
  <div class="square" :class="{ active: active, perfect: isPerfect, small: size === 'small' }">
    <IconLeft v-if="direction == 37" class="icon" :size="size" />
    <IconUp v-if="direction == 38" class="icon" :size="size" />
    <IconRight v-if="direction == 39" class="icon" :size="size" />
    <IconDown v-if="direction == 40" class="icon" :size="size" />
  </div>
</template>

<style scoped>
.square {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 15px;
  height: 100px;
  width: 100px;
  background-color: gray;
  margin: 15px;
  color: white;
}

.square.active {
  background-color: limegreen;
  transform: scale(1.1);
  transition: transform ease 0.5s;
  box-shadow: 8px 0px 8px rgb(0 0 0 / 50%);
}

.square.active.perfect {
  background-color: gold !important;
  transition: background-color ease 0.25s;
}

.square.small {
  height: 50px;
  width: 50px;
}

.square.small.active {
  box-shadow: none;
}
</style>
