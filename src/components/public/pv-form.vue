<template>
  <el-form ref="formHtml" :size="pvform.size" :model="pvform.data" :inline="pvform.inline" hide-required-asterisk
    :class="option.className" scroll-to-error :disabled="option.disabled" :status-icon="option.statusIcon"
    @submit.prevent="() => { }">
    <slot v-if="option.prepend" :name="option.prepend" :row="pvform.data"></slot>
    <template v-if="pvform.span">
      <el-row :gutter="option.gutter ?? 20">
        <template v-for="item in pvform.items">
          <el-col :span="item.span ? item.span : pvform.span" :key="item.name" :class="option.bodyClassName"
            v-if="item.visible">
            <pv-form-item :option="pvform.data" :item="item" v-model="pvform.data" @change="onTapChange"
              @submit="onTapSubmit">
              <template #[item.slotName]="{ row, column }">
                <slot :name="column.slotName" :row="row" :column="column"></slot>
              </template>
            </pv-form-item>
          </el-col>
        </template>
      </el-row>
    </template>
    <!-- 表单非多列显示 -->
    <template v-else>
      <template v-for="item in pvform.items">
        <pv-form-item :option="pvform.data" v-if="item.visible" :key="item.name" :item="item" v-model="pvform.data"
          @change="onTapChange" @submit="onTapSubmit">
          <template #[item.slotName]="{ row, column }">
            <slot :name="column.slotName" :row="row" :column="column"></slot>
          </template>
        </pv-form-item>
      </template>
    </template>
    <slot v-if="option.append" :name="option.append" :row="pvform.data"></slot>
  </el-form>
</template>

<script setup lang="ts" name="pv-form">
import { findObjectValue, getName, validation, isObject, dataEmpty } from 'pine-utils'
const props: any = defineProps({
  option: {
    type: Object,
    required: true,
    default: () => { }
  },
  datas: {
    type: Object,
    required: false,
    default: () => { }
  }
});
const formHtml: any = ref();
const emit = defineEmits(['change', 'submit', 'beforeSubmit']);
const pvform: any = reactive({
  items: props.option.items.length ? props.option.items : [],
  rules: props.option?.rules || null,
  span: props.option?.span || 0,
  size: props.option?.size,
  inline: props.option?.span ? false : props.option?.inline,
  data: props.option?.datas ?? {},
  loading: false,
  loads: []
});

// 设置动态表单
const setDynamicItem = (datas: any, name: string) => {
  const items = [].concat(props.option.items);
  let list: any = [];
  if (datas && Array.isArray(datas)) {
    list = datas.map((ditem: any) => {
      ditem.visible = true;
      ditem[name] = true;
      return ditem;
    });
  } else if (datas && typeof datas == 'string') {
    list = JSON.parse(datas).map((ditem: any) => {
      ditem.visible = true;
      ditem[name] = true;
      return ditem;
    });
  }
  items.map((sitem: any, key: number, array: Array<any>) => {
    if (sitem.insert) {
      array.splice(key, 1, sitem, ...list);
    }
  });
  pvform.items = items;
};

// 动态获取表单
const getDynamicFormItem = ({ data, item }: any) => {
  if (item?.dynamic?.load) {
    httpRequest(item.dynamic, pvform.data).then(({ data }: any) => {
      const datas = findObjectValue(data, item.dynamic.request);
      if (Array.isArray(datas)) {
        setDynamicItem(datas, item.dynamic.name);
      }
    });
  } else {
    const datas = item?.list.find((fitem: any) => {
      if (fitem[item.props.value] == data || fitem[item.props.label] == data) {
        return fitem;
      }
    });
    setDynamicItem(
      findObjectValue(datas, item.dynamic.request),
      item.dynamic.name
    );
  }
};

