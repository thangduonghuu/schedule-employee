<script setup lang="ts">
import {
  ClockCircleOutlined,
  HomeOutlined,
  LaptopOutlined,
} from "@ant-design/icons-vue";
import { CURRENT_STATE } from "~/utils/enum/state";

const props = defineProps({
  state: {
    type: CURRENT_STATE,
    default: CURRENT_STATE.WFH,
  },
});

const current = ref<CURRENT_STATE>(props.state);
const optionSelected = ref([]);

const handleClick = (state: CURRENT_STATE) => {
  current.value = state;
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
const options = [...Array(25)].map((_, i) => ({
  value: (i + 10).toString(36) + (i + 1),
}));
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <a-card style="width: 250px">
      <a-typography-title class="text-center" :level="4">{{
        current
      }}</a-typography-title>
      <a-select
        v-model:value="optionSelected"
        mode="tags"
        style="width: 100%"
        placeholder="Tags Mode"
        :options="options"
      ></a-select>
      <div class="flex gap-1">
        <TagState
          :color="'bg-blue-500'"
          @click="handleClick(CURRENT_STATE.WFO)"
          :state="CURRENT_STATE.WFO"
          :isSelected="current === CURRENT_STATE.WFO"
        >
          <LaptopOutlined />
        </TagState>
        <TagState
          :color="'bg-gray-500'"
          @click="handleClick(CURRENT_STATE.WFH)"
          :state="CURRENT_STATE.WFH"
          :isSelected="current === CURRENT_STATE.WFH"
        >
          <HomeOutlined />
        </TagState>
        <TagState
          :color="'bg-red-500'"
          @click="handleClick(CURRENT_STATE.OFF)"
          :state="CURRENT_STATE.OFF"
          :isSelected="current === CURRENT_STATE.OFF"
        >
          <ClockCircleOutlined />
        </TagState>
      </div>
    </a-card>
  </div>
</template>
