<template>
  <el-form-item :align="item.align" :prop="item.name" :rules="item.rules" :show-message="item.showMessage"
    :label-width="item.labelWidth" :label-position="item.labelPosition" :class="item.className"
    :inline-message="item.inlineMessage">
    <template v-if="item.label" #label>
      <div class="inline-block" :class="item.labelClassName">
        <span v-if="item.required" style="color: var(--el-color-error)">*</span>
        <span v-html="`${item.label}:`"></span>
      </div>
    </template>
    <div class="width-full flex-row flex-1" :class="item.itemClassName">
      <template v-if="item.slotName">
        <slot :name="item.slotName" :column="item" :row="option"></slot>
      </template>
      <template v-else>
        <template v-if="item.eltype == 'switch'">
          <el-switch :disabled="setItemDisabled(option, item)" v-model="option[item.name]"
            :active-color="item.activeColor" :inactive-color="item.inactiveColor"
            :active-icon-class="item.activeIconClass" :inactive-icon-class="item.inactiveIconClass"
            :inactive-value="item.inactiveValue" :active-value="item.activeValue" :active-text="item.activeText"
            :inactive-text="item.inactiveText"></el-switch>
        </template>
        <template v-else-if="item.eltype == 'date'">
          <pv-date :disabled="setItemDisabled(option, item)" v-model="option[item.name]" :item="item"></pv-date>
        </template>

        <template v-else-if="item.eltype == 'rate'">
          <pv-rate :disabled="setItemDisabled(option, item)" v-model="option[item.name]" :item="item"></pv-rate>
        </template>
        <!-- 时间 -->
        <template v-else-if="item.eltype == 'time'">
          <pv-time :disabled="setItemDisabled(option, item)" v-model="option[item.name]" :item="item"
            :option="option"></pv-time>
        </template>
        <template v-else-if="item.eltype == 'number'">
          <pv-number :disabled="setItemDisabled(option, item)" v-model="option[item.name]" :item="item"
            :option="option"></pv-number>
        </template>
        <!-- input -->
        <template v-else-if="item.eltype == 'input'">
          <pv-input :disabled="setItemDisabled(option, item)" :option="option" v-model="option[item.name]" :item="item"
            @change="onTapChange"></pv-input>
        </template>
        <template v-else-if="item.eltype == 'checkbox'">
          <pv-checkbox :disabled="setItemDisabled(option, item)" v-model="option[item.name]" :item="item"></pv-checkbox>
        </template>
        <template v-else-if="item.eltype == 'radio'">
          <pv-radio :disabled="setItemDisabled(option, item)" v-model="option[item.name]" :item="item"
            @change="onTapChange"></pv-radio>
        </template>
        <template v-else-if="item.eltype == 'color'">
          <pv-color v-model="option[item.name]" :item="item"></pv-color>
        </template>
        <template v-else-if="item.eltype == 'content'">
          <div @click="onTapSubmit(item)">{{ item.placeholder }}</div>
        </template>


        <template v-else-if="item.eltype == 'editor'">
          <pv-editor :item="item" :option="option" v-model="option[item.name]"></pv-editor>
        </template>
        <template v-else-if="item.eltype == 'select'">
          <pv-select class="flex-1" :disabled="setItemDisabled(option, item)" :item="item" :option="option"
            v-model="option[item.name]" @change="onTapChange"></pv-select>
        </template>
        <template v-else-if="item.eltype == 'line'">
          <el-divider style="margin: 0px" :border-style="item.type" />
        </template>
        <template v-else-if="item.eltype == 'upload'">
          <pv-upload :item="item" v-model="option[item.name]" :datas="option[item.name]"
            @change="onTapChange"></pv-upload>
        </template>
        <template v-else-if="item.eltype == 'treeSelect'">
          <pv-treeSelect v-model="option[item.name]" :item="item" :option="option"></pv-treeSelect>
        </template>
        <template v-else-if="item.eltype == 'authCode'">
          <pv-code v-model="option[item.name]" v-if="item.visible" :item="item" :option="option"
            @change="onTapChange"></pv-code>
        </template>
        <template v-else-if="item.eltype == 'treaty'">
          <pv-treaty v-model="option[item.name]" :item="item" :option="option"></pv-treaty>
        </template>
        <template v-else-if="item.eltype == 'cascader'">
          <pv-cascader :disabled="setItemDisabled(option, item)" v-model="option[item.name]" :item="item"
            :option="option" @change="onTapChange"></pv-cascader>
        </template>
        <template v-else-if="item.eltype == 'button' && !item.disabled">
          <template v-for="(sitem, key) in item.list">
            <el-button v-if="sitem.visible" :key="key" :type="sitem.type" :size="sitem.size" :icon="sitem.icon"
              :circle="sitem.circle" :disabled="sitem.disabled" :class="sitem.className" :plain="sitem.plain"
              :round="sitem.round" @click="onTapSubmit(sitem)">
              {{ sitem.text }}
            </el-button>
          </template>
        </template>
        <template v-else-if="item.eltype == 'link' && !item.disabled">
          <template v-for="(sitem, key) in item.list">
            <el-link v-if="sitem.visible" :key="key" :type="sitem.type" :disabled="sitem.disabled"
              @click="onTapSubmit(sitem)">
              {{ sitem.text }}
            </el-link>
          </template>
        </template>

      </template>
    </div>
  </el-form-item>
</template>

<script setup lang="ts" name="pv-form-item">
import { setItemDisabled } from '@/utils/index';
const props: any = defineProps<{
  option: any;
  item: any;
}>();
const emit = defineEmits(['submit', 'change']);
const onTapSubmit = async (item: any) => {
  emit('submit', item);
};
const onTapChange = (data: any) => {
  emit('change', {
    data: {
      ...props.option,
      ...data
    }, item: props.item
  });
};

</script>
