<template>
  <div class="sidebar height100">
    <l-sidebar-left>
      <template #top>
        <div class="search-area">
          <l-card-title style="padding: 8px 0">
            <template #left>患者列表</template>
          </l-card-title>
          <div style="padding-bottom: 8px">
            <el-tabs v-model="recordStatus" @tab-click="search">
              <el-tab-pane label="待结算" name="3"></el-tab-pane>
              <el-tab-pane label="已结算" name="4"></el-tab-pane>
              <el-tab-pane label="全部" name="null"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="search-con">
            <l-formt-title style="margin-bottom: 4px">
              <el-input
                class="rightButton"
                v-model="condition"
                placeholder="姓名/家床号/床位号/档案号/患者编号"
                title="请输入姓名/家床号/床位号/档案号/患者编号查询"
                @keyup.enter.native="search"
              ></el-input>
              <el-button
                @click="readCard"
                plain
                type="primary"
                size="mini"
                shortbutton
                >读卡</el-button
              >
            </l-formt-title>
            <el-date-picker
              v-if="recordStatus !== '3'"
              style="width: auto"
              v-model="DateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
            >
            </el-date-picker>
            <div class="search-buttons">
              <el-button @click="search" plain type="primary">查询</el-button>
              <el-button @click="reSet">重置</el-button>
            </div>
          </div>
        </div>
      </template>
      <template #bottom>
        <l-table
          :showTotal="true"
          :pageSize="pageParams.pageSize"
          :page="pageParams.pageNo"
          :total="pageParams.total"
          :paginationSmall="true"
          :background="false"
          layout="prev,pager,next"
          paginationAlign="center"
          @changeSize="sizeChangePatientList"
        >
          <div class="patient-penetrate-container">
            <div class="patient-penetrate-box">
              <l-patient-info-item
                v-for="(item, index) in listData"
                :key="'click' + index"
                :class="{
                  'l-c-penetrate': true,
                  'is-active': currentPenetrate === index,
                  'l-patient-info-item': true,
                }"
                @click.native="choosePenetrateItem(index)"
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
                  <span class="age c999">{{ item.patientAge }}</span>
                  <!-- <span class="inpCode c999">{{item.inpCode}}</span> -->
                </template>
                <template #bottom>
                  <div style="font-size: 12px; color: #999; line-height: 1.5">
                    <div>患者编号：{{ item.patientCode }}</div>
                    <div>证件号：{{ item.identificationNum }}</div>
                    <div>建床时间：{{ item.wdeptAdmissionTime }}</div>
                    <div v-if="recordStatus == 4">
                      结算时间：{{ item.settlementTime }}
                    </div>
                    <div>家床号：{{ item.inpCode }}</div>
                    <div>床号：{{ item.bedCode }}</div>
                    <div>
                      <span>状态：</span>
                      <span
                        v-if="recordStatus != 4"
                        :val="item.recordStatus"
                        code="InpStatus"
                        v-codeTransform
                      ></span>
                      <span v-else>
                        <span v-if="item.recordStatus == 1">财务出院</span>
                        <span v-if="item.recordStatus == 2">撤销财务出院</span>
                        <span v-if="item.recordStatus == 9">回归</span>
                      </span>
                    </div>
                  </div>
                </template>
              </l-patient-info-item>
            </div>
          </div>
        </l-table>
      </template>
    </l-sidebar-left>
  </div>
</template>

