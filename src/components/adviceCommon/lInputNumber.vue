<template>
  <el-input
    class="l-input-number"
    v-bind="$attrs"
    v-model="numberValue"
    v-on="$listeners"
    type="number"
    ref="reference"
    @keydown.native="limitHandler"
    @input="inputHandler"
  ></el-input>
  <!-- @keyup.native="channelInputLimit" -->
</template>

<script type="text/ecmascript-6">
export default {
  name: "LInputNumber",
  model: {
    prop: 'value',
    event: 'update'
  },
  data() {
    return {
      numberValue: ""
    };
  },
  created() {
    this.numberValue = this.$attrs.value;
    // console.log("初始值", this.numberValue);
  },
  watch: {
    // 组件内变化 同步组件外
    // 不能使用watch， 组件外延迟更新
    // numberValue(value) {
    //   let okNo = this.limitNo(value);
    //   // console.log("输入的值：：：：", value, "校验的值：：：", okNo);
    //   this.numberValue = okNo;
    //   this.$emit("update", okNo);
    // },
    // 组件外变化  本组件更新
    "$attrs.value"(value) {
      // console.log("外部的值变化了");
      this.numberValue = value;
    }
  },
  methods: {
    focus (){
      try {
        this.$refs.reference.focus();
      } catch (error) {
        
      }
      
    },
    inputHandler(value){
      let okNo = this.limitNo(value);
      // console.log("输入的值：：：：", value, "校验的值：：：", okNo);
      this.numberValue = okNo;
      this.$emit("update", okNo);
    },
    limitHandler(e) {
      let key = e.key;
      // 不允许输入'e' '-'
      if (key === "e" || key === "-") {
        e.returnValue = false;
        return false;
      }
      return true;
    },
    limitNo(newValue) {
      let { max, min } = this.$attrs;
      min = typeof min === "undefined" ? 0 : Number(min);
      max = typeof max === "undefined" ? Infinity : Number(max);
      let okNo = newValue;
      if (newValue !== "") {
        // 大小值控制
        if (Number(newValue) > max) {
          okNo = max;
        } else if (Number(newValue) < min) {
          okNo = min;
        }
      }
      return okNo;
    },
    // channelInputLimit(e) {
    //   let key = e.key;
    //   let { max, min } = this.$attrs;
    //   min = typeof min === "undefined" ? 0 : Number(min);
    //   max = typeof max === "undefined" ? 10000 : Number(max);
    //   let target = e.target;
    //   let oldValue = e.target.value;

    //   if (target.value !== "") {
    //     // 大小值控制
    //     if (Number(oldValue) > max) {
    //       // target.value = max;
    //       this.numberValue = max;
    //     } else if (Number(oldValue) < min) {
    //       // target.value = min;
    //       this.numberValue = min;
    //     }
    //   }
    //   return true;
    // }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.l-input-number /deep/.el-input__inner {
  text-align: center !important;
  line-height: 1 !important;
}
</style>
