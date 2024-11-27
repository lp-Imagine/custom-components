/*
 * @Description:  自动计算表格高度
 * @Author: luopeng
 * @Date: 2024-11-27 09:56:46
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-27 15:14:16
 */

import { getComputedHeight } from "../../utils/index";
import { ref, Ref } from "vue";

interface CalParam {
    className?: string;
    height?: number;
}

/**
 * 表格高度自适应hook
 * @param {Object} table - 表格实例
 * @param {Object} calParam - 计算参数
 * @param {string} calParam.className - 需要减去高度的元素class名
 * @param {number} calParam.height - 需要减去的固定高度
 * @returns {Ref<number|string>} 计算后的表格高度
 * @example
 * // 在组件中使用:
 * const tableRef = ref(null)
 * // 需要在onMounted中调用,因为组件挂载前ref.value为null
 * onMounted(() => {
 *   const tableHeight = useTableHeight(tableRef.value, {
 *     className: 'total-info', // 可选,需要减去的元素class
 *     height: 40 // 可选,需要减去的固定高度
 *   })
 * })
 * 
 * // 在template中使用:
 * <el-table ref="tableRef" :height="tableHeight">
 *   ...
 * </el-table>
 */
function useTableHeight(table: any, calParam?: CalParam): Ref<number | string> {
    if (!table) return ref('');
    // 计算表格高度
    const computeHeight = getComputedHeight(table, calParam);
    const height = ref<number | string>(computeHeight);
    return height;
}

export default useTableHeight;