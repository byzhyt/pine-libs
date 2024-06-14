<template>
  <el-menu :ellipsis="false" :default-active="route.path" unique-opened>
    <template v-for="item in items" :key="item?.path">
      <pv-menu-item
        v-if="item.meta?.visible ?? true"
        :item="item"
        :index="item.path"
      ></pv-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts" name="pv-menu">
const route: any = useRoute();

defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array<any>
  }
});
onBeforeMount(() => {});
</script>
