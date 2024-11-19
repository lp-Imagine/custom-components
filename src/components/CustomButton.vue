<!--
 * @Description:  
 * @Author: luopeng
 * @Date: 2024-11-19 11:28:31
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-19 11:36:01
-->
<template>
  <el-button type="primary" @click="handleClick">
    {{ label }}
  </el-button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    label: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
<style scoped lang="scss">

</style>