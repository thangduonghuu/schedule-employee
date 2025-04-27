<script lang="ts" setup>
definePageMeta({
  middleware: "sign-in",
});

import { useMutation } from "@tanstack/vue-query";
import type { FormInstance, Rule } from "ant-design-vue/es/form";
import Cookie from "js-cookie";
import { reactive } from "vue";
import { Register } from "~/api/auth";

const showPage = ref(false);
const router = useRouter();
const formRef = ref<FormInstance>();

const { mutateAsync: createUserMutation, isPending } = useMutation({
  mutationFn: Register,
  onSuccess: () => {
    message.success("Register successful");
    router.push("/login");
  },
  onError: () => {
    message.error("Register failed");
  },
});

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const formState = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  checkPass: "",
});
const onFinish = (values: any) => {
  createUserMutation(values);
};

const validatePass = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("Please input the password");
  } else {
    if (formState.checkPass !== "" && formRef.value) {
      formRef.value.validateFields("checkPass");
    }
    return Promise.resolve();
  }
};

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("Please input the password again");
  } else if (value !== formState.password) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  password: [{ required: true, validator: validatePass, trigger: "change" }],
  checkPass: [{ required: true, validator: validatePass2, trigger: "change" }],
};

const backToLogin = () => {
  router.push("/login");
};

onMounted(() => {
  const token = Cookie.get("access_token");
  document.title = "Register Page";
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
    class="flex items-center h-full justify-center bg-background"
  >
    <div class="p-8 pb-3 w-[500px] bg-custom rounded-2xl shadow-lg">
      <div>
        <div class="flex gap-2 cursor-pointer items-center" @click="backToLogin">
          <Icon name="weui:back-filled" />
          <a-typography-text style="color: #6b7280">
            Back to login
          </a-typography-text>
        </div>
      </div>
      <h1 class="text-2xl font-bold text-center mb-4">Register</h1>
      <a-form
        :model="formState"
        layout="vertical"
        ref="formRef"
        name="nest-messages"
        :validate-messages="validateMessages"
        :rules="rules"
        @finish="onFinish"
      >
        <a-form-item
          name="firstName"
          label="First Name"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="formState.firstName" />
        </a-form-item>
        <a-form-item
          name="lastName"
          label="Last Name"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="formState.lastName" />
        </a-form-item>
        <a-form-item
          name="email"
          label="Email"
          :rules="[{ type: 'email', required: true }]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item has-feedback label="Password" name="password">
          <a-input
            v-model:value="formState.password"
            type="password"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="Confirm password" name="checkPass">
          <a-input
            v-model:value="formState.checkPass"
            type="password"
            autocomplete="off"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            class="w-full"
            type="primary"
            html-type="submit"
            :loading="isPending"
          >
            Register
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
