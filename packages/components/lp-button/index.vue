<!--
 * @Description:  loading 按钮
 * @Author: luopeng
 * @Date: 2024-11-19 11:28:31
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-21 14:27:10
-->
<template>
  <el-button v-bind="$attrs" @click.stop="handleClick" :loading="loading">
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { ref } from "vue";
defineOptions({
  name: "LpButton",
});
const loading = ref<boolean>(false);

const emit = defineEmits<{
  (e: "click", callback: () => void): void;
}>();
const handleClick = () => {
  loading.value = true;
  emit("click", () => {
    loading.value = false;
  });
};
</script>
