<template>
  <div class="container">
    <div class="ratio">
      <div class="title">今日办理家床登记人</div>
      <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
        <el-table-column
          width="70"
          align="center"
          show-overflow-tooltip
          prop="patientName"
          label="姓名"
        ></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="sdeptId" label="科室">
          <template slot-scope="scope">
            <span
              tableName="sys_org"
              :conditionMap="{org_type: '_DEPT_', id: scope.row['sdeptId']}"
              columns="org_nm"
              v-tableTransform
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="prepareMoney"
          min-width="90"
          label="预交金"
        >
          <template slot-scope="scope">
            <span>{{scope.row['prepareMoney']}}元</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="content">
      <el-row>
        <el-col class="row-title" :span="14">总人数</el-col>
        <el-col class="row-data" :span="10">{{totalPatientCount}}人</el-col>
      </el-row>
      <el-row>
        <el-col class="row-title" :span="14">总预交金</el-col>
        <el-col class="row-data" :span="10">{{totalPreparyMoney}}元</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getAdmitRegistrState } from "@/api/ipnw/etHospital.js";
export default {
  data() {
    return {
      isLoading: false,
      tableData: [],
      totalPatientCount: "" || "--",
      totalPreparyMoney: "" || "--",
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取今日办理家床登记人列表
    async getData() {
      try {
        this.isLoading = true;
        let params = {
          startDate: new Date().format("yyyy-MM-dd") + " 00:00:00",
          endDate: new Date().format("yyyy-MM-dd") + " 23:59:59"
        };
        console.log(params);
        let { data } = await getAdmitRegistrState(params);
        this.tableData = data.patients;
        this.totalPatientCount = data.totalPatientCount;
        this.totalPreparyMoney = data.totalPreparyMoney;
        console.log(data);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$message.error(error.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  font-size: 14px;
  .ratio {
    margin-bottom: 25px;
  }
  .row-title {

    font-weight: 400;
    color: #949da3;
  }
  .row-data {

    font-weight: bold;
    color: #2e323a;
  }
  .el-row {
    margin-bottom: 15px;
  }
  .title {
    height: 24px;
    font-size: 15px;

    font-weight: bold;
    color: rgba(46, 50, 58, 1);
    line-height: 24px;
    margin-bottom: 20px;
  }
  .content {
    margin-bottom: 5px;
    color: #606266;
  }
}
</style>
