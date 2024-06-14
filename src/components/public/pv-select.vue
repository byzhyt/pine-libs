<template>
  <el-select v-model="data" ref="selectHtml" :fit-input-width="true" :class="item?.className ?? ''" clearable
    :filterable="item?.filterable ?? false" :remote="item?.remote ?? false" :remote-method="remoteMethod"
    :disabled="item?.disabled ?? false" :multiple="item?.multiple ?? false" :placeholder="item?.placeholder ?? ''"
    :loading="loading" @change="onTapChange">
    <el-option v-for="sitem in pvselect.list" :key="sitem.label" :label="sitem?.label ?? ''"
      :value="sitem?.value ?? ''"></el-option>
  </el-select>
</template>
<script setup lang="ts" name="pv-select">
const emit = defineEmits(["change"]);
const data = ref();
const selectHtml = ref();
const loading = ref(false);
const props: any = defineProps({
  item: { type: Object, required: false, default: () => { } },
  datas: { type: Array, required: false, default: () => [] },
  option: { type: Object, required: false, default: () => { } },
});
const pvselect: any = reactive({
  list: props?.item?.list ?? props?.datas ?? [],
});

const onTapChange = (val: any) => {
  data.value = val;
  const temjson: any = {};
  temjson[props.item.name] = val;
  emit("change", temjson);
};
//模糊查询
const remoteMethod = async (query: string) => {
  console.log(props.option)
  if (query) {
    loading.value = true;
    loading.value = false;
    pvselect.list = await getItemLoad(props.item, { query, ...props.option });
  } else {
    pvselect.list = [];
  }
};
// 获取请求
const getDataList = async () => {
  pvselect.list = props?.item?.list ?? props.datas;
};
watch(props?.item, () => {
  getDataList();
}, { deep: true });
onBeforeMount(() => {
  getDataList();
});
defineExpose({ data, selectHtml, getDataList });
</script>
