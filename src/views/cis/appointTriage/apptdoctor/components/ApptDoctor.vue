<template>
  <div class="height100 width100 body-div">
    <div class="margin-left-20 mar-top-20">
      <l-card-title>
        <template slot="left">门诊排班表</template>
      </l-card-title>
    </div>
    <div class="con">
      <div class="width100 l-clearfix:after">
        <div class="block table-title"></div>
        <div
          class="block table-title"
          v-for="item in dateList"
          :key="item.index"
        >{{ item.nowDate + " " + item.week }}</div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block bgc-grey">上午</div>
        <div v-for="(value, key) in am" :class="value.flag ? 'full' : 'surplus'" :key="key">
          <template v-if="!value.flag">
            <template v-if="value.num">
              <el-dropdown @command="handleCommand">
                <el-row>
                  <span class="order-class">{{ "预约" }}</span>
                </el-row>
                <el-row>
                  <span>{{ value.num }}</span>
                </el-row>
                <el-row>
                  <span>{{ value.rangTime }}</span>
                </el-row>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(time, index) in amRange"
                    :key="index"
                    :command="
                      value.date +
                        '_' +
                        key +
                        '_am_' +
                        time +
                        '_' +
                        value.scheduleId
                    "
                  >{{ time }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
          <template v-else>
            <el-row>
              <span>{{ "已满" }}</span>
            </el-row>
            <el-row>
              <span>{{ value.num }}</span>
            </el-row>
          </template>
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block bgc-grey">下午</div>
        <div v-for="(value, key) in pm" :class="value.flag ? 'full' : 'surplus'" :key="key">
          <template v-if="!value.flag">
            <template v-if="value.num">
              <el-dropdown @command="handleCommand">
                <el-row>
                  <span class="order-class">{{ "预约" }}</span>
                </el-row>
                <el-row>
                  <span>{{ value.num }}</span>
                </el-row>
                <el-row>
                  <span>{{ value.rangTime }}</span>
                </el-row>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(time, index) in pmRange"
                    :key="index"
                    :command="
                      value.date +
                        '_' +
                        key +
                        '_pm_' +
                        time +
                        '_' +
                        value.scheduleId
                    "
                  >{{ time }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
          <template v-else>
            <el-row>
              <span>{{ "已满" }}</span>
            </el-row>
            <el-row>
              <span>{{ value.num }}</span>
            </el-row>
          </template>
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block bgc-grey">晚上</div>
        <div v-for="(value, key) in night" :class="value.flag ? 'full' : 'surplus'" :key="key">
          <template v-if="!value.flag">
            <template v-if="value.num">
              <el-dropdown @command="handleCommand">
                <el-row>
                  <span class="order-class">{{ "预约" }}</span>
                </el-row>
                <el-row>
                  <span>{{ value.num }}</span>
                </el-row>
                <el-row>
                  <span>{{ value.rangTime }}</span>
                </el-row>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(time, index) in nightRange"
                    :key="index"
                    :command="
                      value.date +
                        '_' +
                        key +
                        '_night_' +
                        time +
                        '_' +
                        value.scheduleId
                    "
                  >{{ time }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
          <template v-else>
            <el-row>
              <span>{{ "已满" }}</span>
            </el-row>
            <el-row>
              <span>{{ value.num }}</span>
            </el-row>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/appointment/appointment.js";
// 重写date 格式化方法
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return month + "-" + day;
};

export default {
  props: ["reInfo", "ouptDeptId"],
  watch: {
    ouptDeptId: {
      handler(value, oldValue) {
        this.getScheduleList();
      }
    },
    "reInfo.diagTreatType": {
      handler(value, oldValue) {
        this.getScheduleList();
      }
    },
    "reInfo.doctorId": {
      handler(value, oldValue) {
        this.getScheduleList();
      }
    },
    am: {
      handler(val) {
        this.am = val
      }
    },
    pm: {
      handler(val) {
        this.pm = val
      }
    },
    night: {
      handler(val) {
        this.night = val
      }
    }
  },
  data() {
    return {
      // 上
      am: {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {}
      },
      // 下
      pm: {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {}
      },
      night: {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {}
      },
      timeListRange: [],
      formDate: {
        nowDate: "",
        week: ""
      },
      // 日期数组
      dateList: [
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        }
      ],
      currentWeek: true,
      // 当前时间
      currentDate: new Date(),
      year: new Date().getFullYear(),
      amRange: ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00"],
      pmRange: ["14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"],
      nightRange: ["18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"],
      resetRange: {
        weekday: "",
        time: ""
      }
    };
  },
  mounted() {
    this.getDate();
    this.getScheduleList();
  },
  methods: {
    handleCommand(command) {
      if (this.ouptDeptId == null) {
        this.$message.warning("请选择挂号信息");
        return;
      }
      if (this.reInfo.diagTreatType != "02" && this.reInfo.doctorId == null) {
        this.$message.warning("非普通门诊必须选择医生");
        return;
      }
      let list = command.split("_");
      let weekday = list[1];
      let time = list[2];
      this.setOrderTime(weekday, time, list[3]);
      let scheduleId = list[list.length - 1];
      if (this.reInfo.diagTreatType == "02" && this.reInfo.doctorId == null) {
        scheduleId = "";
      }
      this.$emit("selectTime", {
        scheduleId: scheduleId,
        time: `${list[0]} ${list[3]}`
      });
    },
    setOrderTime(weekday, time, rang) {
      // 设置已选中的时间段
      this.resetRangeTime(weekday, time);
      if (time === "am") {
        this.am[weekday].rangTime = rang;
      } else if (time === "pm") {
        this.pm[weekday].rangTime = rang;
      } else {
        this.night[weekday].rangTime = rang;
      }
      this.resetRange.weekday = weekday;
      this.resetRange.time = time;
    },
    returnDate(startTime, endTime) {
      let am = [0, 12];
      let pm = [12, 18];
      let night = [18, 23];
      let startF = new Date(startTime);
      let endF = new Date(endTime);
      let startStr = startF.valueOf();
      let endStr = endF.valueOf();
      let date = startTime.split(" ")[0];
      let oneTime = new Date(startStr).getHours();
      let twoTime = new Date(endStr).getHours();
      let str;
      if (oneTime > am[0] && twoTime <= am[1]) {
        str = "am";
      } else if (oneTime >= pm[0] && twoTime <= pm[1]) {
        str = "pm";
      } else {
        str = "night";
      }
      return {
        date,
        str
      };
    },
    judgeTime(itemObjList) {
      let mapObj = {
        0: "mon",
        1: "tue",
        2: "wed",
        3: "thu",
        4: "fri",
        5: "sat",
        6: "sun"
      };
       this.dateList.forEach((item, index) => {
        // eslint-disable-next-line complexity
        let aaanum = 0;
        let aaaSdeptLimitNum = 0;
        let pppnum = 0;
        let pppSdeptLimitNum = 0;
        let nnnnum = 0;
        let nnnSdeptLimitNum = 0;
        // eslint-disable-next-line complexity
       itemObjList.forEach(itemObj => {
          let str = `${this.year}-${item.nowDate}`;
          if (str === itemObj.date) {
            switch (itemObj.str) {
              case "am":
                if(itemObj.apptNum && itemObj.apptNum != 0){
                  aaanum = aaanum + itemObj.apptNum;
                }
                if(itemObj.sdeptLimitNum && itemObj.sdeptLimitNum != 0){
                  aaaSdeptLimitNum = aaaSdeptLimitNum + itemObj.sdeptLimitNum + itemObj.appendNum;
                }
                this.am[mapObj[index]] = {
                  // num: `${itemObj.apptNum}/${itemObj.sdeptLimitNum}`,
                  num: `${aaanum}/${aaaSdeptLimitNum}`,
                  scheduleId: itemObj.scheduleId,
                  date: itemObj.date,
                  rangTime: "",
                  flag: itemObj.apptNum === itemObj.sdeptLimitNum
                };
                break;
              case "pm":
                if(itemObj.apptNum && itemObj.apptNum != 0){
                  pppnum = pppnum + itemObj.apptNum;
                }
                if(itemObj.sdeptLimitNum && itemObj.sdeptLimitNum != 0){
                  pppSdeptLimitNum = pppSdeptLimitNum + itemObj.sdeptLimitNum + itemObj.appendNum;
                }
                this.pm[mapObj[index]] = {
                  // num: `${itemObj.apptNum}/${itemObj.sdeptLimitNum}`,
                  num: `${pppnum}/${pppSdeptLimitNum}`,
                  scheduleId: itemObj.scheduleId,
                  date: itemObj.date,
                  rangTime: "",
                  flag: itemObj.apptNum === itemObj.sdeptLimitNum
                };
                break;
              default:
                if(itemObj.apptNum && itemObj.apptNum != 0){
                  nnnnum = nnnnum + itemObj.apptNum;
                }
                if(itemObj.sdeptLimitNum && itemObj.sdeptLimitNum != 0){
                  nnnSdeptLimitNum = nnnSdeptLimitNum + itemObj.sdeptLimitNum + itemObj.appendNum;
                }
                this.night[mapObj[index]] = {
                  // num: `${itemObj.apptNum}/${itemObj.sdeptLimitNum}`,
                  num: `${nnnnum}/${nnnSdeptLimitNum}`,
                  scheduleId: itemObj.scheduleId,
                  date: itemObj.date,
                  rangTime: "",
                  flag: itemObj.apptNum === itemObj.sdeptLimitNum
                };
                break;
            }
          }
        });
      });
    },
    resetRangeTime(weekday, time) {
      if (this.resetRange.time === "") {
        return;
      }
      if (this.resetRange.time === "am") {
        this.am[this.resetRange.weekday].rangTime = "";
      } else if (this.resetRange.time === "pm") {
        this.pm[this.resetRange.weekday].rangTime = "";
      } else {
        this.night[this.resetRange.weekday].rangTime = "";
      }
    },
    resetScheduleData() {
      this.am = {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {}
      };
      this.pm = {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {}
      };
      this.night = {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {}
      };
    },
    //排班
    async getScheduleList() {
      try {
        this.$showLoading();
        let startDate = `${this.year}-${this.dateList[0].nowDate} 00:00:00`;
        let stopDate = `${this.year}-${this.dateList[6].nowDate} 23:59:59`;

        // 为了日期跨年，加时间
        let date = new Date(startDate);
        let aa = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
        stopDate = new Date(aa).getFullYear() + `-${this.dateList[6].nowDate} 23:59:59`;
        let resData = await service.getOrderNumList({
          startDate,
          stopDate,
          ouptDeptId: this.ouptDeptId || "",
          diagTreatType: this.reInfo.diagTreatType || "",
          doctorId: this.reInfo.doctorId || ""
        });
        if (resData.code === 1) {
          this.resetScheduleData();
          let data = resData.data;
          let obj = [];
          data.forEach(item => {
            let itemObj = this.returnDate(
              item.dutyStartTime,
              item.dutyStopTime
            );
            itemObj.apptNum = item.apptNum;
            itemObj.scheduleId = item.scheduleId;
            itemObj.sdeptLimitNum = item.sdeptLimitNum;
            itemObj.appendNum = item.appendNum || 0;
            obj.push(itemObj);
          });
          this.judgeTime(obj);
        }
        this.$hideLoading();
      } catch (error) {
        console.log(error);
        this.$hideLoading();
        // this.$message.error(error.msg || "排班接口错误");
      }
    },
    // 日期
    getDate() {
      let currentDate = this.currentDate;
      const weeks = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      let a = new Date(currentDate).getDay() - 1;
      if(a === -1){
        a = 6;
      }
      let lengths = weeks.length - 1;
      for (let i = 0; i < 7; i++) {
        // 周一的时间
        // let date = currentDate - a * 60 * 60 * 24 * 1000;
        let date = currentDate - 1 * 60 * 60 * 24 * 1000;
        let b = date + 60 * 60 * 24 * 1000 * (i + 1);
        this.dateList[i].week =
          weeks[a + i <= lengths ? a + i : a + i - lengths - 1];
        this.dateList[i].nowDate = new Date(b).toLocaleStr();
      }
    },
    nowWeek() {
      // 本周
      this.currentDate = new Date();
      this.getDate();
    }
  }
};
</script>
<style lang="scss" scoped>
.body-div {
  .con {
    margin: 0 20px;
  }
  .mar-top-20 {
    margin-top: 20px;
  }
  .block {
    float: left;
    width: 12.2%;
    height: 74px;
    text-align: center;
    border: 1px solid #ededed;
    line-height: 74px;
  }
  .bgc-grey {
    background-color: #f7f8fa;
  }
  .table-title {
    background: #f7f8fa;
    font-size: 14px;
    color: #2e323a;
    height: 41px;
    line-height: 41px;
  }
  .task {
    height: 80px;
  }
  .title-span {
    font-size: 14px;
    font-weight: bold;
    color: rgba(148, 157, 163, 1);
    line-height: 35px;
  }
  .el-button {
    border: none;
  }
  .full {
    float: left;
    width: 12.2%;
    height: 74px;
    text-align: center;
    border: 1px solid #ededed;
    padding-top: 15px;
    span {
      font-size: 14px;
      color: rgba(208, 208, 208, 1);
    }
    background: rgba(245, 245, 245, 1);
  }
  .surplus {
    float: left;
    width: 12.2%;
    height: 74px;
    text-align: center;
    border: 1px solid #ededed;
    padding-top: 15px;
    span {
      font-size: 14px;
      color: rgba(61, 125, 251, 1);
    }
    .order-class {
      color: #ff6a00;
      cursor: pointer;
    }
  }
}
</style>
