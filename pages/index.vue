<script setup lang="ts">
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import { Field, Form, useField, useForm } from "vee-validate";
import Loading from "~/components/Loading.vue";
import { useFetchSchedule } from "~/hooks/schedule";
import { fullSchema } from "~/schema/schedule.schema";

const scheduleForHalfDay = ref<boolean>(false);
const schedule = ref();
const weekDays = ref<string[]>([]);
const currentDate = ref(new Date());
const open = ref<boolean>(false);

const weekNumber = ref<string>();

const { data, isFetching: loading } = useFetchSchedule(weekNumber);
const { handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: fullSchema,
  initialValues: {
    isHalfSchedule: scheduleForHalfDay.value,
    schedule: schedule.value,
  },
});

watch(data, () => {
  if (data.value) {
    scheduleForHalfDay.value = data.value.isHalfSchedule;
    schedule.value = data.value.schedule;

    setFieldValue("schedule", data.value.schedule);
    setFieldValue("isHalfSchedule", data.value.isHalfSchedule);
  }
});

watch(errors, () => {
  if (errors.value) {
    console.log("Form errors", errors.value);
  }
});

const {
  value: valueMonday,
  errorMessage: errorValueMonday,
  handleChange: handleChangeMonday,
} = useField("schedule.Monday");
const {
  value: valueTuesday,
  errorMessage: errorValueTuesday,
  handleChange: handleChangeTuesday,
} = useField("schedule.Tuesday");
const {
  value: valueWednesday,
  errorMessage: errorValueWednesday,
  handleChange: handleChangeWednesday,
} = useField("schedule.Wednesday");
const {
  value: valueThursday,
  errorMessage: errorValueThursday,
  handleChange: handleChangeThursday,
} = useField("schedule.Thursday");
const {
  value: valueFriday,
  errorMessage: errorValueFriday,
  handleChange: handleChangeFriday,
} = useField("schedule.Friday");

const onSubmit = handleSubmit(
  (values) => {
    console.log("Form Submitted", values);
  },
  (errors) => {
    message.error("Form submission failed");
  }
);

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  open.value = false;
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
  weekNumber.value = format(today, "yyyy-'w'ww");
});

updateWeek();
</script>

<template>
  <div class="flex items-center w-full h-full">
    <form class="w-full" @submit.prevent="onSubmit">
      <section class="w-full h-full bg-violet-200 rounded-2xl">
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a-button :disabled="loading" @click="goToToday"> Today</a-button>
            <!-- <div class="p-2 py-1 bg-white rounded-lg">Today</div> -->
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
            <a-button class="btn py-5 rounded-full" type="primary">
              Notify manager</a-button
            >
            <a-button
              class="btn py-5 rounded-full"
              @click="scheduleForHalfDay = !scheduleForHalfDay"
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
          <div class="flex items-center justify-between w-10"></div>
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
            <div class="flex flex-col justify-around items-center">
              <div
                v-if="scheduleForHalfDay"
                class="flex items-center justify-between"
              >
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
                  <Field type="text" name="schedule.Monday" v-slot="{ field }">
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :handle-change="handleChangeMonday"
                      :isError="!!errorValueFriday"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field type="text" name="schedule.Tuesday" v-slot="{ field }">
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :isError="!!errorValueFriday"
                      :handle-change="handleChangeTuesday"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field
                    type="text"
                    name="schedule.Wednesday"
                    v-slot="{ field }"
                  >
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :handle-change="handleChangeWednesday"
                      :isError="!!errorValueFriday"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field
                    type="text"
                    name="schedule.Thursday"
                    v-slot="{ field }"
                  >
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :isError="!!errorValueFriday"
                      :handle-change="handleChangeThursday"
                      :value="field.value"
                    />
                  </Field>
                </a-col>
                <a-col class="gutter-row" flex="1">
                  <Field type="text" name="schedule.Friday" v-slot="{ field }">
                    <DateSchedule
                      :is-half-schedule="scheduleForHalfDay"
                      :handle-change="handleChangeFriday"
                      :isError="!!errorValueFriday"
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
              :disabled="loading"
              class="py-5 rounded-full flex items-center gap-1"
            >
              reset
            </a-button>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="loading"
              class="py-5 rounded-full flex items-center gap-1"
            >
              Confirm schedule
            </a-button>
          </div>
        </div>
      </section>
    </form>
    <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<style></style>
