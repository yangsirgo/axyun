<template>
  <el-select
    v-model="curVal"
    filterable
    remote
    :clearable="clearable"
    :remote-method="remoteMethod"
    placeholder="请选择"
    @change="changeFunc"
    @focus="focusFunc"
    :disabled="disabled"
  >
    <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code"></el-option>
  </el-select>
</template>

<script>
import hmmBaseApi from "@/api/hmm/base";
import { watch } from "fs";

export default {
  props: {
    value: [String, Array, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      curVal: ""
    };
  },
  watch: {
    value(val) {
      this.curVal = val;
    }
  },
  created() {
    this.getSupplierList();
  },
  methods: {
    getSupplierList(data = "") {
      hmmBaseApi
        .getOtherSupplier([
          {
            code: "DrugSupplier",
            key: "supplier",
            val: data
          }
        ])
        .then(res => {
          if (res.code == 1) {
            this.options = res.data.supplier;
          } else {
            this.$message.error(res.msg || "获取供应商数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无供应商数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取供应商数据失败");
        });
    },
    remoteMethod(query) {
      this.getSupplierList(query);
    },
    changeFunc(item) {
      this.$emit("update:value", item);
      this.$emit("change", item);
    },
    focusFunc(item){
       this.getSupplierList();
    }
  }
};
</script>

<style>
</style>
