<template>
  <div class="flex items-center h-full justify-center bg-gray-50">
    <div class="p-12 w-[500px] bg-violet-300 rounded-2xl shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-4 text-white">Register</h1>
      <a-form
        :model="formState"
        v-bind="layout"
        name="nest-messages"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        :validate-messages="validateMessages"
        @finish="onFinish"
      >
        <a-form-item
          :name="['user', 'name']"
          label="Name"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="formState.user.name" />
        </a-form-item>
        <a-form-item
          :name="['user', 'email']"
          label="Email"
          :rules="[{ type: 'email', required: true }]"
        >
          <a-input v-model:value="formState.user.email" />
        </a-form-item>
        <a-form-item
          :name="['user', 'password']"
          label="Password"
          :rules="[{ type: 'string', required: true }]"
        >
          <a-input v-model:value="formState.user.password" />
        </a-form-item>
        <a-form-item
          :name="['user', 'confirmPassword']"
          label="Confirm Password"
          :rules="[{ type: 'string', required: true }]"
        >
          <a-input v-model:value="formState.user.confirmPassword" />
        </a-form-item>
        <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
          <a-button
            html-type="submit"
            type="primary"
            class="py-5 rounded-full flex items-center gap-1"
          >
            Register
          </a-button>
          <!-- <a-button type="primary" html-type="submit">Submit</a-button> -->
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

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
  user: {
    name: "",
    age: undefined,
    email: "",
    password: "",
    confirmPassword: "",
  },
});
const onFinish = (values: any) => {
  console.log("Success:", values);
};
</script>
