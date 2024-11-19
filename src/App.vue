<!--
 * @Description:  
 * @Author: luopeng
 * @Date: 2024-11-19 11:28:31
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-11-19 22:40:46
-->
<script setup>
import LpTable from "./components/lp-table/index.vue";
import LpButton from "./components/lp-button/index.vue";
import { reactive, ref } from "vue";

const list = [
  {
    name: "John",
    age: 18,
    address: "New York No. 1 Lake Park",
  },
  {
    name: "Jim",
    age: 25,
    address: "London No. 1 Lake Park",
  },
  {
    name: "Joe",
    age: 30,
    address: "Sydney No. 1 Lake Park",
  },
];

const column = [
  {
    prop: "name",
    label: "Name",
    minWidth: 150,
    fixed: "left",
  },
  {
    prop: "age",
    label: "Age",
    minWidth: 150,
  },
  {
    prop: "address",
    label: "Address",
    minWidth: 150,
  },
];

const data = reactive(list);
const columns = ref(column);
const loading = ref(false);

const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(list);
    }, 2000);
  });
};

const handleClick = (cb) => {
  loading.value = true;
  getData()
    .then((res) => {
      data.push(...res);
    })
    .finally(() => {
      cb();
      loading.value = false;
    });
};

const selectionChange = (val) => {
  console.log("selectionChange==", val);
};
</script>

<template>
  <div class="container">
    <LpTable
      border
      fit
      stripe
      :data="data"
      :columns="columns"
      :loading="loading"
      @selection-change="selectionChange"
    >
      <template #menuLeftBefore>
         <LpButton type="primary" @click="handleClick">添加</LpButton>
      </template>
    </LpTable>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  background-color: #fff;
}
</style>

