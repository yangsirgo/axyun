<template>
  <div class="patient-contain">
    <el-table
      ref="officeTable"
      height="100%"
      element-loading-text="加载中..."
      stripe
      border
      :data="tdata"
      @row-click="getChargeInfo"
      v-loading="loading"
      v-loadmore="loadNextPage"
      highlight-current-row
    >
      <el-table-column
        v-for="(item, index) in toChargeParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'left'"
        :fixed="item.fixed"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'settlementType'">
            <span :val="scope.row[item.prop]" code="MedicalPaymentMethod" v-codeTransform></span>
          </template>
          <span v-else class="overflow-point">{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import service from "@/api/appointment/outpCharge";
import { mapActions, mapGetters } from "vuex";
import appointmentService from "@/api/appointment/appointment";

// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};

export default {
  name: "patientInfo",
  props: {
    tdata: {
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 账户余额
      balanceMoney: 0,
      toChargeList: [],
      // 收费信息
      chargeInfo: {},
      // 患者信息
      patientInfo: {},
      // 就诊信息
      outpInfo: {},
      info: {},
      // 待收费
      toChargeParams: [
        {
          label: "就诊科室",
          prop: "ouptDeptName",
          width: "100",
          align: "left",
          fixed: false
        },
        {
          label: "接诊医生",
          prop: "doctorName",
          width: "100",
          align: "left",
          fixed: false
        },
        {
          label: "结算类型",
          prop: "settlementType",
          width: "100",
          align: "left",
          fixed: false
        },
        {
          label: "医疗诊疗类别",
          prop: "medicalType",
          width: "160",
          align: "left",
          fixed: false
        }
      ],
      queryData: {}
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  watch: {
    tdata: {
      handler(val) {
        if (val.length > 0) {
          this.$nextTick(() => {
            this.setCurrent(val[0]);
            this.getChargeInfo(val[0]);
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    //一进入页面 默认选中第一行
    setCurrent(row) {
      this.$refs.officeTable && this.$refs.officeTable.setCurrentRow(row);
    },
    // table 下滑加载更多
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getToCharge(this.queryData, true);
    },
    handlePatientReferral(row) {
      this.changeRecPatientData(row);
    },
    getToCharge(queryData, isload = false, patientId) {
      this.queryData = queryData;
      this.loading = true;
      let data = {
        patientId: patientId || undefined,
        patientName: this.queryData.search || "",
        appointmentMode: this.queryData.channelWay || "",
        ouptDeptId: this.queryData.technicalOffices || "",
        ...this.pageParams
      };
      if (patientId) {
        data.patientName = undefined;
      }
      if (
        this.queryData &&
        this.queryData.timeRange &&
        this.queryData.timeRange.length > 1
      ) {
        data.sDate = this.queryData.timeRange[0].toLocaleString();
        data.eDate = this.queryData.timeRange[1].toLocaleString();
      } else {
        // 默认向前查三天
        // eslint-disable-next-line no-unused-expressions
        data.sDate =
          new Date(new Date() - 3 * 60 * 60 * 24 * 1000).format("yyyy-MM-dd") +
          " 00:00:00";
        data.eDate = new Date().format("yyyy-MM-dd") + " 23:59:59";
      }
      let _self = this;
      service
        .getToCharge(data)
        .then(res => {
          this.loading = false;
          if (res.data) {
            if (isload) {
              this.toChargeList.push(...res.data);
            } else {
              this.toChargeList = res.data;
            }
            this.pageParams = res.pageParams;
            if (res.data.length > 0) {
              _self.setCurrent(res.data[0]);
              this.changeRecPatientData(res.data[0]);
            } else {
              this.changeRecPatientData(queryData);
            }
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error.msg || "标准错误提示");
        });
    },
    async readCard(val) {
      try {
        if (val.search == "") {
          this.$message.warning("请输入卡号");
          return;
        }
        this.$showLoading();
        const { data } = await appointmentService.getCardDetailInfo({
          cardNum: val.search || ""
        });
        if (!data.patientId || data.patientId == null) {
          this.$hideLoading();
          this.$message("未查询到患者");
          return;
        }
        await this.getToCharge(
          {
            ...val,
            ...data
          },
          false,
          data.patientId
        );
        // this.changeRecPatientData(data)
        this.$hideLoading();
      } catch (error) {
        this.$message.error(error.msg);
        this.$hideLoading();
      }
    },
    // 拿到患者就诊信息 及待收费数据
    getChargeInfo(item) {
      this.$emit("send-p-data", item);
    }
  }
};
</script>

<style scoped lang="scss">
.patient-contain {
  margin: 0 20px;
  height: calc(100% - 10px);
}
</style>
