import * as yup from "yup";

const getSessionSchema = (isHalf: boolean) =>
  yup.object({
    am: yup.string().required(),
    amState: yup.string().when("am", (am, schema) => {
      return am[0] === "WAO"
        ? schema.required(
            "Seat is required when working at office in the morning"
          )
        : schema.notRequired();
    }),
    pm: isHalf
      ? yup.string().required("PM is required for half schedule")
      : yup.string().optional(),
    pmState: yup.string().when("pm", (pm, schema) => {
      return pm[0] === "WAO"
        ? schema.required(
            "Seat is required when working at office in the afternoon"
          )
        : schema.notRequired();
    }),
  });

const scheduleSchema = yup.lazy((value, { parent }) => {
  const isHalf = parent?.isHalfSchedule;
  return yup.object({
    monday: getSessionSchema(isHalf).required(),
    tuesday: getSessionSchema(isHalf).required(),
    wednesday: getSessionSchema(isHalf).required(),
    thursday: getSessionSchema(isHalf).required(),
    friday: getSessionSchema(isHalf).required(),
  });
});

export const fullSchema = yup.object({
  isHalfSchedule: yup.boolean().required(),
  schedule: scheduleSchema,
});
