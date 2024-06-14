<template>
  <el-checkbox-group ref="checkHtml" v-model="data" :text-color="item.textColor" :fill="item.fill"
    :min="Number(item.minlength)" :max="Number(item.maxlength)" :disabled="item.disabled" :size="item.size"
    @change="onTapChange">
    <template v-for="sitem in pvcheck.list">
      <el-checkbox-button v-if="item.type == 'button'" :true-label="sitem.trueLabel" :false-label="sitem.falseLabel"
        :key="sitem.label" :disabled="sitem.disabled" :label="sitem.value">
        {{ sitem.label }}
      </el-checkbox-button>
      <template v-else>
        <el-checkbox :key="sitem.label" :true-label="sitem.trueLabel" :false-label="sitem.falseLabel"
          :disabled="sitem.disabled" :label="sitem.value">
          {{ sitem.label }}
        </el-checkbox>
      </template>
    </template>
  </el-checkbox-group>
</template>

<script setup lang="ts" name="pv-checkbox">
const emit = defineEmits(['change']);
const props: any = defineProps({
  item: { type: Object, required: false, default: () => { } },
  datas: { type: Array, required: false, default: () => [] },
  option: { type: Object, required: false, default: () => { } },
});
const data = ref();
const checkHtml = ref();
const pvcheck: any = reactive({
  list: props?.item?.list ?? props?.datas ?? [],
});

const onTapChange = (val: any) => {
  data.value = val;
  const temjson: any = {};
  temjson[props.item.name] = val;
  emit("change", temjson);
};
// 获取请求
const getDataList = async () => {
  if (props.item?.load || props.item?.props) {
    if (props.item.nodeKey && props.option[props.item.nodeKey]) {
      pvcheck.list = await getItemLoad(props.item, props.option);
    } else {
      pvcheck.list = await getItemLoad(props.item, props.option);
    }
  } else {
    pvcheck.list = props?.item?.list ?? props.datas;
  }
};
watch(props?.item, () => {
  pvcheck.list = props?.item?.list ?? props.datas;
}, { deep: true });

defineExpose({ data, checkHtml, getDataList });

</script>
