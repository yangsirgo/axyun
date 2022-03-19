<template>
  <div class="sidebar height100" id="l-c-penetrate-tabs-container">
    <l-sidebar-left>
      <template #top>
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
          <el-button type="primary" plain class="btn" @click="addnew"
            >新建档案</el-button
          >
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
            <div class="patient-penetrate-container">
              <div class="patient-penetrate-box">
                <l-patient-info-item
                  v-for="(item, index) in currentPatientsList"
                  :key="index"
                  :class="{
                    'l-c-penetrate': true,
                    'is-active': currentPenetrate === `${index}` && receivePatientData.patientId === item.patientId && receivePatientData.activeName === activeName ,
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
import { getPatientArchInfo } from "@/api/ipnw/etHospital";
import { mapActions, mapGetters } from "vuex";
import readCardMixin from "@/mixins/readCard.js";
import { deepClone } from "@/utils/index.js";

export default {
  mixins: [readCardMixin],
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
        searchValue: "",
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
        startPlaceholder: "预约开始日期",
        endPlaceholder: "预约结束日期"
      },
      formParams: ["timeRange", "search"],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      number: "",
      currentPatientsList: [],
      tabsList: [],
      activeNames: "first",
      currentPenetrate: ""
    };
  },
  props: {
    activeName: {
      type: String,
      default: ""
    }
  },
  components: {},
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
      changeRecPatientData: "homeSickbeds/changeRecPatientData",
      setActiveTabName: "cis/setActiveTabName"
    }),
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.form.search = obj.patientCode;
      this.search();
    },
    reset() {
      this.form.timeRange = "";
      this.form.search = "";
      this.search();
    },
    addnew() {
      this.$emit("addnew", this.form.search);
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
    // 搜索患者  isSelectPatient 是否选中患者
    async search(id, isSelectPatient = true) {
      let form = this.form;
      if (form.timeRange != "" && form.timeRange != null) {
        form.startDate = form.timeRange[0];
        form.stopDate = form.timeRange[1];
      }
      if (id) {
        form.search = id;
      }

      if (form.timeRange != "" && form.timeRange != null) {
        this.params.startDate = form.timeRange[0];
        this.params.stopDate = form.timeRange[1];
      } else {
        this.params.startDate = "";
        this.params.stopDate = "";
      }
      this.loadData(false, isSelectPatient);
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

      // 整理数据
      item.patientBirthday = item.birthDate;

      item.familyAddress = item.currentDetail;
      item.summaryOfIllness = item.admitIllnessSummary;

      item.createOpinions = item.admitOpinion;
      item.diseaseType = item.siRegDiseaseCode;
      item.createType = item.admitTypeCode;
      item.criticalLevel = item.admissionSituation;

      item.addrProvince = item.currentProvinceCode;
      item.addrCity = item.currentCityCode;
      item.addrDistrict = item.currentRegionCode;
      item.addrStreet = item.currentStreetCode;
      item.addrVillage = item.currentCommunityCode;
      item.activeName = this.activeName;
      this.$emit("choosePatientFun", item);
      this.changeRecPatientData(item);
    },

    // 列表分页
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.loadData();
    },
    loadData(noLoading = false, isSelectPatient = true) {
      //控制loading显示 与 不显示
      this.loading = !noLoading;
      let condition = this.form.search ? this.form.search.replace(/\s*/g,"") : "";

      let params = {
        condition
      };

      params.pageNo = this.pageParams.pageNo;
      params.pageSize = this.pageParams.pageSize;

      getPatientArchInfo(params, false)
        .then(res => {
          let resultData = res.data;
          this.pageParams.total = res.total;
          for (let i = 0; i < resultData.length; i++) {
            // 整理数据，使index页面可使用
            resultData[i] = {
              ...resultData[i],
              ...resultData[i].patientArchiveInfoVO,
              ...resultData[i].patientEmpiInfoAddrssVO
            };
          }
          let patientId = this.receivePatientData
            ? this.receivePatientData.patientId
            : "";
          let targetRow = resultData.find(item => {
            return item.patientId === patientId;
          });

          this.currentPatientsList = resultData;
          if (resultData.length == 1) {
            this.choosePenetrateItemWrapper(0, resultData[0]);
          }
          // 不选中患者，只刷新列表
          if (!isSelectPatient) return;

          if (targetRow && this.activeName === "first") {
            // 选中效果
            let index = resultData.findIndex(item => {
              return item.patientId === this.receivePatientData.patientId;
            });

            this.currentPenetrate = `${index}`;

            this.choosePenetrateItemWrapper(
              this.currentPenetrate,
              resultData[this.currentPenetrate]
            );
          } else if (this.currentPatientsList.length && this.activeName === "first") {
            this.choosePenetrateItemWrapper(0,this.currentPatientsList[0]);
            /* this.$nextTick(() => {
              document.getElementsByClassName("l-patient-info-item")[0].click();
            }); */
          }
        })
        .catch(error => {
          console.log(error, "directCheckLeftBar");
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
      min-width: 59px;
      padding: 8px 8px;
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
