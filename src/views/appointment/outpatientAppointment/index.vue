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
        <PatientListFinance @listItemClick="listItemClickHandler"></PatientListFinance>
      </template>
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <l-patient-card
                :patientName="mainTableData&&mainTableData.patientName"
                :patientAge="mainTableData&&mainTableData.age"
                :patientGender="mainTableData&&mainTableData.patientGender"
            >
                <patient-basic-info :patientInfo="mainTableData"></patient-basic-info>
                <!-- <div class="moneyTitle">
                代缴费金额合计：
                <span class="money">{{formatNumber(allWaitPrice)}}元</span>
                </div> -->
            </l-patient-card>
          </div>
          <div class="m-contain">
            <div class="top-con height100">
              <div class="top-con-tab height100 padding12px" style="position: relative;">
                <l-card-title style="margin:8px 0px;">
                <template #left>
                    预约挂号
                </template>
                </l-card-title>
                <div style="border: #E3E3E3 solid 1px;width:100%;">
                    <div style="display:flex;width:100%;min-height: 50px;border-bottom: #f0f0f0 solid 1px;">
                        <div style="width: 78px;background-color: #f1f4f6;border-right: #E3E3E3 solid 1px;font-size:14px;display:flex;justify-content: center;align-items: center;">
                            预约日期
                        </div>
                        <div style="display:flex;align-items: center;padding: 10px 20px;flex:1;justify-content: space-evenly;">
                            <div style="display:flex;align-items: center;justify-content: center;color: #2E323A;cursor:pointer"
                            @click="upWeek">
                                <i class="iconfont el-icon-arrow-left"></i>
                                <div>上一周</div>
                            </div>
                            <div style="display:flex;align-items: center;justify-content: center;margin: 10px;cursor:pointer"
                                v-for="(item, index) in weekList" :key="index" @click="clickDate(item.value)">
                                <div style="padding:5px;" :class="[ item.check?'date-card-selected': 'date-card-select' ]">
                                    <div style="display:flex;align-items: center;justify-content: center;fonst-size:12px;height:18px;">{{item.date}}</div>
                                    <div style="display:flex;align-items: center;justify-content: center;fonst-size:12px;height:18px;">{{item.week}}</div>
                                </div>
                            </div>
                            <div style="display:flex;align-items: center;justify-content: center;color: #2E323A;cursor:pointer"
                            @click="nextWeek">
                                <div>下一周</div>
                                <i class="iconfont el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;width:100%;min-height: 50px;border-bottom: #f0f0f0 solid 1px;">
                        <div style="width: 78px;background-color: #f1f4f6;border-right: #E3E3E3 solid 1px;font-size:14px;display:flex;justify-content: center;align-items: center;">
                            科室
                        </div>
                        <div style="padding: 10px 20px;font-size: 14px;flex:1;">
                            <div style="display:flex;align-items: center;justify-content: space-evenly;">
                                <div style="line-height: 20px;padding:10px;cursor:pointer;" :class="[ item.check?'dept-selected': 'dept-select' ]"
                                    v-for="(item, index) in deptList" :key="index" @click="clickDept(item)">{{item.apptDeptName}}
                                    <i class="iconfont el-icon-arrow-up" v-if="item.check"></i>
                                    <i class="iconfont el-icon-arrow-down" v-else></i>
                                </div>
                            </div>
                            <div style="display:flex;align-items: center;">
                                <div style="line-height: 20px;padding:10px;cursor:pointer;" :class="[ item.check?'dept-son-selected': 'dept-son-select' ]"
                                    v-for="(item, index) in deptSonList" :key="index" @click="clickSonDept(item)">{{item.outpDeptName}}</div>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;width:100%;min-height: 50px;">
                        <div style="width: 78px;background-color: #f1f4f6;border-right: #E3E3E3 solid 1px;font-size:14px;display:flex;justify-content: center;align-items: center;">
                            诊疗类型
                        </div>
                        <div style="display:flex;align-items: center;padding: 10px 20px;">
                            <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="(item, index) in treatTypeList" :label="item.diagTreatTypeCode" :key="index">{{item.diagTreatTypeName}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div style="background-color:#f1f4f6;width:100%;height:36px;display:flex;align-items: center;justify-content: center;margin-top:12px;font-size:14px;"
                    v-if="shangwu == 'am'">
                    <div style="height:28px;display:flex;align-items: center;justify-content: center;width:49%;background-color:#ffffff;color:#2B4583;font-weight:600;cursor:pointer;" @click="amandpm(1)">
                        上午
                    </div>
                    <div style="height:28px;display:flex;align-items: center;justify-content: center;width:49%;cursor:pointer;" @click="amandpm(2)">
                        下午
                    </div>
                </div>
                <div style="background-color:#f1f4f6;width:100%;height:36px;display:flex;align-items: center;justify-content: center;margin-top:12px;font-size:14px;"
                    v-if="shangwu == 'pm'">
                    <div style="height:28px;display:flex;align-items: center;justify-content: center;width:49%;cursor:pointer;" @click="amandpm(1)">
                        上午
                    </div>
                    <div style="height:28px;display:flex;align-items: center;justify-content: center;width:49%;background-color:#ffffff;color:#2B4583;font-weight:600;cursor:pointer;" @click="amandpm(2)">
                        下午
                    </div>
                </div>
                <l-card-title style="margin:8px 0px;">
                <template #left>
                    <div style="display:flex;align-items: center;">
                        出诊医师
                        <div style="margin-left:20px;font-size:12px;display:flex;align-items: center;justify-content: center;">
                            <div style="width: 8px;height: 8px;background-color:#d8d8d8;border-radius: 50%;"></div>
                            <div style="margin-left:3px;color:#949DA3;">已占用号源</div>
                        </div>
                        <div style="margin-left:20px;font-size:12px;display:flex;align-items: center;justify-content: center;">
                            <div style="width: 8px;height: 8px;background-color:#2B4583;border-radius: 50%;"></div>
                            <div style="margin-left:3px;color:#949DA3;">剩余号源</div>
                        </div>
                    </div>
                </template>
                </l-card-title>
                <div style="display:flex;align-items: center;justify-content: space-between;padding: 10px 20px;width:100%;" v-if="scheduleList.length>0">
                    <div style="display:flex;align-items: center;justify-content: center;color: #2E323A;cursor:pointer" @click="leftDoctorCard">
                        <i class="iconfont el-icon-arrow-left"></i>
                    </div>
                    <div v-for="(item, index) in doctorList" :key="index">
                        <div style="cursor:pointer;width:190px;height:96px;border-radius: 4px;padding:12px;color: #2E323A;" v-if="!item.flag"
                            :class="[ item.check?'doctor-card-selected': 'doctor-card-select' ]" @click="clickDoctor(item)">
                            <div style="display:flex;align-items: center;justify-content: center;">
                                <div style="width: 48px;height: 48px;border-radius: 50%;" :class="[ item.check?'doctor-img-selected': 'doctor-img-select' ]"></div>
                                <div style="margin-left:8px">
                                    <div style="display:flex;align-items: center;">
                                        <div style="font-size: 16px;margin-right:4px;">{{item.doctorName}}</div>
                                        <div style="background-color:rgba(43,69,131,0.1);padding: 1px 4px;display:flex;align-items: center;justify-content: center;">
                                        <div style="color:#2B4583;">
                                            <span
                                                :val="item.diagTreatType"
                                                code="DIAG_TREAT_TYPE"
                                                v-codeTransform
                                                ></span>
                                            </div>

                                        </div>
                                    </div>
                                    <div style="display:flex;align-items: center;line-height:22px;">
                                        <div style="font-size:14px;color:#949DA3;">
                                            <span
                                            :val="item.workCode"
                                            code="doctorProfessionalTitle"
                                            v-codeTransform
                                            ></span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div style="display:flex;align-items: center;justify-content: center;margin-top:8px;">
                                <div style="height:16px;width:164px;display:flex;">
                                    <div style="height:16px;width:103px;background-color:#D8D8D8;border-radius: 4px 0px 0px 4px;display:flex;align-items: center;justify-content: center;font-size: 12px;font-weight: 700;color:#ffffff;">{{item.allUsedNum}}</div>
                                    <div style="height:16px;width:61px;background-color:#2B4583;border-radius: 0px 4px 4px 0px;display:flex;align-items: center;justify-content: center;font-size: 12px;font-weight: 700;color:#ffffff;">{{item.allUsableNum}}</div>
                                </div>
                            </div>
                        </div>
                        <div style="width:190px;height:96px;border-radius: 4px;padding:12px;" v-if="item.flag"
                         ></div>
                    </div>
                    <div style="display:flex;align-items: center;justify-content: center;color: #2E323A;cursor:pointer;" @click="rightDoctorCard">
                        <i class="iconfont el-icon-arrow-right"></i>
                    </div>
                </div>
                <div style="padding: 12px 50px;display:flex;flex-wrap:wrap;">

                    <div style="width:96px;height:40px;padding:4px;display:flex;cursor:pointer;" v-for="(item, index) in apptList" :key="index" @click="clickTime(item)">
                        <div v-if="!item.disabletime" style="width:100%;height:100%;border-radius: 4px;display:flex;align-items: center;justify-content: center;position: relative;"
                            :class="[ item.disabletime?'time-card-disable':item.check?'time-card-selected': 'time-card-select' ]">
                            <div v-if="item.check" style="width: 0;height: 0;border-right: 22px solid #134796;border-top:15px solid transparent;position:absolute;bottom: 0px;right:0px;"></div>
                            <i v-if="item.check" class='iconfont el-icon-check' style="position:absolute;bottom: -2px;right:1px;color: #ffffff;font-size: 10px;"></i>
                            <span v-if="item.appointmentTime">{{item.showtime}}</span>
                            <span v-else>加号</span>
                        </div>
                    </div>
                </div>
              </div>

            </div>
          </div>

            <div style="height: 95px;bacground-color:#ffffff;position:relative;">
                <div style="position:absolute;bottom: 73px;right: 17px;">
                    <el-checkbox v-model="zddyptchecked">自动打印凭条</el-checkbox>
                </div>
                <div class="bottom-con width100">
                    <div class="btns float-right">
                        <el-button type="primary" @click="createApptClick" :disabled="!patientId||!doctorCard.scheduleId">提交</el-button>
                        <el-button type="primary" @click="cancelClick" plain>取消</el-button>
                    </div>
                </div>
            </div>

          <el-dialog
            title="收费"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            width="700px"
            @close="closeDialog"
          >
            <l-charge :charge="newLchrage" :isApptointment="true" @close="close"></l-charge>
          </el-dialog>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
// import mixin from '@/mixins/leftBarPenetrate'
import Vue from 'vue'
import outpatientAppointment from "@/api/appointmentNew/outpatientAppointment.js";
import service from "@/api/appointment/appointment";
import itemVue from '../../public/temperature/item.vue';
import { onPreview } from "@/utils/print";
import {mapGetters, mapActions} from "vuex";

/**
* 获取本周、本季度、本月、上月的开始日期、结束日期
*/
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //

//格式化日期：yyyy-MM-dd
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth()+1;
    var myweekday = date.getDate();

    if(mymonth < 10){
        mymonth = "0" + mymonth;
    }
    if(myweekday < 10){
        myweekday = "0" + myweekday;
    }
    return (myyear+"-"+mymonth + "-" + myweekday);
}
//格式化日期：M月dd日
function formatDate2(date) {
    // var myyear = date.getFullYear();
    var mymonth = date.getMonth()+1;
    var myweekday = date.getDate();

    // if(mymonth < 10){
    //     mymonth = "0" + mymonth;
    // }
    // if(myweekday < 10){
    //     myweekday = "0" + myweekday;
    // }
    return (mymonth + "月" + myweekday + "日");
}

