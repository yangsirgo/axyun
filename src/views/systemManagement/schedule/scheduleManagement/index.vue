
<!--- 
  旧版界面 准备删掉
  2020/06/05
  shaokang
 ----->

<template>
  <div class="management">
    <copy-lastweek
      :appointEndWeek="appointEndWeek"
      @copyWeekSchedule="copyWeekSchedule"
      @initData="initData"
      :copyType="copyType"
      :copytitle="copytitle"
      ref="lastweek"
    />
    <publish-dialog @publishSchedule="publishSchedule" ref="diglog"></publish-dialog>
    <success-message ref="save" :message="savamessage" />
    <el-card class="management-card">
      <div slot="header" class="clearfix">
        <el-button @click="copyWeek" type="text">复制上周</el-button>
        <el-button @click="copyAppointWeek" style="width: 124px" type="text">复制指定周次</el-button>
        <div class="right-area">
          <l-formt-title label="最小诊疗时间" labelWidth="64">
            <el-select clearable v-model="minDiagnosisTime" placeholder="请选择">
              <el-option label="5分钟" :value="5"></el-option>
              <el-option label="10分钟" :value="10"></el-option>
            </el-select>
          </l-formt-title>
          <el-button v-if="false" @click="opentips" class="publish" type="text">发布排班</el-button>
          <el-button @click="saveSchedule" type="text">保存排班</el-button>
        </div>
      </div>
      <el-container>
        <el-main>
          <div class="table-box">
            <div class="departments">
              <l-value-domain
                remoteUrl="/appointment/doctorSchedule/getDept"
                type="select"
                :value.sync="departId"
                remoteShowKey="deptName"
                remoteValueKey="deptId"
                placeholder="请选择科室"
                defaultFirst
                @change="departChange"
              ></l-value-domain>
            </div>
            <div class="chooseWeek">
              <el-button class="lastWeek" icon="el-icon-arrow-left" @click="lastclick">上一周</el-button>
              <div class="dateRange">第{{ weekIndex + 1 }}周 {{ startDate }}至{{ endDate }}</div>
              <el-button class="nextWeek" @click="nextclick">
                下一周
                <i class="el-icon-arrow-right el-icon--right"></i>
              </el-button>
            </div>
            <table class="weekday" style="width:100%" border="0" cellspacing="1" bgcolor="#E4E4E4">
              <caption></caption>
              <tr>
                <th scope="col" style="width:273px">
                  <div class="full-doctors">
                    <el-checkbox
                      :indeterminate="isIndeterminate"
                      v-model="checkAll"
                      class="checkname"
                      @change="handleCheckAllChange"
                    >出诊医生</el-checkbox>
                  </div>
                </th>
                <th scope="col" v-for="(item, index) in myWeekArray" :key="index">
                  <span>{{ item | getWeekFormat }}</span>
                </th>
              </tr>
              <tr v-for="(item, indexs) in doctors" :key="indexs">
                <td class="doctor-name">
                  <el-checkbox
                    @change="handleSingleCheckChange"
                    v-model="item.checked"
                    class="checkname"
                  >{{ item.doctorName }}-[{{ item.workCode }}]</el-checkbox>
                  <p class="morning">上午</p>
                  <p class="afternoon">下午</p>
                  <p class="evening">晚上</p>
                </td>
                <td v-for="(item1, index) in 7" :key="index">
                  <div v-if="doctors[indexs].swList[index]">
                    <el-cascader
                      :class="{
                        type1: doctors[indexs].swList[index].type == '02',
                        type2: doctors[indexs].swList[index].type == '03',
                        type3: doctors[indexs].swList[index].type == '3'
                      }"
                      v-model="doctors[indexs].swList[index].value"
                      placeholder="请选择门诊类型"
                      class="choose-menu1"
                      :options="options"
                      :props="{ expandTrigger: 'hover' }"
                      clearable
                      @change="handleChange($event,'sw', index, indexs)"
                    ></el-cascader>
                  </div>
                  <div v-if="doctors[indexs].xwList[index]">
                    <el-cascader
                      :class="{
                        type1: doctors[indexs].xwList[index].type == '02',
                        type2: doctors[indexs].xwList[index].type == '03',
                        type3: doctors[indexs].xwList[index].type == '3'
                      }"
                      v-model="doctors[indexs].xwList[index].value"
                      placeholder="请选择门诊类型"
                      class="choose-menu2"
                      :options="options"
                      clearable
                      :props="{ expandTrigger: 'hover' }"
                      @change="handleChange($event,'xw', index, indexs)"
                    ></el-cascader>
                  </div>
                  <div v-if="doctors[indexs].wsList[index]">
                    <el-cascader
                      :class="{
                        type1: doctors[indexs].wsList[index].type == '02',
                        type2: doctors[indexs].wsList[index].type == '03',
                        type3: doctors[indexs].wsList[index].type == '3'
                      }"
                      v-model="doctors[indexs].wsList[index].value"
                      placeholder="请选择门诊类型"
                      class="choose-menu3"
                      :options="options"
                      clearable
                      :props="{ expandTrigger: 'hover' }"
                      @change="handleChange($event, 'ws', index, indexs)"
                    ></el-cascader>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
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
import publishDialog from "./components/PublishDialog";
import copyLastweek from "./components/CopyLastWeek";
import successMessage from "@/views/systemManagement/components/SuccessMessage";
import { deepClone } from "@/utils/index.js";
import sceduleApi from "@/api/schedule/scheduleManagement.js";
import service from "@/api/appointment/appointment.js";

