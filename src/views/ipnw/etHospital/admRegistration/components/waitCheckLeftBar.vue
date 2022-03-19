<template>
  <div class="sidebar height100" id="l-c-penetrate-tabs-container">
    <l-sidebar-left>
      <template #top>
        <el-date-picker
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
        ></el-date-picker>
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
        <div class="btns-contain">
          <el-button
            type="primary"
            plain
            class="btn"
            @click="sideEvent('query')"
            >查询</el-button
          >
          <el-button plain class="btn" @click="reset">重置</el-button>
        </div>
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
            <div
              class="patient-penetrate-container"

            >
              <div class="patient-penetrate-box">
                <l-patient-info-item
                  v-for="(item, index) in currentPatientsList"
                  :key="index"
                  :class="{
                    'l-c-penetrate': true,
                    'is-active': currentPenetrate === `${index}` && receivePatientData.patientId === item.patientId,
                    'l-patient-info-item': true,
                  }"
                  @click.native="choosePenetrateItemWrapper(index, item)"
                >
                  <template #top>
                    <div class="patientBar">
                      <div class="patientBar-left">
                        <span
                          class="code overflowEllipsis"
                          :title="item.appointmentCode"
                          >{{ item.appointmentCode }}</span
                        >
                        <span
                          :title="item.patientName"
                          class="name overflowEllipsis margin-left-4"
                          >{{ item.patientName }}</span
                        >
                        <span
                          :val="item.patientGender"
                          code="GENDER_CODE"
                          v-codeTransform
                          class="gender margin-left-4"
                          v-if="item.patientGender"
                        ></span>
                        <span
                          v-if="item.patientAge"
                          class="gender margin-left-4"
                        >
                          {{
                            isNaN(item.patientAge)
                              ? item.patientAge
                              : item.patientAge + "岁"
                          }}
                        </span>
                      </div>
                    </div>
                  </template>
                  <template #bottom>
                    <div class="show-patient-detail">
                      <span>证件号</span>
                      <span class="margin-left-4">{{
                        item.identificationNum ? item.identificationNum : "--"
                      }}</span>
                    </div>
                    <div class="show-patient-detail">
                      <span>申请时间</span>
                      <span class="margin-left-4">{{
                        item.applyDate && item.applyDate.split(" ").length > 1
                          ? item.applyDate.split(" ")[0]
                          : "--"
                      }}</span>
                    </div>
                  </template>
                </l-patient-info-item>
              </div>
            </div>
          </l-table>
        </div>
        <div v-else style="text-align: center; margin-top: 20px">暂无数据</div>
      </template>
    </l-sidebar-left>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { createBedHistoryList } from "@/api/ipnw/etHospital";

import readCardMixin from "@/mixins/readCard.js";
import { deepClone } from "@/utils/index.js";

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
        startTime:
          new Date(new Date() - 7 * 60 * 60 * 24 * 1000).format("yyyy-MM-dd") +
          "00:00:00",
        endTime: new Date().format("yyyy-MM-dd") + " 23:59:59"
      },
      form: {
        search: "",
        timeRange: [
          new Date(new Date() - 7 * 60 * 60 * 24 * 1000).format("yyyy-MM-dd"),
          new Date().format("yyyy-MM-dd")
        ],
        startTime:
          new Date(new Date() - 7 * 60 * 60 * 24 * 1000).format("yyyy-MM-dd") +
          "00:00:00",
        endTime: new Date().format("yyyy-MM-dd") + " 23:59:59"
      },
      datePicker: {
        //datepicker 的 placeholder
        startPlaceholder: "申请开始日期",
        endPlaceholder: "申请结束日期"
      },
      formParams: ["timeRange", "search"],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      currentPatientsList: [],
      activeNames: "first",
      currentPenetrate: ""
    };
  },
  mounted() {
    this.loadData(null);
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("base", ["searchAgainKey"]),
    ...mapGetters("user", ["role"]),
    ...mapGetters("cis", ["activeTabName"])
  },
  watch: {
    searchAgainKey() {
      this.loadData();
    }
  },
  methods: {
    ...mapActions({
      setActiveTabName: "cis/setActiveTabName",
      changeRecPatientData: "homeSickbeds/changeRecPatientData",
      setPublicHealthPatientData: "base/setPublicHealthPatientData"
    }),
    reset() {
      this.form.timeRange = "";
      this.form.search = "";
      this.search();
    },
    //子组件抛出的方法
    sideEvent(sideEvent) {
      if (sideEvent === "query") {
        this.search();
      } else if (sideEvent === "readCard") {
        this.readCard();
      }
    },
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.form.search = obj.patientCode;
      this.pageParams.pageNo = 1;
      this.search({
        patientId: obj.patientId,
        patientCode: obj.patientCode
      });
    },
    search(obj) {
      let form = this.form;
      if (form.timeRange != "" && form.timeRange != null) {
        form.startTime = form.timeRange[0];
        form.endTime = form.timeRange[1];
      }

      if (form.timeRange != "" && form.timeRange != null) {
        this.params.startTime = form.timeRange[0];
        this.params.endTime = form.timeRange[1];
      } else {
        this.params.startTime = "";
        this.params.endTime = "";
      }
      this.pageParams.pageNo = 1;
      this.loadData(false, obj);
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
      console.log(`item2222`, item)
      this.setPublicHealthPatientData(item)
      this.currentPenetrate = `${index}`;
      // 整理数据
      item.birthDate = item.patientBirthday;
      this.changeRecPatientData(item);
      this.$emit("choosePatientFun2", item);
    },
    // 列表分页
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.loadData();
    },
    loadData(noLoading, obj = null) {
      //控制loading显示 与 不显示
      this.loading = !noLoading;

      //预约时间格式处理
      let startTime = this.params.startTime;
      startTime = startTime ? startTime + " 00:00:00" : "";
      let endTime = this.params.endTime;
      endTime = endTime ? endTime + " 23:59:59" : "";
      let keyword = this.form.search ? this.form.search.replace(/\s*/g,"") : "";

      let params = {
        startTime: this.params.hasOwnProperty("startTime") ? startTime : "",
        endTime: this.params.hasOwnProperty("endTime") ? endTime : "",
        keyword,
        status: "1", // 已申请状态
        ...obj
      };

      params.pageNo = this.pageParams.pageNo;
      params.pageSize = this.pageParams.pageSize;

      createBedHistoryList(params, false)
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
          // 判断是否清空 vuex 数据
          let patientId = this.receivePatientData
            ? this.receivePatientData.patientId
            : "";
          let targetRow = resultData.find(item => {
            return item.patientId === patientId;
          });
          this.currentPatientsList = resultData;

          if (!targetRow) {
            // 如果没有清空 vuex 数据
            // 门急诊 病历处方下的三级模块 不需要切换患者为默认值
            if (this.currentPatientsList.length && this.activeName === "first") {
              this.choosePenetrateItemWrapper(0, this.currentPatientsList[0]);
            }
          } else {
            if (obj) {
              let index = resultData.findIndex(item => {
                return item.patientId === obj.patientId;
              });

              if (index >= 0) {
                this.choosePenetrateItemWrapper(
                  index,
                  this.currentPatientsList[index]
                );
              }
            }
          }
        })
        .catch(e => {
          console.log(e, "error");
        })
        .finally(() => {
          this.loading = false;
        });

      this.setActiveTabName(this.activeNames);
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
