<template>
  <div class="flex-col bg-white radius-10px p-10px height-full">
    <el-breadcrumb class=" p-y-15px p-x-10px bg-bgc" :class="mb ? 'm-b-15px' : 'm-b-10px'" separator=">">
      <template :key="key" v-for="(item, key) in routes">
        <el-breadcrumb-item v-if="item.path != '/'" :to="item.redirect ?? item.path">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <div class="flex-1 flex-col overflow-y-auto p-10px" :class="bodyClassName">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts" name="layoutCrumbs">
const route = useRoute();
defineProps({
  mb: {
    type: Boolean,
    default: true
  },
  bodyClassName: {
    type: String,
    default: ''
  }
});
const routes = computed(() => {
  const matched = getDictList('matched') ?? [];
  if (route.matched.length >= 2 && !getDictList('text')) {
    return matched;
  } else {
    return [...matched, {
      ...route,
      meta: {
        title: getDictList('text')
      }
    }];
  }
});
</script>
