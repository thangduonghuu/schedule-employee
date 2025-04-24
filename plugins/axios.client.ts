import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const axiosClient = axios.create({
    baseURL: config.public.apiBaseUrl, // Use runtime config for the base URL
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
      //   if (error.response?.status === 401) {
      //     Cookies.remove("accessToken");
      //     window.location.href = "/sign-in";
      //   }

      // const isGetMethod = error.config?.method?.toLowerCase() === "get";

      // if (isGetMethod) {
      //   return Promise.reject(error);
      // }

      return Promise.reject(error.response?.data);
    }
  );

  axiosClient.interceptors.request.use((request) => {
    const token = Cookies.get("accessToken");
    // if (token)
    request.headers.Authorization = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5nLmR1b25nQGV4YW1wbGUuY29tIiwidXNlcklkIjoiNjJjZGU1ODEtNmZmMy00MjU2LThkMWYtZTJlN2Y2MGRiMjNlIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ1Mzk0MTM3LCJleHAiOjE3NDUzOTc3Mzd9.ZXwt83FXtzfxyJdHxhcYh5uN4-zsdQwlVS2739mrzwM`;
    request.headers["Cache-Control"] = "no-cache";
    request.headers.Pragma = "no-cache";
    request.headers.Expires = "0";

    return request;
  });

  // Provide the Axios client globally
  nuxtApp.provide("axios", axiosClient);
});
