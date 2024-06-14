<template>
  <div class="flex-row gap-15px align-center">
    <el-input :placeholder="item.placeholder" type="text" :maxlength="item.maxlength" v-model="pvcode.inputValue"
      @change="onTapInputChange"></el-input>
    <div>
      <pv-icon v-if="item.append.eltype == 'icon'" :option="item.append" :icon="pvcode.codePath"
        @change="onTapChange"></pv-icon>
      <el-button v-else :type="item.append.type" :size="item.append.size" :icon="item.append.icon"
        :circle="item.append.circle" :disabled="pvcode.disabled" :class="item.append.className" :plain="item.append.plain"
        :round="item.append.round" @click="onTapChange">
        {{ pvcode.btntext }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="pv-code">

const props = defineProps<{ item: any; option: any; }>();
const data = ref();
const emit = defineEmits(['change']);
const pvcode: any = reactive({
  codePath: '',
  timer: null,
  timeIndex: 0,
  inputValue: '',
  btntext: '',
  disabled: false
});
// 定时器调用函数
const setInitClock = () => {
  const { append }: any = { ...props.item };
  pvcode.btntext = append.text;
  if ((append.maxlength && append.minlength) || append.minlength) {
    pvcode.timeIndex = append.minlength;
  } else {
    pvcode.timeIndex = append.maxlength;
  }
};

const onTapInputChange = (val: any) => {
  pvcode.inputValue = val;
  const temjson: any = {};
  temjson[props.item.name] = val;
  emit('change', temjson);
};

// 清除定时器并恢复
const resetClearInterval = () => {
  clearInterval(pvcode.timer);
  pvcode.disabled = false;
  setInitClock();
};
// 定时器倒计时
const setTimeClock = () => {
  const { append } = props.item;
  pvcode.disabled = true;
  if ((append.maxlength && append.minlength) || append.minlength) {
    if (pvcode.timeIndex >= append.maxlength) {
      resetClearInterval();
    } else {
      pvcode.timeIndex += 1;
    }
  } else {
    if (pvcode.timeIndex <= append.minlength) {
      resetClearInterval();
    } else {
      pvcode.timeIndex -= 1;
    }
  }
  pvcode.btntext = pvcode.timeIndex + append.text;
};

const onTapChange = async () => {
  const { append } = props.item;
  const rep = new RegExp(validation[append.pattern]);
  const data = props.option[append.name];
  if (!data.match(rep)) {
    MessageBox({
      type: 'error',
      message: append.message
    });
    return false;
  }
  resetClearInterval();
  pvcode.disabled = true;

  httpRequest(props.item.append, props.option).then(() => {
    pvcode.timer = setInterval(setTimeClock, 1000);
    pvcode.codePath = findObjectValue(data, props.item.request);
  }).catch(() => {
    pvcode.disabled = false;
  });
};

onBeforeMount(() => {
  setInitClock();
});
defineExpose({ data: pvcode.inputValue });
</script>
