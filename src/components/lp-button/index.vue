<!--
 * @Description:  loading 按钮
 * @Author: luopeng
 * @Date: 2024-11-19 11:28:31
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-20 09:45:03
-->
<template>
  <el-button v-bind="$attrs" @click.stop="handleClick" :loading="loading">
    <slot />
  </el-button>
</template>

<script setup name="lp-button">
import { ref } from "vue";

const loading = ref(false);

const emit = defineEmits(["click"]);
const handleClick = () => {
  loading.value = true;
  emit("click", () => {
    loading.value = false;
  });
};
</script>
<style scoped lang="scss"></style>;
