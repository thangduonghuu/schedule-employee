<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { format } from "date-fns";
import { Field, useField, useForm } from "vee-validate";
import { repeatSchedule } from "~/api/schedule";
import { schemaRepeatForm } from "~/schema/repeatForm.schema";
import { CURRENT_STATE } from "~/utils/enum/state";
import { QUERY_KEYS } from "~/utils/lookup/query-key";

const props = defineProps({
  week: {
    type: String,
    default: format(new Date(), "yyyy-'w'ww"),
  },
  onCloseModal: {
    type: Function,
    default: () => {},
  },
  refetch: {
    type: Function,
    default: () => {},
  },
  open: {
    type: Boolean,
    default: false,
  },
});

const queryClient = useQueryClient();

const { mutateAsync: repeatScheduleMutate, isPending } = useMutation({
  mutationFn: repeatSchedule,
  onSuccess: () => {
    message.success("Repeat Schedule successful");
    props.onCloseModal();
    queryClient.invalidateQueries();
    queryClient.refetchQueries();
  },
  onError: () => {
    message.error("Repeat Schedule failed");
  },
});

const { handleSubmit, setFieldValue } = useForm({
  name: "repeatSchedule",
  validationSchema: schemaRepeatForm,
  initialValues: {
    week: props.week,
    numberWeekRepeat: 1,
  },
});

watch(
  () => props.week,
  (newVal) => {
    if (props.week) {
      setFieldValue("week", newVal);
    }
  }
);

const { handleChange: handleChangeNumberWeek } = useField("numberWeekRepeat");
const { handleChange } = useField("changeToType");

const handleOk = handleSubmit((value) => {
  repeatScheduleMutate(value);
});
</script>
<template>
  <a-modal
    :closable="false"
    :open="open"
    :footer="false"
    title="Repeat the schedule"
    :confirm-loading="isPending"
  >
    <div>
      <form @submit.prevent="handleOk">
        <a-typography-title class="flex items-center" :level="5"
          >Repeat options:</a-typography-title
        >
        <div class="flex align-center">
          <div class="flex align-center gap-2">
            <p>Repeat for</p>
            <Field name="numberWeekRepeat">
              <a-input-number
                id="inputNumber"
                :defaultValue="1"
                @change="handleChangeNumberWeek"
                :min="1"
                :max="7"
              />
            </Field>
            <a-typography>weeks (max 7)</a-typography>
          </div>
        </div>
        <div>
          <a-typography-title class="flex items-center" :level="5"
            >Repeat For:</a-typography-title
          >
          <Field name="changeToType" v-slot="{ field }">
            <div class="flex gap-2 h-24">
              <div
                @click="handleChange(CURRENT_STATE.WAO)"
                class="p-2 cursor-pointer relative items-center border rounded-lg flex-1"
                :style="
                  field.value === CURRENT_STATE.WAO
                    ? 'background-color: #3b82f6;'
                    : ''
                "
              >
                <div class="flex items-center justify-center flex-col h-20">
                  <Icon
                    name="ph:laptop-light"
                    style="width: 32px; height: 32px"
                    :style="
                      field.value === CURRENT_STATE.WAO &&
                      'background-color: white'
                    "
                  />

                  <a-typography
                    class="text-center"
                    :class="field.value === CURRENT_STATE.WAO && 'text-white'"
                    >Work at office</a-typography
                  >

                  <div class="absolute left-2 top-2 rounded">
                    <Icon
                      v-if="field.value != CURRENT_STATE.WAO"
                      name="fluent:checkbox-unchecked-24-regular"
                      style="width: 24px; height: 24px; color: gray"
                    />

                    <Icon
                      v-if="field.value === CURRENT_STATE.WAO"
                      name="material-symbols-light:check-box-rounded"
                      style="width: 24px; height: 24px; color: white"
                    />
                    <!-- <CheckSquareOutlined style="font-size: 20px;" /> -->
                  </div>
                </div>
              </div>
              <div
                @click="handleChange(CURRENT_STATE.WFH)"
                class="p-2 cursor-pointer relative items-center border rounded-lg flex-1"
                :style="
                  field.value === CURRENT_STATE.WFH
                    ? 'background-color: #3b82f6;'
                    : ''
                "
              >
                <div class="flex items-center justify-center flex-col h-20">
                  <Icon
                    name="codicon:home"
                    style="width: 40px; height: 40px"
                    :style="
                      field.value === CURRENT_STATE.WFH &&
                      'background-color: white'
                    "
                  />

                  <a-typography
                    class="text-center"
                    :class="field.value === CURRENT_STATE.WFH && 'text-white'"
                    >Work from home</a-typography
                  >

                  <div class="absolute left-2 top-2 rounded">
                    <Icon
                      v-if="field.value != CURRENT_STATE.WFH"
                      name="fluent:checkbox-unchecked-24-regular"
                      style="width: 24px; height: 24px; color: gray"
                    />

                    <Icon
                      v-if="field.value === CURRENT_STATE.WFH"
                      name="material-symbols-light:check-box-rounded"
                      style="width: 24px; height: 24px; color: white"
                    />
                    <!-- <CheckSquareOutlined style="font-size: 20px;" /> -->
                  </div>
                </div>
              </div>
            </div>
          </Field>
        </div>
        <div class="flex gap-2 pt-4 justify-end">
          <a-button :disabled="isPending" @click="props.onCloseModal()"
            >Cancel</a-button
          >
          <a-button
            :loading="isPending"
            html-type="submit"
            type="primary"
            @click="handleOk"
            >OK</a-button
          >
        </div>
      </form>
    </div>
  </a-modal>
</template>