// 关联请求数据处理
const formFindCascader = async (item: any) => {
  await pvform.items.map((citem: any) => {
    item.cascader.map(async (name: string) => {
      if (name == citem.name && item.visible) {
        pvform.data[name] = dataEmpty(citem);
        formHtml.value.resetFields();
        // 获取当前下拉框选中数据
        const selfitem = item.list.find((sitem: any) => {
          if (sitem.value == pvform.data[item.name]) {
            return sitem;
          }
        }) ?? {};
        citem.selfitem = selfitem;
        if ((citem.load || citem.list) && !item.oneself) {
          if (!item.oneself) {
            citem.list = await getItemLoad(citem, pvform.data);
          } else {
            pvform.data[name] = selfitem[getName(citem)];
          }
        } else {
          if (citem.props) {
            const list = findObjectValue(selfitem, item.oneself);
            citem.list = Array.isArray(list) ? list : JSON.parse(list);
            citem.list = await getItemLoad(citem);
          } else {
            pvform.data[name] = findObjectValue(selfitem, getName(citem));

          }
        }
      }
    });
    return citem;
  });
};
// 控制字段显示
const formFindControl = async (item: any) => {
  pvform.items.map((ritem: any) => {
    if (ritem?.name && Array.isArray(item?.control) && item.control.length) {
      item.control.map((citem: any) => {
        if (citem.label == ritem.name && item.visible) {
          if (citem.static) {
            if (Array.isArray(citem.value)) {
              ritem.visible = citem.value.includes(
                findObjectValue(pvform.data, getName(item))
              );
            } else {
              ritem.visible =
                findObjectValue(pvform.data, getName(item)) == citem.value;
            }
          } else {
            ritem.visible = findObjectValue(pvform.data, getName(item));
          }
        }
      });
    }

    return ritem;
  });
};

// 数据变化监听事件
const onTapChange = ({ data, item }: any) => {
  pvform.data = { ...pvform.data, ...data };
  emit('change', { data: pvform.data, item: item });
  if (item.dynamic && isObject(item?.dynamic)) {
    getDynamicFormItem(item);
  }
  if (item.cascader && Array.isArray(item.cascader)) {
    formFindCascader(item);
  }
  if (item.control && Array.isArray(item.control)) {
    formFindControl(item);
  }
};
// 初始化表单单元执行方法
const setLabelItems = (item: any, nodeKey: string) => {
  item.labelWidth = item.labelWidth ?? props.option?.labelWidth;
  item.labelPosition =
    item.labelPosition ?? props.option?.labelPosition ?? 'right';
  item.showMessage = item.showMessage ?? props.option?.showMessage ?? true;
  item.inlineMessage =
    item.inlineMessage ?? props.option?.inlineMessage ?? false;
  if (item?.name) {
    const svalue = findObjectValue(pvform.data, getName(item));
    if (pvform.data.hasOwnProperty(nodeKey)) {
      pvform.data[item.name] = svalue;
    } else {
      if (typeof svalue == 'string') {
        pvform.data[item.name] = svalue == '' ? dataEmpty(item) : svalue;
      } else {
        pvform.data[item.name] = svalue;
      }
    }
  }
  if (!item?.rules && (item?.pattern ?? item?.required)) {
    const rulesJson1 = {
      required: item?.required ?? false,
      trigger: 'change',
      message: item?.message ?? item?.placeholder ?? '该字段不能为空'
    };
    if (item?.label && item?.placeholder && !item?.placeholder.match(item?.label)) {
      rulesJson1.message = item?.placeholder + item?.label;
    }
    const rulesJson2 = {
      trigger: 'change',
      message: '输入格式有误',
      pattern: validation[item?.pattern]
    };
    if (!validation[item?.pattern]) {
      rulesJson2.pattern =
        pvform.data[item?.pattern] ?? validation[item?.pattern ?? 'content'];
    }
    item.rules = [rulesJson1, rulesJson2];
  }
  return item;
};
// 初始化表单单元
const setInitFormItem = () => {
  const items = [].concat(pvform.items);
  const nodeKey = props.option?.nodeKey;
  items.map(async (item: any) => {
    setLabelItems(item, nodeKey);
    return item;
  });
  nextTick(() => {
    pvform.items = items;
  });
};