<script>
import service from "@/api/financeManagement/inp.js";
import readCardMixin from "@/mixins/readCard.js";
export default {
  mixins: [readCardMixin],
  data() {
    return {
      listData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      condition: "",
      currentPenetrate: "",
      recordStatus: "3",
      DateArr: [
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format(
          "yyyy-MM-dd"
        ),
        new Date().format("yyyy-MM-dd")
      ]
    };
  },
  mounted() {
    this.$root.$on("PatientListDischargeSettleRefresh", this.refresh);
    this.patientListByExample();
  },
  methods: {
    choosePenetrateItem(index) {
      this.currentPenetrate = index;
      this.listData[index].tabStatus = this.recordStatus;
      this.$emit("listItemClick", this.listData[index]);
    },
    search() {
      this.pageParams.pageNo = 1;
      this.patientListByExample();
    },
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.condition = obj.patientCode;
      this.pageParams.pageNo = 1;
      this.patientListByExample({
        patientId: obj.patientId,
        patientCode: obj.patientCode,
        pattern: obj.patientCode
      });
    },
    /* readCard() {
      this.$message.error("没有外接设备");
    }, */
    reSet() {
      this.condition = "";
      this.DateArr = [];
    },
    //刷新患者列表
    async refresh() {
      await this.patientListByExample();
      this.listData[this.currentPenetrate].tabStatus = this.recordStatus;
      this.$emit("listItemClick", this.listData[this.currentPenetrate]);
    },
    //获取在院患者列表
    async patientListByExample(obj) {
      this.$emit("listItemClick", { tabStatus: this.recordStatus });
      let DateOb =
        this.recordStatus == "4"
          ? {
              startDate: this.DateArr.length
                ? new Date(this.DateArr[0]).format("yyyy-MM-dd") + " 00:00:00"
                : "",
              stopDate: this.DateArr.length
                ? new Date(this.DateArr[1]).format("yyyy-MM-dd") + " 23:59:59"
                : ""
            }
          : {
              inStartDate: this.DateArr.length
                ? new Date(this.DateArr[0]).format("yyyy-MM-dd") + " 00:00:00"
                : "",
              inStopDate: this.DateArr.length
                ? new Date(this.DateArr[1]).format("yyyy-MM-dd") + " 23:59:59"
                : ""
            };
      if (this.recordStatus == "3") {
        DateOb.inStartDate = "";
        DateOb.inStopDate = "";
      }
      let apiName =
        this.recordStatus == "4"
          ? "getLeaveHosPatient"
          : "getAllInpPatientInfo";
      let condition = this.condition ? this.condition.replace(/\s*/g,"") : "";
      let res = await service[apiName]({
        ...DateOb,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        recordStatus: this.recordStatus == "null" ? null : this.recordStatus,
        searchValue: condition,
        selectParam: condition,
        ...obj
      });
      // let list = [];
      // res.data.forEach((item, index) => {
      //   list.push(item);
      // });
      this.listData = res.data;
      if (res.data && res.data.length) {
        /* this.currentPenetrate = 0;
        res.data[0].tabStatus = this.recordStatus;
        this.$emit("listItemClick", res.data[0]); */
        this.$nextTick(() => {
          document.getElementsByClassName("l-patient-info-item")[0].click();
        });
      } else {
        this.currentPenetrate = "";
        this.$emit("listItemClick", {});
      }
      this.pageParams.total = res.total;
    },
    sizeChangePatientList(a) {
      this.currentPenetrate = "";
      this.pageParams.pageNo = a.page;
      this.patientListByExample();
    }
  },
  beforeDestroy() {
    this.$root.$off("PatientListDischargeSettleRefresh");
  }
};
</script>

<style lang='scss' scoped>
.sidebar {
  padding: $l-padding-default-4;
  padding-top: 0;
  padding-bottom: $l-padding-default-6;

  .search-area {
    margin-bottom: $l-margin-default-4;

    .search-con {
      /deep/ .rightButton.el-input {
        width: calc(100% - 47px);
      }

      /deep/ .el-button--mini {
        margin-left: $l-margin-default-1;
      }

      /deep/ input::-webkit-input-placeholder {
        /* placeholder颜色 */
        color: #aab2bd;
        /* placeholder字体大小 */
        font-size: 12px;
      }

      /deep/ .l-input-wrap {
        margin-left: 0;
      }

      .search-buttons {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;

        /deep/ button {
          width: calc(50% - 4px);
        }
      }
    }
  }

  .l-c-penetrate {
    &.is-active {
      .name {
        color: $l-color-white;
      }
    }
  }

  .name {
    font-weight: bold;
  }

  .inpCode {
    float: right;
  }

  .c999 {
    color: #aaa;
  }
}
</style>
