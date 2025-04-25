<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { Field, useField, useForm } from "vee-validate";
import { repeatSchedule } from "~/api/schedule";
import { schemaRepeatForm } from "~/schema/repeatForm.schema";

const props = defineProps({
  week: {
    type: String,
    default: "",
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
    props.refetch();
    queryClient.invalidateQueries();
  },
  onError: () => {
    message.error("Repeat Schedule failed");
  },
});

const { handleSubmit } = useForm({
  validationSchema: schemaRepeatForm,
  initialValues: {
    week: props.week,
  },
});

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
                @click="handleChange('WAO')"
                class="p-2 cursor-pointer relative items-center border rounded-lg flex-1"
                :style="
                  field.value === 'WAO' ? 'background-color: #3b82f6;' : ''
                "
              >
                <div class="flex items-center justify-center flex-col h-20">
                  <Icon
                    name="ph:laptop-light"
                    style="width: 32px; height: 32px"
                    :style="field.value === 'WAO' && 'background-color: white'"
                  />

                  <a-typography
                    class="text-center"
                    :class="field.value === 'WAO' && 'text-white'"
                    >Work at office</a-typography
                  >

                  <div class="absolute left-2 top-2 rounded">
                    <Icon
                      v-if="field.value != 'WAO'"
                      name="fluent:checkbox-unchecked-24-regular"
                      style="width: 24px; height: 24px; color: gray"
                    />

                    <Icon
                      v-if="field.value === 'WAO'"
                      name="material-symbols-light:check-box-rounded"
                      style="width: 24px; height: 24px; color: white"
                    />
                    <!-- <CheckSquareOutlined style="font-size: 20px;" /> -->
                  </div>
                </div>
              </div>
              <div
                @click="handleChange('WFH')"
                class="p-2 cursor-pointer relative items-center border rounded-lg flex-1"
                :style="
                  field.value === 'WFH' ? 'background-color: #3b82f6;' : ''
                "
              >
                <div class="flex items-center justify-center flex-col h-20">
                  <Icon
                    name="codicon:home"
                    style="width: 40px; height: 40px"
                    :style="field.value === 'WFH' && 'background-color: white'"
                  />

                  <a-typography
                    class="text-center"
                    :class="field.value === 'WFH' && 'text-white'"
                    >Work from home</a-typography
                  >

                  <div class="absolute left-2 top-2 rounded">
                    <Icon
                      v-if="field.value != 'WFH'"
                      name="fluent:checkbox-unchecked-24-regular"
                      style="width: 24px; height: 24px; color: gray"
                    />

                    <Icon
                      v-if="field.value === 'WFH'"
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
