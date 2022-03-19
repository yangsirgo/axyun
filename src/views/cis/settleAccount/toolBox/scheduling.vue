<template>
  <div class="withdrawNum">
    <div class="title">
      <l-card-title>
        <template #left>
          <div>
            <span
              tableName="sys_org"
              :conditionMap="{ org_type: '_DEPT_', id: ouptDeptId }"
              columns="org_nm"
              v-tableTransform
            ></span
            >近期排班情况
          </div>
        </template>
      </l-card-title>
    </div>
    <div v-if="doctList.length > 0">
      <el-tabs tab-position="left" type="border-card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in doctList"
          :key="index"
          :label="item.name"
        >
          <div
            class="table-box"
            v-for="(item1, index1) in item.dutyList"
            :key="index1"
          >
            <span>{{ item1.date }}</span>
            <el-table
              :cell-class-name="cellClass"
              border
              :data="item1.times"
              style="width: 100%"
            >
              <el-table-column
                v-for="(item2, index2) in tableParams"
                :key="index2"
                align="center"
                :label="item2.label"
                min-width="100"
              >
                <template slot-scope="{ row }">
                  <p class="timeRange">{{ row[item2.prop] }}</p>
                  <p class="num">
                    {{ row[item2.prop1] == "00" ? "截止" : row[item2.prop1] }}
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="special-sty" >暂无排版情况</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import service from "@/api/appointment/appointment";

