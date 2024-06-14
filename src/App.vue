<template>
  <el-config-provider :message="config.message" :locale="config.locale" :size="config.size">
    <router-view class="web-body" v-slot="{ Component }">
      <component v-if="Component" :is="Component"></component>
      <template to="body" v-else>
        <pv-loading></pv-loading>
      </template>
    </router-view>
  </el-config-provider>
</template>
<script setup lang="ts">
const config: any = inject("configTheme");
const router = useRouter();
onBeforeMount(() => {
  const routes: any = router.options.routes;
  routes.map((item: any) => {
    if (item.path == "/") {
      setDictList({
        type: "menuList",
        data: item.children
      });
    }
  });
});
</script>
