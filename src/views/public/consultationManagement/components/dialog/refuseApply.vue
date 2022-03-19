<template>
  <layout>
    <div slot="top">
      <div class="ptb20">
        <el-input type="textarea" :rows="4" resize="none" placeholder="拒绝原因（必填）" v-model="reason"></el-input>
      </div>
    </div>
    <div slot="bottom">
      <el-button type="primary" @click="$emit('close-dialog')">再看看</el-button>
      <el-button class="plain-button" @click="refuse">拒绝申请</el-button>
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
      reason: ""
    };
  },
  methods: {
    refuse(){
      this.$message.success('拒绝会诊成功')
    }
  }
};
</script>

<style lang="scss" scoped>
</style>