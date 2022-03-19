<template>
  <div class="height100 width100 body-div">
    <div>
      <l-card-title>
        <template slot="left">排班情况</template>
      </l-card-title>
    </div>
    <div class="top-con clearfix">
      <div class="top-left">{{ periodTime }} 第{{ weekIndex }}周</div>
      <div class="top-right">
        <el-button @click="lastWeek" type="text">上一周</el-button>
        <el-button @click="nowWeek" type="text">本周</el-button>
        <el-button type="text" @click="nextWeek">下一周</el-button>
      </div>
    </div>
    <div class="con">
      <div class="width100 l-clearfix:after">
        <div class="block table-title">时间</div>
        <div
          class="block table-title"
          v-for="item in dateList"
          :key="item.index"
        >{{ item.nowDate + " " + item.week }}</div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block">上午</div>
        <div :class="am.mon.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ am.mon.flag ? "已满" : am.mon.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ am.mon.num }}</span>
          </el-row>
        </div>
        <div :class="am.tue.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ am.tue.flag ? "已满" : am.tue.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ am.tue.num }}</span>
          </el-row>
        </div>
        <div :class="am.wed.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ am.wed.flag ? "已满" : am.wed.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ am.wed.num }}</span>
          </el-row>
        </div>
        <div :class="am.thu.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ am.thu.flag ? "已满" : am.thu.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ am.thu.num }}</span>
          </el-row>
        </div>
        <div :class="am.fri.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ am.fri.flag ? "已满" : am.fri.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ am.fri.num }}</span>
          </el-row>
        </div>
        <div :class="am.sat.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ am.sat.flag ? "已满" : am.sat.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ am.sat.num }}</span>
          </el-row>
        </div>
        <div :class="am.sun.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ am.sun.flag ? "已满" : am.sun.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ am.sun.num }}</span>
          </el-row>
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block">下午</div>
        <div :class="pm.mon.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ pm.mon.flag ? "已满" : pm.mon.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ pm.mon.num }}</span>
          </el-row>
        </div>
        <div :class="pm.tue.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ pm.tue.flag ? "已满" : pm.tue.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ pm.tue.num }}</span>
          </el-row>
        </div>
        <div :class="pm.wed.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ pm.wed.flag ? "已满" : pm.wed.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ pm.wed.num }}</span>
          </el-row>
        </div>
        <div :class="pm.thu.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ pm.thu.flag ? "已满" : pm.thu.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ pm.thu.num }}</span>
          </el-row>
        </div>
        <div :class="pm.fri.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ pm.fri.flag ? "已满" : pm.fri.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ pm.fri.num }}</span>
          </el-row>
        </div>
        <div :class="pm.sat.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ pm.sat.flag ? "已满" : pm.sat.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ pm.sat.num }}</span>
          </el-row>
        </div>
        <div :class="pm.sun.flag ? 'full' : 'surplus'">
          <el-row>
            <span>{{ pm.sun.flag ? "已满" : pm.sun.num ? "预约" : "" }}</span>
          </el-row>
          <el-row>
            <span>{{ pm.sun.num }}</span>
          </el-row>
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block">晚上</div>
        <div :class="night.mon.flag ? 'full' : 'surplus'">
          <el-row>
            <span>
              {{
              night.mon.flag ? "已满" : night.mon.num ? "预约" : ""
              }}
            </span>
          </el-row>
          <el-row>
            <span>{{ night.mon.num }}</span>
          </el-row>
        </div>
        <div :class="night.tue.flag ? 'full' : 'surplus'">
          <el-row>
            <span>
              {{
              night.tue.flag ? "已满" : night.tue.num ? "预约" : ""
              }}
            </span>
          </el-row>
          <el-row>
            <span>{{ night.tue.num }}</span>
          </el-row>
        </div>
        <div :class="night.wed.flag ? 'full' : 'surplus'">
          <el-row>
            <span>
              {{
              night.wed.flag ? "已满" : night.wed.num ? "预约" : ""
              }}
            </span>
          </el-row>
          <el-row>
            <span>{{ night.wed.num }}</span>
          </el-row>
        </div>
        <div :class="night.thu.flag ? 'full' : 'surplus'">
          <el-row>
            <span>
              {{
              night.thu.flag ? "已满" : night.thu.num ? "预约" : ""
              }}
            </span>
          </el-row>
          <el-row>
            <span>{{ night.thu.num }}</span>
          </el-row>
        </div>
        <div :class="night.fri.flag ? 'full' : 'surplus'">
          <el-row>
            <span>
              {{
              night.fri.flag ? "已满" : night.fri.num ? "预约" : ""
              }}
            </span>
          </el-row>
          <el-row>
            <span>{{ night.fri.num }}</span>
          </el-row>
        </div>
        <div :class="night.sat.flag ? 'full' : 'surplus'">
          <el-row>
            <span>
              {{
              night.sat.flag ? "已满" : night.sat.num ? "预约" : ""
              }}
            </span>
          </el-row>
          <el-row>
            <span>{{ night.sat.num }}</span>
          </el-row>
        </div>
        <div :class="night.sun.flag ? 'full' : 'surplus'">
          <el-row>
            <span>
              {{
              night.sun.flag ? "已满" : night.sun.num ? "预约" : ""
              }}
            </span>
          </el-row>
          <el-row>
            <span>{{ night.sun.num }}</span>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/appointment/appointment.js";
