<template>
  <el-tree-v2 ref="treeHtml" class="width-full flex-col flex-1" :data="pvtree.list" :props="item.props"
    :height="pvtree.height" :default-expand-all="item.defaultExpandAll" :check-on-click-node="item.checkOnClickNode"
    :default-expanded-keys="item?.showCheckbox ? data : []" :show-checkbox="item.showCheckbox" :node-key="item.treeKey"
    :default-checked-keys="item?.showCheckbox ? data : []" :empty-text="item.emptyText" :icon="item.iconClass"
    :indent="item.indent" :highlight-current="item?.highlightCurrent ?? true" :current-node-key="item.treeKey"
    :filter-method="onFilterMethod" @check-change="handleNodeClick" @node-click="handleNodeClick"></el-tree-v2>
</template>
<script setup lang="ts" name="pv-tree">
const emit = defineEmits(['change']);
const props: any = defineProps({
  item: { type: Object, required: false, default: () => { } },
  datas: { type: Array, required: false, default: () => [] },
  option: { type: Object, required: false, default: () => { } },
});
const data: any = ref();
const treeHtml = ref();
const pvtree: any = reactive({
  treeHeight: 0,
  data: [],
  time: null
});

const handleNodeClick = (data: any, node: any) => {
  data.value = data;
  const checkboxs = props.item.showCheckbox ? treeHtml.value.getCheckedNodes() : [];
  emit('change', { data, node: node, checkboxs });
};
const onFilterMethod = (query: string, node: any) => {
  return node.label!.includes(query);
};
// 获取请求
const getDataList = async () => {
  // if (props.item?.load || props.item?.props) {
  //   if (props.item.nodeKey && props.option[props.item.nodeKey]) {
  //     pvtree.list = await getItemLoad(props.item, props.option);
  //   } else {
  //     pvtree.list = await getItemLoad(props.item, props.option);
  //   }
  // } else {
  // }
  pvtree.list = props?.item?.list ?? props.datas;
};
watch(props?.item, () => {
  getDataList();
}, { deep: true });

onBeforeMount(async () => {
  await getDataList();
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
