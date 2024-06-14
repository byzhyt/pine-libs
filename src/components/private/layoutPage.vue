<template>
  <section class="flex-col login-body">
    <layoutHeader class="header-box" :ptitle="option?.ptitle"></layoutHeader>
    <div class="m-10px p-15px bg-white flex-1 radius-15px flex-col overflow-y-auto">
      <el-page-header class="p-l-15px bg-bgc p-6px m-b-15px" @back="goBack" v-if="route.path != '/gateway'">
        <template #content>
          <span class="text-h4">{{ route.meta.title }}</span>
        </template>
      </el-page-header>
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts" name="layoutPage">
defineProps({
  option: {
    required: false,
    type: Object,
    default: () => { }
  },
});
const router = useRouter();
const route: any = useRoute();
const goBack = () => {
  router.go(-1);
};
</script>
