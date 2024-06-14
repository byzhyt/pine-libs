<template>
  <el-table-column fixed v-if="['selection', 'index'].includes(item.type)" :align="item.align || 'center'"
    :label="item.label" :type="item.type" :min-width="item.minwidth" :width="item.width"
    :selectable="onSelectableChange"></el-table-column>
  <el-table-column v-else :align="item.align ?? 'center'" :label="item.label" :fixed="item.fixed" :prop="item?.name"
    :type="item.type" :min-width="item.minwidth" :width="item.width" :header-align="item.headerAlign ?? 'center'"
    :selectable="item.selectable" :show-overflow-tooltip="false" :reserve-selection="item.reserveSelectable"
    :filters="item.filters" :filter-placement="item.filterPlacement" :filtered-value="item.filteredValue"
    :resizable="item.resizable" :sort-orders="item.sortOrders" :sort-by="item.sortBy" :sortable="item.sortable"
    :column-key="item.columnKey" :index="item.index">
    <template #default="{ row, column }">

      <div :class="item.itemClassName ?? ''">
        <template v-if="item.slotName">
          <slot :row="row" :name="item.slotName" :column="item"></slot>
        </template>
        <template v-else-if="item.eltype == 'switch'">
          <el-switch v-model="row[item.name]" :disabled="item.disabled"></el-switch>
        </template>
        <template v-else-if="item.eltype == 'icon'">
          <pv-icon v-if="row[item.name]" :icon="row[item.name]" :preview="item.preview" className="max-w-80%"
            :option="item"></pv-icon>
        </template>
        <!-- 操作按钮 -->
        <template v-else-if="item.eltype == 'button'">
          <template v-for="(sitem, key) in setVisibleButton(item.list)" :key="key">
            <el-button v-if="setItemVisible(row, sitem)" :type="sitem.type" :data-item="row" :size="sitem.size"
              :icon="sitem.icon" :circle="sitem.circle" :disabled="sitem.disabled" :class="sitem.className"
              :plain="sitem.plain" :round="sitem.round" @click="onTapSubmit(sitem, row)">
              {{ sitem.text }}
            </el-button>
          </template>
        </template>
        <template v-else-if="item.eltype == 'link'">
          <template :key="key" v-for="(sitem, key) in setVisibleButton(item.list)">
            <el-link v-if="setItemVisible(row, sitem)" :type="sitem.type ?? 'default'" :disabled="sitem.disabled ?? false"
              :underline="sitem.underline ?? false" :class="sitem.className ?? ''" :icon="sitem.icon ?? ''"
              @click="onTapSubmit(sitem, row)">
              {{ sitem.text }}
            </el-link>
          </template>
        </template>
        <template v-else-if="item.eltype == 'tag'">
          <el-tag v-if="setTextHtml(row, item).htmlText" :type="setTextHtml(row, item).type ?? item.type">
            {{ setTextHtml(row, item).htmlText }}
          </el-tag>
        </template>
        <template v-else-if="item.eltype == 'text'">
          <el-link v-if="setTextHtml(row, item).htmlText" :type="setTextHtml(row, item).type ?? 'default'"
            :disabled="item.disabled ?? false" :underline="item.underline ?? false"
            :class="setTextHtml(row, item) ?? item.className ?? ''" :icon="setTextHtml(row, item).icon ?? ''"
            @click="onTapSubmit(item, row)">
            {{ setTextHtml(row, item).htmlText }}
          </el-link>
        </template>
        <template v-else-if="item.eltype == 'content'">
          <pv-popover :row="row" :column="column" :item="item"></pv-popover>
        </template>
        <template v-else>
          <span :class="setTextHtml(row, item).className">
            {{ setTextHtml(row, item).htmlText }}
          </span>
        </template>
      </div>
    </template>
  </el-table-column>
</template>

<script setup lang="ts" name="pv-table-item">
import { setTextHtml, setItemVisible, setVisibleButton } from '@/utils/index';

const props: any = defineProps<{ item: any; }>();
const emit = defineEmits(['submit']);

const onSelectableChange = (row: any) => {
  const selectable: any = props.item?.selectable ?? (() => { });
  return selectable(row) ?? true;
};
const onTapSubmit = (item: object, row: object) => {
  emit('submit', {
    item,
    row
  });
};
</script>
