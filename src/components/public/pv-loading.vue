<template>
  <div>{{ loading }}</div>
</template>
<script setup lang="ts" name="pv-loading">
defineProps({
  loading: {
    required: false,
    type: String,
    default: "正在加载..."
  }
});
</script>
