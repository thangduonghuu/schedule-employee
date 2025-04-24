<script setup lang="ts">
import Card from "./Card.vue";
import { defineProps } from "vue";

defineProps({
  color: {
    type: String,
    default: "bg-blue-500",
  },
  isError: {
    type: Boolean,
    default: false,
  },
  isHalfSchedule: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Object,
    default: "",
  },
  handleChange: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <div v-if="isHalfSchedule" class="flex flex-col gap-4">
    <div>
      <Card
        :state="value.am"
        :isError="isError"
        :handleClick="
          (am: string) => {
            handleChange({
              ...value,
              am,
            });
          }
        "
      />
    </div>
    <div>
      <Card
        :state="value.pm"
        :isError="isError"
        :handleClick="
          (pm: string) => {
            handleChange({
              ...value,
              pm,
            });
          }
        "
      />
    </div>
  </div>
  <div v-if="!isHalfSchedule">
    <div>
      <Card />
    </div>
  </div>
</template>
