<template>
  <el-row :class="option?.className">
    <template v-for="item in pagejson.items" :key="item.label">
      <el-col v-if="item.visible" :span="item.span ?? option.span ?? 24" class="flex-row"
        :class="item?.className ?? item.className">
        <div v-if="item.label" :class="item.labelClassName ?? pagejson.labelClassName"
          :style="{ width: item.labelWidth ?? pagejson.labelWidth }">
          <span> {{ item.label }}</span>
          <span v-if="item.label"> ：</span>
        </div>
        <div class="flex-1" :class="item.itemClassName ?? pagejson.itemClassName">
          <template v-if="item.slotName">
            <slot :name="item.slotName" :column="item" :row="pagejson.data"></slot>
          </template>
          <template v-else-if="item.eltype == 'content'">
            {{ item.placeholder }}
          </template>
          <template v-else-if="item.eltype == 'line'">
            <el-divider style="margin: 0px" :border-style="item.type" />
          </template>
          <template v-else-if="item.eltype == 'icon'">
            <pv-icon :className="'max-w-120px ' + item.imgClassName" :preview="item.preview"
              :icon="pagejson.data[item.name]" :option="item"></pv-icon>
          </template>
          <template v-else-if="item.eltype == 'tag'">
            <el-tag :type="setTextHtml(pagejson.data, item).type ?? item.type ?? ''"
              @click="handleChange(pagejson.data, item)">
              {{ setTextHtml(pagejson.data, item).htmlText }}
            </el-tag>
          </template>

          <template v-else>
            <el-link :type="setTextHtml(pagejson.data, item).type ?? 'default'" :disabled="item.disabled ?? false"
              :underline="item.underline ?? false" :class="setTextHtml(pagejson.data, item) ?? item.className ?? ''"
              :icon="setTextHtml(pagejson.data, item).icon ?? ''">
              {{ setTextHtml(pagejson.data, item).htmlText }}
            </el-link>
          </template>
        </div>
      </el-col>
    </template>
  </el-row>
</template>

<script setup lang="ts" name="pv-descriptions">
import { handleChange, setTextHtml } from '@/utils/index';
import { findObjectValue } from 'pine-utils'
const props = defineProps({
  option: {
    type: Object,
    default: () => { }
  },
  datas: {
    type: Object,
    required: false,
    default: () => { }
  }
});

defineEmits(['change', 'submit', 'beforeSubmit']);
const pagejson = reactive({
  labelWidth: props.option.labelWidth ?? '',
  itemClassName: props.option.itemClassName ?? '',
  labelClassName: props.option.labelClassName ?? '',
  items: props.option.items ?? [],
  data: props.option.datas ?? props.datas ?? {}
});
const getItemsList = () => {
  const values = findObjectValue(pagejson.data, props.option.nodeKey ?? 'pk');
  pagejson.items.map(async (item: any) => {
    if (item?.name && item.visible) {
      if ((item?.load || item?.props) && !item?.nodeKey) {
        item.list = await getItemLoad(item, pagejson.data);
      }
      if (values) {
        if (item?.load || item?.props) {
          item.list = await getItemLoad(item, pagejson.data);
        }
      }

    }
    return item;
  });
};
const getLoadDetails = () => {
  if (props.option.load) {
    httpRequest(props.option, pagejson.data).then(({ data }: any) => {
      pagejson.data = data;
    });
  }
};
onBeforeMount(async () => {
  getItemsList();
  getLoadDetails();
});
onMounted(() => { });
</script>
