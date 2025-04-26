<script setup lang="ts">
import {
  ClockCircleOutlined,
  HomeOutlined,
  LaptopOutlined,
} from "@ant-design/icons-vue";
import { CURRENT_STATE } from "~/utils/enum/state";
import type { PropType } from "vue";
import type { SelectProps } from "ant-design-vue";

const props = defineProps({
  isError: {
    type: Boolean,
    default: false,
  },
  handleClick: {
    type: Function,
    default: () => {},
  },
  selectValue: {
    type: String,
    default: "",
  },
  state: {
    type: Object as PropType<CURRENT_STATE>,
  },
  handleSelectRoom: {
    type: Function,
    default: () => {},
  },
});
const selected = ref<string | undefined>(props.selectValue);

watch(
  () => props.selectValue,
  (newValue) => {
    selected.value = newValue;
  },
  { immediate: true }
);

const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const options = ref<SelectProps["options"]>([
  { value: "camp1", label: "F2-Camp1" },
  { value: "camp2", label: "F3-Camp2" },
  { value: "camp3", label: "F4-Camp3" },
]);
</script> 

<template>
  <div class="flex items-center justify-center h-full">
    <a-card style="width: 250px">
      <a-typography-title class="text-center" :level="4">{{
        state
      }}</a-typography-title>
      <a-select 
        v-model:value="selected"
        :style="state === CURRENT_STATE.WAO ? 'visibility: visible' :'visibility: hidden'"
        show-search
        :status="isError ? 'error' : ''"
        placeholder="Select a person"
        style="width: 200px"
        :options="options"
        :filter-option="filterOption"
        @change="handleSelectRoom"
      ></a-select>
      <div class="flex gap-1">
        <TagState
          :color="'bg-blue-500'"
          @click="handleClick(CURRENT_STATE.WAO)"
          :state="CURRENT_STATE.WAO"
          :isSelected="state === CURRENT_STATE.WAO"
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