// 重组动态参数
const setDynamicParams = () => {
  const items = [].concat(pvform.items);
  const params = Object.assign({}, pvform.data);
  const tempjson: any = {};

  const sitem: any = items.find((item: any) => {
    if (isObject(item.dynamic) && item.dynamic.name) {
      return item;
    }
  });
  if (sitem) {
    tempjson[sitem?.dynamic.name] = {};
    items.map((item: any) => {
      if (item[sitem?.dynamic.name]) {
        tempjson[sitem.dynamic.name][item.name] = params[item.name];
        delete params[item.name];
      }
    });
  }
  return Object.assign({}, params, tempjson);
};
const getLoadOrParams = (item: any) => {
  let sitem = item;
  if (Array.isArray(item.load)) {
    sitem = pvform.data[item.nodeKey] ? item.load[1] : item.load[0];
  }
  sitem.nodeKey = item.nodeKey;
  return sitem;
};
// 表单点击事件
const onTapSubmit = async (item: any) => {
  emit('beforeSubmit', { data: pvform.data, item });
  const datas = item?.dynamic ? setDynamicParams() : pvform.data;
  if (item.load) {

    formHtml.value.validate((valid: any) => {
      if (valid) {
        if (pvform.loading) return false;
        pvform.loading = true;
        httpRequest(getLoadOrParams(item), datas)
          .then(({ data }: any) => {
            pvform.loading = false;
            handleChange(item, data).then((data: any) => {
              console.log(data);
              emit('submit', { ...data, datas });
            });
          })
          .catch(() => {
            pvform.loading = false;
          });
      }
    });
  } else if (item.validate) {
    formHtml.value.validate((valid: any) => {
      if (valid) {
        emit('submit', { data: pvform.data, item, datas: {} });
      }
    });
  } else {
    handleChange(item, pvform.data).then((data: any) => {
      emit('submit', data);
    });
  }
};
// 表单下拉框数据请求
const httpSelectList = async (item: any, loop: boolean) => {
  if ((item?.load || item?.props) && !item.lazy) {
    item.list = await getItemLoad(item, pvform.data);
  }
  if (item?.control && Array.isArray(item?.control)) {
    formFindControl(item);
  }
  if (item?.dynamic && isObject(item?.dynamic)) {
    pvform.data = Object.assign(
      {},
      pvform.data,
      pvform.data[item?.dynamic.name]
    );
    loop &&
      (await getDynamicFormItem({
        data: pvform.data[item.name],
        item
      }));
  }
  //  关联请求数据处理
  if (item?.cascader && Array.isArray(item?.cascader)) {
    loop && formFindCascader(item);
  }
};
// 表单数据初始化
const getFormsJson = () => {
  const items = [].concat(pvform.items);
  items.map(async (item: any) => {
    if (item?.name) {
      const values = findObjectValue(
        pvform.data,
        item?.nodeKey
      );

      if (!item?.nodeKey && item.oneself) {
        httpSelectList(item, true);
      } else if (!item?.nodeKey) {
        httpSelectList(item, false);
      } else {
        values && httpSelectList(item, true);
      }

    }
    return item;
  });
  nextTick(() => {
    pvform.items = items;
  });
};
// 表单数据请求
const getLoadDetails = async () => {
  pvform.data = Object.assign({}, pvform?.data ?? {}, props.datas ?? {});

  if (props.option.load) {
    httpRequest(props.option, pvform.data)
      .then((data: any) => {
        if (props.option?.request) {
          pvform.data = findObjectValue(data, props.option?.request);
        } else {
          pvform.data = data;
        }
        setInitFormItem();
      })
      .catch(() => {
        setInitFormItem();
      });
  } else {
    setInitFormItem();
  }
};

onBeforeMount(() => getLoadDetails());
onMounted(() => {
  formHtml.value.resetFields();
  getFormsJson();
});

onBeforeUnmount(() => {
  formHtml.value.resetFields();
});

defineExpose({
  data: pvform.data,
  formHtml,
  getLoadDetails,
  onTapSubmit
});
</script>
<style lang="scss" scoped>
.el-form :deep() {

  .el-input {
    width: 100%;
  }
}
</style>
