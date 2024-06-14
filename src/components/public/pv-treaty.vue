<template>
  <el-checkbox v-model="data" :label="item.value">
    <span>我已阅读并同意</span>
    <el-link :to="item.path" type="primary">
      {{ item.placeholder }}</el-link></el-checkbox>
</template>

<script setup lang="ts" name="pv-treaty">
const data = ref();
defineProps<{ item: any; }>();
defineExpose({
  data
});
</script>
