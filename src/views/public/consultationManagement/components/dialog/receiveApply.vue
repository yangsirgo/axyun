<template>
  <layout>
    <div slot="top">
      <div class="ptb20">
        <LFormtTitle label="选择会诊医生">
          <l-value-domain :value.sync="type" placeholder="请选择"></l-value-domain>
        </LFormtTitle>
      </div>
    </div>
    <div slot="bottom">
      <el-button type="primary">确定并接收会诊</el-button>
      <el-button class="plain-button">取消</el-button>
    </div>
  </layout>
</template>

<script>
import layout from "./layout";

export default {
  name: "conReceive",
  components: { layout },
  data() {
    return {
      type: ""
    };
  }
};
</script>

<style lang="scss" scoped>
</style>