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

export const repeatSchedule = async (data: {}) => {
  const nuxtApp = useNuxtApp(); // Ensure this is called within a valid context
  const { $axios } = nuxtApp;

  const response = await $axios.post(ENDPOINTS.schedule.repeat, data);
  return response;
}