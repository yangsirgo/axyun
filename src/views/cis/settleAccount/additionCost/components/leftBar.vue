<template>
  <div class="leftTabsWrapper height100">
    <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="form"
      :tabs-name="tabsName"
      :form-list="formParams"
    >
      <template #first>
          <patientsTable ref="list" :params="params"></patientsTable>
      </template>
    </leftTabs>
  </div>
</template>

<script>
  // 目前form 表单有
  // 科室：technicalOffices
  // 诊区：diagnosisArea
  // 诊室：diagnosisRoom
  // 时间：timeRange
  // 搜索：search

  import leftTabs from "@/components/LSideTabs.vue";
  import patientsTable from "./patientsTable.vue";
  import {
    getPatients,
    receive,
    findAllergy,
    selectPatientBySth,
    cardReading
  } from "@/api/cis/visit/visit";
  import visit from "@/api/cis/visit/visit";
  import { mapActions, mapGetters } from "vuex";
  export default {
    name: "leftBar",
    props: ["pSetterForm","executionType"], // 左侧的表单 列表  executionType 有输液 皮试项
    data() {
      return {
        form: {},
        formParams: [
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
      handleClick() {
        // tab 的切换方法
      },
      async search(form) {
        // 查询方法
        let data = {
          searchValue: form.search
        };
        this.params.searchValue = form.search;
        this.params.searchReasult = "";
        if (form.search != "" && form.search != null) {
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
        this.params.areaId = form.diagnosisArea || ""; //诊区
        this.params.roomId = form.diagnosisRoom || ""; //诊室
        this.params.appointmentMode = form.channelWay || ""; //渠道
        if (form.timeRange != "" && form.timeRange != null) {
          this.params.startDate = form.timeRange[0];
          this.params.stopDate = form.timeRange[1];
        } else {
          /*this.params.startDate = new Date().format("yyyy-MM-dd");
          this.params.stopDate = new Date().format("yyyy-MM-dd");*/
          this.params.startDate = '';
          this.params.stopDate =  '';
        }
        if (form.technicalOffices != null) {
          this.params.technicalOffices = form.technicalOffices;
        }
        this.$refs.list.loadData();
        // this.params = form;
      },
      // async selectPatientBySth(data){
      //   await selectPatientBySth(data).then(res => {
      //     for (let i = 0; i < res.data.length; i++) {
      //       this.params.searchReasult += res.data[i] + ","
      //     }
      //   })
      // },
      readCard(form) {
        // 读卡方法
        let data = {
          cardData: form.search
        };
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
            }
            this.$refs.list.showData.all = res.data;
            this.$refs.list.showData.wait = [];
            // this.$message.success("读卡成功！");
          })
          .catch(() => {
            this.$message.error("获取档案失败，请稍后重试！");
          });
      }
    },
    components: {
      leftTabs,
      patientsTable
    },
    created() {
      if (this.pSetterForm != undefined && Array.isArray(this.pSetterForm)) {
        this.formParams = this.pSetterForm;
      }
    }
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