export default {
  name: "scheduleManagement",
  components: {
    publishDialog,
    copyLastweek,
    successMessage
  },
  data() {
    return {
      currentYear: 1970, // 年份
      currentMonth: 1, // 月份
      currentDay: 1, // 日期
      currentWeek: 1, // 星期
      savamessage: "保存排班成功",
      copytitle: "复制上周排班",
      copyType: "lastweek",
      checkAll: false,
      isIndeterminate: false, //总checkBox
      minDiagnosisTime: 5, //最小诊疗时间(分钟)
      // {
      //     doctorName: "郑医生",
      //     doctorId: "00000123",
      //     deptId: "69",
      //     workCode: "01",
      //     checked: false,
      //     swList: [],
      //     xwList: [],
      //     wsList: []
      //   }
      doctors: [],
      currentFirstDate: "",
      clen: 7,
      weekDayArr: [],
      lastWeekDayArr: [],
      myDateToWeek: "",
      outpatientType: "选择门诊类型",
      choosedListMorning: [],
      choosedListAfternoon: [],
      choosedListEvening: [],
      departId: "", //科室Id
      saveScheduleList: [], //执行保存时的排班数据
      receiveScheduleList: [], //接受查询到的排班数据
      copyFormTimeRange: {}, //从哪个周复制排班的日期范围
      copyToTimeRange: {}, //复制排班到哪个周日期范围
      copyFormWeekEvery: [],
      options: [
        {
          value: "02",
          label: "普通门诊",
          children: []
        },
        {
          value: "03",
          label: "专家门诊",
          children: []
        },
        {
          value: "0",
          label: "取消出诊"
        }
      ]
    };
  },
  filters: {
    getWeekFormat(date) {
      const weeksObj = {
        1: "星期一",
        2: "星期二",
        3: "星期三",
        4: "星期四",
        5: "星期五",
        6: "星期六",
        0: "星期日"
      };
      let weekNumber = new Date(Date.parse(date.replace(/\-/g, "/"))).getDay();
      return `${date} ${weeksObj[weekNumber]}`;
    }
  },
  computed: {
    //处理后的每周日期数组YY-MM-DD
    myWeekArray() {
      return this.weekDayArr.map(item => {
        return item.toISOString().slice(0, 10);
      });
    },
    sdeptLimitNum() {
      return 240 / this.minDiagnosisTime;
    },
    appointEndWeek() {
      return this.myWeekArray[1];
    },
    //当前周是一年的第几周
    weekIndex() {
      return this.startDate.weekIndexInYear();
    },
    //每周开始日期
    startDate() {
      return this.myWeekArray[0];
    },
    //每周结束日期
    endDate() {
      return this.myWeekArray[6];
    }
  },
  created() {
    this.createStartData();
    this.initData(null);
  },
  mounted() {
    this.getDoctorList(this.startDate, this.endDate, true);
  },
  methods: {
    // 科室切换
    departChange(data) {
      this.departId = data;
      this.getDoctorList(this.startDate, this.endDate, true);
    },
    async getAllRoomsList() {
      try {
        let resData = await sceduleApi.getAllRoomsList({
          deptId: this.departId
        });
        let roomList = [];
        if (resData.code === 1 && resData.data) {
          roomList = resData.data.map(item => {
            return {
              label: item.roomName,
              value: item.roomId
            };
          });
        }
        this.options[0].children = roomList;
        this.options[1].children = roomList;
      } catch (error) {
        console.log(error);
        this.$message.error(error.msg || "查询诊室接口报错");
      }
    },
    handleChange(data, time, index, indexs) {
      let itemChoosed;
      if (time === "sw") {
        itemChoosed = this.doctors[indexs].swList.find(item => {
          return item.index === index;
        });
      } else if (time === "xw") {
        itemChoosed = this.doctors[indexs].xwList.find(item => {
          return item.index === index;
        });
      } else {
        itemChoosed = this.doctors[indexs].wsList.find(item => {
          return item.index === index;
        });
      }

      if (itemChoosed.seted) {
        if (data.length == 0) {
          itemChoosed.deled = true;
          itemChoosed.type = "0";
        } else {
          itemChoosed.deled = false;
          itemChoosed.type = data[0];
        }
      } else {
        itemChoosed.type = data[0] || "0";
      }
      console.log("-----itemChoosed-----", itemChoosed, this.doctors[indexs]);
    },
    //处理排班类型变化
    handleTypeChange(command, node) {
      let { indexs, index, time } = node.$attrs;
      let itemChoosed;
      if (time === "sw") {
        itemChoosed = this.doctors[indexs].swList.find(item => {
          return item.index === index;
        });
      } else if (time === "xw") {
        itemChoosed = this.doctors[indexs].xwList.find(item => {
          return item.index === index;
        });
      } else {
        itemChoosed = this.doctors[indexs].wsList.find(item => {
          return item.index === index;
        });
      }
      itemChoosed.type = command;
    },
    //根据科室ID查询其下的医生
    async getDoctorList(startDate, endDate, isCopyWeek) {
      try {
        if (!this.departId) {
          return;
        }
        this.$showLoading();
        let response = await service.getDoctorListByDeptId(this.departId);
        let doctors = [];
        if (response.code == 1 && response.data.length) {
          for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            doctors.push({
              doctorName: element.uname,
              doctorId: element.uid,
              ouptDeptId: this.departId,
              workCode: "1737",
              checked: false,
              swList: deepClone(this.choosedListMorning),
              xwList: deepClone(this.choosedListAfternoon),
              wsList: deepClone(this.choosedListEvening)
            });
          }
        }
        this.receiveScheduleList = doctors;
        this.getScheduleListData(startDate, endDate, isCopyWeek);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "查询医生列表失败");
      }
    },
    //获取医生排班信息
    getScheduleListData(startDate, endDate, isCopyWeek) {
      let params = {
        ouptDeptId: this.departId,
        startDate: startDate + " " + "00:00:00",
        stopDate: endDate + " " + "23:59:59"
      };
      let _this = this;
      sceduleApi.getScheduleList(params).then(res => {
        console.log(res, "getScheduleListData");
        let Data = res.data;
        var obj = {};
        // if (Data) {
        //   _this.receiveScheduleList = Data.reduce((item, next) => {
        //     obj[next.doctorId]
        //       ? ""
        //       : (obj[next.doctorId] =
        //           true &&
        //           item.push({
        //             // doctorName: next.doctorName,
        //             // doctorId: next.doctorId,
        //             // deptId: next.deptId,
        //             // workCode: next.workCode,
        //             // scheduleId: next.scheduleId,
        //             ...next,
        //             checked: false,
        //             swList: deepClone(_this.choosedListMorning),
        //             xwList: deepClone(_this.choosedListAfternoon),
        //             wsList: deepClone(_this.choosedListEvening)
        //           }));
        //     return item;
        //   }, []);
        // }

        for (let i = 0; i < Data.length; i++) {
          for (let j = 0; j < _this.receiveScheduleList.length; j++) {
            if (_this.receiveScheduleList[j].doctorId == Data[i].doctorId) {
              let weekDayIndex = -1;
              if (isCopyWeek) {
                weekDayIndex = _this.myWeekArray.indexOf(
                  Data[i].dutyStartTime.slice(0, 10)
                );
              } else {
                weekDayIndex = _this.copyFormWeekEvery.indexOf(
                  Data[i].dutyStartTime.slice(0, 10)
                );
              }
              if (
                Data[i].dutyStartTime.slice(-8, -6) == "08" &&
                weekDayIndex !== -1
              ) {
                _this.receiveScheduleList[j].swList[weekDayIndex] = {
                  type: Data[i].diagTreatType,
                  value: [Data[i].diagTreatType, Data[i].roomId],
                  index: weekDayIndex,
                  scheduleId: isCopyWeek ? Data[i].scheduleId : undefined,
                  seted: true,
                  time: "sw"
                };
              } else if (
                Data[i].dutyStartTime.slice(-8, -6) == "12" &&
                weekDayIndex !== -1
              ) {
                _this.receiveScheduleList[j].xwList[weekDayIndex] = {
                  type: Data[i].diagTreatType,
                  value: [Data[i].diagTreatType, Data[i].roomId],
                  index: weekDayIndex,
                  scheduleId: isCopyWeek ? Data[i].scheduleId : undefined,
                  seted: true,
                  time: "xw"
                };
              } else if (
                Data[i].dutyStartTime.slice(-8, -6) == "18" &&
                weekDayIndex !== -1
              ) {
                _this.receiveScheduleList[j].wsList[weekDayIndex] = {
                  type: Data[i].diagTreatType,
                  value: [Data[i].diagTreatType, Data[i].roomId],
                  index: weekDayIndex,
                  scheduleId: isCopyWeek ? Data[i].scheduleId : undefined,
                  seted: true,
                  time: "ws"
                };
              }
              break;
            }
          }
        }
        _this.doctors = deepClone(_this.receiveScheduleList);
      });

      this.getAllRoomsList();
    },
    //创建初始数据
    createStartData() {
      for (let j = 0; j < 7; j++) {
        this.choosedListMorning.push({
          type: "0",
          index: j,
          time: "sw" //上午
        });
        this.choosedListAfternoon.push({
          type: "0",
          index: j,
          time: "xw" //下午
        });
        this.choosedListEvening.push({
          type: "0",
          index: j,
          time: "ws" //晚上
        });
      }
      this.doctors.forEach(item => {
        item.swList = deepClone(this.choosedListMorning);
        item.xwList = deepClone(this.choosedListAfternoon);
        item.wsList = deepClone(this.choosedListEvening);
      });
    },
    //复制上周排班
    copyWeek() {
      this.copytitle = "复制上周排班";
      this.copyType = "lastweek";
      this.$refs.lastweek.isShowCopy = true;
    },
    //复制指定周次排班
    copyAppointWeek() {
      this.copytitle = "复制指定周次排班";
      this.copyType = "appointweek";
      this.$refs.lastweek.isShowCopy = true;
    },
    //发布排班
    opentips() {
      this.$refs.diglog.openDialog();
    },
    //保存排班
    saveSchedule() {
      let _this = this;
      this.$confirm("保存排班?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.savamessage = "保存排班成功";
          this.dealWithSchedule();
          sceduleApi.saveScheduleList(_this.saveScheduleList).then(res => {
            if (res.code == 1) {
              this.$refs.save.isOpen = true;
              setTimeout(() => {
                this.$refs.save.isOpen = false;
              }, 1000);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存排班"
          });
        });
    },
    dealWithSchedule() {
      let _this = this;
      this.saveScheduleList = [];
      this.doctors.map((item, index) => {
        if (item.checked) {
          let BaseData = {
            // deptId: item.deptId,
            // doctorId: item.doctorId,
            // doctorName: item.doctorName,
            // workCode: item.workCode,
            // ouptDeptId: item.ouptDeptId,
            ...item,
            sdeptLimitNum: _this.sdeptLimitNum
          };
          // doctorId,
          // doctorName,
          // ouptDeptId, // 挂号科室id
          // diagTreatType , // 诊疗类型
          // roomId, // 诊室id
          // dutyStopTime, // 排班结束时间
          // dutyStartTime,
          // sdeptLimitNum, // 号源数量 40
          // deptId , // 医生的科室id
          if (item.scheduleId) {
            BaseData.scheduleId = item.scheduleId;
          }
          item.swList.map((item, index) => {
            if (item.type != "0" || item.seted) {
              _this.saveScheduleList.push({
                ...BaseData,
                roomId: item.value[1],
                scheduleId: item.scheduleId,
                deptId: _this.departId,
                deletedStatus: item.deled ? "1" : "0",
                diagTreatType: item.type,
                dutyStartTime: _this.myWeekArray[index] + " " + "08:00:00",
                dutyStopTime: _this.myWeekArray[index] + " " + "12:00:00"
              });
            }
          });
          item.xwList.map((item, index) => {
            if (item.type != "0" || item.seted) {
              _this.saveScheduleList.push({
                ...BaseData,
                roomId: item.value[1],
                scheduleId: item.scheduleId,
                deptId: _this.departId,
                deletedStatus: item.deled ? "1" : "0",
                diagTreatType: item.type,
                dutyStartTime: _this.myWeekArray[index] + " " + "12:00:00",
                dutyStopTime: _this.myWeekArray[index] + " " + "18:00:00"
              });
            }
          });
          item.wsList.map((item, index) => {
            if (item.type != "0" || item.seted) {
              _this.saveScheduleList.push({
                ...BaseData,
                roomId: item.value[1],
                scheduleId: item.scheduleId,
                deptId: _this.departId,
                deletedStatus: item.deled ? "1" : "0",
                diagTreatType: item.type,
                dutyStartTime: _this.myWeekArray[index] + " " + "18:00:00",
                dutyStopTime: _this.myWeekArray[index] + " " + "23:30:00"
              });
            }
          });
        }
      });
    },
    //发布排班
    publishSchedule() {
      this.dealWithSchedule();
      this.savamessage = "排班发布成功";
      console.log("-------", this.saveScheduleList, this.doctors);
      // TODO
      // sceduleApi.releaseScheduleList(this.saveScheduleList).then(res => {
      //   if (res.code == 1) {
      //     this.$refs.save.isOpen = true;
      //     setTimeout(() => {
      //       this.$refs.save.isOpen = false;
      //     }, 1000);
      //   }
      // });
    },
    //处理所有checkBox切换
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
      this.doctors.forEach(item => {
        item.checked = val;
      });
    },
    //处理单个checkBox切换
    handleSingleCheckChange(value) {
      let checkedCount = 0;
      this.doctors.map(item => {
        if (item.checked) {
          checkedCount++;
        }
      });
      this.checkAll = checkedCount === this.doctors.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.doctors.length;
    },
    //获取今天是一年中的第几周
    // weekIndex() {
    // return this.myWeekArray[0].weekIndexInYear();
    // },
    // 日期格式处理
    formatDate(year, month, day) {
      const y = year;
      let m = month;
      if (m < 10) m = `0${m}`;
      let d = day;
      if (d < 10) d = `0${d}`;
      return `${y}-${m}-${d}`;
    },
    //获取当前周的日期数组
    initData(cur) {
      let date = "";
      if (cur) {
        date = new Date(cur);
      } else {
        date = new Date();
      }
      this.currentDay = date.getDate(); // 今日日期 几号
      this.currentYear = date.getFullYear(); // 当前年份
      this.currentMonth = date.getMonth() + 1; // 当前月份
      this.currentWeek = date.getDay(); // 1...6,0  // 星期几
      if (this.currentWeek === 0) {
        this.currentWeek = 7;
      }
      const str = this.formatDate(
        this.currentYear,
        this.currentMonth,
        this.currentDay
      ); // 今日日期 年-月-日
      this.weekDayArr.length = 0;
      // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
      // 今天
      for (let i = this.currentWeek - 1; i >= 0; i -= 1) {
        const d = new Date(str);
        d.setDate(d.getDate() - i);
        this.weekDayArr.push(d);
      }
      // 这个星期
      for (let i = 1; i <= 7 - this.currentWeek; i += 1) {
        const d = new Date(str);
        d.setDate(d.getDate() + i);
        this.weekDayArr.push(d);
      }
    },
    //上一周
    lastclick() {
      this.checkAll = false;
      const d = this.weekDayArr[0]; // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() - 7);
      this.initData(d);
      this.getDoctorList(this.startDate, this.endDate, true);
    },
    //下一周
    nextclick() {
      this.checkAll = false;
      const d = this.weekDayArr[6]; // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() + 7);
      this.initData(d);
      this.getDoctorList(this.startDate, this.endDate, true);
    },
    //根据日期获取该日期所在周的星期一到星期天的日期
    getFullWeekStartEnd(date) {
      let oneDayTime = 24 * 60 * 60 * 1000;
      let now = new Date(date);
      let nowTime = now.getTime();
      let day = now.getDay();
      this.copyFormWeekEvery = [];
      if (day == 0) {
        for (let i = 0; i < 7; i++) {
          this.copyFormWeekEvery.push(
            (new Date(date) - i * oneDayTime).toISOString().slice(0, 10)
          );
        }
      } else {
        for (let j = 1; j < 8; j++) {
          this.copyFormWeekEvery.push(
            new Date(nowTime + (j - day) * oneDayTime)
              .toISOString()
              .slice(0, 10)
          );
        }
      }
    },
    //复制周次排班
    copyWeekSchedule(date) {
      this.getFullWeekStartEnd(date);
      this.getDoctorList(
        this.copyFormWeekEvery[0],
        this.copyFormWeekEvery[6],
        false
      );
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-dropdown-link {
  position: relative;
  width: 100%;
  height: 100%;
  display: inline-block;
  span {
    position: absolute;
    left: 20px;
  }
  i {
    position: absolute;
    display: inline-block;
    right: 20px;
    top: 11px;
  }
}

/deep/ .el-card__body {
  height: calc(100% - 73px);
  .el-container {
    height: 100%;
    .el-main {
      height: 100%;
    }
  }
}
.management {
  height: 100%;
  .management-card {
    height: 100%;
    .clearfix {
      .right-area {
        position: relative;
        float: right;
        display: inline-block;
        width: auto;
        &::before {
          content: "每位患者的最少诊疗时间";
          font-size: 8px;
          color: $l-color-primary;
          position: absolute;
          bottom: -15px;
          left: 11px;
        }
        .l-input-wrap {
          width: 200px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
      .el-button {
        width: 80px;
        height: 36px;
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid $l-color-primary;
        font-size: $l-font-size;
        font-weight: 400;
        &.publish {
          background-color: $l-color-primary;
          color: #fff;
        }
      }
    }
    .el-main {
      padding: 0;
    }
  }
}
//mana-aside
.departments {
  text-align: center;
  height: 76px;
  width: 277px;
  display: inline-block;
  font-size: 18px;
  font-weight: $l-font-weight;
  background-color: #fff;
  padding: 0 20px;
  border-right: 1px solid $l-color-bgcolor-11;
  border-left: 1px solid $l-color-bgcolor-11;
  .l-setting {
    cursor: pointer;
    @include l-center-vertical;
  }
}
.full-doctors {
  height: 62px;
  width: 273px;
  padding-left: 19px;
  line-height: 62px;
  background-color: #fff;
  text-align: left;
  .el-checkbox {
    float: left;
    font-size: 14px;
    font-weight: bold;
    color: $l-color-fontcolor-3;
  }
}
.doctor-name {
  height: 132px;
  width: 273px;
  padding-left: 20px;
  label.el-checkbox {
    float: left;
    margin-left: 20px;
    font-size: 14px;
    font-weight: bold;
    color: $l-color-fontcolor-3;
  }
  p {
    position: absolute;
    right: 10px;
    line-height: 20px;
    font-size: $l-font-size;
    font-weight: 400;
    color: #d4d4d4;
  }
  .morning {
    top: 18px;
  }
  .afternoon {
    bottom: 57px;
  }
  .evening {
    bottom: 18px;
  }
}
.table-box {
  height: 100%;
  .chooseWeek {
    position: relative;
    height: 75px;
    width: calc(100% - 277px);
    float: right;
    .el-button {
      position: absolute;
      top: 20px;
      width: 82px;
      height: 36px;
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
      padding: 10px;
      color: $l-color-fontcolor-3;
    }
    .lastWeek {
      left: 20px;
    }
    .nextWeek {
      right: 20px;
    }
    .dateRange {
      cursor: pointer;
      @include l-center;
      position: absolute;
      font-size: 18px;
      font-weight: $l-font-weight;
      color: $l-color-fontcolor-3;
      line-height: 18px;
      padding: 0 10px;
      border-left: 2px solid $l-color-bgcolor-11;
      border-right: 2px solid $l-color-bgcolor-11;
    }
  }
  table.weekday {
    th {
      height: 61px;
      background-color: $l-color-bgcolor-18;
      font-size: $l-font-size;
      color: $l-color-fontcolor-3;
      font-weight: 400;
    }
    td {
      position: relative;
      height: 132px;
      padding: 0;
      background-color: #fff;
      text-align: center;
      .choose-menu1,
      .choose-menu2,
      .choose-menu3 {
        cursor: pointer;
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-weight: $l-font-weight;
        color: #d4d4d4;
        background-color: $l-color-bgcolor-18;
        position: absolute;
        left: 0;
      }
      /deep/ .choose-menu1 .el-input__inner,
      /deep/ .choose-menu2 .el-input__inner,
      /deep/ .choose-menu3 .el-input__inner {
        background-color: $l-color-bgcolor-18;
      }

      .choose-menu1 {
        top: 6px;
      }
      .choose-menu2 {
        bottom: 48px;
      }
      .choose-menu3 {
        bottom: 9px;
      }
      .type1 {
        background-color: $l-color-bgcolor-20;
        color: $l-color-fontcolor-2;
      }
      .type2 {
        background-color: $l-color-bgcolor;
        color: $l-color-border-6;
      }
      .type3 {
        background-color: $l-color-bgcolor-12;
        color: $l-color-primary;
      }
      /deep/ .type1 .el-input__inner {
        background-color: $l-color-bgcolor-20;
        color: $l-color-fontcolor-2;
      }
      /deep/ .type2 .el-input__inner {
        background-color: $l-color-bgcolor;
        color: $l-color-border-6;
      }
      /deep/ .type3 .el-input__inner {
        background-color: $l-color-bgcolor-12;
        color: $l-color-primary;
      }
    }
  }
  /deep/ .el-input__inner {
    border: 0px solid #fff;
    border-radius: 0;
  }
}
</style>
