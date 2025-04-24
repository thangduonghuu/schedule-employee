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
      if (error.response?.status === 401) {
        Cookies.remove("accessToken");
        window.location.href = "/login";
      }

      const isGetMethod = error.config?.method?.toLowerCase() === "get";

      if (isGetMethod) {
        return Promise.reject(error);
      }

      return Promise.reject(error.response?.data);
    }
  );

  axiosClient.interceptors.request.use((request) => {
    const token = Cookies.get("accessToken");
    if (token) request.headers.Authorization = `${token}`;
    request.headers["Cache-Control"] = "no-cache";
    request.headers.Pragma = "no-cache";
    request.headers.Expires = "0";

    return request;
  });

  // Provide the Axios client globally
  nuxtApp.provide("axios", axiosClient);
});
