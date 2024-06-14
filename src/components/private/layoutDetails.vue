<template>
  <LayoutCrumbs>
    <template v-if="pagejson.loading">
      <pv-descriptions v-if="pagejson.readonly" :class="pagejson.pageDetails?.className ?? 'w-500px'"
        :option="pagejson.pageDetails" :datas="pagejson.details">
        <template #[pagejson.pageDetails.slotName]="{ row, column }">
          <slot :name="column.slotName" :row="row" :column="column"></slot>
        </template>
      </pv-descriptions>
      <pv-form v-else :class="pagejson.pageForm?.className ?? 'w-500px'" :option="pagejson.pageForm"
        :datas="pagejson.details">
        <template #[pagejson.pageForm.slotName]="{ row, column }">
          <slot :name="column.slotName" :row="row" :column="column"></slot>
        </template></pv-form>
    </template>
  </LayoutCrumbs>
</template>

<script setup lang="ts" name="layoutDetails">
const route: any = useRoute();
const props: any = defineProps({
  option: {
    type: Object,
    required: true,
    default: () => { }
  },
  datas: {
    type: Object,
    required: false,
    default: () => { }
  }
});
const pagejson: any = reactive({
  loading: false,
  details: {},
  pageForm: { ...props.option.pageForm },
  pageDetails: { ...props.option.pageDetails },
  readonly: false
});
const getReadonly = () => {
  const nodeKey = pagejson.pageForm?.nodeKey ?? 'pk';
  if (route.query.hasOwnProperty('pageType')) {
    if (pagejson.details.hasOwnProperty(nodeKey)) {
      pagejson.readonly = pagejson.details.hasOwnProperty(nodeKey) ? false : true;
    } else {
      console.log(route.query?.pageType, 111);
      pagejson.readonly = route.query?.pageType == 'false';
    }
  } else {

    pagejson.readonly = false;
  }

};
const isload = computed(() => {
  if (pagejson.readonly) {
    return props.option.pageDetails;
  } else {
    return props.option.pageForm;
  }
});
const getLoadDetails = async () => {
  httpRequest({
    load: isload.value?.load,
    params: isload.value.params
  }, route.query).then(({ data }: any) => {
    pagejson.details = data?.data ?? data;
    pagejson.loading = true;
  }).catch(() => {
    pagejson.loading = true;
  });
};

onBeforeMount(async () => {
  pagejson.loading = false;
  pagejson.pageForm.load = '';
  pagejson.pageDetails.load = '';
  const query = { ...route.query };

  getReadonly();
  if (isload.value?.load && query.hasOwnProperty('pageType')) {
    getLoadDetails();
  } else {
    if (query.hasOwnProperty('pageType') && query?.pageType == 'true') {
      pagejson.details = getDetails() ?? props.datas;
    } else {
      pagejson.details = { ...pagejson.pageForm.datas, ...query };
    }
    pagejson.loading = true;;
  }
});
</script>
