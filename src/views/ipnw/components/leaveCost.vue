<template>
  <div>
    <div class="main">
      <el-row>
        <span class="row-title">西药费</span>
        <span class="row-data">{{dataList.westMedicine || "-"}}</span>
      </el-row>
      <el-row>
        <span class="row-title">治疗费</span>
        <span class="row-data">{{dataList.treatment || "-"}}</span>
      </el-row>
      <el-row>
        <span class="row-title">检查费</span>
        <span class="row-data">{{dataList.check || "-"}}</span>
      </el-row>
      <el-row>
        <span class="row-title">中药费</span>
        <span class="row-data">{{dataList.chineseMedicine || "-"}}</span>
      </el-row>
      <el-row>
        <span class="row-title">材料费</span>
        <span class="row-data">{{dataList.stuff || "-"}}</span>
      </el-row>
      <el-row>
        <span class="row-title">检验费</span>
        <span class="row-data">{{dataList.examine || "-"}}</span>
      </el-row>
      <el-row class="bold">合计：{{dataList.total || "-"}}</el-row>
      <el-row class="bold">已收：{{dataList.accepted || "-"}}</el-row>
      <el-row class="red bold">待收：{{dataList.uncollected || "-"}}</el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: {
        westMedicine: "",
        treatment: "",
        check: "0.00元",
        chineseMedicine: "",
        stuff: "0.00元",
        examine: "",
        total: "0.00元",
        accepted: "0.00元",
        uncollected: "0.00元"
      },
      loading: false
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.main {
  padding-left: 20px;
  .el-row {
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: 400;
  }
  .row-title {
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    margin-right: 10px;
  }

  .row-data {
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
  }
  .red {
    color: #d9001b;
  }
  .bold {
    font-weight: bold;
  }
}
</style>