<template>
  <div class="leftTabsWrapper height100 width100">
    <!--列表tabs写法-->
    <LSideTab
      @tabClick="handleClick"
      @sideEvent="sideEvent"
    >
      <template #formList>
        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%; margin: 0 0 8px 0"
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
        <patients-tree ref="list" :params="params"></patients-tree>
      </template>
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
  import patientsTree from "../prescriptionRecor/newPatientsManage/components/patientsTable.vue";
  import {
    getPatients,
    receive,
    findAllergy,
    selectPatientBySth,
    cardReading
  } from "@/api/cis/visit/visit";
  import visit from "@/api/cis/visit/visit";
  import {mapActions, mapGetters} from "vuex";

  export default {
    name: "leftBar",
    props: ["pSetterForm"], // 左侧的表单 列表
    data() {
      return {
        form: {
          search: "",
          timeRange: "",
          startDate: "",
          stopDate: ""
        },
        datePicker: {
          //datepicker 的 placeholder
          startPlaceholder: "预约开始日期",
          endPlaceholder: "预约结束日期"
        },
        formParams: [
          // "diagnosisArea",
          // "diagnosisRoom",
          // "channelWay",
          "timeRange",
          "search"
        ],
        patientInfo: {},
        patientInfoList: [],
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
      handleClick(tabs) {
      },
      async search() {
        let form = this.form;
        if (form.timeRange != "" && form.timeRange != null) {
          form.startDate = form.timeRange[0];
          form.stopDate = form.timeRange[1];
        }

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
          this.params.stopDate = '';
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
      readCard() {
        let form = this.form;
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
      LSideTab,
      patientsTree
    },
    provide() {
      return {
        getIsCreatRecordBtn: () => 0,// 是否建档按钮:1为有;0为无
        getPatientInfoTitle: () => '',// 患者信息名称
        getPatientInfos: () => this.receivePatientData,
        getPatientInfoList: () => this.patientInfoList
      };
    },
    created() {
      if (this.pSetterForm != undefined && Array.isArray(this.pSetterForm)) {
        this.formParams = this.pSetterForm;
      }
    },
    computed: {
      ...mapGetters("base", ["role", "name", "reloadPatient"]),
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      reloadPatient: {
        //深度监听,可监听到对象、数组的变化
        handler(val) {
          this.search(this.form);
        },
        deep: true
      },
    },
  };
</script>

<style scoped lang="scss">
  .leftTabsWrapper {
  }

  /deep/ .el-tabs__content {
    overflow: unset !important;
  }
</style>
