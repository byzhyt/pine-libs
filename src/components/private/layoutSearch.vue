<template>
  <layoutCrumbs :mb="false">
    <div class="radius-10px height-full flex-col">
      <pageSearch ref="pageHtml" :datas="datas" :option="option" @load="onTapLoad" @change="onTapChange">
        <slot></slot>
        <template #descHeader>
          <slot name="topDesc"></slot>
        </template>
      </pageSearch>
    </div>
  </layoutCrumbs>
</template>

<script setup lang="ts" name="layoutSearch">
const emit = defineEmits(['change', 'load']);
defineProps({
  option: {
    required: true,
    type: Object,
    default: () => { }
  },
  datas: {
    type: Object,
    required: false,
    default: () => { }
  }
});
const pageHtml = ref();
const onTapLoad = (data: any) => {
  emit('load', data);
};
const onDialogVisible = () => {
  pageHtml.value.onDialogVisible();
};
const setInitTable = () => {
  pageHtml.value.setInitTable();
};
const onTapChange = (data: any) => emit('change', data);
defineExpose({
  pageHtml,
  setInitTable,
  onDialogVisible
});
</script>
