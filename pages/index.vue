<script setup lang="ts">
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { useMutation } from "@tanstack/vue-query";
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import { Field, useField, useForm, useIsFormDirty } from "vee-validate";
import Loading from "~/components/Loading.vue";
import { useFetchSchedule } from "~/hooks/schedule";
import { fullSchema } from "~/schema/schedule.schema";
import { createSchedule, repeatSchedule } from "../api/schedule";
import {
  DefaultValueFullSchedule,
  DefaultValueHalfSchedule,
} from "~/utils/lookup/constants";
import RepeatForm from "~/components/form/RepeatForm.vue";

const scheduleForHalfDay = ref<boolean>(false);
const schedule = ref();
const weekDays = ref<string[]>([]);
const currentDate = ref(new Date());
const open = ref<boolean>(false);
const isFormDirty = ref<boolean>(false);

const weekNumber = ref<string>(format(new Date(), "yyyy-'w'ww"));

const { data, isFetching: loading, refetch } = useFetchSchedule(weekNumber);

const { handleSubmit, setFieldValue, meta, resetForm, values } = useForm({
  name: "ScheduleForm",
  validationSchema: fullSchema,
  initialValues: {
    isHalfSchedule: scheduleForHalfDay.value,
    schedule: schedule.value,
  },
});

watch(values, () => {
  if (values.isHalfSchedule) {
    scheduleForHalfDay.value = values.isHalfSchedule;
  }
});

watch(data, () => {
  if (data.value) {
    scheduleForHalfDay.value = data.value.isHalfSchedule;
    schedule.value = data.value.schedule;
    resetForm({
      values: {
        isHalfSchedule: data.value.isHalfSchedule,
        schedule: data.value.schedule,
      },
    });
  }
});

watch(meta, (newValue) => {
  if (meta.value) {
    isFormDirty.value = newValue.dirty;
  }
});

const { mutateAsync: createScheduleMutate, isPending: isPendingCreate } =
  useMutation({
    mutationFn: createSchedule,
    onSuccess: (data) => {
      message.success("Create Schedule successful");
      refetch();
    },
    onError: () => {
      message.error("Create Schedule failed");
    },
  });

const { handleChange: handleChangeMonday, validate: validateMonday } =
  useField("schedule.Monday");

const { handleChange: handleChangeTuesday, validate: validateTuesday } =
  useField("schedule.Tuesday");

const { handleChange: handleChangeWednesday, validate: validateWednesday } =
  useField("schedule.Wednesday");

const { handleChange: handleChangeThursday, validate: validateThursday } =
  useField("schedule.Thursday");

const { handleChange: handleChangeFriday, validate: validateFriday } =
  useField("schedule.Friday");

const onSubmit = handleSubmit(
  (values) => {
    createScheduleMutate({
      week: weekNumber.value,
      ...values,
    });
  },
  (errors) => {
    message.error("Form submission failed");
  }
);

const showModal = () => {
  open.value = true;
};

const updateWeek = () => {
  const start = startOfWeek(currentDate.value, { weekStartsOn: 0 }); // 1 for Monday start
  weekDays.value = Array.from({ length: 7 }, (_, i) =>
    format(addDays(start, i), "EEE d")
  );
};

const goToNextWeek = () => {
  currentDate.value = addWeeks(currentDate.value, 1);
  weekNumber.value = format(currentDate.value, "yyyy-'w'ww");
  updateWeek();
};

const onChangeModeToHalfSchedule = () => {
  scheduleForHalfDay.value = !scheduleForHalfDay.value;

  setFieldValue("isHalfSchedule", scheduleForHalfDay.value);

  if (scheduleForHalfDay.value === meta.value.initialValues?.isHalfSchedule) {
    resetForm();
    return;
  }
  if (scheduleForHalfDay.value) {
    setFieldValue("isHalfSchedule", DefaultValueHalfSchedule.isHalfSchedule);
    setFieldValue("schedule", DefaultValueHalfSchedule.schedule);
  } else {
    setFieldValue("isHalfSchedule", DefaultValueFullSchedule.isHalfSchedule);
    setFieldValue("schedule", DefaultValueFullSchedule.schedule);
  }
};

const goToPreviousWeek = () => {
  currentDate.value = subWeeks(currentDate.value, 1);
  weekNumber.value = format(currentDate.value, "yyyy-'w'ww");
  updateWeek();
};

const goToToday = () => {
  currentDate.value = new Date();
  weekNumber.value = format(currentDate.value, "yyyy-'w'ww");
  updateWeek();
};

const onCloseModal = () => {
  open.value = false;
};

onMounted(() => {
  const today = new Date();
  const start = startOfWeek(today);

  weekDays.value = Array.from({ length: 7 }, (_, i) =>
    format(addDays(start, i), "EEE d")
  );
});

onMounted(() => {
  const today = new Date();
  currentDate.value = today;
  document.title = "Schedule Page";
});

updateWeek();
</script>

