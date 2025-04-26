<script lang="ts" setup>

import { ref } from "vue";
const activeKey = ref("1");
</script>
<template>
  <div class="min-h-screen bg-background">

    <main class="container-custom h-dvh w-full">
      <slot />
    </main>
  </div>
</template>
