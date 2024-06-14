<template>
  <header class="flex-row p-10px gap-15px align-center">
    <router-link to="/">
      <slot name="logo">
        <pv-icon icon=""></pv-icon>
      </slot>
    </router-link>

    <div class="flex-1 flex-row justify-end">
      
    </div>
  </header>
</template>

<script setup lang="ts" name="layotHeader">

onBeforeMount(() => {});
</script>
