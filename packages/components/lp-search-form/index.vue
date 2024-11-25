<template>
  <!-- 栅栏布局 -->
  <template v-if="baseConfig.responsive">
    <el-form :model="formData" :rules="rules" v-bind="$attrs">
      <el-row>
        <template v-for="item in fields" :key="item.prop">
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item :label="item.label" :prop="item.prop">
              <slot v-if="$slots[item.prop]" :name="item.prop"></slot>
              <template v-else>
                <component
                  :is="item.type"
                  v-bind="item.props"
                  v-model="formData[item.prop]"
                >
                  <template v-if="item.type === 'el-select'">
                    <el-option
                      v-for="option in item.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    ></el-option>
                  </template>
                </component>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </template>

  <template v-else>
    <el-form :model="formData" :rules="rules" v-bind="$attrs">
      <template v-for="item in fields" :key="item.prop">
        <el-form-item :label="item.label" :prop="item.prop">
          <slot v-if="$slots[item.prop]" :name="item.prop"></slot>
          <template v-else>
            <component
              :is="item.type"
              v-bind="item.props"
              v-model="formData[item.prop]"
              :style="item.style"
            >
              <template v-if="item.type === 'el-select'">
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </template>
            </component>
          </template>
        </el-form-item>
      </template>
    </el-form>
  </template>

  <!-- 操作按钮 -->
  <div v-if="baseConfig.showSearchBtn">
    <lp-button
      :size="$attrs.size || 'default'"
      type="primary"
      :icon="Search"
      @click="(event) => emitEvent('search-click', event)"
      >{{ baseConfig.searchText }}</lp-button
    >
    <lp-button
      :size="$attrs.size || 'default'"
      :icon="Refresh"
      @click="(event) => emitEvent('reset-click', event)"
      >{{ baseConfig.resetText }}</lp-button
    >
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, defineModel } from "vue";
import LpButton from "../lp-button/index";
import { Search, Refresh } from "@element-plus/icons-vue";

interface FormField {
  label: string;
  prop: string;
  type: string;
  props?: Record<string, any>;
  style?: string;
  options?: Array<{
    label: string;
    value: string | number;
  }>;
}

interface Config {
  responsive?: boolean;
  inline?: boolean;
  showSearchBtn?: boolean;
  searchText?: string;
  resetText?: string;
  [key: string]: any;
}

defineComponent({
  Search,
  Refresh,
});

defineOptions({ name: "LpSearchForm" });

const props = defineProps<{
  modelValue?: Record<string, any>;
  config?: Config;
  fields: FormField[];
  rules?: Record<string, any>;
}>();

const formData = defineModel<Record<string, any>>();

const baseConfig = computed<Config>(() => {
  return {
    responsive: true,
    inline: false,
    showSearchBtn: true,
    searchText: "查询",
    resetText: "重置",
    ...props.config,
  };
});

type EmitEvents = "search-click" | "reset-click";

const emit = defineEmits<{
  (e: "search-click", formData: Record<string, any>, cb?: () => void): void;
  (e: "reset-click", formData: Record<string, any>, cb?: () => void): void;
}>();

const emitEvent = (eventName: EmitEvents, cb?: () => void) => {
  emit(eventName, formData.value, cb);
};
</script>

<style>
</style>