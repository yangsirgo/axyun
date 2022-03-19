<template>
  <div class="leftTabsWrapper height100">
    <!-- <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="form"
      :tabs-name="tabsName"
      :form-list="formParams"
    >
      <template #first> -->
        <!--皮试执行列表-->
        <!-- <patients-skin v-if="executionType === 'skinTest'" ref="list" :params="params"></patients-skin> -->
        <!--输液执行部分列表-->
        <!-- <patients-Infusion v-else-if="executionType === 'infusion'" ref="list" executionType="infusion" :params="params"></patients-Infusion> -->
        <!--肌注执行部分列表-->
        <!-- <patients-Infusion v-else-if="executionType === 'injection'" ref="list" executionType="injection" :params="params"></patients-Infusion> -->
        <!--治疗执行部分列表-->
        <!-- <patients-Infusion v-else-if="executionType === 'treatment'" ref="list" executionType="treatment" :params="params"></patients-Infusion> -->
        <!--检查采样列表-->
        <!-- <patients-sampling v-else-if="executionType === 'sample'" ref="list" executionType="sample" :params="params"></patients-sampling> -->
      <!-- </template>
    </leftTabs> -->
    <LSideTab
      @tabClick="handleClick"
      @sideEvent="sideEvent"
    >
      <template #formList>
        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%; margin: 0 0 10px 0"
          v-model="form.timeRange"
          type="daterange"
          range-separator="至"
          @change="search"
          :default-time="['00:00:00', '23:59:59']"
          :start-placeholder="datePicker.startPlaceholder"
          :end-placeholder="datePicker.endPlaceholder"
        ></el-date-picker>
        <el-input @keyup.native.enter="sideEvent('query')"
                  v-model="form.search"
                  placeholder="姓名/手机/证件号/患者编号"
                  style="width: 100%"
                  @keyup.enter.native="search"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="('query')"></i>
        </el-input>
      </template>
      <template #mainCont>
        <!--皮试执行列表-->
        <patients-skin v-if="executionType === 'skinTest'" ref="list" :params="params"></patients-skin>
        <!--输液执行部分列表-->
        <!-- <patients-Infusion v-else-if="executionType === 'infusion'" ref="list" executionType="infusion" :params="params"></patients-Infusion> -->
        <!--肌注执行部分列表-->
        <!-- <patients-Infusion v-else-if="executionType === 'injection'" ref="list" executionType="injection" :params="params"></patients-Infusion> -->
        <!--治疗执行部分列表-->
        <!-- <patients-Infusion v-else-if="executionType === 'treatment'" ref="list" executionType="treatment" :params="params"></patients-Infusion> -->
        <!--检查采样列表-->
        <!-- <patients-sampling v-else-if="executionType === 'sample'" ref="list" executionType="sample" :params="params"></patients-sampling> -->
      </template>
      <template #sideOperation></template>
    </LSideTab>
  </div>
</template>

<script>
// 目前form 表单有
// 科室：technicalOffices
// 诊区：diagnosisArea
// 诊室：diagnosisRoom
// 时间：timeRange
// 搜索：search

import LSideTab from "@/views/components/LSideTab";

