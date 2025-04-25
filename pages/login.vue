<script lang="ts" setup>
definePageMeta({
  middleware: "sign-in",
});

import { useMutation } from "@tanstack/vue-query";
import { reactive } from "vue";
import { Login } from "~/api/auth";
import Cookie from "js-cookie";

const showPage = ref(false);
const router = useRouter();

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  email: "",
  password: "",
  remember: true,
});
const onFinish = (values: any) => {
  login(values);
};

const { mutateAsync: login, isPending: isPendingCreate } = useMutation({
  mutationFn: Login,
  onSuccess: (data) => {
    Cookie.set("access_token", data.token, {
      expires: 1,
    });
    navigateTo("/");
    message.success("Login successful");
  },
  onError: () => {
    message.error("Login failed");
  },
});

const onFinishFailed = (errorInfo: any) => {};

const goToRegister = () => {
  router.push("/register");
};

onMounted(() => {
  const token = Cookie.get("access_token");
  if (token) {
    router.replace("/");
  } else {
    showPage.value = true;
  }
});
</script>

<template>
  <div
    v-if="showPage"
    class="flex items-center gap-2 flex-col h-full justify-center bg-gray-50"
  >
    <div class="p-8 pb-0 bg-violet-300 rounded-2xl shadow-lg">
      <h1 class="text-2xl w-[350px] font-bold text-center mb-4">Login</h1>
      <a-form
        layout="vertical"
        :model="formState"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
            },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button :loading="isPendingCreate" type="primary" html-type="submit"
            >Submit</a-button
          >
        </a-form-item>
      </a-form>
    </div>
    <a-typography-text style="color: #6b7280"
      >Don't have an account?
    </a-typography-text>
    <a-typography-text
      @click="goToRegister"
      style="cursor: pointer; color: #1890ff"
    >
      Register
    </a-typography-text>
  </div>
</template>
