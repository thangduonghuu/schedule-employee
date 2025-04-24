import * as yup from "yup";

const sessionSchema = yup.object({
  am: yup.string().required(),
  amState: yup.string().when("am", (am, schema) => {
    return am[0] === "WFO"
      ? schema.required(
          "Seat is required when working at office in the morning"
        )
      : schema.notRequired();
  }),
  pm: yup.string().required(),
  pmState: yup.string().when("pm", (pm, schema) => {
    return pm[0] === "WFO"
      ? schema.required(
          "Seat is required when working at office in the afternoon"
        )
      : schema.notRequired();
  }),
});

const scheduleSchema = yup.object({
  Monday: sessionSchema.required(),
  Tuesday: sessionSchema.required(),
  Wednesday: sessionSchema.required(),
  Thursday: sessionSchema.required(),
  Friday: sessionSchema.required(),
});

export const fullSchema = yup.object({
  isHalfSchedule: yup.boolean().required(),
  schedule: scheduleSchema,
});
