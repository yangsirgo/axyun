<template>
  <div class="height100" style="margin: 0 20px;">
    <div style="margin：5px;margin-bottom:10px;">
      <div style="background-color: #81d3f8;padding: 10px;">
        <div style="display:flex;justify-content: space-between;height: 28px;">
          <div style="font-size: 16px;">杨宋玉</div>
          <div style="font-size: 19px;font-weight: 600;">390.5元</div>
        </div>
        <div style="font-size: 16px;height: 24px;">票据号:1111111111</div>
        <div style="font-size: 16px;height: 24px;">结算时间:1111111111</div>
        <div style="font-size: 16px;">缴费地点:1111111111</div>
      </div>
    </div>
    <div style="margin：5px;">
      <div style="background-color: #f6f6f6;padding: 10px;">
        <div style="display:flex;justify-content: space-between;height: 28px;">
          <div style="font-size: 16px;">杨宋玉</div>
          <div style="font-size: 19px;font-weight: 600;">390.5元</div>
        </div>
        <div style="font-size: 16px;height: 24px;">票据号:1111111111</div>
        <div style="font-size: 16px;height: 24px;">结算时间:1111111111</div>
        <div style="font-size: 16px;">缴费地点:1111111111</div>
      </div>
    </div>
    <!-- <el-table
      element-loading-text="加载中..."
      stripe
      border
      height="100%"
      :data="rechargeList"
      @row-click="getRechargeInfo"
      highlight-current-row
      v-loading="tlm_isLoading"
      v-loadmore="loadNextPage"
    >
      <el-table-column
        v-for="(item, index) in rechargeParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'left'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'ouptDeptId'">
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
          <template v-else>
            <span class="overflow-point">{{ scope.row[item.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import service from "@/api/appointment/retreat";
import { mapActions, mapGetters } from "vuex";
import appointmentService from "@/api/appointment/appointment";

// 重写date 格式化方法
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
  data() {
    return {
      tlm_isLoading: false,
      // 账户余额
      balanceMoney: 0,
      rechargeList: [],
      // 收费信息
      chargeInfo: {},
      // 患者信息
      patientInfo: {},
      // 就诊信息
      outpInfo: {},
      info: {},
      pageParams: {
        pageNo: 1,
        pageSize: 13,
        total: 0
      },
      // 待收费
      rechargeParams: [
        {
          label: "姓11名",
          prop: "patientName",
          width: "50",
          align: "left"
        },
        {
          label: "科室",
          prop: "ouptDeptId",
          width: "50",
          align: "left"
        },
        {
          label: "收费时间",
          prop: "chargeTime",
          width: "50",
          align: "left"
        }
      ]
    };
  },
  components: {},
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.getRechargeList({},true,'')  ;
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    // table 下滑加载更多
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }

      this.pageParams.pageNo++;
      this.getRechargeList({}, true);
    },
    getRechargeList(queryData, isLoad = false,patientId) {
      this.tlm_isLoading = true;
      let data = {
        patientId: patientId || undefined,
        ...this.pageParams,
        ouptDeptId: queryData.technicalOffices || "",
        patientName: queryData.search || ""
      };
      if(data.patientId){
        data.patientName = undefined;
      }
      if (queryData && queryData.timeRange && queryData.timeRange.length > 1) {
        data.sDate = queryData.timeRange[0].toLocaleString();
        data.eDate = queryData.timeRange[1].toLocaleString();
      }
      service
        .getReturnCharge(data)
        .then(res => {
          if (isLoad) {
            this.rechargeList.push(...res.data);
          } else {
            this.rechargeList = res.data;
          }

          this.pageParams.total = res.total;
          if (res.data && res.data.length > 0) {
            this.changeRecPatientData(res.data[0]);
          }else{
            this.changeRecPatientData(queryData); // 放入患者信息
          }
          this.tlm_isLoading = false;
        })
        .catch(error => {
          this.tlm_isLoading = false;
          this.$message.error(error.msg || "标准错误提示");
        });
    },
    async readCard(val){
      try {
          if (val.search == "") {
            this.$message.warning("请输入卡号");
            return;
          }
          this.$showLoading();
          const { data } = await appointmentService.getCardDetailInfo({
            cardNum: val.search || ""
          });
          if(!data.patientId || data.patientId == null){
            this.$hideLoading();
            this.$message("未查询到患者");
            return;
          }
          await this.getRechargeList(
            {...val,
              ...data},
            false,
            data.patientId
          )
          // this.changeRecPatientData(data)
          this.$hideLoading();
        } catch (error) {
          this.$message.error(error.msg);
          this.$hideLoading();
        }
    },
    // 拿到患者就诊信息 及待收费数据
    getRechargeInfo(item) {
      this.changeRecPatientData(item);
    }
  }
}
</script>

<style scoped lang="scss">
</style>
