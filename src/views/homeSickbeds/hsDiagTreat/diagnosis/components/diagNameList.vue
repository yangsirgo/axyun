<template>
  <div class="width100 inline-block">
    <el-select
      class="width100"
      v-model="curVal"
      filterable
      remote
      :remote-method="remoteMethod"
      placeholder="请选择"
      @change="changeFun"
    >
      <el-option
        v-for="item in options"
        :key="item.icd10Encoding"
        :label="item.dictionaryName"
        :value="item.icd10Encoding"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { getDiagNameList } from "@/api/common/diagnosis.js";

export default {
  name: "diagNameList",
  prop: {
    value: [String, Array, Number]
  },
  data() {
    return {
      // 原始所有的数据
      oldList: [],
      // 数据多余10条保存前10条数据
      newlist: null,
      // 过滤后的下拉选数据
      options: [],
      // 当前选中的值
      curVal: ""
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.remoteMethod(val);
        if (this.curVal !== val) {
          this.$nextTick(() => {
            this.curVal = val;
          });
        }
      }
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      getDiagNameList()
        .then(res => {
          if (res.code === 1) {
            this.oldList = res.data;
            if (res.data.length > 10) {
              const newlist = res.data.slice(0, 11);
              this.newlist = newlist;
              this.options = newlist;
            } else {
              this.newlist = null;
              this.options = this.oldList;
            }
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    remoteMethod(query) {
      console.log(query);
      // 模糊搜索
      if (query !== "") {
        this.options = this.oldList.filter(item => {
          return (
            item.dictionaryName.indexOf(query) > -1 ||
            item.namePy.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            item.nameWb.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            item.icd10Encoding.indexOf(query) > -1
          );
        });
      } else {
        if (this.newlist) {
          this.options = this.newlist;
        } else {
          this.options = this.oldList;
        }
      }
    },
    getItem(val) {
      const one = this.options.filter(item => {
        return item.icd10Encoding === val;
      });
      if (one.length > 0) {
        return one[0];
      } else {
        return {};
      }
    },
    changeFun(val) {
      this.$emit("update:value", val);
      // 像父组件发送当前选中的值：val，当前的对象data
      const data = this.getItem(val);
      this.$emit("change", val, data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>