// 重写date 格式化方法
Date.prototype.toLocaleStr = function() {
  return this.getMonth() + 1 + "-" + this.getDate();
};
String.prototype.weekIndexInYear = function() {
  var nowDate = new Date(this != "" ? this : new Date());
  var initTime = new Date(this != "" ? this : new Date());
  initTime.setMonth(0); // 本年初始月份
  initTime.setDate(1); // 本年初始时间
  initTime.setHours(0);
  initTime.setMinutes(0);
  initTime.setSeconds(0);

  nowDate.setHours(23);
  nowDate.setMinutes(59);
  nowDate.setSeconds(59);
  var differenceVal = nowDate - initTime; // 今天的时间减去本年开始时间，获得相差的时间
  var todayYear = Math.ceil(differenceVal / (24 * 60 * 60 * 1000)); // 获取今天是今年第几天
  var firstDay = initTime.getDay(); // 获取这年的第一天是周几，因为首周可能是上一年的最后一周内
  var startDiff;
  if (firstDay == 1) {
    startDiff = 0;
  } else if (firstDay > 1) {
    startDiff = firstDay - 7;
  } else {
    startDiff = -1;
  }
  return Math.ceil((todayYear + startDiff) / 7); // 返回今天是今年第几周
};
export default {
  props: ["deptId", "doctorId"],
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
      // 当前时间
      currentDate: new Date(),
      nowYear: new Date().getFullYear()
    };
  },
  watch: {
    doctorId: {
      handler(value, oldValue) {
        if (value) {
          this.getScheduleList();
        }
      }
    },
    deptId: {
      handler(value, oldValue) {
        if (value) {
          this.getScheduleList();
        }
      }
    }
  },
  computed: {
    weekIndex() {
      return this.dateList[0].nowDate.weekIndexInYear();
    },
    periodTime() {
      return `${this.nowYear}-${this.dateList[0].nowDate} 至 ${this.nowYear}-${this.dateList[6].nowDate}`;
    }
  },
  mounted() {
    this.getDate();
    this.getScheduleList();
  },
  methods: {
    returnDate(dateString) {
      let timeList = dateString.split(" ");
      let date = timeList[0];
      let time = timeList[1];
      let str;
      switch (time) {
        case "08:00:00":
          str = "am";
          break;
        case "14:00:00":
          str = "pm";
          break;
        default:
          str = "night";
          break;
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

      itemObjList.forEach(itemObj => {
        this.dateList.forEach((item, index) => {
          let str = `${this.nowYear}-${item.nowDate}`;
          if (str === itemObj.date) {
            switch (itemObj.str) {
              case "am":
                this.am[mapObj[index]] = {
                  num: `${itemObj.apptNum}/${itemObj.sdeptLimitNum}`,
                  flag: itemObj.apptNum === itemObj.sdeptLimitNum
                };
                break;
              case "pm":
                this.pm[mapObj[index]] = {
                  num: `${itemObj.apptNum}/${itemObj.sdeptLimitNum}`,
                  flag: itemObj.apptNum === itemObj.sdeptLimitNum
                };
                break;
              default:
                this.night[mapObj[index]] = {
                  num: `${itemObj.apptNum}/${itemObj.sdeptLimitNum}`,
                  flag: itemObj.apptNum === itemObj.sdeptLimitNum
                };
                break;
            }
          }
        });
      });
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
        let startDate = `${this.nowYear}-${this.dateList[0].nowDate} 00:00:00`;
        let stopDate = `${this.nowYear}-${this.dateList[6].nowDate} 23:59:59`;
        
        let resData = await service.getOrderNumList({
          startDate,
          stopDate,
          ouptDeptId: this.deptId,
          doctorId: this.doctorId
        });
        let timeObj = {};
        resData.data.forEach(item => {
          let dutyStartTime = item.dutyStartTime;
        });

        if (resData.code === 1) {
          // 清空原有排班
          this.resetScheduleData();
          
          let data = resData.data;
          let obj = [];
          data.forEach(item => {
            let itemObj = this.returnDate(item.dutyStartTime);
            itemObj.apptNum = item.apptNum;
            itemObj.sdeptLimitNum = item.sdeptLimitNum;
            obj.push(itemObj);
          });
          this.judgeTime(obj);
        }
        this.$hideLoading();
      } catch (error) {
        console.log(error);
        this.$hideLoading();
        this.$message.error(error.msg || "医生排班接口报错");
      }
    },
    // 日期
    getDate(dateFlag) {
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
      if (dateFlag) {
        currentDate = dateFlag;
      }
      let a = new Date(currentDate).getDay();
      for (let i = 0; i < 7; i++) {
        // 周一的时间
        let date = currentDate - a * 60 * 60 * 24 * 1000;
        this.dateList[i].week = weeks[i];
        let b = date + 60 * 60 * 24 * 1000 * (i + 1);
        this.dateList[i].nowDate = new Date(b).toLocaleStr();
      }
    },
    lastWeek() {
      // 上周时间
      this.currentDate = this.currentDate - 7 * 60 * 60 * 24 * 1000;
      this.getDate();
      this.resetScheduleData();
      this.getScheduleList();
    },
    nowWeek() {
      // 本周
      this.currentDate = new Date();
      this.getDate();
      this.resetScheduleData();
      this.getScheduleList();
    },
    nextWeek() {
      // 下周时间
      this.currentDate = this.currentDate.valueOf() + 7 * 60 * 60 * 24 * 1000;
      this.getDate();
      this.resetScheduleData();
      this.getScheduleList();
    }
  }
};
</script>
<style lang="scss" scoped>
.body-div {
  .top-con {
    .top-left {
      float: left;
      line-height: 36px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(46, 50, 58, 1);
    }
    .top-right {
      margin-right: 20px;
      float: right;
    }
  }
  .con {
    margin-right: 20px;
  }
  .block {
    float: left;
    width: 12.5%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    line-height: 68px;
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
    width: 12.5%;
    height: 68px;
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
    width: 12.5%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    padding-top: 15px;
    span {
      font-size: 14px;
      color: rgba(61, 125, 251, 1);
    }
  }
}
</style>
