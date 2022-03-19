<template>
  <div class="cls">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="医嘱收费和项目维护" name="1">
        <div @click="divClick(0)" :class="activeCls(0)">财务分类码</div>
        <div @click="divClick(1)" :class="activeCls(1)">收费项目维护</div>
      </el-collapse-item>
      <el-collapse-item title="医嘱目录维护" name="2">
        <div @click="divClick(2)" :class="activeCls(2)">医嘱项目</div>
        <div @click="divClick(3)" :class="activeCls(3)">医嘱大类</div>
        <div @click="divClick(4)" :class="activeCls(4)">医嘱子类</div>
        <div @click="divClick(5)" :class="activeCls(5)">用法关联附加医嘱</div>
        <div @click="divClick(6)" :class="activeCls(6)">角色医嘱授权</div>
      </el-collapse-item>
      <el-collapse-item title="电子申请目录维护" name="3">
        <div @click="divClick(7)" :class="activeCls(7)">检查检验目录维护</div>
      </el-collapse-item>
      <el-collapse-item title="疾病诊断与手术" name="4">
        <div @click="divClick(8)" :class="activeCls(8)">疾病字典维护</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "leftTree",
  components: {},
  data() {
    return {
      activeNames: ["1", "2", "4"],
      current: 2
    };
  },
  created() {},
  mounted() {
    this.divClick(this.current);
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    divClick(index) {
      this.current = index;
      this.$emit("itemClick", index);
    },
    activeCls(index) {
      return {
        active: this.current === index,
        divContent: true
      };
    }
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang="scss">
.cls {
  /deep/.el-collapse-item__content {
    padding: 0 !important;
  }
  .active {
    background-color: #c4e3f3;
  }
  .divContent {
    line-height: 36px;
    padding: 0 30px;
  }
}
</style>
