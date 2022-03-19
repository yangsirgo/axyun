<template>
  <div class="sidebar height100" id="l-c-penetrate-tabs-container">
    <l-sidebar-left>
      <template #top>
        <!-- <l-card-title>
          <template #left>就诊患者查询</template>
        </l-card-title> -->
        <!-- <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%; margin: 8px 0"
          v-model="form.timeRange"
          type="daterange"
          range-separator="至"
          @change="search"
          :default-time="['00:00:00', '23:59:59']"
          :start-placeholder="datePicker.startPlaceholder"
          :end-placeholder="datePicker.endPlaceholder"
        ></el-date-picker> -->
        <div class="read-card">
          <l-formt-title class="l-input-wrap-new">
            <el-input
              v-model="form.search"
              placeholder="姓名/证件号/患者编号"
              @keyup.enter.native="sideEvent('query')"
            ></el-input>
            <el-button
              plain
              type="primary"
              size="mini"
              shortbutton
              @click="sideEvent('readCard')"
              >读卡</el-button
            >
          </l-formt-title>
        </div>
        <!-- <div class="btns-contain">
          <el-button
            type="primary"
            plain
            class="btn"
            @click="sideEvent('query')"
            >查询</el-button
          >
          <el-button plain class="btn" @click="reset">重置</el-button>
        </div> -->
      </template>
      <template #bottom>
        <div class="no-tabs" v-if="currentPatientsList.length > 0">
          <l-table
            :pageSize="pageParams.pageSize"
            :page="pageParams.pageNo"
            :total="pageParams.total"
            :background="false"
            :paginationSmall="true"
            layout="prev,pager,next"
            paginationAlign="center"
            @changeSize="sizeChangePatientList"
            :showTotal="true"
          >
            <div class="patient-penetrate-container">
              <div class="patient-penetrate-box">
                <l-patient-info-item
                  v-for="(item, index) in currentPatientsList"
                  :key="index"
                  :class="{
                    'l-c-penetrate': true,
                    'is-active': currentPenetrate === `${index}` && receivePatientData.patientId === item.patientId && receivePatientData.activeName === activeName,
                    'l-patient-info-item': true
                  }"
                  @click.native="choosePenetrateItemWrapper(index, item)"
                >
                  <template #top>
                    <span
                      style="
                        max-width: 42px;
                        display: inline-block;
                        vertical-align: top;
                      "
                      class="name overflowEllipsis"
                      :title="item.patientName"
                      >{{ item.patientName }}</span
                    >
                    <span class="patientGender gender c999">{{
                      item.patientGender == 1
                        ? "男"
                        : item.patientGender == 2
                        ? "女"
                        : "未知"
                    }}</span>
                    <span class="age c999 gender">{{ item.patientAge }}</span>
                    <!-- <span class="inpCode c999">{{item.inpCode}}</span> -->
                  </template>
                  <template #bottom>
                    <div style="font-size: 12px; color: #999; line-height: 1.5">
                      <!-- <div>患者编号：{{ item.patientCode }}</div> -->
                      <div>证件号：{{ item.identificationNum }}</div>
                      <!-- <div>建床时间：{{item.finAdmissionTime}}</div> -->
                      <div>
                        申请状态：{{ filterStatusName(item.status) }}
                      </div>
                      <!-- <div>家床号：{{item.inpCode}}</div>
                      <div>床号：{{item.bedCode}}</div> -->
                    </div>
                  </template>
                </l-patient-info-item>
              </div>
            </div>
          </l-table>
        </div>
        <div v-else style="text-align: center; margin-top: 20px">暂无数据</div>
        <!-- </template>
            </l-tables>-->
      </template>
    </l-sidebar-left>
  </div>
</template>

<script>
import {
  getCisNewPatients,
  receive,
  findAllergy,
  finish,
  getDiaByClinicType,
  selectPatientBySth,
  newSelectPatientBySth,
  cardReading
} from "@/api/cis/visit/visit";

import { getResidentPendingInfo } from "@/api/ipnw/etHospital";
// import patientsTree from "../prescriptionRecor/newPatientsManage/components/patientsTable.vue";
import { saveSign, updateSign, findByPatientId } from "@/api/cis/order/order";
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils";
import readCardMixin from '@/mixins/readCard.js'

