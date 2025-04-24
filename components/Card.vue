<script setup lang="ts">
import {
  ClockCircleOutlined,
  HomeOutlined,
  LaptopOutlined,
} from "@ant-design/icons-vue";
import { CURRENT_STATE } from "~/utils/enum/state";
import type { PropType } from "vue";

defineProps({
  isError: {
    type: Boolean,
    default: false,
  },
  handleClick: {
    type: Function,
    default: () => {},
  },
  state: {
    type: Object as PropType<CURRENT_STATE>,
    default: CURRENT_STATE.WFH,
  },
});

const optionSelected = ref([]);

const options = [...Array(25)].map((_, i) => ({
  value: (i + 10).toString(36) + (i + 1),
}));
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <a-card style="width: 250px">
      <a-typography-title class="text-center" :level="4">{{
        state
      }}</a-typography-title>
      <a-select
        v-if="state === CURRENT_STATE.WFO"
        v-model:value="optionSelected"
        mode="tags"
        status="error"
        style="width: 100%"
        placeholder="Tags Mode"
        :options="options"
      ></a-select>
      <div class="flex gap-1">
        <TagState
          :color="'bg-blue-500'"
          @click="handleClick(CURRENT_STATE.WFO)"
          :state="CURRENT_STATE.WFO"
          :isSelected="state === CURRENT_STATE.WFO"
        >
          <LaptopOutlined />
        </TagState>
        <TagState
          :color="'bg-gray-500'"
          @click="handleClick(CURRENT_STATE.WFH)"
          :state="CURRENT_STATE.WFH"
          :isSelected="state === CURRENT_STATE.WFH"
        >
          <HomeOutlined />
        </TagState>
        <TagState
          :color="'bg-red-500'"
          @click="handleClick(CURRENT_STATE.OFF)"
          :state="CURRENT_STATE.OFF"
          :isSelected="state === CURRENT_STATE.OFF"
        >
          <ClockCircleOutlined />
        </TagState>
      </div>
    </a-card>
  </div>
</template>
