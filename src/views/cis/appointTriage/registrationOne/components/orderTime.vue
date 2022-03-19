<template>
  <div class="order-time mar-top-20">
    <div class="order-time-con">
      <l-card-title>
        <template slot="left">挂号时间</template>
      </l-card-title>
    </div>
    <div class="con clearfix">
      <div class="width100 l-clearfix:after">
        <div class="block bgc-grey">上午</div>
        <div
          v-for="(item, index) in am"
          :key="index"
          :class="[
            all.am[index] == item ? 'full' : 'surplus',
            index == currentChoosed.index && 'am' === currentChoosed.time
              ? 'currentIndex'
              : ''
          ]"
          @click="setOrderTime('am', index, all.am[index], item)"
        >
          <el-row>
            <span class="text-color">{{ amRange[index] }}</span>
          </el-row>
          <el-row>
            <span>
              {{ all.am[index] ? (all.am[index] > item ? "预约" : "约满") : ""
              }}{{ all.am[index] ? item : ""
              }}{{ all.am[index] ? "/" + all.am[index] : "" }}
            </span>
          </el-row>
        </div>
        <!-- <div class="surplus" @click="putAddNum('am')">
          <el-row>
            <span class="jiahao-btn">加号</span>
          </el-row>
          <el-row>
            <span></span>
          </el-row>
        </div>-->
        <div class="width100 l-clearfix:after">
          <div class="block bgc-grey">下午</div>
          <div
            v-for="(item, index) in pm"
            :key="index"
            :class="[
              all.pm[index] == item ? 'full' : 'surplus',
              index == currentChoosed.index && 'pm' === currentChoosed.time
                ? 'currentIndex'
                : ''
            ]"
            @click="setOrderTime('pm', index, all.pm[index], item)"
          >
            <el-row>
              <span class="text-color">{{ pmRange[index] }}</span>
            </el-row>
            <el-row>
              <span>
                {{ all.pm[index] ? (all.pm[index] > item ? "预约" : "约满") : ""
                }}{{ all.pm[index] ? item : ""
                }}{{ all.pm[index] ? "/" + all.pm[index] : "" }}
              </span>
            </el-row>
          </div>
          <!-- <div class="surplus" @click="putAddNum('pm')">
            <el-row>
              <span class="jiahao-btn">加号</span>
            </el-row>
            <el-row>
              <span></span>
            </el-row>
          </div>-->
        </div>
        <div class="width100 l-clearfix:after">
          <div class="block bgc-grey">晚上</div>
          <div
            v-for="(item, index) in night"
            :key="index"
            :class="[
              all.night[index] == item ? 'full' : 'surplus',
              ,
              index == currentChoosed.index && 'night' === currentChoosed.time
                ? 'currentIndex'
                : ''
            ]"
            @click="setOrderTime('night', index, all.night[index], item)"
          >
            <el-row>
              <span class="text-color">{{ nightRange[index] }}</span>
            </el-row>
            <el-row>
              <span>
                {{ all.night[index] ? (all.night[index] > item ? "预约" : "约满") : ""
                }}{{ all.night[index] ? item : ""
                }}{{ all.night[index] ? "/" + all.night[index] : "" }}
              </span>
            </el-row>
          </div>
          <!-- <div class="surplus" @click="putAddNum('night')">
            <el-row>
              <span class="jiahao-btn">加号</span>
            </el-row>
            <el-row>
              <span></span>
            </el-row>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/appointment/appointment.js";

