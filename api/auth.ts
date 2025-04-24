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
  console.log({
    email,
    password,
  });
  const response = await $axios.post(ENDPOINTS.auth.signIn, {
    email,
    password,
  });
  return response;
};