//获得本周的开始日期
function getWeekStartDate(flag) {
    console.log(nowDay)
    console.log(nowDayOfWeek)
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + flag*1);
    return formatDate(weekStartDate);
}
//获得本周的开始日期
function getWeekStartDate2(flag) {
    console.log(nowDay)
    console.log(nowDayOfWeek)
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + flag*1);
    return formatDate2(weekStartDate);
}

export default {
    // mixins: [mixin],
    name: "appoints",
    data() {
        return {
            toolBoxs: ["appointRegisterRecord"],
            name:'',
            listLength: [],
            pageParams: {
                pageNo: 1,
                pageSize: 20,
                total: 200,
            },
            listLength: 5,
            currentRowIndex: "",
            thisWeekFlag: 0,
            selectedDate: formatDate(new Date()),
            weekList: [{
                date: getWeekStartDate2(1),
                week: '周一',
                value: getWeekStartDate(1),
            },{
                date: getWeekStartDate2(2),
                week: '周二',
                value: getWeekStartDate(2)
            },{
                date: getWeekStartDate2(3),
                week: '周三',
                value: getWeekStartDate(3)
            },{
                date: getWeekStartDate2(4),
                week: '周四',
                value: getWeekStartDate(4)
            },{
                date: getWeekStartDate2(5),
                week: '周五',
                value: getWeekStartDate(5)
            },{
                date: getWeekStartDate2(6),
                week: '周六',
                value: getWeekStartDate(6)
            },{
                date: getWeekStartDate2(7),
                week: '周日',
                value: getWeekStartDate(7)
            }],
            checkList: [],
            zddyptchecked: true,
            deptList: [],
            deptSonList: [],
            apptDeptCode: '',
            outpDeptId: '',
            treatTypeList: [],
            shangwu: 'am',
            scheduleList: [],
            pageDCNo:1,
            pageDCSize:5,
            doctorList:[],
            doctorCard:{},
            apptList:[],
            timeCard:{},
            patientId: '',
            mainTableData: {},
            // 缴费弹窗
            dialogVisible: false,
            newLchrage: {
                appointment: {}, // 预约明细
                chargePrescriptions: [], // 待收费明细，
                accountInfo: {} // 账户数据
            },
        }
    },
    mounted() {
        this.clickDate(formatDate(new Date()))
    },
    methods: {
        messageHandler() {},
        nextWeek(){
            console.log('this.selectedDate',this.selectedDate);
            this.thisWeekFlag = this.thisWeekFlag + 1
            console.log(this.thisWeekFlag)
            let weekFlag = this.thisWeekFlag
            let newList = JSON.parse(JSON.stringify(this.weekList));
            console.log('newList',newList)
            this.weekList = []
            for(var i=0;i<7;i++){
                newList[i].date = getWeekStartDate2(weekFlag* 7 + i + 1)
                newList[i].value = getWeekStartDate(weekFlag * 7 + i + 1)
                if(newList[i].value == this.selectedDate){
                    newList[i].check = true
                }else{
                    newList[i].check = false
                }
                this.weekList.push(newList[i])
            }
            console.log('this.weekList',this.weekList)
        },
        upWeek(){
            if(this.thisWeekFlag > 0){
                this.thisWeekFlag = this.thisWeekFlag - 1
                console.log(this.thisWeekFlag)
                let weekFlag = this.thisWeekFlag
                // let newList = []
                let newList = JSON.parse(JSON.stringify(this.weekList));
                console.log('newList',newList)
                this.weekList = []
                for(var i=0;i<7;i++){
                    newList[i].date = getWeekStartDate2(weekFlag* 7 + i + 1)
                    newList[i].value = getWeekStartDate(weekFlag * 7 + i + 1)
                    if(newList[i].value == this.selectedDate){
                        newList[i].check = true
                    }else{
                        newList[i].check = false
                    }
                    this.weekList.push(newList[i])
                }
                console.log('this.weekList',this.weekList)
            }else{
                this.$message("已是本周，不能再上一周了！");
            }
        },
        async clickDate(param){

            // clear
            this.doctorList = []
            this.doctorCard = {}
            this.apptList = []
            this.timeCard = {}
            this.deptSonList = []
            this.apptDeptCode = {}


            this.selectedDate = param
            console.log('clickDate',this.selectedDate)
            let newList = JSON.parse(JSON.stringify(this.weekList));
            this.weekList = []
            for(var i=0;i<7;i++){
                if(newList[i].value == this.selectedDate){
                    newList[i].check = true
                }else{
                    newList[i].check = false
                }
                this.weekList.push(newList[i])
            }
            try {
                let res = await outpatientAppointment.getApptAndDeptByDate({date:param})
                this.deptList = res.data;
                if (res.code == 1 && res.data.length == 0) {
                    this.$message("未查询到门诊部门号源信息");
                }
            } catch (error) {
                this.$message.error(error.msg);
            }
            try {
                let res = await outpatientAppointment.getDiagTreatTypeByParam({date:this.selectedDate,apptDeptCode:'',outpDeptId:''})
                this.treatTypeList = res.data;
                this.checkList = []
                for(var i=0;i < this.treatTypeList.length; i++) {
                    this.checkList.push(this.treatTypeList[i].diagTreatTypeCode)
                }
                if (res.code == 1 && res.data.length == 0) {
                    this.$message("未查询到诊疗类型");
                }
            } catch (error) {
                this.$message.error(error.msg);
            }
        },
        async clickDept(param){

            // clear
            this.doctorList = []
            this.doctorCard = {}
            this.apptList = []
            this.timeCard = {}
            this.deptSonList = []
            this.apptDeptCode = {}


            for(var i=0;i < this.deptList.length; i++) {
                if(this.deptList[i].apptDeptName == param.apptDeptName){
                    this.deptList[i].check = true
                    this.deptSonList = this.deptList[i].outpDeptList
                    this.apptDeptCode = this.deptList[i].apptDeptCode
                }else{
                    this.deptList[i].check = false
                }
            }
            try {
                let res = await outpatientAppointment.getDiagTreatTypeByParam({date:this.selectedDate,apptDeptCode:this.apptDeptCode,outpDeptId:''})
                this.treatTypeList = res.data;
                this.checkList = []
                for(var i=0;i < this.treatTypeList.length; i++) {
                    this.checkList.push(this.treatTypeList[i].diagTreatTypeCode)
                }
                if (res.code == 1 && res.data.length == 0) {
                    this.$message("未查询到诊疗类型");
                }
            } catch (error) {
                this.$message.error(error.msg);
            }
        },
        async clickSonDept(param){

            // clear
            this.doctorList = []
            this.doctorCard = {}
            this.apptList = []
            this.timeCard = {}


            for(var i=0;i < this.deptSonList.length; i++) {
                if(this.deptSonList[i].outpDeptName == param.outpDeptName){
                    this.deptSonList[i].check = true
                    this.outpDeptId = this.deptSonList[i].outpDeptId
                    Vue.set(this.deptSonList,i,{check:true,outpDeptId:this.deptSonList[i].outpDeptId,outpDeptName:this.deptSonList[i].outpDeptName})
                }else{
                    this.deptSonList[i].check = false
                }
            }
            try {
                let res = await outpatientAppointment.getDiagTreatTypeByParam({date:this.selectedDate,apptDeptCode:this.apptDeptCode,outpDeptId:this.outpDeptId})
                this.treatTypeList = res.data;
                this.checkList = []
                for(var i=0;i < this.treatTypeList.length; i++) {
                    this.checkList.push(this.treatTypeList[i].diagTreatTypeCode)
                }
                if (res.code == 1 && res.data.length == 0) {
                    this.$message("未查询到诊疗类型");
                    return;
                }
                let params ={
                    date: this.selectedDate,//日期 yyyy-MM-dd  (不要时分秒)
                    apptDeptCode: this.apptDeptCode,// 门诊部门CODE
                    outpDeptId: this.outpDeptId,// 科室ID
                    diagTreatTypes: this.checkList,// 诊疗类型集合
                    flag: this.shangwu, // 上午下午标志  am 上午;pm 下午
                }
                this.getScheduleByApptParam(params)
            } catch (error) {
                this.$message.error(error.msg);
            }
        },
        handleCheckedCitiesChange(value) {

            // clear
            this.doctorList = []
            this.doctorCard = {}
            this.apptList = []
            this.timeCard = {}

            console.log(value)
            this.checkList = value
            let params ={
                date: this.selectedDate,//日期 yyyy-MM-dd  (不要时分秒)
                apptDeptCode: this.apptDeptCode,// 门诊部门CODE
                outpDeptId: this.outpDeptId,// 科室ID
                diagTreatTypes: this.checkList,// 诊疗类型集合
                flag: this.shangwu, // 上午下午标志  am 上午;pm 下午
            }
            this.getScheduleByApptParam(params)
        },
        amandpm(data){
            if(data == '2'){
                this.shangwu = 'pm'
            } else {
                this.shangwu = 'am'
            }

            // clear
            this.doctorList = []
            this.doctorCard = {}
            this.apptList = []
            this.timeCard = {}


            let params ={
                date: this.selectedDate,//日期 yyyy-MM-dd  (不要时分秒)
                apptDeptCode: this.apptDeptCode,// 门诊部门CODE
                outpDeptId: this.outpDeptId,// 科室ID
                diagTreatTypes: this.checkList,// 诊疗类型集合
                flag: this.shangwu, // 上午下午标志  am 上午;pm 下午
            }
            if(this.outpDeptId&&this.apptDeptCode){ // 选了门诊部门和科室才调getScheduleByApptParam接口
                this.getScheduleByApptParam(params)
            }
        },
        async getScheduleByApptParam(params) {
            try {
                let res = await outpatientAppointment.getScheduleByApptParam(params)
                this.scheduleList = res.data;
                this.doctorList = []
                var n = 0
                // if(this.scheduleList.length>=this.pageDCSize){
                    n = this.pageDCSize
                // }else{
                //     n = this.scheduleList.length
                // }
                for(var i=0;i<n;i++){
                    if(this.scheduleList[i]){
                        this.doctorList.push(this.scheduleList[i])
                    } else {
                        this.doctorList.push({flag: true}) // 无数据时，站位
                    }
                }
                console.log('this.doctorList',this.doctorList)

                if (res.code == 1 && res.data.length == 0) {
                    this.$message("未查询到排班信息");
                }
            } catch (error) {
                this.$message.error(error.msg);
            }
        },
        leftDoctorCard(){
            if(this.pageDCNo <= 1){
                this.$message("已经是第一页啦！");
                return;
            }else{
                this.pageDCNo--
                // this.pageDCSize
                this.doctorList = []
                for(var i=0;i<this.pageDCSize;i++){
                    this.doctorList.push(this.scheduleList[(this.pageDCNo-1)*this.pageDCSize + i])
                }
            }
        },
        rightDoctorCard(){
            if(this.scheduleList.length<this.pageDCSize*this.pageDCNo){
                this.$message("已经是最后一页啦！");
                return;
            }
            this.pageDCNo++
            // this.pageDCSize

            var n = 0
            // if(this.scheduleList.length>=this.pageDCSize*this.pageDCNo){
                n = this.pageDCSize
            // }else{
            //     n = this.scheduleList.length - this.pageDCSize*(this.pageDCNo-1)
            // }

            this.doctorList = []
            for(var i=0;i<n;i++){
                if(this.scheduleList[(this.pageDCNo-1)*this.pageDCSize + i]){
                    this.doctorList.push(this.scheduleList[(this.pageDCNo-1)*this.pageDCSize + i])
                } else {
                    this.doctorList.push({flag: true}) // 无数据时，站位
                }
            }
        },
        async clickDoctor(item){
            console.log('clickDoctor-doctorCard',item)
            for(var i=0;i < this.doctorList.length; i++) {
                if(this.doctorList[i].scheduleId == item.scheduleId){
                    this.doctorList[i].check = true
                    this.doctorCard = item
                    Vue.set(this.doctorList,i,{...item,check:true})
                } else {
                    this.doctorList[i].check = false
                }
            }
            for(var i=0;i < this.scheduleList.length; i++) {
                if(this.scheduleList[i].scheduleId == item.scheduleId){
                    this.scheduleList[i].check = true
                    // Vue.set(this.scheduleList,i,{check:true,outpDeptId:this.scheduleList[i].outpDeptId,outpDeptName:this.scheduleList[i].outpDeptName})
                } else {
                    this.scheduleList[i].check = false
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
                let res = await outpatientAppointment.getApptByScheduleId({scheduleSerialId:this.doctorCard.scheduleId})
                this.apptList = res.data;
                // appointmentTime
                // let aaaa = new Date(yy,MM,dd,hh,mm,ss)//.toLocaleString()//formatDate(new Date())
                // console.log('nowTimeaaa',aaaa)
                for(var i=0;i<this.apptList.length;i++){
                    if(this.apptList[i].appointmentTime){
                        let datatime = Date.parse(new Date(this.apptList[i].appointmentTime))
                        let nowtime = Date.parse(new Date())

                        console.log('datatime',datatime)
                        console.log('nowtime',nowtime)
                        if(datatime<nowtime || this.apptList[i].recordStatus != '99'){
                            this.apptList[i].disabletime = true
                        }
                    }
                    Date.parse(new Date("2017-02-06 10:30:50"))
                    this.apptList[i].showtime = this.apptList[i].appointmentTime.substring(11,16)
                }
                console.log('this.apptList',this.apptList)

                if (res.code == 1 && res.data.length == 0) {
                    this.$message("未查询到排班信息");
                }
            } catch (error) {
                this.$message.error(error.msg);
            }
        },
        clickTime(item){
            let datatime = Date.parse(new Date(item.appointmentTime))
            let nowtime = Date.parse(new Date())
            if(datatime<nowtime){
                this.$message("该时段已过，不可选取！");
                return;
            }
            if(item.recordStatus != '99'){
                this.$message("该时段已被占用！");
                return;
            }
            for(var i=0;i < this.apptList.length; i++) {
                if(this.apptList[i].appointmentId == item.appointmentId){
                    this.apptList[i].check = true
                    this.timeCard = item
                    Vue.set(this.apptList,i,{...item,check:true})
                } else {
                    this.apptList[i].check = false
                }
            }

            console.log('clickTime-timeCard',item)
        },
        ...mapActions({
            changeRecPatientData: "base/changeRecPatientData"
        }),
        listItemClickHandler(data){

            // clear
            this.doctorList = []
            this.doctorCard = {}
            this.apptList = []
            this.timeCard = {}


            this.clickDate(formatDate(new Date()))

            console.log('listItemClickHandler',data)
            this.patientId = data.patientId
            this.mainTableData = data;

            this.getRegisteredList();// //查询挂号记录

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
          onPreview(printData,"挂号凭证");
        },
        cancelClick(){
            this.clickDate(formatDate(new Date()))
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
    }
}
</script>

<style lang='scss' scoped>
.doctor-card-selected{
    border: #2B4583 solid 1px;
    background-color: #F5F8FA;
}
.doctor-card-select{
    border: #e3e3e3 solid 1px;
}
.doctor-img-selected{
    background-color: #ffffff;
}
.doctor-img-select{
    background-color: #F1F4F6;
}
.date-card-selected{
    background-color:#f1f4f6;
    color: #2B4583;
}
.date-card-select{
    background-color:#ffffff;
    color:#666c70
}
.dept-selected{
    font-weight: 600;
    color:#2B4583;
}
.dept-select{
    color:#949DA3;
}
.dept-son-selected{
    color:#2B4583;
    font-weight:600;
}
.dept-son-select{
    color:#949DA3;
}
.time-card-selected{
    border: 1px solid #2b4583;
    color: #2e323a;
}
.time-card-select{
    border: 1px solid #f0f0f0;
    color: #949DA3;
}
.time-card-disable{
    border: 1px solid #f0f0f0;
    color: #949DA355;
    cursor:not-allowed;
}
.padding12px{
    padding: 12px;
}

.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  .m-contain {
    height: calc(100% - 150px);
    overflow-y: auto;
    box-sizing: border-box;
    .top-con {
    //   margin-top: 17px;
      .top-con-tab {
        font-size: 12px;
        /deep/ .el-tabs__nav-wrap {
          padding-left: 18px;
          border-bottom: 1px solid $l-color-border-8;
        }

        .first-list {
          width: 854px;
          font-size: 0;
          .lay-item {
            display: inline-block;
            line-height: 17px;
            font-size: 12px;
            .item-title {
              display: inline-block;
              color: #949da3;
            }
            .item-contain {
              margin-left: 8px;
              display: inline-block;
              color: #2e323a;
            }
            .item-title-01 {
              width: 36px;
            }

            .item-title-02 {
              width: 48px;
            }

            .item-contain-01 {
              width: 146px;
            }

            .item-contain-02 {
              width: 101px;
            }
            .item-contain-03 {
              width: 93px;
            }
            .item-contain-04 {
              width: 270px;
            }
          }
        }

        .third-con {
          position: relative;
          font-size: 0;
          padding-left: 17px;
          .input-con {
            /deep/ .el-input {
              width: calc(100% - 56px);
            }
            /deep/ .el-button {
              margin-left: $l-margin-default-4;
            }
          }
          .third-contain {
            .show-con {
              width: 854px;
              padding: 12px $l-padding-default-6;
              line-height: 20px;
              font-size: 14px;
              background: $l-color-bgcolor-18;
              border-radius: $l-bg-radius-bg;
              .text-left {
                color: #666c70;
              }
              .text-right {
                margin-left: $l-margin-default-4;
                margin-right: 32px;
                color: #2e323a;
              }
            }
          }
        }
      }
    }
  }
}
.bottom-con {
    padding: 16px;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 63px;
    border-top: 1px solid #e4e4e4;
}
.margin-right-8 {
  margin-right: $l-margin-default-4;
}
.margin-top-default {
  margin-top: $l-margin-default-6;
}

/deep/ .el-input-group__append {
  background-color: rgba(255, 255, 255, 1);
  border-width: 0;
}
</style>