// import leftTabs from "@/components/LSideTabs.vue";
import patientsSkin from "./patientsTable.vue";
// import patientsInfusion from "./infusion/patientsTableInfusion.vue";
// import patientsSampling from "./sampling/patientsTableSamping.vue";
import {
  getPatients,
  receive,
  findAllergy,
  selectPatientBySth,
  cardReading
} from "@/api/cis/visit/visit";
import visit from "@/api/cis/visit/visit";
import service from "@/api/appointment/appointment";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "leftBar",
  props: ["pSetterForm","executionType"], // 左侧的表单 列表  executionType 有输液 皮试项
  data() {
    return {
      datePicker: {
        //datepicker 的 placeholder
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期"
      },
      patientInfo: {},
      patientInfoList: [],
      form: {},
      formParams: [
        "diagnosisArea",
        "diagnosisRoom",
        "channelWay",
        "timeRange",
        "search"
      ],
      tabsName: [
        {
          label: "患者列表",
          value: "first"
        }
      ],
      params: {
        searchValue: "",
        searchReasult: "",
        startDate: "",
        stopDate: ""
      }
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),

    //子组件抛出的方法
    sideEvent(sideEvent) {
      if (sideEvent === "query") {
        this.search();
      } else if (sideEvent === "readCard") {
        this.readCard();
      }

    },

    handleClick() {
      // tab 的切换方法
    },
    async search() {
      console.log("this.form",this.form)
      // 查询方法
      let data = {
        searchValue: this.form.search
      };
      this.params.searchValue = this.form.search;
      this.params.searchReasult = "";
      if (this.form.search != "" && this.form.search != null) {
        let res = await visit.selectPatientBySth(data);
        for (let i = 0; i < res.length; i++) {
          this.params.searchReasult += res[i] + ",";
        }
        // if(this.params.searchReasult == ''){
        //   this.$refs.list.showData.all = [];
        //   this.$refs.list.showData.received = [];
        //   this.$refs.list.showData.wait = [];
        //   return;
        // }
      }
      this.params.areaId = this.form.diagnosisArea || ""; //诊区
      this.params.roomId = this.form.diagnosisRoom || ""; //诊室
      this.params.appointmentMode = this.form.channelWay || ""; //渠道
      if (this.form.timeRange != "" && this.form.timeRange != null) {
        this.params.startDate = this.form.timeRange[0];
        this.params.stopDate = this.form.timeRange[1];
      } else {
        /*this.params.startDate = new Date().format("yyyy-MM-dd");
        this.params.stopDate = new Date().format("yyyy-MM-dd");*/
        this.params.startDate = '';
        this.params.stopDate =  '';
      }
      if (this.form.technicalOffices != null) {
        this.params.technicalOffices = this.form.technicalOffices;
      }
      this.$refs.list.loadData();
      this.$refs.list.loadTableSkin();
      // this.params = this.form;
    },
    // async selectPatientBySth(data){
    //   await selectPatientBySth(data).then(res => {
    //     for (let i = 0; i < res.data.length; i++) {
    //       this.params.searchReasult += res.data[i] + ","
    //     }
    //   })
    // },
    async readCard() {
      // 读卡方法
      let data = {
        cardData: this.form.search
      };
    
      if (this.form.search == "") {
        this.$message.warning("请输入卡号");
        return;
      }
      cardReading(data)
        .then(res => {
          this.$refs.list.showData.received = [];
          if (res.data != null && res.data.length > 0) {
            if (res.data[0].recordStatus == 4) {
              //今天，编辑
              if (
                res.data[0].hasOwnProperty("rediagStatus") &&
                res.data[0].rediagStatus == 1
              ) {
                res.data[0].optStr = "回诊F";
                this.$refs.list.showData.received.push(res.data[0]);
              } else {
                res.data[0].optStr = "编辑";
                this.$refs.list.showData.received.push(res.data[0]);
              }
            } else if (res.data[0].recordStatus == 5) {
              res.data[0].optStr = "查看";
            }
            //生日转年龄
            //res.data[0].age = res.data[0].hasOwnProperty('birthDate') && res.data[0].birthDate != '' && res.data[0].birthDate != null ? this.jsGetAge(res.data[0].birthDate.substring(0, 10)) : '';
            this.changeRecPatientData(res.data[0]);
          }else {
            this.$message.info("查无此人，请输入正确卡号");
          }
          this.$refs.list.showData.all = res.data;
          this.$refs.list.showData.wait = [];
          // this.$message.success("读卡成功！");
        })
        .catch(() => {
          this.$message.error("获取档案失败，请稍后重试！");
        });
      // try {
      //   if (val.search == "") {
      //     this.$message.warning("请输入卡号");
      //     return;
      //   }
      //   this.$showLoading();
      //   const { data } = await service.getCardDetailInfo({
      //     cardNum: val.search || ""
      //   });

      //   // 清除患者信息中的visitCode  重要！！！(会影响后边开电子申请流程)
      //   this.$delete(data,"visitCode");
        
      //   this.patientInfo = { ...data };
      //   this.tableLeftData = [data];
      //   if (data && data.patientId) {
      //     const accountInfo = await service.getAccountInfo(data.patientId);
      //     this.balanceMoney = accountInfo.data.balanceMoney || "";
      //     this.info = {
      //       ...data,
      //       ...accountInfo.data
      //     };
      //   } else {
      //     this.$message.info("查无此人，请输入正确卡号");
      //   }
      //   this.changeRecPatientData(this.info);
      //   this.$hideLoading();
      // } catch (error) {
      //   console.log(error, "error");
      //   this.$hideLoading();
      //   this.$message.error(error.msg);
      // }
    }
  },
  components: {
    LSideTab,
    // leftTabs,
    // patientsInfusion,
    // patientsSampling,
    patientsSkin
  },
  provide() {
    return {
      getIsCreatRecordBtn: () => 0,// 是否建档按钮:1为有;0为无
      getPatientInfoTitle: () => '',// 患者信息名称
      getPatientInfos: () => this.receivePatientData,
      getPatientInfoList: () => this.patientInfoList
    };
  },
  computed: {
    ...mapGetters("base", ["role", "name", "reloadPatient"]),
    ...mapGetters("base", ["receivePatientData"])
  },
  created() {
    if (this.pSetterForm != undefined && Array.isArray(this.pSetterForm)) {
      this.formParams = this.pSetterForm;
    }
  },
  watch: {
    // receivePatientData: {
    //     //深度监听,可监听到对象、数组的变化
    //     handler(val) {
    //         // this.wardsCode = val.wardId;
    //         console.log('11111111111111111111111111111111111111111111-----------',val)
    //         console.log('11111111111111111111111111111111111111111111')
    //         this.search(this.form);
    //     },
    //     deep: true
    // },
    reloadPatient: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        // this.wardsCode = val.wardId;
        console.log('11111111111111111111111111111111111111111111++++++++++++++', val)
        console.log('11111111111111111111111111111111111111111111++')
        this.search(this.form);
      },
      deep: true
    },
  },
};
</script>

<style scoped lang="scss">
.leftTabsWrapper {
  /*height: calc(100% - 230px);*/
}
/deep/ .el-tabs__content {
  overflow: unset !important;
}
</style>
