<template>
  <el-radio-group v-model="data" :text-color="item.textColor" :fill="item.fill" :size="item.size" @change="onTapChange">
    <template v-for="sitem in pvradio.list">
      <el-radio-button v-if="item.type" :key="sitem.label" :label="sitem.value" :true-label="sitem.trueLabel"
        :false-label="sitem.falseLabel">
        {{ sitem.label }}
      </el-radio-button>
      <template v-else>
        <el-radio :label="sitem.value" :key="sitem.label" :true-label="sitem.trueLabel" :false-label="sitem.falseLabel">
          {{ sitem.label }}
        </el-radio>
      </template>
    </template>
  </el-radio-group>
</template>

<script setup lang="ts" name="pv-radio">
const emit = defineEmits(['change']);

const props: any = defineProps<{ item: any; }>();
const data = ref();
const pvradio: any = reactive({
  list: []
});

const onTapChange = (val: any) => {
  data.value = val;
  const temjson: any = {};
  temjson[props.item.name] = val;
  emit("change", temjson);
};

// 获取请求
const getDataList = async () => {
  pvradio.list = props?.item?.list ?? props.datas;
};
watch(props?.item, () => {
  getDataList();
}, { deep: true });
onMounted(() => {
  getDataList();
});
defineExpose({ data });
</script>
