import * as yup from "yup";

export const schemaRepeatForm = yup.object({
  numberWeekRepeat: yup.number().required("Number of weeks is required"),
  week: yup.string().required("Week is required"),
  changeToType: yup.string().optional(),
});
