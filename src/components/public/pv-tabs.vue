<template>
  <el-tabs v-model="data" :tab-position="option?.position" :type="option?.type"
    @tab-change="onTapChange">
    <el-tab-pane v-for="(item, key) in pvtabs.tabsList" :key="key" :disabled="item.disabled" :name="item.value">
      <template #label>
        <pv-icon :icon="item" v-if="item.icon"></pv-icon>
        <span v-text="item.label" v-if="item.label"></span>
      </template>
      <slot></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts" name="pv-tabs">
const emit = defineEmits(['change']);

const props = defineProps({
  datas: {
    type: Array,
    required: false,
    default: () => []
  },
  option: {
    type: Object,
    required: false,
    default: () => { }
  }
});
const data = ref();
const pvtabs: any = reactive({
  tabsList: props.datas ?? props?.option?.items ?? []
});
const onTapChange = (val: any) => {
  data.value = val;
  emit('change', val);
};
onBeforeMount(() => {
  data.value = pvtabs.tabsList[0].value;
});
defineExpose({
  data
});
</script>
