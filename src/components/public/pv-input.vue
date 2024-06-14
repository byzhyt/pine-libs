<template>
  <el-input :class="item.className" class="flex-1" :type="item.type" v-model.trim="data" :minlength="item.minlength"
    :show-password="item.type == 'password' && item.showPassword" :maxlength="item.maxlength" :disabled="item.disabled"
    :show-word-limit="item.type == 'textarea' && item.showWordLimit" :rows="(item.type == 'textarea' && item.rows) || 5"
    :prefix-icon="item.prefixIcon" :suffix-icon="item.suffixIcon" :clearable="item.clearable || true"
    :placeholder="item.placeholder" @change="onTapChange">
    <template #prefix v-if="item.prefixIcon == 'custom'">
      <img class="w-15px h-15px" :src="item.iconUrl" alt="" />
    </template>
    <template #prepend v-if="item.prepend">
      <slot name="prepend">{{ item.prepend }}</slot>
    </template>
    <template #append v-if="item.append">
      <slot name="append">{{ item.append }}</slot>
    </template>
  </el-input>
</template>

<script setup lang="ts" name="pv-input">
const props: any = defineProps({
  item: { type: Object, required: false, default: () => { } },
  option: { type: Object, required: false, default: () => { } },
  datas: { type: Object, required: false, default: () => { } }
});
const data = ref();
const emit = defineEmits(['change']);
const onTapChange = (val: any) => {
  data.value = val;
  const temjson: any = {};
  temjson[props.item.name] = val;
  console.log(temjson)
  emit('change', temjson);
};
defineExpose({
  data
});
</script>
