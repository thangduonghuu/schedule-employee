// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@ant-design-vue/nuxt", "@nuxt/icon"],
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.API_BASE_URL || "https://hdtjnfqfb1.execute-api.ap-southeast-2.amazonaws.com/",
    },
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    viewer: true,
  },
  plugins: [
    "@/plugins/axios.client.ts", // Correct plugin path
  ],
});
