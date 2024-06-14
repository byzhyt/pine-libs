<template>
  <footer class="flex-row text-info flex-wrap">
    <span class="p-r-6px">{{ config.corp }}</span>
    <span>版权所有 违者必究</span>
    <el-link :underline="false" :href="config.adviceLink">{{
      config.adviceLabel
    }}</el-link>
  </footer>
</template>

<script setup lang="ts">
const config: any = inject("configTheme");
</script>
