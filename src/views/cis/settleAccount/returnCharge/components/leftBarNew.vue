  <template>
  <div class="height100">
    <leftTabs
      @read-card="readCard"
      :tabs-name="tabsName"
      @query="search"
      hideBtn
      :form-list="formParams"
    >
      <template #first>
        <patients-table ref="patientsTable" :tdata="mainBodyData" @send-p-data="childSendData"></patients-table>
      </template>
      <template #second>第二卡片内容</template>
      <template #third>第三卡片内容</template>
    </leftTabs>
  </div>
</template>

<script>
// 目前form 表单有
// 院区：CourtyardArea
// 科室：technicalOffices
// 渠道：channelWay
// 时间：timeRange
// 搜索：search

import leftTabs from "@/components/LSideTabs.vue";
import patientsTable from "./patientsTableNew";
import { mapActions } from "vuex";
import service from "@/api/cis/settleAccount/index.js";
import appointment from "@/api/appointment/appointment";

export default {
  name: "leftBar",
  components: {
    leftTabs,
    patientsTable
  },
  data() {
    return {
      tabsName: [
        {
          label: "可申请退费信息",
          value: "first"
        }
      ],
      formParams: ["search"],
      mainBodyData: []
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    search(form) {},
    readCard(val) {
      // 读卡方法
      this.readCardFunc(val);
    },
    async readCardFunc(val) {
      try {
        if (val.search == "") {
          this.$message.warning("请输入卡号");
          return;
        }
        this.$showLoading();
        const { data } = await appointment.getCardDetailInfo({
          cardNum: val.search || ""
        });

        // 清除患者信息中的visitCode  重要！！！(会影响后边开电子申请流程)
        this.$delete(data, "visitCode");

        this.patientInfo = { ...data };
        this.tableLeftData = [data];
        if (data && data.patientId) {
          const accountInfo = await appointment.getAccountInfo(data.patientId);
          this.balanceMoney = accountInfo.data.balanceMoney || "";
          this.info = {
            ...data,
            ...accountInfo.data
          };
          this.getTableData(this.info);
        } else {
          this.$message.info("查无此人，请输入正确卡号");
        }
        this.changeRecPatientData(this.info);
      } catch (error) {
        this.$message.error(error.msg);
      } finally {
        this.$hideLoading();
      }
    },
    // 获取代收费明细
    getTableData(data) {
      if (!data.patientId) {
        this.$message.info("请选择患者");
        return;
      }
      let startTime = new Date() - 30 * 60 * 60 * 24 * 1000;
      startTime = new Date(startTime);
      let endTime = new Date();
      let params = {
        patientId: data.patientId,
        payStatus: "1",
        startChargeTime: startTime,
        endChargeTime: endTime
      };
      service
        .getTradeDetailInfo(params)
        .then(res => {
          if (res.code === 1) {
            this.mainBodyData = res.data;
          } else {
            this.$message.error(res.msg || "获取代收费明细失败");
          }
        })
        .catch(err => {
          this.$message.error(err.msg || "获取代收费明细失败");
        });
    },
    childSendData(val) {
      this.$emit("get-data", val);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
