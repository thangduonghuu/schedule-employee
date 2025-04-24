<script lang="ts" setup>
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons-vue";

import { ref } from "vue";
const activeKey = ref("1");
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- <header class="bg-white shadow-sm">
      <div class="container-custom py-4">
        <nav class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600"
              >My Schedule</NuxtLink
            >
          </div>
          <div class="flex items-center space-x-4">
            <a-tabs v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="Week"></a-tab-pane>
              <a-tab-pane key="2" tab="Month"></a-tab-pane>
            </a-tabs>
          </div>
        </nav>
      </div>
    </header> -->

    <main class="container-custom h-dvh w-full">
      <slot />
    </main>
  </div>
</template>
