<template>
  <div class="signIn">
    <l-card-title>
      <template #left>
        <div>{{ patientInfo.patientName || "" }}预约记录</div>
      </template>
    </l-card-title>
    <div class="table-box">
      <el-table
        v-loading="isLoading"
        height="100%"
        :data="tableData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          align="left"
          show-overflow-tooltip
          prop="appointmentTime"
          label="预约时间"
          min-width="110"
        >
        </el-table-column>
        <el-table-column
          align="left"
          show-overflow-tooltip
          prop="ouptDeptId"
          label="预约科室"
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
        <el-table-column align="left" label="是否就诊" min-width="80">
          <template slot-scope="{ row }">
            <span>{{ row.recordStatus == "1" ? "未签到" : "已签到" }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getUId, getUN } from "@/utils/crypto";
import tooBox from "@/api/cis/toolBox/toolBox";
import { mapGetters } from "vuex";
export default {
  name: "signIn",
  props: {
    name: {
      type: String,
      default: "易斌"
    }
  },
  data() {
    return {
      isLoading: false,
      patientInfo: {
        patientName: ""
      },
      tableData: [],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      }
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  mounted() {
    this.getAppotRecord();
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        // 监听 患者 ID 变化 触发事件 reload table 数据
        this.patientInfo = val;
        this.getAppotRecord();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async getAppotRecord() {
      //获取患者预约记录
      try {
        if (!this.patientInfo || !this.patientInfo.patientId) {
          return;
        }
        this.isLoading = true;
        let params = {
          patientId: this.patientInfo.patientId
        };
        tooBox.getRecord(params).then(res => {
          this.tableData = res.data;
          this.isLoading = false;
        });
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.signIn {
  // width: 298px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 0 10px 10px;
  .table-box {
    width: 100%;
    height: calc(100% - 63px);
  }
}
</style>
