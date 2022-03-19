<template>
  <div class="height100">
    <leftTabs
      @tabs-change="handleTabChange"
      @read-card="readCard"
      @query="search"
      v-model="form"
      :form-list="formParams"
    >
      <template #firstBottom>
        <patients-table ref="patientsTable"></patients-table>
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
import { applyReferralCard } from "@/api/cis/visit/visit";
import visit from "@/api/cis/visit/visit";
import { mapGetters } from "vuex";

export default {
  name: "leftBar",
  data() {
    return {
      data: {
        bakList: [],
        referral: []
      },
      form: {},
      formParams: ["technicalOffices", "timeRange", "channelWay", "search"]
    };
  },
  mounted() {
    this.search(this.form);
    console.log(this.role, "this.role");
  },
  methods: {
    handleTabChange() {
      // tab 的切换方法
    },
    async search(form) {
      console.log(form, "form");
      let startDate, stopDate, start, end, visitCode, patientIds;
      if (form.timeRange) {
        start = new Date(form.timeRange[0]);
        end = new Date(form.timeRange[1]);
      }
      // visitCode = this.form.search;
      patientIds = "";
      console.log(visitCode);
      if (form.timeRange) {
        startDate = this.getFormatDate(start);
        stopDate = this.getFormatDate(end);
      }
      // 查询patientIds 用于模糊查询中的姓名查询
      // if (form.search != "" && form.search != null) {
      //   let searchValue2 = {
      //     searchValue: form.search
      //   };
      //   let res = await visit.selectPatientBySth(searchValue2);
      //   console.log(res, "res我的");
      //   for (let i = 0; i < res.length; i++) {
      //     patientIds += res[i] + ",";
      //   }
      //   console.log(patientIds);
      // }
      // console.log(visitCode, "-", patientIds, "vp");
      // 查询方法
      // this.$refs.patientsTable.loadData({
      //   startDate,
      //   stopDate,
      //   ouptDeptId: form.technicalOffices || "",
      //   visitCode,
      //   patientIds
      // });
      let params = {};
      if (form.technicalOffices == "") {
        params = {
          startDate,
          stopDate,
          doctorId: this.role.userId,
          keyword: this.form.search,
          pageNo: 1,
          pageSize: 10
        };
      } else {
        params = {
          startDate,
          stopDate,
          ouptDeptId: form.technicalOffices || "",
          keyword: this.form.search,
          pageNo: 1,
          pageSize: 10
        };
      }
      console.log(params, "params");
      await this.$refs.patientsTable.loadData(params);
      this.$refs.patientsTable.pageNo = 1;
      this.$refs.patientsTable.data.referral = [...this.$refs.patientsTable.referralInit];
    },
    //格式化日期
    getFormatDate(d) {
      let year = d.getFullYear();
      let month = this.change(d.getMonth() + 1);
      let day = this.change(d.getDate());
      return year + "-" + month + "-" + day;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      }
      return t;
    },
    readCard(form) {
      // 读卡方法 t
      let data = {
        cardData: form.search
      };
      if (form.search) {
        applyReferralCard(data)
          .then(res => {
            if (res.data) {
              this.$refs.patientsTable.showData.referral = [];
              this.data.bakList = res.data;
              for (let i = 0; i < this.data.bakList.length; i++) {
                this.data.bakList[i].optStr = "转诊";
                this.data.referral.push(this.data.bakList[i]);
              }
              this.$refs.patientsTable.showData = this.data;
            } else {
              this.$message({ message: "未查询到患者信息", type: "warning" });
            }
          })
          .catch(error => {
            this.$message.error(error.msg);
          });
      } else {
        this.$message({ message: "请输入卡号", type: "warning" });
      }
    }
  },
  components: {
    leftTabs,
    patientsTable
  },
  computed: {
    ...mapGetters("user", ["role"])
  }
};
</script>

<style lang="scss" scoped>
</style>
