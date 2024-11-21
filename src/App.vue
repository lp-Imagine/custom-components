<script setup>
import { defineComponent, reactive, ref } from "vue";
import { utils } from "../packages/index";
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
const num = ref(0);

const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(list);
    }, 2000);
  });
};

const handleClick = (cb) => {
  loading.value = true;
  num.value = utils.accAdd(num.value, 1);
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
        <LpButton type="primary" @click="handleClick">添加{{ num }}</LpButton>
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