export default {
  name: "",
  props: {
    ouptDeptId: {
      type: [String, Number],
      default: ""
    },
    diagTreatType: {
      type: [String, Number],
      default: ""
    },
    doctorId: {
      type: [String, Number],
      default: ""
    },
    scheduleList: {
      type: [Array],
      default: function() {
        return [];
      }
    }
  },
  components: {},
  data() {
    return {
      am: [0, 0, 0, 0],
      pm: [0, 0, 0, 0],
      night: [0, 0, 0, 0],
      amRange: ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00"],
      pmRange: ["14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"],
      nightRange: ["18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"],
      appt: [],
      all: {
        am: [],
        pm: [],
        night: []
      },
      currentChoosed: {
        index: -1,
        time: ""
      },
      scheduleId: ""
    };
  },
  watch: {
    ouptDeptId: {
      handler(value, oldValue) {
        if (value) {
          this.getOrderList();
        }
        this.currentChoosed = {
          index: -1,
          time: ""
        };
        this.resetData();
      }
    },
    diagTreatType: {
      handler(value, oldValue) {
        this.getOrderList();

        this.resetData();
      }
    },
    doctorId: {
      handler(value, oldValue) {
        this.getOrderList();
        this.resetData();
      }
    }
  },
  mounted() {},
  methods: {
    resetData() {
      this.currentChoosed = {
        index: -1,
        time: ""
      };
    },
    async putAddNum(time) {
      if (!this.doctorId) {
        this.$message.warning("请选择医生");
      }
      let timeStr = "";
      if (time === "am") {
        timeStr = "am";
      } else if (time === "pm") {
        timeStr = "pm";
      } else if (time === "night") {
        timeStr = "night";
      }
      let itemObj = this.scheduleList.find((item, index) => {
        return (
          this.doctorId === item.doctorId &&
          this.diagTreatType === item.diagTreatType &&
          this.ouptDeptId === item.ouptDeptId &&
          this.returnHourRange(item.dutyStopTime) === timeStr
        );
      });

      this.scheduleId = itemObj.scheduleId;

      try {
        this.$showLoading();
        let resData = await service.getAddNum({
          scheduleId: this.scheduleId
        });
        this.$message({
          message: "加号成功",
          type: "success"
        });

        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "加号接口报错");
      }
    },
    returnHourRange(str) {
      let dateStr = new Date(str);
      let startStr = dateStr.valueOf();
      let hour = new Date(startStr).getHours();
      let timeStr = "";
      if (hour <= 12 && hour >= 8) {
        timeStr = "am";
      } else if (hour <= 18 && hour >= 14) {
        timeStr = "pm";
      } else {
        timeStr = "night";
      }
      return timeStr;
    },
    // eslint-disable-next-line complexity
    isClickTime(time, index) {
      let hour = new Date().getHours();
      let flag;
      if (time === "am") {
        if (index === 0) {
          flag = hour < 9;
        } else if (index === 1) {
          flag = hour < 10;
        } else if (index === 2) {
          flag = hour < 11;
        } else {
          flag = hour < 12;
        }
      } else if (time === "pm") {
        if (index === 0) {
          flag = hour < 15;
        } else if (index === 1) {
          flag = hour < 16;
        } else if (index === 2) {
          flag = hour < 17;
        } else {
          flag = hour < 18;
        }
      } else {
        if (index === 0) {
          flag = hour < 19;
        } else if (index === 1) {
          flag = hour < 20;
        } else if (index === 2) {
          flag = hour < 21;
        } else {
          flag = hour < 22;
        }
      }
      return flag;
    },
    setOrderTime(time, index, allNum, num) {
      let str = "";
      if (allNum === num) {
        return;
      }
      if (this.ouptDeptId == null) {
        this.$message.warning("请选择挂号信息");
        return;
      }
      if (!this.isClickTime(time, index)) {
        this.$message.warning("当前时间不可以挂号");
        return;
      }
      if (this.diagTreatType != "02" && this.doctorId == null) {
        this.$message.warning("非普通门诊必须选择医生");
        return;
      }
      this.currentChoosed = {
        index: index,
        time: time
      };
      if (time === "am") {
        str = this.amRange[index];
      } else if (time === "pm") {
        str = this.pmRange[index];
      } else if (time === "night") {
        str = this.nightRange[index];
      }
      let itemObj = {};
      if (this.doctorId != null) {
        itemObj = this.scheduleList.find((item, index) => {
          if (
            this.doctorId == item.doctorId &&
            this.diagTreatType == item.diagTreatType &&
            this.ouptDeptId == item.ouptDeptId &&
            this.returnHourRange(item.dutyStopTime) === time
          ) {
            return item;
          }
          return null;
        });
      }
      this.$emit("putDeteEvent", {
        schedule: itemObj,
        timeRange: str
      });
    },
    juageTime() {
      let dateStr = "";
      let startStr = "";
      let hour = "";
      // 赋初值
      this.am = [0, 0, 0, 0];
      this.pm = [0, 0, 0, 0];
      this.night = [0, 0, 0, 0];
      this.appt.forEach((item, index) => {
        dateStr = new Date(item.date);
        startStr = dateStr.valueOf();
        hour = new Date(startStr).getHours();
        let obj = this.timeRange(hour);
        if (obj.time === "am") {
          this.am[obj.range] = this.am[obj.range] + item.num;
        } else if (obj.time === "pm") {
          this.pm[obj.range] = this.pm[obj.range] + item.num;
        } else if (obj.time === "night") {
          this.night[obj.range] = this.night[obj.range] + item.num;
        }
      });
    },
    // eslint-disable-next-line complexity
    timeRange(hour) {
      let obj = {
        time: "",
        range: 0
      };
      if (hour == 8) {
        obj.time = "am";
        obj.range = 0;
      } else if (hour == 9) {
        obj.time = "am";
        obj.range = 1;
      } else if (hour == 10) {
        obj.time = "am";
        obj.range = 2;
      } else if (hour == 11) {
        obj.time = "am";
        obj.range = 3;
      } else if (hour == 14) {
        obj.time = "pm";
        obj.range = 0;
      } else if (hour == 15) {
        obj.time = "pm";
        obj.range = 1;
      } else if (hour == 16) {
        obj.time = "pm";
        obj.range = 2;
      } else if (hour == 17) {
        obj.time = "pm";
        obj.range = 3;
      } else if (hour == 18) {
        obj.time = "night";
        obj.range = 0;
      } else if (hour == 19) {
        obj.time = "night";
        obj.range = 1;
      } else if (hour == 20) {
        obj.time = "night";
        obj.range = 2;
      } else if (hour == 21) {
        obj.time = "night";
        obj.range = 3;
      }

      return obj;
    },
    // 获取不同时间段预约数据
    async getOrderList() {
      try {
        this.$showLoading();
        const hour = new Date().getHours();
        let sDate = "";
        let eDate = "";
        let dateStr =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
        sDate = `${dateStr} 00:00:00`;
        eDate = `${dateStr} 23:59:59`;
        let resData = await service.getCurrentDateList({
          sDate,
          eDate,
          ouptDeptId: this.ouptDeptId,
          diagTreatType: this.diagTreatType,
          doctorId: this.doctorId
        });
        if (resData.code === 1) {
          this.appt = [];
          let appt = resData.data.appt;
          // this.all = resData.data.all;
          this.getNum(resData.data.all);
          for (let k in appt) {
            let obj = {};
            obj.date = k;
            obj.num = appt[k];
            this.appt.push(obj);
          }
          this.juageTime();
        }
        this.$hideLoading();
      } catch (error) {
        this.$message.error(error.msg || "获取预约接口报错");
        this.$hideLoading();
      }
    },
    // 整理号源
    getNum(data) {
      let am = data.amNum;
      let pm = data.pmNum;
      let night = data.nightAdd;

      if (am % 4 == 0) {
        let a = am / 4;
        this.all.am = [a, a, a, a];
      } else {
        let b = am - am % 4;
        let c = am % 4;
        let a = b / 4;
        this.all.am = [a, a, a, a + c];
      }

      if (pm % 4 == 0) {
        let a = pm / 4;
        this.all.pm = [a, a, a, a];
      } else {
        let b = pm - pm % 4;
        let c = pm % 4;
        let a = b / 4;
        this.all.pm = [a, a, a, a + c];
      }

      if (night % 4 == 0) {
        let a = night / 4;
        this.all.night = [a, a, a, a];
      } else {
        let b = night - night % 4;
        let c = night % 4;
        let a = b / 4;
        this.all.night = [a, a, a, a + c];
      }
      console.log("all", data, this.all);
    }
  }
};
</script>

<style lang='scss' scoped>
.order-time {
  padding-left: 20px;
  .con {
    margin: 0;
  }
  .mar-top-20 {
    margin-top: 20px;
  }
  .block {
    float: left;
    width: 20%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    line-height: 68px;
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
  .jiahao-btn {
    display: inline-block;
    margin-top: 10px;
  }
  .el-button {
    border: none;
  }
  .full {
    float: left;
    width: 20%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    padding-top: 15px;
    span {
      font-size: 14px;
      color: rgba(208, 208, 208, 1);
    }
    .text-color {
      color: #2e323a;
    }
    background: rgba(245, 245, 245, 1);
  }
  .surplus {
    float: left;
    width: 20%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    padding-top: 15px;
    cursor: pointer;
    span {
      font-size: 14px;
      color: rgba(61, 125, 251, 1);
    }
    .text-color {
      color: #2e323a;
    }
  }
  .currentIndex {
    color: #fff;
    background-color: #ff6a00;
    span {
      color: #fff;
    }
  }
}
</style>
