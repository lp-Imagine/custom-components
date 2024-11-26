<!--
 * @Description:  svg图标组件
 * @Author: luopeng
 * @Date: 2024-11-26 10:43:41
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-26 16:12:17
-->
<template>
  <svg
    :class="{ 'svg-icon': true, [className]: true }"
    aria-hidden="true"
    :style="style"
  >
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "LpSvgIcon",
  props: {
    name: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    size: {
      type: [String, Number],
      default: 1,
    },
    color: {
      type: String,
      default: "#333",
    },
  },
  setup(props) {
    const style = computed(() => {
      return `width:${props.size}em;height:${props.size}em;color:${props.color}`;
    });
    const iconName = computed(() => {
      return `#icon-${props.name}`;
    });

    return {
      style,
      iconName,
    };
  },
});
</script>

<style lang="scss" scoped>
.lp-svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
