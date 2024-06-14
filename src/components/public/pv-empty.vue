<template>
  <div class="text-center">
    <p class=" flex-row justify-center">
      <pv-icon :preview="false" :className="'max-w-150px ' + className" :icon="emptyPath"></pv-icon>
    </p>
    <p class="text-h3">暂无数据</p>
  </div>
</template>

<script setup lang="ts" name="pv-empty">
const emptyPath = setFilePath('icon-empty.png');
defineProps({
  className: {
    type: String,
    required: false,
    default: ''
  },

});
</script>
<style lang="scss" scoped>
.text-h3 {
  line-height: 2;
}
</style>