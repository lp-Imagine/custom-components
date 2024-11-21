<!--
 * @Description:  表格分页器
 * @Author: luopeng
 * @Date: 2024-11-21 15:01:10
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-21 15:47:10
-->
<template>
  <div class="common-page__wrapper">
    <el-pagination
      v-bind="$attrs"
      :size="size"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :page-size="params.pageSize"
      :current-page="params.pageNum"
      :total="totalCount"
      :pager-count="pagerCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

defineOptions({ name: "LpTablePage" });
const props = defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  pageParams: {
    type: Object,
    default: () => ({
      pageNum: 1,
      pageSize: 10,
    }),
  },
  size: {
    type: String,
    default: "default",
  },
  background: {
    type: Boolean,
    default: true,
  },
  pageKey: {
    type: Object,
    default: () => {
      return { numKey: "pageNum", sizeKey: "pageSize" };
    },
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  pagerCount: {
    type: Number,
    default: 7,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 30, 50, 100],
  },
});

const params = ref({
  pageNum: 1,
  pageSize: 10,
});

watch(
  () => props.pageParams,
  (newVal) => {
    params.value.pageNum = newVal[props.pageKey.numKey];
    params.value.pageSize = newVal[props.pageKey.sizeKey];
  },
  { deep: true, immediate: true }
);

const emit = defineEmits(["change"]);
const handleSizeChange = (val) => {
  params.value.pageNum = 1;
  params.value.pageSize = val;
  emit("change", params.value);
};

const handleCurrentChange = (val) => {
  params.value.pageNum = val;
  emit("change", params.value);
};

</script>

<style scoped lang="scss">
.common-page__wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 0 8px;
  background-color: #fff;
  border-radius: 0 0 6px 6px;
}
</style>