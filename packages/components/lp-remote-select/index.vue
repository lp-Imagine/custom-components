<!--
 * @Description:  远程搜索选择器
 * @Author: luopeng
 * @Date: 2024-11-19 11:28:31
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-25 10:58:06
-->
<template>
  <el-select
    v-model="localValue"
    v-bind="$attrs"
    filterable
    remote
    :multiple="multiple"
    :loading="loading"
    :remote-method="fetchMethod"
    @change="handleChange"
  >
    <el-option
      v-for="item in computedOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script setup lang="ts">
defineOptions({
  name: "LpRemoteSelect",
});
import { ref, watch, nextTick, onMounted, computed, PropType } from "vue";
import { deepClone } from '../../utils/index'

interface Option {
  value: string | number;
  label: string;
  [key: string]: any;
}

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | (string | number)[]): void;
  (e: "fetch-query", query: string, callback: () => void): void;
  (e: "change", value: Option | Option[]): void;
}>();

const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | (string | number)[]>,
    default: undefined
  },
  label: {
    type: [String, Array] as PropType<string | string[]>,
    default: undefined
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  valueKey: {
    type: String,
    default: "value",
  },
  labelKey: {
    type: String,
    default: "label",
  },
  list: {
    type: Array as PropType<Option[]>,
    default: () => [],
  },
  // 初始数据
  initList: {
    type: Array as PropType<Option[]>,
    default: () => [],
  },
});
const loading = ref(false);
const localValue = ref<string | number | (string | number)[]>(props.multiple ? [] : "");
const options = ref<Option[]>([]);
const defaultList = ref<Option[]>([]);
const useInit = ref(true);

watch(
  () => props.modelValue,
  (newValue) => {
    nextTick(() => {
      localValue.value = newValue as string | number | (string | number)[];
    });
  },
  { deep: true }
);

watch(
  () => props.list,
  (newVal) => {
    if (!useInit.value) options.value = newVal;
  },
  { deep: true, immediate: true }
);

watch(
  () => props.initList,
  (newVal) => {
    if (useInit.value) {
      options.value = newVal;
      // 保存一份初始数据
      defaultList.value = deepClone(props.initList);
    }
  },
  { deep: true, immediate: true }
);

const computedOptions = computed(() => {
  // 搜索模式
  if (!useInit.value) return options.value;
  if (props.multiple) {
    // 多选模式
    let newList: Option[] = [];
    ((props.modelValue || []) as (string | number)[]).forEach((item, index) => {
      const find = defaultList.value.find((el) => el[props.valueKey] === item);
      if (!find) newList.push({ value: item, label: (props.label as string[])[index] });
    });
    return [...newList, ...defaultList.value];
  }
  // 单选模式
  const findIndex = defaultList.value.findIndex(
    (item) => item[props.valueKey] === props.modelValue
  );
  if (findIndex === -1 && props.modelValue) {
    // 该选项不在列表中，添加进去
    const newItem = {
      value: props.modelValue,
      label: props.label as string,
    } as Option;
    return [newItem, ...defaultList.value];
  }
  // 该选项在列表中，直接返回列表
  return defaultList.value;
});

onMounted(() => {
  nextTick(() => {
    // 初始化数据
    localValue.value = props.modelValue as string | number | (string | number)[];
  });
});

const handleChange = (val: string | number | (string | number)[]) => {
  localValue.value = val;
  if (props.multiple) {
    // 多选
    const modelList = options.value.filter((item) =>
      (val as (string | number)[]).includes(item[props.valueKey])
    );
    emit("change", modelList);
  } else {
    const modelItem = options.value.find(
      (item) => item[props.valueKey] === val
    );
    emit("change", modelItem as Option);
  }
  emit("update:modelValue", val);
};

const fetchMethod = (query: string) => {
  useInit.value = !query;
  if (!query) return;
  loading.value = true;
  emit("fetch-query", query, () => {
    loading.value = false;
  });
};
</script>

<style>
</style>