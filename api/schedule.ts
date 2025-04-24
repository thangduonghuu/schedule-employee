import { ENDPOINTS } from "~/utils/lookup/endpoints";

export const getUserSchedule = async (query: {}) => {
  const nuxtApp = useNuxtApp(); // Ensure this is called within a valid context
  const { $axios } = nuxtApp;

  const response = await $axios.get(ENDPOINTS.schedule.query(query));
  return response;
};

export const createSchedule = async (data: {}) => {
  const nuxtApp = useNuxtApp(); // Ensure this is called within a valid context
  const { $axios } = nuxtApp;

  const response = await $axios.post(ENDPOINTS.schedule.create, data);
  return response;
}