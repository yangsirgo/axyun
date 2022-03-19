<template>
  <div class="container height100" ref="page">
    <el-card class="left height100">
      <patient :isMultiple="true" title_position="top"></patient>
    </el-card>
    <el-card class="right">
      <report-center></report-center>
    </el-card>
  </div>
</template>

<script>
  import ReportCenter from '../../../public/reportCenter'
  import Patient from '../../components/Patient'
  export default {
    name: "report",
    components: {
      ReportCenter,
      Patient
    }
  }
</script>

<style lang="scss" scoped>
  .container{
    overflow:hidden;
    padding: 0 20px;
    padding-left: 0;
  }
  .left{
    float: left;
    width:287px;
    height: 100%;
  }
  .right{
    margin-left:307px;
    height:100%;
  }
</style>
