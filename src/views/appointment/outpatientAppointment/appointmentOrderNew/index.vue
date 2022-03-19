<template>
  <div class="height100 width100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      :isToolBox="true"
      :hasThreeRouterFlag="false"
      :patientListShow="true"
      displayMode="expand"
      @message="messageHandler"
    >
      <template #list>
        <!-- isAppointmentOrder表示是否是挂号界面的患者列表组件 -->
        <PatientListFinance
          ref="PatientListFinance"
          @listItemClick="listItemClickHandler"
          user="appointmentOrder"
          :isAppointmentOrder="true"
        ></PatientListFinance>
      </template>
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <!-- <l-patient-card
              :patientName="mainTableData && mainTableData.patientName"
              :patientAge="mainTableData && mainTableData.age"
              :patientGender="mainTableData && mainTableData.patientGender"
            >
              <patient-basic-info
                :patientInfo="mainTableData"
              ></patient-basic-info>
            </l-patient-card> -->
            <!-- docType="1",挂号类型 -->
            <patientDetail
              :patientData="patientInfoShow"
              :detailList="detailList"
              docType="1"
              @returnConfirm="refreshData"
            ></patientDetail>
          </div>
          <div class="m-contain">
            <Main ref="Main" :patientInfo="mainTableData" @updatePatientList="updatePatientList"></Main>
          </div>
          <el-dialog
            title="收费"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            width="700px"
            @close="closeDialog"
          >
            <l-charge
              :charge="newLchrage"
              :isApptointment="true"
              @close="close"
            ></l-charge>
          </el-dialog>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions } from "vuex";

import outpatientAppointment from "@/api/appointmentNew/outpatientAppointment.js";
import service from "@/api/appointment/appointment";
import { onPreview } from "@/utils/print";

import Main from "./main.vue";
import patientDetail from "@/views/cis/prescriptionRecor/components/patientDetail.vue";
import { deepClone } from "@/utils";

/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += nowYear < 2000 ? 1900 : 0; //

//格式化日期：yyyy-MM-dd
function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return myyear + "-" + mymonth + "-" + myweekday;
}
//格式化日期：M月dd日
function formatDate2(date) {
  // var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  // if(mymonth < 10){
  //     mymonth = "0" + mymonth;
  // }
  // if(myweekday < 10){
  //     myweekday = "0" + myweekday;
  // }
  return mymonth + "月" + myweekday + "日";
}

//获得本周的开始日期
function getWeekStartDate(flag) {
  console.log(nowDay);
  console.log(nowDayOfWeek);
  var weekStartDate = new Date(
    nowYear,
    nowMonth,
    nowDay - nowDayOfWeek + flag * 1
  );
  return formatDate(weekStartDate);
}
//获得本周的开始日期
function getWeekStartDate2(flag) {
  console.log(nowDay);
  console.log(nowDayOfWeek);
  var weekStartDate = new Date(
    nowYear,
    nowMonth,
    nowDay - nowDayOfWeek + flag * 1
  );
  return formatDate2(weekStartDate);
}

