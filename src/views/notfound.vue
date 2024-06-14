<template>
  <el-alert title="未找到页面" type="error" show-icon>
    <p @click="onDialogVisible" style="text-decoration: underline">
      非常抱歉，未找到页面点击操作
    </p>
  </el-alert>
</template>

<script setup lang="ts">
const router = useRouter();
const onDialogVisible = () => {
  router.push("/");
};
</script>
