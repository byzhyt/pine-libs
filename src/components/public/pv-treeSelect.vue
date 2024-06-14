<template>
  <el-tree-select v-model="data" class="flex-1" ref="treeHtml" clearable :data="pvtree.list" :props="item.props"
    :accordion="item.accordion" :node-key="item.treeKey" highlight-current :show-checkbox="item.showCheckbox"
    :default-checked-keys="item.showCheckbox ? data : []" :expand-on-click-node="item.clickNode"
    :check-strictly="item.checkStrictly ?? true" :filterable="item.filterable ?? true"
    @current-change="handleNodeClick"></el-tree-select>
</template>
<script setup lang="ts" name="pv-treeSelect">
const emit = defineEmits(['change']);
const props = defineProps({
  item: { type: Object, required: false, default: () => { } },
  datas: { type: Array, required: false, default: () => [] },
  option: { type: Object, required: false, default: () => { } }
});
const data = ref<Array<any>>();
const treeBox = ref();
const treeTitle = ref();
const pvtree: any = reactive({
  treeHeight: 0,
  list: props.item.list ?? props.datas,
  time: null,
  option: { type: Object, required: false, default: () => { } }
});
const treeHtml = ref();
const titleHeight: any = useElementSize(treeTitle);
const leftHeight: any = useElementSize(treeBox);
const handleNodeClick = (data: any, node: any) => {
  data.value = data;
  emit("change", node.data);
};

// 获取请求
const getDataList = async () => {
  if (props.item?.load || props.item?.props) {
    if (props.item.nodeKey && props.option[props.item.nodeKey]) {
      pvtree.list = await getItemLoad(props.item, props.option);
    } else {
      pvtree.list = await getItemLoad(props.item, props.option);
    }
  } else {
    pvtree.list = props?.item?.list ?? props.datas;
  }
};
watch(props?.item, () => {
  pvtree.list = props?.item?.list ?? props.datas;
}, { deep: true });
onMounted(() => {
  pvtree.height =
    Number(leftHeight.height.value) - Number(titleHeight.height.value);
});

onUnmounted(() => {
  clearTimeout(pvtree.time);
});
defineExpose({
  data,
  getDataList
});
</script>

<style lang="scss" scoped>
.el-tree :deep(.el-vl__wrapper) {
  flex: 1;
  overflow-y: auto;
}
</style>
