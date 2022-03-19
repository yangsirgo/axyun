<template>
  <el-card class="box-card">
    <div class="header">
      <span class="title">{{title.name}}</span>
      <el-button
        class="button"
        v-for="(button, index) in buttons"
        :key="index"
        :class="{active:buttonId==button.id}"
        v-on:click="buttonChange(button.id,title.name,button.name)"
        type="text"
      >{{button.name}}</el-button>
    </div>
    <!-- 插槽 -->
    <slot></slot>
  </el-card>
</template>
<script>
export default {
  props: ["title", "buttons"],
  data() {
    return {
      buttonId: 1
    };
  },
  methods: {
    buttonChange(buttonId, titleName, buttonName) {
      this.buttonId = buttonId;
      this.$emit("buttonclick", {
        titleName: titleName,
        button: {
          buttonId: buttonId,
          buttonName: buttonName
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  line-height: 26px;
  padding-bottom: 22px;
}
.title {
  font-size: 14px;
  
  font-weight: bold;
  color: rgba(119, 119, 119, 1);
}
.button {
  float: right;
  height: 30px;
  border-radius: 30px;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  font-size: 14px;
  text-align: center;
  margin-right: 10px;
  
  color: #9c9c9c;
  border: none;
}
.active {
  background: rgba(255, 106, 0, 1);
  color: rgba(255, 255, 255, 1);
  width: 60px;
  height: 26px;
  border-radius: 30px;
}
</style>