<template>
  <template v-if="isImage(icon)">
    <template :key="path" v-for="path in pvicon.imglist">
      <el-image
        :preview-teleported="true"
        :src="path"
        :class="[className, option?.iconClassName]"
        :lazy="option?.lazy ?? ''"
        :fit="option?.fit ?? 'cover'"
        :alt="option?.alt ?? ''"
        :preview-src-list="preview ? pvicon.imglist : []"
      >
        <template #error v-if="config.errorPath">
          <img :src="config.errorPath" class="width-full" @click="onChange" />
        </template>
        <template #placeholder v-if="config.emptyPath">
          <img :src="config.emptyPath" class="width-full" @click="onChange" />
        </template>
      </el-image>
    </template>
  </template>
  <template v-else>
    <span
      style="line-height: 1"
      :class="[icon, className, option?.iconClassName]"
    >
      <el-icon v-if="icon" @click="onChange">
        <component :is="icon"></component>
      </el-icon>
    </span>
  </template>
</template>

<script setup lang="ts" name="pv-icon">
const props = defineProps({
  icon: String,
  className: {
    type: String,
    required: false,
    default: ""
  },
  preview: {
    type: Boolean,
    required: false,
    default: true
  },
  option: {
    type: Object,
    required: false,
    default: () => {}
  }
});
const config: any = inject("configTheme");
const emit = defineEmits(["change"]);
const pvicon = reactive({
  imglist: [] as any
});
const router = useRouter();
const onChange = () => {
  const path = props.option?.path;
  if (path) {
    router.push(path);
  } else {
    emit("change");
  }
};
const domain = getDictList("domain");
const isImage = (icon: any) => {
  let loop: any = false;
  if (icon) {
    if (Array.isArray(icon)) {
      icon.map((name) => {
        loop = name.match(/[.png,.jpeg,.gif,.svg,.webp]$/g) ? true : false;
      });
    } else {
      loop = icon.match(/[.png,.jpeg,.gif,.svg,.webp]$/g) ? true : false;
    }
  }
  return loop;
};
const previewImageList = (data: any) => {
  if (!data) {
    return [];
  }
  let list = [];
  if (Array.isArray(data)) {
    list = data;
  } else {
    if (data.match(/,/g)) {
      list = data.split(",");
    } else {
      list = [data];
    }
  }

  return list.map((item: string) => {
    if (item.match(/^[a-z,A-Z]+?\:\/\//) && isImage(item)) {
      return item;
    } else {
      return `${domain}${item}`;
    }
  });
};

onBeforeMount(() => {
  pvicon.imglist = previewImageList(props.icon);
});
</script>
<style lang="scss" scoped>
.el-image {
  display: block;
}
</style>
