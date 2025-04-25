import { ENDPOINTS } from "~/utils/lookup/endpoints";

export const Login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const nuxtApp = useNuxtApp(); // Ensure this is called within a valid context
  const { $axios } = nuxtApp;
  const response = await $axios.post(ENDPOINTS.auth.signIn, {
    email,
    password,
  });
  return response;
};

export const Register = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const nuxtApp = useNuxtApp(); // Ensure this is called within a valid context
  const { $axios } = nuxtApp;
  const response = await $axios.post(ENDPOINTS.auth.signUp, {
    email,
    password,
    firstName,
    lastName
  });
  return response;
};
