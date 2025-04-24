<script setup lang="ts">
import { h } from "vue";

defineProps({
  color: {
    type: String,
    default: "bg-blue-500",
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  state: {
    type: String,
    default: "",
  },
  onClick: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <label @click="onClick">
    <input type="radio" name="group" class="custom-radio" value="option2" />

    <div
      :class="[
        '!w-[65px] h-[50px] rounded-xl btn radio-button border cursor-pointer',
        { ' text-white border border-white': isSelected },
        isSelected ? color : '',
      ]"
    >
      <slot />
    </div>
  </label>
</template>
