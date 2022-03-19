<template>
  <div class="register" v-loading="loading">
    <div class="date-pick">
      <el-date-picker
        style="width:90%"
        v-model="searchDate"
        @change="getHisList"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      ></el-date-picker>
      <i class="iconfont iconriqi"></i>
    </div>
    <!-- value-format="yyyy-MM-dd" -->

    <div class="table-box">
      <el-table height="100%" :data="tableData" border style="width: 100%">
        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          prop="appointmentTime"
          label="预约时间"
          min-width="200"
        ></el-table-column>
        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          prop="ouptDeptId"
          label="科室"
          min-width="100"
        >
          <template slot-scope="scope">
            <span
              tableName="sys_org"
              :conditionMap="{
                org_type: '_DEPT_',
                id: scope.row['ouptDeptId']
              }"
              columns="org_nm"
              v-tableTransform
            ></span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="recordStatus" label="进度" min-width="80">
          <template slot-scope="scope">
            <span :val="scope.row['recordStatus']" code="SeeDoctorStatus" v-codeTransform></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import service from "@/api/appointment/appointment";
export default {
  name: "register",
  data() {
    return {
      patientInfo: {},
      searchDate: [],
      tableData: [],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // 局部loading
      loading: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.patientInfo = value;
        value.patientId && this.getHisList();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    paddingLeftNum(s) {
      return s < 10 ? "0" + s : s;
    },
    timeTransform(time) {
      const d = new Date(time);
      const resDate =
        d.getFullYear() +
        "-" +
        this.paddingLeftNum(d.getMonth() + 1) +
        "-" +
        this.paddingLeftNum(d.getDate());
      const resTime =
        this.paddingLeftNum(d.getHours()) +
        ":" +
        this.paddingLeftNum(d.getMinutes()) +
        ":" +
        this.paddingLeftNum(d.getSeconds());
      return `${resDate} ${resTime}`;
    },
    // 获取历史挂号记录
    async getHisList() {
      try {
        if (!this.patientInfo.patientId) {
          return;
        }
        this.loading = true;
        let sDate = "";
        let eDate = "";
        console.log(this.searchDate, "this.");
        if (this.searchDate && this.searchDate.length > 1) {
          sDate = this.timeTransform(this.searchDate[0]);
          eDate = this.timeTransform(this.searchDate[1]);
        }
        console.log(sDate, eDate);
        const response = await service.getHisList({
          patientId: this.patientInfo.patientId,
          sDate,
          eDate
        });
        this.tableData = response.data;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.$message.error(error.msg || "获取历史挂号记录报错");
      }
    }
  }
};
</script>
<style>
.el-date-range-picker__time-picker-wrap .el-time-panel {
  width: 149px !important;
}
</style>
<style lang='scss' scoped>
// body .el-time-panel {
//   width: 149px !important;
// }
.register {
  // width: 298px;
  width: 100%;
  height: 100%;
  // padding: 10px;
  background-color: #fff;

  .date-pick {
    width: 100%;
    height: 36px;
    display: inline-block;
    position: relative;
    // white-space: nowrap;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    box-sizing: border-box;
    /deep/ .el-date-editor > .el-range__close-icon {
      position: relative;
    }
    .iconriqi {
      position: absolute;
      top: 8px;
      right: 10px;
      display: inline-block;
      color: $l-color-fontcolor-4;
    }
    /deep/ .el-date-editor {
      width: auto;
      height: 34px;
      padding: 0 28px 0 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 5px;
    }
    /deep/ .el-date-editor > .el-icon-date {
      display: none;
    }
    /deep/ .el-date-editor > .el-range__close-icon {
      position: relative;
      line-height: 36px;
    }
    /deep/ .el-date-editor > .el-range-separator {
      padding: 0;
      text-align: center;
      line-height: 34px;
      color: #cecfd4;
    }
    /deep/ .el-date-editor > .el-range-input {
      width: 82px;
    }
    /deep/ .el-input__inner {
      border: 0;
      vertical-align: 0;
      line-height: 1;
    }
  }
  .table-box {
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>
