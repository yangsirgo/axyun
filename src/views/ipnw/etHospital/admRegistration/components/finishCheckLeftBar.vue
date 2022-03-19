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
        </div>
      </template>
      <template #bottom>
        <div class="no-tabs" v-if="listLengthFlag">
          <l-table
            :pageSize="pageParams.pageSize"
            :page="pageParams.pageNo"
            :total="pageParams.total"
            :background="false"
            :paginationSmall="true"
            layout="prev,pager,next"
            paginationAlign="center"
            :showTotal="true"
            @changeSize="sizeChangePatientList"
          >
            <div class="patient-penetrate-container" v-loading="loading">
              <div class="patient-penetrate-box">
                <l-patient-info-item
                  v-for="(item, index) in currentPatientList"
                  :key="item.patientId + item.birthDate + index"
                  :class="{
                    'l-c-penetrate': true,
                    'is-active': currentPenetrate === `${index}` && receivePatientData.patientId === item.patientId,
                    'l-patient-info-item': true,
                  }"
                  @click.native="choosePenetrateItemWrapper(index, item)"
                >
                  <template #top>
                    <span class="name">{{ item.patientName }}</span>
                    <span class="patientGender c999">{{
                      item.patientGender == 1
                        ? "男"
                        : item.patientGender == 2
                        ? "女"
                        : "未知"
                    }}</span>
                    <span class="age c999 patientGender">{{
                      item.patientAge
                    }}</span>
                  </template>
                  <template #bottom>
                    <div style="font-size: 12px; color: #999; line-height: 1.5">
                      <div>患者编号：{{ item.patientCode }}</div>
                      <div>证件号：{{ item.identificationNum }}</div>
                      <div>建床时间：{{ item.finAdmissionTime }}</div>
                      <div>家床号：{{ item.inpCode }}</div>
                      <div>床号：{{ item.bedCode }}</div>
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

import { getInpPatientInfoCopy } from "@/api/ipnw/etHospital";

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
        //datepicker 的 placeholder
        startPlaceholder: "预约开始日期",
        endPlaceholder: "预约结束日期"
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      currentPatientList: [],
      currentPenetrate: ""
    };
  },
  mounted() {
    this.loadData(null);
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("base", ["searchAgainKey"]),
    listLengthFlag() {
      return this.currentPatientList.length > 0;
    }
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
    search(selectedItem) {
      let form = this.form;
      if (form.timeRange != "" && form.timeRange != null) {
        form.startDate = form.timeRange[0];
        form.stopDate = form.timeRange[1];
      }

      if (form.timeRange != "" && form.timeRange != null) {
        this.params.startDate = form.timeRange[0];
        this.params.stopDate = form.timeRange[1];
      } else {
        this.params.startDate = "";
        this.params.stopDate = "";
      }

      this.pageParams.pageNo = 1;
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

    // 列表分页
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.loadData();
    },
    choosePenetrateItemWrapper(index, itemInit) {
      let item = deepClone(itemInit);
      console.log(`item3333`, item)
      this.currentPenetrate = `${index}`;
      this.$emit("choosePatientFun3", item);
      this.setPublicHealthPatientData(item)
      this.changeRecPatientData(item);
    },
    loadData(selectedItem = null) {
      // 是待登记、直接登记，登记完成后跳转过来的
      if (selectedItem && selectedItem.patientCode) {
        this.form.search = selectedItem.patientCode;
      }

      if (this.loading) {
        return;
      }

      this.loading = true;
      let searchValue = this.form.search ? this.form.search.replace(/\s*/g,"") : "";

      let params = {
        searchValue,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };

      getInpPatientInfoCopy(params, false)
        .then(res => {
          let resultData = res.data;
          this.pageParams.total = res.total;

          for (let i = 0; i < resultData.length; i++) {
            let itemObj = resultData[i];
            //生日转年龄
            itemObj.age =
              itemObj.hasOwnProperty("birthDate") &&
              itemObj.birthDate != "" &&
              itemObj.birthDate != null
                ? this.jsGetAge(itemObj.birthDate.substring(0, 10))
                : "";
          }
          console.log(resultData, "resultData");
          this.currentPatientList = resultData;
          this.$forceUpdate();

          console.log(this.currentPatientList, "this.currentPatientList");

          let targetRow = null;
          if (selectedItem) {
            targetRow = this.currentPatientList.find(item => {
              return item.patientId === selectedItem.patientId;
            });
          }

          if (targetRow) {
            // 选中效果
            let index = this.currentPatientList.findIndex(item => {
              return item.patientId === selectedItem.patientId;
            });
            if (index >= 0) {
              this.choosePenetrateItemWrapper(
                index,
                this.currentPatientList[index]
              );
            }
          } else {
            // 不在列表中显示
            if (this.currentPatientList.length && this.activeName === "third") {
              this.choosePenetrateItemWrapper(0, this.currentPatientList[0]);
            }
          }
        })
        .catch(error => {
          console.log(error, "error00");
        })
        .finally(() => {
          this.loading = false;
        });
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
      > .patientGender {
        color: #ffffff;
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
      > .patientGender {
        color: #ffffff;
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
        .patientGender {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