<template>
  <div class="flex items-center w-full h-full">
    <form class="w-full" @submit.prevent="onSubmit">
      <section class="w-full h-full bg-custom rounded-2xl">
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a-button :disabled="loading" @click="goToToday"> Today</a-button>
            <div class="flex gap-1">
              <div>
                <a-button
                  :disabled="loading"
                  class="btn custom-icon"
                  shape="circle"
                  :icon="h(LeftOutlined)"
                  @click="goToPreviousWeek"
                />
              </div>
              <div>
                <a-button
                  :disabled="loading"
                  class="btn custom-icon"
                  shape="circle"
                  :icon="h(RightOutlined)"
                  @click="goToNextWeek"
                />
              </div>
            </div>
            <div>
              {{ format(currentDate, "MMM d") }} -
              {{ format(addDays(currentDate, 4), "MMM d, yyyy") }}
            </div>
          </div>
          <div class="flex gap-1">
            <a-button
              :disabled="loading || isPendingCreate"
              class="btn py-5 rounded-full"
              @click="onChangeModeToHalfSchedule"
            >
              {{
                scheduleForHalfDay
                  ? "Schedule as full day"
                  : "Schedule as half day"
              }}</a-button
            >
          </div>
        </div>

        <div
          v-if="loading"
          class="w-full flex justify-center items-center h-20"
        >
          <Loading />
        </div>

        <div v-if="!loading" class="p-4 pb-0 flex w-full gap-10">
          <div
            v-if="scheduleForHalfDay"
            class="flex items-center justify-between w-10"
          ></div>
          <div class="w-full">
            <a-row type="flex flex-1" :gutter="16">
              <template v-for="(day, index) in weekDays" :key="index">
                <a-col
                  v-if="index !== 0 && index !== weekDays.length - 1"
                  class="gutter-row"
                  flex="1"
                >
                  <div>
                    <a-typography-title
                      class="text-center"
                      :level="4"
                      :style="{
                        color:
                          day === format(new Date(), 'EEE d')
                            ? 'red'
                            : 'inherit',
                      }"
                    >
                      {{ day }}
                    </a-typography-title>
                  </div>
                </a-col>
              </template>
            </a-row>
          </div>
        </div>

        <div v-if="!loading">
          <div class="p-4 flex w-full gap-10">
            <div
              v-if="scheduleForHalfDay"
              class="flex flex-col justify-around items-center"
            >
              <div class="flex items-center justify-between">
                <div class="p-2 w-10 h-10 bg-white rounded-full box-shadow">
                  <Icon
                    name="solar:sun-line-duotone"
                    style="width: 24px; height: 24px; color: gold"
                  />
                </div>
              </div>

              <div
                v-if="scheduleForHalfDay"
                class="flex items-center justify-between"
              >
                <div class="p-2 w-10 h-10 bg-white rounded-full box-shadow">
                  <Icon
                    name="solar:sun-fog-outline"
                    style="width: 24px; height: 24px; color: violet"
                  />
                </div>
              </div>
            </div>
            <div v-if="schedule" class="w-full">
              <a-row type="flex flex-1" :gutter="16">
                <a-col class="gutter-row" flex="1">
                  <Field
                    type="text"
                    :keep-value="true"
                    :validate-on-change="true"
                    name="schedule.Monday"
                    v-slot="{ field, errorMessage, validateOnChange }"
                  >
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :handle-change="(val:any) => {
                          handleChangeMonday(val);
                          validateMonday();
                        }
                      "
                      :isError="!!errorMessage"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field
                    type="text"
                    :keep-value="true"
                    :validate-on-change="true"
                    name="schedule.Tuesday"
                    v-slot="{ field, errorMessage }"
                  >
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :isError="!!errorMessage"
                      :handle-change="(val:any) => {
                          handleChangeTuesday(val);
                          validateTuesday();
                        }
                      "
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field
                    type="text"
                    :keep-value="true"
                    :validate-on-change="true"
                    name="schedule.Wednesday"
                    v-slot="{ field, errorMessage }"
                  >
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :handle-change="(val:any) => {
                        handleChangeWednesday(val);
                        validateWednesday();
                      }"
                      :isError="!!errorMessage"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field
                    type="text"
                    name="schedule.Thursday"
                    :keep-value="true"
                    :validate-on-change="true"
                    v-slot="{ field, errorMessage }"
                  >
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :isError="!!errorMessage"
                      :handle-change="( val:any) => {
                        handleChangeThursday(val);
                        validateThursday();
                      }"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field
                    type="text"
                    :keep-value="true"
                    :validate-on-change="true"
                    name="schedule.Friday"
                    v-slot="{ field, errorMessage }"
                  >
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :handle-change="( val:any) => {
                        handleChangeFriday(val);
                        validateFriday();
                      }"
                      :isError="!!errorMessage"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>

        <div class="p-4 flex justify-between">
          <a-button
            :disabled="isPendingCreate || loading"
            class="btn py-5 rounded-full flex items-center gap-1"
            @click="showModal"
          >
            <Icon
              name="solar:repeat-line-duotone"
              style="width: 24px; height: 24px; color: black"
            />
            <a-typography>Repeat the schedule</a-typography>
          </a-button>
          <div class="flex gap-1">
            <a-button
              @click="
                () => {
                  resetForm();
                }
              "
              :disabled="loading || !isFormDirty || isPendingCreate"
              class="py-5 rounded-full flex items-center gap-1"
            >
              Reset
            </a-button>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="loading || isPendingCreate"
              class="py-5 rounded-full flex items-center gap-1"
            >
              Confirm schedule
            </a-button>
          </div>
        </div>
      </section>
    </form>

    <RepeatForm
      :open="open"
      :week="weekNumber"
      :on-close-modal="onCloseModal"
      :refetch="refetch"
    />
  </div>
</template>

<style></style>