export default {
  mixins: [readCardMixin],
  props: {
    activeName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      patientInfoShow: {},
      showData: {
        finished: [],
        wait: [],
        received: []
      },
      loading: false,
      params: {
        keyword: "",
        searchReasult: "",
        startDate: "",
        stopDate: ""
      },
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
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 200
      },
      number: "",
      //   listLength: 5,
      currentPatientsList: [],
      tabsList: [],
      activeNames: "first",
      currentPenetrate: ""
    };
  },
  components: {},
  mounted() {
    this.loadData(null);
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("user", ["role"]),
    // ...mapGetters("base","re
    ...mapGetters("cis", ["activeTabName"]),
    ...mapGetters("base", ["searchAgainKey"])
  },
  watch: {
    searchAgainKey() {
      this.loadData();
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "homeSickbeds/changeRecPatientData",
      // setReloadKey: "base/changeSearchAgainKey",
      setActiveTabName: "cis/setActiveTabName"
    }),
    filterStatusName(status) {

      if (status == "1") {
        return "未通过";
      } else if (status == "2") {
        return "通过";
      } else if (status == "0") {
        return "待审核";
      } 
      
      return "待审核";
    },
    reset() {
      this.form.timeRange = "";
      this.form.search = "";
      this.search();
    },
    //子组件抛出的方法
    sideEvent(sideEvent) {
      // 重置分页数据
      this.pageParams.pageNo = 1;
      if (sideEvent === "query") {
        this.search();
      } else if (sideEvent === "readCard") {
        this.readCard();
      }
    },
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.form.search = obj.patientCode;
      this.search();
    },
    /* readCard() {
      let form = this.form;
      // 读卡方法
      let data = {
        cardData: form.search
      };
      this.loading = true;
      cardReading(data)
        .then(res => {
          if (res.data != null && res.data.length > 0) {
            if (res.data[0].recordStatus == 4) {
              //今天，编辑
              if (
                res.data[0].hasOwnProperty("rediagStatus") &&
                res.data[0].rediagStatus == 1
              ) {
                res.data[0].optStr = "回诊F";
                this.showData.received.push(res.data[0]);
              } else {
                res.data[0].optStr = "编辑";
                this.showData.received.push(res.data[0]);
              }
            } else if (res.data[0].recordStatus == 5) {
              res.data[0].optStr = "查看";
            }
            this.choosePenetrateItemWrapper(0, res.data[0]);
          }
          this.currentPatientsList = res.data || [];
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("获取档案失败，请稍后重试！");
        });
    }, */
    async search(selectedItem) {
      let form = this.form;
      if (form.timeRange != "" && form.timeRange != null) {
        form.startDate = form.timeRange[0];
        form.stopDate = form.timeRange[1];
      }

      if (selectedItem && selectedItem.patientCode) {
        form.search = selectedItem.patientCode;
      }

      // 查询方法
      let data = {
        keyword: form.search
      };
      if (form.timeRange != "" && form.timeRange != null) {
        this.params.startDate = form.timeRange[0];
        this.params.stopDate = form.timeRange[1];
      } else {
        this.params.startDate = "";
        this.params.stopDate = "";
      }
      // this.changeRecPatientData(selectedItem);
      this.loadData(selectedItem);
    },
    //计算生日
    jsGetAge(strBirthday) {
      let returnAge;
      let strBirthdayArr = strBirthday.split("-");
      let birthYear = strBirthdayArr[0];
      let birthMonth = strBirthdayArr[1];
      let birthDay = strBirthdayArr[2];
      let d = new Date();
      let nowYear = d.getFullYear();
      let nowMonth = d.getMonth() + 1;
      let nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0;
      } else {
        let ageDiff = nowYear - birthYear;
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            let dayDiff = nowDay - birthDay;
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            let monthDiff = nowMonth - birthMonth;
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1;
        }
      }
      return returnAge;
    },
    choosePenetrateItemWrapper(index, itemInit) {
      let item = deepClone(itemInit);
      this.currentPenetrate = `${index}`;
      item.activeName = this.activeName;
      // 整理数据
      // item.birthDate = item.patientBirthday
      console.log("choosePatientFun::::", item);
      this.changeRecPatientData(item);
      this.$emit("choosePatientFunResid", item);
      

    },

    // 列表分页
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      // let pageParams = {
      //   pageNo: this.pageParams.pageNo,
      //   pageSize: 20
      // };
      this.loadData();
    },
    loadData(selectedItem) {
      // //预约时间格式处理
      // let startDate = this.params.startDate;
      // startDate = startDate ? startDate + " 00:00:00" : "";
      // let stopDate = this.params.stopDate;
      // stopDate = stopDate ? stopDate + " 23:59:59" : "";
      let condition = this.form.search ? this.form.search.replace(/\s*/g,"") : "";
      let params = {
        keyword: condition
        // status: '1,9'
        // startTime: this.params.hasOwnProperty("startDate") ? startDate : "",
        // endTime: this.params.hasOwnProperty("stopDate") ? stopDate : ""
      };

      // //待诊1 诊中2 结束3
      // switch (this.activeNames) {
      //   case "first":
      //     params.flag = "1";
      //     break;
      //   case "second":
      //     params.flag = "2";
      //     break;
      //   case "third":
      //     params.flag = "3";
      //     break;
      // }

      // pageNo: this.pageParams.pageNo,
      //     pageSize: this.pageParams.pageSize

      params.pageNum = this.pageParams.pageNo;
      params.pageSize = this.pageParams.pageSize;

      // pageNo: this.pageParams.pageNo,
      // pageSize: this.pageParams.pageSize,
      // keyword: this.condition,

      getResidentPendingInfo(params, false)
        // eslint-disable-next-line complexity
        .then(res => {
          let resultData = res.data;
          this.pageParams.total = res.total;
          for (let i = 0; i < resultData.length; i++) {
            //生日转年龄
            resultData[i].age =
              resultData[i].hasOwnProperty("birthDate") &&
              resultData[i].birthDate != "" &&
              resultData[i].birthDate != null
                ? this.jsGetAge(resultData[i].birthDate.substring(0, 10))
                : "";
          }
          this.loading = false;

          this.currentPatientsList = resultData;
          console.log("selectedItem", selectedItem);

          if (resultData.length == 1) {
            this.choosePenetrateItemWrapper(0, resultData[0]);
          }
          let patientId = this.receivePatientData
            ? this.receivePatientData.patientId
            : "";
          let targetRow = resultData.find(item => {
            return item.patientId === patientId;
          });
          console.log("targetRow:::", targetRow);
          // if (targetRow && this.activeName === "third") {
          //   // 如果列表中还有这个患者，就选中他
          //   this.$emit("choosePatientFun", targetRow);
          //   // 选中效果
          //   let index = resultData.findIndex(item => {
          //     return item.patientId === this.receivePatientData.patientId;
          //   });
          //   this.$nextTick(() => {
          //     this.currentPenetrate = `${index}`;
          //   });
          //   this.choosePenetrateItemWrapper(
          //     this.currentPenetrate,
          //     resultData[this.currentPenetrate]
          //   );
          // } else 
          if (this.currentPatientsList.length && this.activeName === "third"){

            this.choosePenetrateItemWrapper(0, this.currentPatientsList[0]);
            /* this.$nextTick(() => {
              document.getElementsByClassName("l-patient-info-item")[0].click();
            }); */
          }
        })
        .catch(() => {
          this.loading = false;
        });

      // this.setActiveTabName(this.activeNames);
    }
  }
};
</script>

