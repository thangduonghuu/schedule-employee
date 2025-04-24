<script setup lang="ts">
import Card from "./Card.vue";
import { defineProps } from "vue";

defineProps({
  color: {
    type: String,
    default: "bg-blue-500",
  },
  isHalfSchedule: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Object,
    default: "",
  },
  onClick: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <div v-if="isHalfSchedule" class="flex flex-col gap-4">
    <div>
      <Card :state="value.am" />
    </div>
    <div>
      <Card :state="value.pm" />
    </div>
  </div>
  <div v-if="!isHalfSchedule">
    <div>
      <Card />
    </div>
  </div>
</template>
