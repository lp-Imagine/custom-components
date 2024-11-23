<!--
 * @Description:  远程搜索选择器
 * @Author: luopeng
 * @Date: 2024-11-19 11:28:31
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-23 23:49:01
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

<script setup>
defineOptions({
  name: "LpRemoteSelect",
});
import { ref, watch, nextTick, onMounted, computed } from "vue";
import { deepClone } from '../../utils/index'
const emit = defineEmits(["update:modelValue", "fetch-query", "change"]);
const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
  },
  label: {
    type: [String, Array],
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
    type: Array,
    default: () => [],
  },
  // 初始数据
  initList: {
    type: Array,
    default: () => [],
  },
});
const loading = ref(false);
const localValue = props.multiple ? ref([]) : ref("");
const options = ref([]);
const defaultList = ref([]);
const useInit = ref(true);

watch(
  () => props.modelValue,
  (newValue) => {
    nextTick(() => {
      localValue.value = newValue;
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
    let newList = [];
    (props.modelValue || []).forEach((item, index) => {
      const find = defaultList.value.find((el) => el[props.valueKey] === item);
      if (!find) newList.push({ value: item, label: props.label[index] });
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
      [props.valueKey]: props.modelValue,
      [props.labelKey]: props.label,
    };
    return [newItem, ...defaultList.value];
  }
  // 该选项在列表中，直接返回列表
  return defaultList.value;
});

onMounted(() => {
  nextTick(() => {
    // 初始化数据
    localValue.value = props.modelValue;
  });
});

const handleChange = (val) => {
  localValue.value = val;
  if (props.multiple) {
    // 多选
    const modelList = options.value.filter((item) =>
      val.includes(item[props.valueKey])
    );
    emit("change", modelList);
  } else {
    const modelItem = options.value.find(
      (item) => item[props.valueKey] === val
    );
    emit("change", modelItem);
  }
  emit("update:modelValue", val);
};

const fetchMethod = (query) => {
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