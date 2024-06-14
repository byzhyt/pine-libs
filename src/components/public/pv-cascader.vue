<template>
  <el-cascader v-model="data" :props="pvcascader.props" :options="item.list" filterable clearable
    @change="onTapChange"></el-cascader>
</template>
<script lang="ts" setup name="pv-cascader">
import {isObject} from 'pine-utils'
const props = defineProps<{ option: any; item: any; }>();
const data = ref();

const emit = defineEmits(['submit', 'change']);
const pvcascader: any = reactive({
  props: {}
});
const onTapChange = (vals: any) => {
  data.value = vals;
  const datas: any = {};
  if (!isObject(props.item?.load)) {
    props.item?.load.map((item: any, index: number) => {
      if (vals) {
        datas[item?.name ?? props.item?.name] = vals[index];
      } else {
        console.log(888)
        datas[item?.name ?? props.item?.name] = '';
      }
    });
  }
  emit('change',datas);
};
const setInitLoad = () => {
  pvcascader.props = {
    multiple: props.item?.multiple ?? false,
    lazy: props.item?.lazy ?? false,
    checkStrictly: props.item?.checkStrictly ?? false
  };
  if (props.item?.lazy && props.item?.load) {
    pvcascader.props.lazyLoad = async (node: any, resolve: any) => {
      const { level, data } = node;
      let itemload: any = {};
      if (isObject(props.item?.load)) {
        itemload = {
          item: props.item,
          data
        };
      } else {
        const item = props.item?.load[level];
        item.request = item.request ?? props.item.request;
        item.params = item.params ?? props.item.params;
        item.props = item.props ?? props.item.props;
        itemload.item = item;
        itemload.data = level ? data : {};
      }
      getItemLoad(itemload.item, itemload.data).then((data) => {
        data.map((item: any) => {
          item.leaf = level >= (props.item?.level ?? 2);
          return item;
        });
        resolve(data);
      }).catch(() => {
        resolve([]);
      });
    };
  } else {
    pvcascader.props = props.item?.props;
  }
};
onBeforeMount(() => {
  setInitLoad();
});
defineExpose({ data });
</script>
