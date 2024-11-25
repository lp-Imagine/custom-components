<!--
 * @Description: el-table展示类组件
 * @Author: luopeng
 * @Date: 2024-11-19 15:31:29
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-25 10:46:36
-->
<template>
  <div class="lp-table" :style="{ '--alert-height': alertHeight }">
    <!-- 操作栏 -->
    <div class="common-action">
      <div class="left">
        <!-- 默认新增按钮 -->
        <el-button
          :size="config.size"
          type="primary"
          :icon="Plus"
          @click="emitEvent('insert-click')"
          v-if="config.showInsert"
          >{{ config.insertText }}</el-button
        >
        <!-- 操作栏左侧插槽(在删除按钮前) -->
        <slot name="menuLeftBefore"></slot>
        <!-- 默认删除按钮 -->
        <el-button
          :size="config.size"
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selections.length"
          @click="emitEvent('batch-delete-click', selections)"
          v-if="config.batchDelete"
          >批量删除</el-button
        >
        <!-- 操作栏左侧插槽(在删除按钮后) -->
        <slot name="menuLeft"></slot>
      </div>
      <div class="right">
        <el-alert
          :title="`已勾选 ${selections.length} 条数据`"
          type="info"
          show-icon
          :closable="false"
          v-if="config.batchCheck && selections.length"
        >
        </el-alert>
      </div>
    </div>
    <el-table
      :data="data"
      v-bind="$attrs"
      :size="config.size"
      v-loading="loading"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        fixed
        width="72"
        v-if="config.batchCheck"
      ></el-table-column>

      <el-table-column
        type="index"
        label="序号"
        align="center"
        fixed
        width="72"
        v-if="config.showIndex"
      ></el-table-column>
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.isSlot"
          v-bind="item"
          :key="`${item.prop}-${index}`"
        >
          <template v-slot="{ row }">
            <slot :name="item.prop" :row="row" :index="row.$index"></slot>
          </template>
          <template #header>
            <slot :name="`${item.prop}Header`">
              {{ item.label }}
            </slot>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!item.isSlot"
          v-bind="item"
          :key="`${item.prop}-${index}`"
        ></el-table-column>
      </template>
      <el-table-column
        label="操作"
        :align="config.operateAlign"
        fixed="right"
        :width="config.operateWidth"
        v-if="config.showOperate"
      >
        <template v-slot="{ row }">
          <slot name="operateBefore" :row="row"></slot>
          <el-button
            :size="config.size"
            :text="config.isText"
            type="primary"
            :icon="Edit"
            @click="emitEvent('update-click', row)"
            v-if="config.showUpdate"
            >编辑</el-button
          >
          <el-button
            :size="config.size"
            :text="config.isText"
            type="danger"
            :icon="Delete"
            @click="emitEvent('delete-click', row)"
            v-if="config.showDelete"
            >删除</el-button
          >
          <slot name="operate" :row="row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <LpTablePage
      v-if="config.showPage"
      :totalCount="totalCount"
      :page-params="config.pageParams"
      :size="config.size"
      :background="config.background"
      :layout="config.layout"
      :pagerCount="config.pagerCount"
      :page-sizes="config.pageSizes"
      :pageKey="config.pageKey"
      @change="(data) => emitEvent('page-change', data)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, computed } from "vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import LpTablePage from '../lp-table-page/index';

interface TableColumn {
  prop: string;
  label?: string;
  isSlot?: boolean;
  [key: string]: any;
}

interface PageKey {
  numKey: string;
  sizeKey: string;
}

interface TableConfig {
  size?: "large" | "default" | "small";
  isText?: boolean;
  showInsert?: boolean;
  insertText?: string;
  batchDelete?: boolean;
  showOperate?: boolean;
  operateWidth?: number;
  operateAlign?: string;
  showUpdate?: boolean;
  showDelete?: boolean;
  batchCheck?: boolean;
  showIndex?: boolean;
  showPage?: boolean;
  pageParams?: {
    pageNum: number;
    pageSize: number;
  };
  pageSizes?: number[];
  background?: boolean;
  layout?: string;
  pagerCount?: number;
  pageKey?: PageKey;
}

defineOptions({
  name: "LpTable",
});

defineComponent({
  components: {
    Delete,
    Edit,
    Plus,
    LpTablePage,
  },
});

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array as () => TableColumn[],
    default: () => [],
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  config: {
    type: Object as () => TableConfig,
    default: () => {
      return {
        size: "default",
        isText: false,
        showInsert: true,
        insertText: "新增",
        batchDelete: true,
        showOperate: true,
        operateWidth: 220,
        operateAlign: "center",
        showUpdate: true,
        showDelete: true,
        batchCheck: true,
        showIndex: true,
        showPage: true,
        pageParams: {
          pageNum: 1,
          pageSize: 10,
        },
        pageSizes: [10, 30, 50, 100],
        background: true,
        layout: "total, sizes, prev, pager, next, jumper",
        pagerCount: 7,
        pageKey: { numKey: "pageNum", sizeKey: "pageSize" },
      };
    },
  },
});

const selections = ref<any[]>([]);

// 计算 CSS 变量
const alertHeight = computed(() => {
  const sizes: Record<string, string> = {
    large: "40px",
    default: "32px",
    small: "24px",
  };
  return sizes[props.config.size || "default"] || sizes.default;
});

const emit = defineEmits<{
  (e: "update-click", row: any): void;
  (e: "delete-click", row: any): void;
  (e: "insert-click"): void;
  (e: "batch-delete-click", selections: any[]): void;
  (e: "selection-change", selections: any[]): void;
  (e: "page-change", data: any): void;
}>();

// 暴露事件
const emitEvent = (eventName: string, row?: any): void => {
  emit(eventName as any, row);
};

const selectionChange = (val: any[]): void => {
  selections.value = val;
  emit("selection-change", val);
};

defineExpose({ emitEvent });
</script>

<style lang="scss" scoped>
.lp-table {
  .common-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .right {
      .el-alert {
        height: var(--alert-height);
      }
    }
  }
}
</style>