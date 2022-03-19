<template>
  <div class="width100">
    <el-select
      v-model="value"
      class="width100"
      filterable
      clearable
      allow-create
      :filter-method="filterMethod"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="selectChange"
      @focus="selectFocus"
      @blur="selectBlur"
    >
      <el-option
        v-for="item in optionList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { makePy } from "@/views/nursingRecord/maintenanceDocument/components/retrieveSelect";

export default {
  name: "retrieveSelect",
  props: ["eleValue", "options", "disabled", "placeholder"],
  data() {
    return {
      optionList: [],
      optionCopyList: [],
      value: ""
    };
  },
  watch: {
    options: {
      handler(val) {
        this.optionList = [];
        this.optionCopyList = [];
        if (val && val.length > 0) {
          for (let i in val) {
            this.$set(this.optionList, i, { ...val[i] });
            this.$set(this.optionCopyList, i, { ...val[i] });
          }
        }
      },
      immediate: true,
      deep: true
    },
    eleValue: {
      handler(val) {
        if (val) {
          this.value = val;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //筛选下拉列表
    filterMethod(val) {
      this.value = val;
      this.$emit("update:eleValue", val);
      let arr = [];
      let optionsCopy = [];
      let options = this.options;
      for (let i in options) {
        arr.push(makePy(options[i].label));
      }
      // console.log(arr);
      if (val) {
        for (let i in arr) {
          for (let j in arr[i]) {
            if (arr[i][j].indexOf(makePy(val)) > -1) {
              optionsCopy.push({ ...options[i] });
            }
          }
        }
        if (!optionsCopy.length) {
          this.optionList = [
            {
              label: val,
              value: val
            }
          ];
        } else {
          this.optionList = optionsCopy;
        }
      } else {
        this.optionList = this.optionCopyList;
      }
    },
    selectChange(val) {
      this.$emit("update:eleValue", val);
      let obj = {};
      for (let i in this.options) {
        if (val == this.options[i].value) {
          obj = { ...this.options[i] };
        }
      }
      this.$emit("change", val, obj);
    },
    selectFocus(e) {
      this.$emit("focus", this.value, e);
    },
    selectBlur(e) {
      this.$emit("blur", this.value, e);
    }
  }
};
</script>

<style scoped>
</style>
