<template>
  <div>
    <div class="title">快捷键提示</div>
    <div v-if="keyList.length > 0">
      <el-row v-for="(item, index) in keyList" :key="index">
        <el-col class="row-title" :span="16">{{ item.fun }}</el-col>
        <el-col class="row-data" :span="8">{{ item.key }}</el-col>
      </el-row>
    </div>
    <div v-else class="nothing">暂无快捷键</div>
  </div>
</template>
<script>
import hotkeys from "../../hotkey.js";
export default {
  props: ["pageName"],
  data() {
    return {
      data: "分诊",
      keyList: {}
    };
  },
  created() {
    if (hotkeys.hasOwnProperty(this.pageName)) {
      this.keyList = hotkeys[this.pageName];
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.title {
  height: 24px;
  font-size: 15px;
  font-weight: bold;
  color: rgba(46, 50, 58, 1);
  line-height: 24px;
  margin-bottom: 10px;
}
.row-title {
  font-weight: 400;
  color: #949da3;
}
.row-data {
  font-weight: 400;
  color: #ff4040;
}
.nothing {
  font-weight: 400;
  color: #949da3;
  text-align: center;
}
.el-row {
  margin-bottom: 15px;
}
</style>
