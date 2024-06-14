<template>
  <div>
    <Suspense>
      <slot></slot>
      <template #fallback>
        <pv-loading :loading="loading"></pv-loading>
      </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts" name="layoutSuspense">
defineProps({
  loading: {
    required: false,
    type: String
  }
});
</script>