export default {
  // mixins: [mixin],
  name: "appoints",
  components: {
    Main,
    patientDetail
  },
  data() {
    return {
      toolBoxs: ["appointRegisterRecord"],
      name: "",
      listLength: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 200
      },
      mainTableData: {},
      // 缴费弹窗
      dialogVisible: false,
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      },
      addarchivesStyle: false, //新建档案弹窗显示标志
      patientInfoShow: {},
      //患者信息条右侧区域
      detailList: []
    };
  },
  watch: {
    mainTableData: {
      immediate: true,
      deep: true,
      handler(a) {
        let data = deepClone(a);
        // 出生年月日 去掉时分秒，只保留年月日
        data.birthDate = data.birthDate && data.birthDate.split(" ")[0];
        data.phoneNum = data.mobileNum;
        data.medicareCard = data.patientCode;
        try {
          let addressInfo = data.addressInfo || {};
          if (
            addressInfo.hasOwnProperty("currentAddress") &&
            JSON.parse(addressInfo.currentAddress).length
          ) {
            data.address = JSON.parse(addressInfo.currentAddress);
          }
          if (a.currentProvinceCode && a.currentCityCode && a.currentRegionCode) {
            data.address = [
              Number(a.currentProvinceCode),
              Number(a.currentCityCode),
              Number(a.currentRegionCode)
            ];
          }
        } catch (error) {

        }
        this.patientInfoShow = data;
      }
    }
  },
  mounted() {
    // this.clickDate(formatDate(new Date()));
  },
  methods: {
    messageHandler() {
      this.$refs.Main.refresh();
    },
    refreshData() {
      this.$refs.PatientListFinance.search();
    },
    nextWeek() {
      console.log("this.selectedDate", this.selectedDate);
      this.thisWeekFlag = this.thisWeekFlag + 1;
      console.log(this.thisWeekFlag);
      let weekFlag = this.thisWeekFlag;
      let newList = JSON.parse(JSON.stringify(this.weekList));
      console.log("newList", newList);
      this.weekList = [];
      for (var i = 0; i < 7; i++) {
        newList[i].date = getWeekStartDate2(weekFlag * 7 + i + 1);
        newList[i].value = getWeekStartDate(weekFlag * 7 + i + 1);
        if (newList[i].value == this.selectedDate) {
          newList[i].check = true;
        } else {
          newList[i].check = false;
        }
        this.weekList.push(newList[i]);
      }
      console.log("this.weekList", this.weekList);
    },
    upWeek() {
      if (this.thisWeekFlag > 0) {
        this.thisWeekFlag = this.thisWeekFlag - 1;
        console.log(this.thisWeekFlag);
        let weekFlag = this.thisWeekFlag;
        // let newList = []
        let newList = JSON.parse(JSON.stringify(this.weekList));
        console.log("newList", newList);
        this.weekList = [];
        for (var i = 0; i < 7; i++) {
          newList[i].date = getWeekStartDate2(weekFlag * 7 + i + 1);
          newList[i].value = getWeekStartDate(weekFlag * 7 + i + 1);
          if (newList[i].value == this.selectedDate) {
            newList[i].check = true;
          } else {
            newList[i].check = false;
          }
          this.weekList.push(newList[i]);
        }
        console.log("this.weekList", this.weekList);
      } else {
        this.$message("已是本周，不能再上一周了！");
      }
    },
    async clickDate(param) {
      // clear
      this.doctorList = [];
      this.doctorCard = {};
      this.apptList = [];
      this.timeCard = {};
      this.deptSonList = [];
      this.apptDeptCode = {};

      this.selectedDate = param;
      console.log("clickDate", this.selectedDate);
      let newList = JSON.parse(JSON.stringify(this.weekList));
      this.weekList = [];
      for (var i = 0; i < 7; i++) {
        if (newList[i].value == this.selectedDate) {
          newList[i].check = true;
        } else {
          newList[i].check = false;
        }
        this.weekList.push(newList[i]);
      }
      try {
        let res = await outpatientAppointment.getApptAndDeptByDate({
          date: param
        });
        this.deptList = res.data;
        if (res.code == 1 && res.data.length == 0) {
          this.$message("未查询到门诊部门号源信息");
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
      try {
        let res = await outpatientAppointment.getDiagTreatTypeByParam({
          date: this.selectedDate,
          apptDeptCode: "",
          outpDeptId: ""
        });
        this.treatTypeList = res.data;
        this.checkList = [];
        for (var i = 0; i < this.treatTypeList.length; i++) {
          this.checkList.push(this.treatTypeList[i].diagTreatTypeCode);
        }
        if (res.code == 1 && res.data.length == 0) {
          this.$message("未查询到诊疗类型");
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    async clickDept(param) {
      // clear
      this.doctorList = [];
      this.doctorCard = {};
      this.apptList = [];
      this.timeCard = {};
      this.deptSonList = [];
      this.apptDeptCode = {};

      for (var i = 0; i < this.deptList.length; i++) {
        if (this.deptList[i].apptDeptName == param.apptDeptName) {
          this.deptList[i].check = true;
          this.deptSonList = this.deptList[i].outpDeptList;
          this.apptDeptCode = this.deptList[i].apptDeptCode;
        } else {
          this.deptList[i].check = false;
        }
      }
      try {
        let res = await outpatientAppointment.getDiagTreatTypeByParam({
          date: this.selectedDate,
          apptDeptCode: this.apptDeptCode,
          outpDeptId: ""
        });
        this.treatTypeList = res.data;
        this.checkList = [];
        for (var i = 0; i < this.treatTypeList.length; i++) {
          this.checkList.push(this.treatTypeList[i].diagTreatTypeCode);
        }
        if (res.code == 1 && res.data.length == 0) {
          this.$message("未查询到诊疗类型");
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    async clickSonDept(param) {
      // clear
      this.doctorList = [];
      this.doctorCard = {};
      this.apptList = [];
      this.timeCard = {};

      for (var i = 0; i < this.deptSonList.length; i++) {
        if (this.deptSonList[i].outpDeptName == param.outpDeptName) {
          this.deptSonList[i].check = true;
          this.outpDeptId = this.deptSonList[i].outpDeptId;
          Vue.set(this.deptSonList, i, {
            check: true,
            outpDeptId: this.deptSonList[i].outpDeptId,
            outpDeptName: this.deptSonList[i].outpDeptName
          });
        } else {
          this.deptSonList[i].check = false;
        }
      }
      try {
        let res = await outpatientAppointment.getDiagTreatTypeByParam({
          date: this.selectedDate,
          apptDeptCode: this.apptDeptCode,
          outpDeptId: this.outpDeptId
        });
        this.treatTypeList = res.data;
        this.checkList = [];
        for (var i = 0; i < this.treatTypeList.length; i++) {
          this.checkList.push(this.treatTypeList[i].diagTreatTypeCode);
        }
        if (res.code == 1 && res.data.length == 0) {
          this.$message("未查询到诊疗类型");
          return;
        }
        let params = {
          date: this.selectedDate, //日期 yyyy-MM-dd  (不要时分秒)
          apptDeptCode: this.apptDeptCode, // 门诊部门CODE
          outpDeptId: this.outpDeptId, // 科室ID
          diagTreatTypes: this.checkList, // 诊疗类型集合
          flag: this.shangwu // 上午下午标志  am 上午;pm 下午
        };
        this.getScheduleByApptParam(params);
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    handleCheckedCitiesChange(value) {
      // clear
      this.doctorList = [];
      this.doctorCard = {};
      this.apptList = [];
      this.timeCard = {};

      console.log(value);
      this.checkList = value;
      let params = {
        date: this.selectedDate, //日期 yyyy-MM-dd  (不要时分秒)
        apptDeptCode: this.apptDeptCode, // 门诊部门CODE
        outpDeptId: this.outpDeptId, // 科室ID
        diagTreatTypes: this.checkList, // 诊疗类型集合
        flag: this.shangwu // 上午下午标志  am 上午;pm 下午
      };
      this.getScheduleByApptParam(params);
    },
    amandpm(data) {
      if (data == "2") {
        this.shangwu = "pm";
      } else {
        this.shangwu = "am";
      }

      // clear
      this.doctorList = [];
      this.doctorCard = {};
      this.apptList = [];
      this.timeCard = {};

      let params = {
        date: this.selectedDate, //日期 yyyy-MM-dd  (不要时分秒)
        apptDeptCode: this.apptDeptCode, // 门诊部门CODE
        outpDeptId: this.outpDeptId, // 科室ID
        diagTreatTypes: this.checkList, // 诊疗类型集合
        flag: this.shangwu // 上午下午标志  am 上午;pm 下午
      };
      if (this.outpDeptId && this.apptDeptCode) {
        // 选了门诊部门和科室才调getScheduleByApptParam接口
        this.getScheduleByApptParam(params);
      }
    },
    async getScheduleByApptParam(params) {
      try {
        let res = await outpatientAppointment.getScheduleByApptParam(params);
        this.scheduleList = res.data;
        this.doctorList = [];
        var n = 0;
        // if(this.scheduleList.length>=this.pageDCSize){
        n = this.pageDCSize;
        // }else{
        //     n = this.scheduleList.length
        // }
        for (var i = 0; i < n; i++) {
          if (this.scheduleList[i]) {
            this.doctorList.push(this.scheduleList[i]);
          } else {
            this.doctorList.push({ flag: true }); // 无数据时，站位
          }
        }
        console.log("this.doctorList", this.doctorList);

        if (res.code == 1 && res.data.length == 0) {
          this.$message("未查询到排班信息");
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    leftDoctorCard() {
      if (this.pageDCNo <= 1) {
        this.$message("已经是第一页啦！");
        return;
      } else {
        this.pageDCNo--;
        // this.pageDCSize
        this.doctorList = [];
        for (var i = 0; i < this.pageDCSize; i++) {
          this.doctorList.push(
            this.scheduleList[(this.pageDCNo - 1) * this.pageDCSize + i]
          );
        }
      }
    },
    rightDoctorCard() {
      if (this.scheduleList.length < this.pageDCSize * this.pageDCNo) {
        this.$message("已经是最后一页啦！");
        return;
      }
      this.pageDCNo++;
      // this.pageDCSize

      var n = 0;
      // if(this.scheduleList.length>=this.pageDCSize*this.pageDCNo){
      n = this.pageDCSize;
      // }else{
      //     n = this.scheduleList.length - this.pageDCSize*(this.pageDCNo-1)
      // }

      this.doctorList = [];
      for (var i = 0; i < n; i++) {
        if (this.scheduleList[(this.pageDCNo - 1) * this.pageDCSize + i]) {
          this.doctorList.push(
            this.scheduleList[(this.pageDCNo - 1) * this.pageDCSize + i]
          );
        } else {
          this.doctorList.push({ flag: true }); // 无数据时，站位
        }
      }
    },
    async clickDoctor(item) {
      console.log("clickDoctor-doctorCard", item);
      for (var i = 0; i < this.doctorList.length; i++) {
        if (this.doctorList[i].scheduleId == item.scheduleId) {
          this.doctorList[i].check = true;
          this.doctorCard = item;
          Vue.set(this.doctorList, i, { ...item, check: true });
        } else {
          this.doctorList[i].check = false;
        }
      }
      for (var i = 0; i < this.scheduleList.length; i++) {
        if (this.scheduleList[i].scheduleId == item.scheduleId) {
          this.scheduleList[i].check = true;
          // Vue.set(this.scheduleList,i,{check:true,outpDeptId:this.scheduleList[i].outpDeptId,outpDeptName:this.scheduleList[i].outpDeptName})
        } else {
          this.scheduleList[i].check = false;
        }
      }
      // var date=new Date();
      // var hh=date.getHours();
      // var mm=date.getMinutes();
      // var ss=date.getSeconds();
      // var yy=date.getFullYear();
      // var MM=date.getMonth()+1;  //因为1月这个方法返回为0，所以加1
      // var dd=date.getDate();
      // let aaaa = new Date(yy,MM,dd,hh,mm,ss).toLocaleString()//formatDate(new Date())
      // console.log('nowTimeaaa',aaaa)
      // Date.parse(new Date("2017-02-06 10:30:50"))
      try {
        let res = await outpatientAppointment.getApptByScheduleId({
          scheduleSerialId: this.doctorCard.scheduleId
        });
        this.apptList = res.data;
        // appointmentTime
        // let aaaa = new Date(yy,MM,dd,hh,mm,ss)//.toLocaleString()//formatDate(new Date())
        // console.log('nowTimeaaa',aaaa)
        for (var i = 0; i < this.apptList.length; i++) {
          if (this.apptList[i].appointmentTime) {
            let datatime = Date.parse(
              new Date(this.apptList[i].appointmentTime)
            );
            let nowtime = Date.parse(new Date());

            console.log("datatime", datatime);
            console.log("nowtime", nowtime);
            if (datatime < nowtime || this.apptList[i].recordStatus != "99") {
              this.apptList[i].disabletime = true;
            }
          }
          Date.parse(new Date("2017-02-06 10:30:50"));
          this.apptList[i].showtime = this.apptList[
            i
          ].appointmentTime.substring(11, 16);
        }
        console.log("this.apptList", this.apptList);

        if (res.code == 1 && res.data.length == 0) {
          this.$message("未查询到排班信息");
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    clickTime(item) {
      let datatime = Date.parse(new Date(item.appointmentTime));
      let nowtime = Date.parse(new Date());
      if (datatime < nowtime) {
        this.$message("该时段已过，不可选取！");
        return;
      }
      if (item.recordStatus != "99") {
        this.$message("该时段已被占用！");
        return;
      }
      for (var i = 0; i < this.apptList.length; i++) {
        if (this.apptList[i].appointmentId == item.appointmentId) {
          this.apptList[i].check = true;
          this.timeCard = item;
          Vue.set(this.apptList, i, { ...item, check: true });
        } else {
          this.apptList[i].check = false;
        }
      }

      console.log("clickTime-timeCard", item);
    },
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    listItemClickHandler(data) {
      // clear
      // this.doctorList = [];
      // this.doctorCard = {};
      // this.apptList = [];
      // this.timeCard = {};

      // this.clickDate(formatDate(new Date()));

      console.log("listItemClickHandler", data);
      this.patientId = data.patientId;
      this.mainTableData = data;

      // this.getRegisteredList(); // //查询挂号记录

      this.changeRecPatientData(data);
    },
    //查询挂号记录
    async getRegisteredList() {
      if (this.mainTableData && !this.mainTableData.patientId) {
        this.$message.error("请先选择一个患者");
        return false;
      }
      //清空当前选中挂号记录
      this.currentRegisteredData = {};
      try {
        // this.loading1 = true;
        console.log(this.date);
        let res = await outpatientAppointment.getRegisteredList({
          patientId: this.mainTableData.patientId,
          startDate: (this.date && this.date[0]) || "",
          stopDate: (this.date && this.date[1]) || ""
        });
        this.registeredData = res.data;
        // this.loading1 = false;
        // this.$$nextTick(()=>{
        //   this.$refs.scheduleTable && this.$refs.scheduleTable.doLayout();
        // })
      } catch (error) {
        // this.loading1 = false;
        // this.$message.error(error.msg);
      }
    },
    //创建预约
    async createApptClick() {
      // this.dialogVisible = true;
      // if (!this.currentRegisteredByScheduleIdData.appointmentId) {
      //   this.$message("请先选择一条数据记录");
      //   return false;
      // }
      try {
        // this.$showLoading();
        let res = await outpatientAppointment.createAppt({
          scheduleId: this.doctorCard.scheduleId, // 排班ID
          appointmentId: this.timeCard.appointmentId, // 预约ID
          patientId: this.patientId, // 患者ID
          channel: 1, // 预约渠道
          appointType: 1, // 预约类型 0：预约 1：挂号
          isAutoAppendNum: false // 是否自动加号  (true  false   布尔类型)
        });

        //清空当前选中挂号记录
        this.currentRegisteredData = {};
        //当前选中的预约数据
        this.newLchrage.appointment = res.data;

        if (this.zddyptchecked) {
          this.printClick();
        }
        // this.$hideLoading();
        this.$message.success(res.msg || "挂号成功");

        //获取收费明细
        let ChargeRegDetail = this.getChargeRegDetail();
        // 待收费对象转换
        this.changeObj(ChargeRegDetail);

        this.dialogVisible = true;

        // this.getRegisteredList();
        // this.getApptByScheduleId();
        // this.getDeptAndNum();
        // this.getScheduleByApptDept();
      } catch (error) {
        // this.$hideLoading();
        this.$message.error(error.msg);
      }
    },

    async getChargeRegDetail() {
      let { data } = await service.getChargeRegDetail({
        birthDate: "",
        regDiagTreatType: this.newLchrage.appointment.diagTreatType,
        regWorkCode: this.newLchrage.appointment.workCode
      });
      return data;
    },
    // 收费相关对象转换
    changeObj(ChargeRegDetail) {
      let chargePrescriptions = [];
      for (let i = 0; i < ChargeRegDetail.length; i++) {
        let item = ChargeRegDetail[i];
        let obj = {
          orderName: item.chargeItemName,
          dosageUnit: item.chargeUnit,
          quantity: "1",
          price: item.chargePrice,
          orderItemId: item.chargeItemId,
          orderItemCat: item.statisticsCode,
          prescriptionSource: "9",
          num: "1",
          visitId: this.newLchrage.appointment.appointmentId,
          ouptDeptId: this.newLchrage.appointment.ouptDeptId, // 专科id
          groupId: item.groupNo, // 组号
          groupNo: item.groupNo
        };
        chargePrescriptions.push(obj);
      }
      this.newLchrage.chargePrescriptions = chargePrescriptions;
    },
    printClick() {
      let printData = {
        visitCode: this.newLchrage.appointment.visitCode,
        name: this.newLchrage.appointment.patientName,
        departName: this.newLchrage.appointment.outpDeptName,
        floors: this.newLchrage.appointment.roomLocation, //就诊地点
        visitTime: this.newLchrage.appointment.appointmentTime,
        num: "",
        doctorName: this.newLchrage.appointment.doctorName,
        roomNum: this.newLchrage.appointment.roomName,
        chargePrice: this.newLchrage.appointment.regMoney,
        chargeType: "挂号",
        visitDate: this.newLchrage.appointment.updatedAt
      };
      onPreview(printData, "挂号凭证");
    },
    cancelClick() {
      this.clickDate(formatDate(new Date()));
    },
    close() {
      this.dialogVisible = false;
      // this.newLchrage = {
      //     appointment: {}, // 预约明细
      //     chargePrescriptions: [], // 待收费明细，
      //     accountInfo: {} // 账户数据
      // };
      // this.getRegisteredList();
    },
    closeDialog() {
      // this.getRegisteredList();
    },
    updatePatientList() {
      this.$refs.PatientListFinance.choosePenetrateItem(this.$refs.PatientListFinance.currentPenetrate);
    }
  }
};
</script>

<style lang='scss' scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  .m-contain {
    height: calc(100% - 56px);
    overflow-y: auto;
    box-sizing: border-box;
  }
}
</style>
