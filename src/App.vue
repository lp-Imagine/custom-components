<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { utils } from "../packages/index";

interface Person {
  name: string;
  age: number;
  address: string;
}

interface Column {
  prop: string;
  label: string;
  minWidth: number;
  fixed?: string;
}

interface Option {
  label: string;
  value: number;
}

const list: Person[] = [
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

const column: Column[] = [
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

const options: Option[] = [
  {
    label: "Option 1",
    value: 1,
  },
  {
    label: "Option 2",
    value: 2,
  },
  {
    label: "Option 3",
    value: 3,
  },
];

const options2: Option[] = [
  {
    label: "Option 4",
    value: 4,
  },
  {
    label: "Option 5",
    value: 5,
  },
  {
    label: "Option 6",
    value: 6,
  },
];

const data = reactive<Person[]>(list);
const columns = ref<Column[]>(column);
const loading = ref<boolean>(false);
const num = ref<number>(0);
const modelObj = ref<Option>({ value: 7, label: "Option 7" });
const optionList = ref<Option[]>([]);
const initList = ref<Option[]>([]);

const valueList = ref<number[]>([7, 8]);
const labelList = ref<string[]>(["Option 7", "Option 8"]);

const getData = (): Promise<Person[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(list);
    }, 100);
  });
};

const handleClick = (cb: () => void) => {
  loading.value = true;
  num.value = utils.accAdd(num.value, 1);
  getData()
    .then((res) => {
      data.push(...res);
      cb()
      loading.value = false;
    })
    .catch(() => {
      cb();
      loading.value = false;
    });
};

const getData2 = (): Promise<Option[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(options2);
    }, 200);
  });
};

const getOptions = (query: string, cb?: () => void) => {
  return getData2().then((res) => {
    if (!query) initList.value = res;
    optionList.value = res.filter((item) => item.label.indexOf(query) > -1);
    if (cb) cb();
    console.log("query=", query, "options=", optionList.value);
  });
};

onMounted(() => {
  getOptions("");
});

const selectChange = (val: any) => {
  console.log("selectChange==", val);
};
</script>

<template>
  <div class="container">
    <lp-remote-select
      no-data-text="暂无数据"
      multiple
      collapse-tags
      placeholder="请输入关键词"
      clearable
      v-model="valueList"
      :label="labelList"
      :initList="initList"
      :list="optionList"
      @fetch-query="getOptions"
      @change="selectChange"
    ></lp-remote-select>
    value: {{ modelObj.value }}
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
