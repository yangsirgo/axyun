<template>
  <div class="checkbox-code">
    <el-checkbox v-model="checkboxValue" @change="changeFunc">{{
      label
    }}</el-checkbox>
  </div>
</template>

<script>
import { get } from "@/utils/requestEmr";

let url = "/wdata/dic/single/YesOrNo";

export default {
  name: "",
  props: {
    value: {
      type: [String],
      require: true
    },
    label: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      checkboxValue: false,
      requestData: []
    };
  },
  watch: {
    value: {
      handler(newValm, val) {
        this.checkboxValue = newValm === "1";
      },
      immediate: true
    }
  },
  created() {
    this.request(url);
  },
  methods: {
    async request(url) {
      let params = {};
      let { data } = await get(url, params);
      this.requestData = data;
    },
    changeFunc(item) {
      let flag = "0";
      if (item) {
        flag = "1";
      }
      this.$emit("update:value", flag);
    }
  }
};
</script>

<style lang='scss' scoped>
.checkbox-code {
  display: inline-block;
}
</style>
