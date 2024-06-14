<template>
  <div class="flex-col">
    <div class="flex-1 width-full flex-col overflow-y-auto">
      <el-table ref="tableHtml" class="height-full" height="100%" :default-sort="pvtable.defaultSort"
        :stripe="pvtable.stripe || true" :border="pvtable.border || true" :row-key="pvtable.nodeKey || 'id'"
        :lazy="pvtable.lazy" :fit="pvtable.fit" :tree-props="pvtable.treeProps"
        :current-row-key="pvtable.rowKey || 'id'" :show-header="pvtable.showHeader || true"
        :highlight-current-row="true" :row-class-name="setRowClassName" :cell-class-name="setRowClassName"
        :data="pvtable.listData" @cell-click="onCellClick" @selection-change="onSelectChange">
        <template #empty>
          <pv-empty :className="pvtable.emptyClassName"></pv-empty>
        </template>
        <template v-for="(item, key) in pvtable.items">
          <pv-tables-item v-if="item.visible" :key="key" :item="item" @submit="onTapSubmit">
            <template #[item.slotName]="{ row, column }">
              <slot :name="column.slotName" :row="row" :column="column"></slot>
            </template>
          </pv-tables-item>
        </template>
      </el-table>
    </div>
    <div class="flex-row align-center justify-end p-10px" :class="paginJson.className ?? ''"
      v-if="pvtable.ispagin && pvtable.listData.length">
      <div class="flex-1" v-if="pvtable.paginPrepend">
        <slot :name="pvtable.paginPrepend"></slot>
      </div>
      <pv-pagin v-if="pvtable.loading" v-model="paginJson.current" :option="paginJson" @change="getLoadData"></pv-pagin>
      <div class="flex-1" v-if="pvtable.paginAppend">
        <slot :name="pvtable.paginAppend"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="pv-table">
import { handleChange } from '@/utils/index';
import { isObject, findObjectValue, arrayToOnly } from 'pine-utils'
const emit = defineEmits(['change', 'select', 'load']);
const pagins: any = inject('pagins');
const props: any = defineProps({
  option: {
    type: Object,
    required: true,
    default: () => { }
  },
  checkNodes: {
    type: Array,
    required: false,
    default: () => []
  },
  datas: {
    type: Array,
    required: false
  }
});

const tableHtml = ref();
const pvtable: any = reactive({
  ...props.option,
  ispagin: props.option.paginjson ?? true,
  listData: props.datas ?? [],
  datas: props.option.datas ?? {},
  loading: true,
  tableHeight: ''
});

const paginJson: any = reactive({
  ...props.paginjson,
  current: 1,
  size: 15,
  total: ''
});

// 选择勾选
const onSelectChange = (row: any) => {
  emit('select', row);
};

// 点击触发事件
const onTapSubmit = ({ item, row }: any) => {
  if (item.load) {
    if (item.message) {
      DialogBox(item.message).then(() => {
        httpRequest(item, row).then(({ data }: any) => {
          handleChange(item, data).then(() => {
            setInitTable();
          });
        });
      });
    } else {
      httpRequest(item, row).then((data: any) => {
        handleChange(item, data).then(() => {
          setInitTable();
        });
      });
    }
  } else {
    handleChange(item, row).then((data: any) => {
      emit('change', data);
    });
  }
};
const onCellClick = (row: any) => {
  console.log(row);
};
const setRowClassName = ({ row, rowIndex }: any) => {
  const rowClassName = props.option.rowClassName;
  if (isObject(rowClassName) && rowClassName?.label && rowClassName?.value) {
    if (rowClassName.static) {
      return (rowClassName?.value % (rowIndex % rowClassName?.value)) ? rowClassName.className : '';
    } else {
      return findObjectValue(row, rowClassName?.label) == rowClassName?.value ? rowClassName.className : '';
    }
  }
};
const setPaginsJson = (data: any) => {
  Object.keys(pagins).map((name) => {
    if (name = 'total') {
      paginJson[name] = data[name] ?? data[pagins[name]];
    }
  });
};

const getSelectionRows = () => {
  tableHtml.value.getSelectionRows();
};

const toggleRowSelection = () => {
  const checkNodes: any = [];
  (props.checkNodes ?? []).map((citem: any) => {
    pvtable.listData.map((item: any) => {
      if (item[props.option.rowKey] == citem[props.option.rowKey]) {
        checkNodes.push(item);
      }
    });
  });
  if (checkNodes.length && pvtable.listData.length) {
    arrayToOnly(checkNodes, props.option.rowKey).map((item: any) => {
      tableHtml.value.toggleRowSelection(item, true);
    });
  } else {
    tableHtml.value?.clearSelection();
  }
};
const getLoadData = (page: any = null) => {
  pvtable.listData = [];

  const pages = page ?? paginJson;
  Object.keys(pages).map((name) => {
    paginJson[name] = pages[name];
  });
  pvtable.datas = {
    ...pvtable.datas,
    ...pages
  };
  httpRequest(props.option, pvtable.datas).then((data: any) => {
    emit('load', data);
    pvtable.loading = true;
    setPaginsJson(
      pagins.request ? findObjectValue(data, pagins?.request) : data
    );
    pvtable.listData = props.option.request
      ? findObjectValue(data, props.option.request)
      : data;
  }).catch((data) => {
    pvtable.listData = [];
    emit('load', data);
  });
};

const setInitTable = async (data: object = pvtable.datas) => {
  pvtable.datas = data;
  pvtable.datas?.size && (paginJson.size = pvtable.datas?.size);
  paginJson.current = 1;
  if (props.option.load) {
    await getLoadData();
  } else {
    paginJson[pagins?.total] = pvtable.listData.length;
    pvtable.loading = true;
  }
};
const getTableJson = () => {
  const values = findObjectValue(pvtable.datas, props.option.nodeKey ?? 'pk');
  pvtable.items.map(async (item: any) => {
    if (item?.name && item.visible) {
      if ((item?.load || item?.props) && !item?.nodeKey) {
        item.list = await getItemLoad(item, pvtable.datas);
      }
      if (values) {
        if (item?.load || item?.props) {
          item.list = await getItemLoad(item, pvtable.datas);
        }
      }

    }
    return item;
  });
};

onBeforeMount(async () => {
  pvtable.loading = false;
  setInitTable();
});
onMounted(() => {
  getTableJson();
});
defineExpose({
  tableHtml,
  setInitTable,
  getSelectionRows,
  toggleRowSelection
});
</script>
<style lang="scss" scoped>
.el-table :deep(.cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
