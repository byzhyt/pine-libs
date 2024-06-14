<template>
  <el-sub-menu
    v-if="item?.children && (item.meta?.visible ?? true)"
    :index="item?.path"
  >
    <template #title>
      <pv-icon
        :icon="item.meta?.icon"
        :option="item.meta"
        className="m-r-10px"
        v-if="item.meta.icon ?? item.meta.iconClassName"
      ></pv-icon>
      <span>{{ item.meta?.title }}</span>
    </template>
    <template v-for="sitem in item?.children">
      <pv-menu-item
        :disabled="sitem.meta?.disabled ?? false"
        :key="sitem?.path"
        v-if="sitem.meta?.visible ?? true"
        :item="sitem"
        :index="sitem?.path"
      ></pv-menu-item>
    </template>
  </el-sub-menu>

  <el-menu-item
    @click="onTapChange(item)"
    v-else
    :key="item?.path"
    :disabled="item.meta?.disabled ?? false"
    :index="item?.path"
  >
    <pv-icon
      :icon="item.meta?.icon"
      :option="item?.meta"
      v-if="item.meta?.icon ?? item.meta?.iconClassName"
    ></pv-icon>
    <template #title> {{ item?.meta?.title }}</template>
  </el-menu-item>
</template>

<script setup lang="ts" name="pv-menu-item">
defineProps<{
  item: any;
}>();

const router = useRouter();
const onTapChange = (item: any) => {
  router.push(item.path);
};
</script>
<style lang="scss" scoped>
::v-deep .el-menu {
  .is-active {
    background: var(--el-menu-hover-bg-color) !important;
  }
}
</style>
