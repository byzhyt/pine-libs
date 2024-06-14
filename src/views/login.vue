<template>
  <section ref="loginHtml">
    <pv-form :option="pagejson.loginJson"></pv-form>
    <layoutFooter class="p-20px"> </layoutFooter>
  </section>
</template>

<script setup lang="ts">
import login from "@/scripts/login";

const pagejson = reactive({
  loginJson: login,
  isfind: "",
  tabsIndex: 1,
  dialogVisible: false,
  formdata: {}
});

const loginHtml = ref();
onBeforeMount(() => { });
</script>