<style scoped lang="scss">
.sidebar {
  position: relative;
  padding: $l-padding-default-4;
  padding-top: 8px;
  .l-input-wrap-new {
    margin-bottom: 0px;
  }
  .read-card {
    margin-bottom: $l-margin-default-4;
    width: 100%;
    /deep/ .el-input {
      width: calc(100% - 56px) !important;
    }
    /deep/ .el-button--mini {
      margin-left: $l-margin-default-4;
    }
  }

  .btns-contain {
    display: flex;
    margin-bottom: $l-margin-default-4;
    justify-content: space-between;
    .btn {
      width: 100px;
    }
  }

  .patientBar {
    display: flex;
    align-items: center;
    .patientBar-left {
      flex: 1;
      width: 0;
      font-size: 0;
      > span {
        font-size: 14px;
      }
      > .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
        max-width: 24px;
        display: inline-block;
        vertical-align: top;
      }
      .endBtn {
        float: right;
        top: calc(-100% + 3px);
        right: -26px;
        position: relative;
      }
      > .name {
        max-width: 42px;
        display: inline-block;
        vertical-align: top;
      }
    }
  }

  .patient-penetrate-box {
    // margin-top: 8px;
    height: calc(100% - 8px);
    overflow: hidden;
    overflow-y: auto;
    .is-actiive {
      > .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
      }

      > .name {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
      }

      > .gender {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        opacity: 0.8;
      }
    }
  }
  .l-c-penetrate {
    &.is-active {
      .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
      }

      .name {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
      }

      .gender {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        opacity: 0.8;
      }

      .endBtn {
        right: -32px;
      }
    }

    .show-patient-detail {
      margin: 4px;
      font-size: 12px;
      color: #666c70;
    }
  }
  .has-penetrate {
    position: relative;
    z-index: 5;
    &.is-active {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .l-c-penetrate-clone {
    position: absolute;
    right: $l-layout-space-max-;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    z-index: 4;
    .top,
    .bottom {
      * {
        opacity: 0;
      }
    }
  }
  .tooltip-content {
    line-height: $l-height-common-2;
    font-size: $l-font-size;
  }
}

.margin-left-4 {
  margin-left: 4px;
}

.overflowEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.no-tabs,
.tabs-cont {
  height: 100%;
}
.patient-penetrate-container {
  width: 100%;
  height: 100%;
  .patient-penetrate-box {
    width: calc(100% + 24px);
    height: 100%;
    overflow: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      display: none;
    }
    .l-c-penetrate {
      width: calc(100% - 24px);
      &.is-active {
        width: 100%;
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        .name {
          color: $l-color-white;
        }
      }
    }
  }
}
</style>
