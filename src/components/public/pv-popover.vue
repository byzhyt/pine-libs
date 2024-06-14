<template>
  <div ref="popoverHtml" v-if="!isPopover" class="line-clamp-1">
    {{ textValue }}
  </div>
  <el-popover v-else :placement="item.placement || 'right-start'" :title="item.label"
    :popper-class="item.popperClass || 'popover-width'" :width="item.popoverWidth ?? 500" trigger="click">
    <div class="max-h-400px overflow-y-auto">{{ textValue }}</div>
    <template #reference>
      <div class="flex-row" ref="popover">
        <div class="line-clamp-1 flex-1 cursor-pointer">{{ textValue }}</div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts" name="pv-popover">
const props = defineProps<{
  row: any;
  item: any;
  column: any;
}>();
const textValue = computed(() => {
  const values = props.row[props.item.name];
  if (Array.isArray(values)) {
    return values.join(',');
  } else {
    return values;
  }
});
const isPopover = computed(() => {
  const values = props.row[props.item.name];
  let textlength = '';
  if (Array.isArray(values)) {
    textlength = String(values.join(','));
  } else {
    textlength = values;
  }
  const pwitdth = Number(props.item?.width ?? props.column?.realWidth);
  if (textlength) {
    const maxwidth: any = Number(Math.abs(
      textlength.length / pwitdth
    )) * 10;
    return maxwidth > .5;
  } else {
    return false;
  }
});
</script>
