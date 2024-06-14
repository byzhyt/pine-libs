<template>
  <el-pagination
    :hide-on-single-page="pvpagin.hideSinglePage"
    :background="pvpagin.background"
    :current-page="pvpagin.current"
    :page-sizes="pvpagin.pageSizes"
    :page-size="pvpagin.size"
    :layout="pvpagin.layout"
    :small="pvpagin.small"
    :total="pvpagin.total"
    @current-change="handleCurrentChange"></el-pagination>
</template>

<script setup lang="ts" name="pv-pagin">
const props = defineProps<{ option: any }>();
const pvpagin: any = reactive({
  total: Number(props.option.total) ?? 0,
  small: props.option.small ?? false,
  hideSinglePage: props.option.hideSinglePage ?? false,
  size: Number(props.option.size) ?? 10,
  current: Number(props.option.current) ?? 1,
  layout: props.option.layout ?? 'total, prev, pager, next, jumper',
  background: props.option.background ?? true,
  pageSizes: props.option.pageSizes ?? []
});
const emit = defineEmits(['change']);

const handleCurrentChange = (val: number) => {
  pvpagin.current = val;
  emit('change', {
    ...pvpagin,
    ...{ current: val }
  });
};

onBeforeMount(() => {
  for (let i = 1; i <= Math.ceil(pvpagin.total / pvpagin.size); i++) {
    pvpagin.pageSizes.push(pvpagin.size * i);
  }
});
defineExpose({
  data: pvpagin
});
</script>