export default {
  name: "withdrawNum",
  data() {
    return {
      ouptDeptId: "",
      doctList: [], // 医生列表
      dutyObj: {}, // 值班对象
      tableParams: [
        {
          label: "上午",
          prop: "morning",
          prop1: "morningNum"
        },
        {
          label: "下午",
          prop: "afternoon",
          prop1: "afterNum"
        },
        {
          label: "晚上",
          prop: "night",
          prop1: "nightNum"
        }
      ],
      tabsData: [
        {
          name: "张军",
          planData: [
            {
              date: "09月12日",

              tableData: [
                {
                  morning: "08:00 - 10:00",
                  afternoon: "14:00 - 15:00",
                  night: "18:00 - 20:00"
                },
                {
                  morning: "10:00 - 12:00",
                  afternoon: "15:00 - 17:30",
                  night: ""
                }
              ]
            }
          ]
        },
        {
          name: "张林云",
          planData: [{}]
        }
      ]
    };
  },
  computed: {
    ...mapGetters("settleAccount", ["retreatData"])
  },
  watch: {
    retreatData: {
      handler(value) {
        if (value.ouptDeptId) {
          this.ouptDeptId = value.ouptDeptId;
          this.getDoctorList();
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getDoctorList();
  },
  methods: {
    handleClick() {},
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (
        rowIndex === 0 && columnIndex === 1 ||
        rowIndex === 1 && columnIndex === 2
      ) {
        return "stoptest";
      }
    },
    async getDoctorList() {
      try {
        this.loading = true;
        let params = {
          ouptDeptId: this.ouptDeptId,
          startDate:
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            "00:00:00",
          stopDate:
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            (new Date().getDate() + 6) +
            " " +
            "23:59:59"
        };
        let res = await service.getScheduleList(params);
        console.log(res.data);
        let datalist = res.data; // 后台返回的数据  list
        this.doctList = []; // 重置医生列表

        /**
         * 更改后台返回的数据结构
         */
        let docts = []; // 医生姓名列表
        if (datalist.length > 0) {
          for (let dataItem = 0; dataItem < datalist.length; dataItem++) {
            docts.push(datalist[dataItem].doctorName);
          }
          docts = Array.from(new Set(docts)); // 医生姓名列表去重
        }
        if (datalist.length > 0) {
          // 遍历医生姓名list
          for (let doctItem = 0; doctItem < docts.length; doctItem++) {
            // new 医生对象   二级
            let doctObj = {}; // 最后把医生对象push到医生列表中
            doctObj.name = docts[doctItem]; // push医生名字属性
            doctObj.dutyList = []; // pushy医生值班List

            // 遍历后台数据 判断医生姓名 拿到每个医生值班日期list 并去重
            let dutys = [];
            for (let dataItem = 0; dataItem < datalist.length; dataItem++) {
              if (datalist[dataItem].doctorName == doctObj.name) {
                let resetDate = datalist[dataItem].dutyStartTime.split(" ")[0];
                dutys.push(resetDate);
              }
            }
            // 得到每个医生下去重好的值班list
            dutys = Array.from(new Set(dutys));

            // 遍历该医生的值班list   dutys
            for (let itemDate = 0; itemDate < dutys.length; itemDate++) {
              let dateItem = {}; // 三级
              dateItem.date = dutys[itemDate];
              dateItem.times = [];
              let time1 = { morning: "", afternoon: "", night: "" };
              let time2 = { morning: "", afternoon: "", night: "" };
              for (let dataItem = 0; dataItem < datalist.length; dataItem++) {
                let resetDate2 = datalist[dataItem].dutyStartTime.split(" ")[0];
                if (
                  datalist[dataItem].doctorName == doctObj.name &&
                  resetDate2 == dutys[itemDate]
                ) {
                  // 预处理时间
                  let startTime = datalist[dataItem].dutyStartTime
                    .split(" ")[1]
                    .substr(0, 5);
                  let endTime = datalist[dataItem].dutyStopTime
                    .split(" ")[1]
                    .substr(0, 5);
                  // 分割时间
                  let middleTime =
                    (parseInt(endTime.substr(0, 2)) -
                      parseInt(startTime.substr(0, 2))) /
                    2;
                  middleTime = Math.round(middleTime);
                  // 显示时间
                  let timeFormat = (
                    parseInt(startTime.substr(0, 2)) + middleTime
                  ).toString();
                  // timeFormat.length == 1
                  //   ? timeFormat = "0" + timeFormat
                  //   : timeFormat = timeFormat;

                  if (timeFormat.length == 1){
                    timeFormat = "0" + timeFormat
                  }

                  let eTime1 = timeFormat + startTime.substr(2, 3);
                  let lastTime = startTime + "-" + eTime1;
                  let lastTime2 = eTime1 + "-" + endTime;
                  let timePoint = lastTime.substr(0, 2);
                  if (timePoint <= 12 && timePoint >= 8) {
                    time1.morning = lastTime;
                    time2.morning = lastTime2;
                  }
                  if (timePoint <= 17 && timePoint >= 14) {
                    time1.afternoon = lastTime;
                    time2.afternoon = lastTime2;
                  }
                  if (timePoint <= 20 && timePoint >= 16) {
                    time1.night = lastTime;
                    time2.night = lastTime2;
                  }
                }
              }
              dateItem.times.push(time1, time2);
              console.log(dateItem.times);
              // 把完成的日期对象push到doctObj.dutyList
              doctObj.dutyList.push(dateItem);
            }
            // 把完成的医生对象push到doctList
            this.doctList.push(doctObj);
          }
          console.log(this.doctList);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        // this.$message.error(error.msg);
      }
    }
  }
};
</script>



<style lang='scss' scoped>
.withdrawNum {
  width: 100%;
  // width: 298px;
  height: 100%;
  background-color: #fff;
  padding: 0px;
  .title {
    width: 100%;
    padding-left: 20px;
  }
  .el-tabs.el-tabs--border-card {
    width: 100%;
    height: calc(100% - 63px);
    box-shadow: none;
  }
  .el-tab-pane {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .table-box {
    margin-bottom: 20px;
    span {
      display: inline-block;
      margin-bottom: 10px;
      margin-left: 10px;
      font-weight: $l-font-weight;
    }
    .el-table {
      border-left: none !important;
      border-top: none !important;
      border-right: none !important;
      /deep/ .stoptest {
        background-color: $l-color-bgcolor-14 !important;
        .timeRange,
        .num {
          color: #d0d0d0 !important;
        }
      }
      /deep/ .el-table__row td {
        height: 80px;
        .timeRange {
          font-size: $l-font-size-min;
          line-height: 18px;
        }
        .num {
          font-size: 18px;
          line-height: 30px;
          color: $l-color-fontcolor-2;
        }
      }
    }
  }
  .special-sty {
    font-size: 16px;
    color: #909399;
    text-align: center;
    margin-top: 20px;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 9px 0 5px 0;
  }
  /deep/ .el-tabs--border-card > .el-tabs__header {
    background-color: #fff !important;
    /deep/ .el-tabs__item.is-left {
      position: relative;
      width: 48px !important;
      padding: 10px 6px !important;
      background-color: #fff !important;
      color: $l-color-fontcolor-3 !important;
      writing-mode: horizontal-tb !important;
      line-height: 14px !important;
      white-space: pre-wrap;
      letter-spacing: 0 !important;
      box-sizing: border-box !important;
      border-top: none !important;
      border-bottom: none !important;
      border-right: 1px solid #dfe4ed !important;
      margin: 0 !important;
      font-weight: $l-font-weight !important;
      font-size: $l-font-size-min !important;
      &::after {
        content: "";
        position: absolute;
        left: 50%;
        margin-left: -14px;
        bottom: 0;
        width: 28px;
        height: 1px;
        background-color: $l-color-bgcolor-11;
      }
    }
    /deep/ .el-tabs__item.is-left.is-active {
      background-color: #fff !important;
      color: $l-color-primary !important;
    }
  }
  /deep/ .el-tabs__header.is-left {
    margin-right: 0 !important;
  }
  /deep/ .el-table--medium th {
    height: 40px;
  }
}
</style>
