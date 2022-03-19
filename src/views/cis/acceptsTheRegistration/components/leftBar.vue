<template>
  <div class="height100">
    <leftTabs
      @read-card="readCard"
      :tabs-name="tabsName"
      @query="search"
      hideBtn
      :form-list="formParams"
      :cardNum="cardNum"
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
import patientsTable from "../components/patientsTable.vue";
import { mapActions, mapGetters } from "vuex";
import service from "@/api/appointment/outpCharge";
import appointment from "@/api/appointment/appointment";

export default {
  name: "leftBar",
  components: {
    leftTabs,
    patientsTable
  },
  props: {
    usePublicPData: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tabsName: [
        {
          label: "待交易信息",
          value: "first"
        }
      ],
      formParams: ["search"],
      mainBodyData: [],
      info: {},
      cardNum: ""
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  mounted() {
    // 如果患者信息卡中有患者，自动读此患者的卡号查询数据
    // this.callReadCard();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      changeFinPatientInfo: "finPublicPData/changeFinPatientInfo"
    }),
    callReadCard() {
      if (this.receivePatientData && this.receivePatientData.cardData) {
        this.cardNum = this.receivePatientData.cardData;
        this.readCardFunc({
          search: this.receivePatientData.cardData
        });
      }
    },
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
        if(this.usePublicPData){
          this.changeRecPatientData(this.info);
        }else{
          this.changeFinPatientInfo(this.info);
        }
        
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    // 获取代收费明细
    getTableData(data) {
      if (!data.patientId) {
        this.$message.info("请选择患者");
        return;
      }
      let params = {
        patientId: data.patientId,
        diagTreatActivityId: data.appointmentId
      };
      service
        .getlistWaitChargeDetail(params)
        .then(res => {
          if (res.code === 1) {
            this.mainBodyData = res.data || [];
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
    },
    refresh() {
      this.getTableData(this.info);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
