<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card class="height100 content padding20" ref="page" style="padding: 0 20px;">
          <el-tabs class="height-main" v-model="activeName" @tab-click="handleClick">
            <!-- 家床记录 -->
            <el-tab-pane label="家床记录" name="first">
              <div class="height100">
                <div class="top-content overflow-hidden">
                  <span class="label float-left">选择类型</span>
                  <div class="float-left">
                    <el-radio-group class="float-left" v-model="time_type" @change="conditionChange">
                      <el-radio  v-model="time_type" :label="0">登记时间</el-radio>
                      <el-radio  v-model="time_type" :label="1">撤床时间</el-radio>
                    </el-radio-group>
                    <div class="float-left" style="width: 300px;">
                      <l-formt-title label="选择日期">
                        <el-date-picker
                          v-model="dateRange"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          @change="conditionChange"
                        ></el-date-picker>
                      </l-formt-title>
                    </div>
                    <el-input
                      style="margin-left: 10px;width:193px;border-radius: 2px"
                      placeholder="住院号、姓名"
                      suffix-icon="el-icon-search"
                      v-model="keyWord"
                      @change="conditionChange"
                    ></el-input>
                    <el-button type="primary" style="margin-left: 20px;border-radius: 2px;" @click="inOutHospital">查询</el-button>
                    <el-button class="reset" @click="clearCondition">重置</el-button>
                  </div>
                </div>
                <div class="table-content">
                  <el-table
                    :data="outInRecord"
                    border
                    style="width: 100%"
                    stripe
                    v-loadmore="loadNext"
                    height="100%"
                  >
                    <el-table-column
                            v-for="(item,index) in outInTableList"
                            :key="item.label+index"
                            :label="item.label"
                            :prop="item.prop"
                            :fixed="item.fixed"
                            align="center"
                            show-overflow-tooltip
                            header-align="center"
                            :min-width="item.width"
                          >
                            <template slot-scope="scope">
                              <div  v-if="item.prop === 'recordStatus'" class="color1"  >
                                {{statusArr[scope.row[item.prop]]}}
                              </div>
                              <div  v-else-if="item.prop === 'admissionSdeptId'" class="color1"  >
                                <span
                                  tableName="sys_org"
                                  :conditionMap="{
                                          org_type: '_DEPT_',
                                          id: scope.row[item.prop]
                                        }"
                                  columns="org_nm"
                                  v-tableTransform
                                ></span>
                              </div>
                              <div  v-else-if="item.prop === 'admissionSituation'" class="color1"  >
                                <span :val="scope.row['admissionSituation']" code="EntranceCode" v-codeTransform></span>
                              </div>
                              <div v-else>{{scope.row[item.prop]}}</div>
                            </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <!-- 转科记录 -->
            <el-tab-pane label="转科记录" name="second">
              <div class="height100">
                <div class="top-content">
                  <span class="label float-left">选择类型</span>
                  <div>
                    <el-radio-group class="float-left" v-model="time_type" @change="conditionChange">
                      <el-radio  v-model="time_type" :label="0">登记时间</el-radio>
                      <el-radio  v-model="time_type" :label="1">撤床时间</el-radio>
                    </el-radio-group>
                    <div class="float-left" style="width: 300px;">
                      <l-formt-title label="选择日期">
                        <el-date-picker
                          v-model="dateRange"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          @change="conditionChange"
                        ></el-date-picker>
                      </l-formt-title>
                    </div>
                    <el-input
                      style="margin-left: 10px;width:193px;border-radius: 2px"
                      placeholder="住院号、姓名"
                      suffix-icon="el-icon-search"
                      v-model="keyWord"
                      @change="conditionChange"
                    ></el-input>
                    <el-button type="primary" style="margin-left: 20px;border-radius: 2px;" @click="inOutHospital">查询</el-button>
                    <el-button class="reset" @click="clearCondition">重置</el-button>
                  </div>
                </div>
                <div class="table-content">
                  <el-table
                    :data="transferRecord"
                    border
                    style="width: 100%"
                    stripe
                    v-loadmore="loadNext"
                    height="100%"
                  >
                    <el-table-column
                            v-for="(item,index) in transferTableList"
                            :key="item.label+index"
                            :label="item.label"
                            :prop="item.prop"
                            :fixed="item.fixed"
                            align="center"
                            show-overflow-tooltip
                            header-align="center"
                            :min-width="item.width"
                          >
                          <template slot-scope="scope">
                              <div  v-if="item.prop === 'recordStatus'" >
                                {{statusArr[scope.row[item.prop]]}}
                              </div>
                              <div  v-else-if="item.prop === 'utDeptCode'">
                                <span
                                  tableName="sys_org"
                                  :conditionMap="{
                                          org_type: '_DEPT_',
                                          id: scope.row[item.prop]
                                        }"
                                  columns="org_nm"
                                  v-tableTransform
                                ></span>
                              </div>
                              <div  v-else-if="item.prop === 'targerDeptCode'">
                                <span
                                  tableName="sys_org"
                                  :conditionMap="{
                                          org_type: '_DEPT_',
                                          id: scope.row[item.prop]
                                        }"
                                  columns="org_nm"
                                  v-tableTransform
                                ></span>
                              </div>
                              <div v-else>{{scope.row[item.prop]}}</div>
                            </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <!-- 转床记录 -->
            <el-tab-pane label="转床记录" name="third">
              <div class="height100">
                <div class="top-content">
                  <div>
                    <div class="float-left" style="width: 300px;">
                      <l-formt-title label="选择日期" style="margin-left: 0;">
                        <el-date-picker
                          v-model="dateRange"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          @change="conditionChange"
                        ></el-date-picker>
                      </l-formt-title>
                    </div>
                    <el-input
                      style="margin-left: 10px;width:193px;border-radius: 2px"
                      placeholder="住院号、姓名"
                      suffix-icon="el-icon-search"
                      v-model="keyWord"
                      @change="conditionChange"
                    ></el-input>
                    <el-button type="primary" style="margin-left: 20px;border-radius: 2px;" @click="inOutHospital">查询</el-button>
                    <el-button class="reset" @click="clearCondition">重置</el-button>
                  </div>
                </div>
                <div class="table-content">
                  <el-table
                    :data="bedRecord"
                    border
                    style="width: 100%"
                    stripe
                    v-loadmore="loadNext"
                    height="100%"
                  >
                    <el-table-column
                            v-for="(item,index) in changeBedTableList"
                            :key="item.label+index"
                            :label="item.label"
                            :prop="item.prop"
                            :fixed="item.fixed"
                            align="center"
                            show-overflow-tooltip
                            header-align="center"
                            :min-width="item.width"
                          >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div>
            <l-card-title>
              <span slot="left">转科/床操作</span>
            </l-card-title>
            <div class="change-section">
              <div class="base-info" style="border-radius: 2px;padding-left: 20px;">
                <span>{{patientInfo.bedCode}}</span>
                <span>{{patientInfo.patientName}}</span>
                <span :val="patientInfo.patientGender" code="GENDER_CODE" v-codeTransform></span>
                <span>{{patientInfo.patientAge}}</span>
              </div>
              <div style="line-height: 60px;">
                <el-radio-group v-model="transferType">
                  <el-radio :label="3">转科</el-radio>
                  <!-- <el-radio :label="6">转床</el-radio> -->
                </el-radio-group>
              </div>
              <div v-if="transferType == 3">
                <div class="float-left margin-right-10" style="width: 300px;">
                  <l-formt-title label="当前科室">
                    <div style="line-height: 36px;">
                      <span
                                  tableName="sys_org"
                                  :conditionMap="{
                                          org_type: '_DEPT_',
                                          id: patientInfo.outDept
                                        }"
                                  columns="org_nm"
                                  v-tableTransform
                                ></span>
                    </div>
                  </l-formt-title>
                </div>
                <div class="float-left margin-right-10" style="width: 300px;">
                  <l-formt-title label="选择目标科室" :required="true">
                      <l-value-domain
                        remoteUrl="/appointment/doctorSchedule/getDept"
                        :value.sync="ruleForm.targetDept"
                        remoteShowKey="deptName"
                        remoteValueKey="deptId"
                        placeholder="请选择"
                        @change="selectIllnessArea"
                      />
                    </l-formt-title>
                </div>
                <div class="float-left margin-right-10" style="width: 300px;">
                  <l-formt-title label="选择目标病区">
                    <el-select v-model="ruleForm.targetWardCode">
                      <el-option
                        v-for="(item,index) in illnessAreaList"
                        :key="item.wardCode+index"
                        :label="item.wardName"
                        :value="item.wardCode">
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div>
                  <el-button
                    type="primary"
                    style="border-radius: 2px;"
                    @click="changeSectionConfirm"
                  >确认转科</el-button>
                  <el-button type="primary" plain @click="changeSectionDialogVisible = false">取 消</el-button>
                </div>
              </div>
              <!-- <div class="change-section" v-else>
                <div class="overflow-hidden">
                  <div class="float-left margin-right-10" style="width: 300px;">
                    <l-formt-title label="当前床位" style="width: 300px;">
                      <div style="line-height: 36px;">{{patientInfo.bedCode}}床</div>
                    </l-formt-title>
                  </div>
                  <div class="float-left margin-right-10" style="width: 300px;">
                    <l-formt-title label="选择目标床位">
                      <el-select v-model="ruleForm.bedId" placeholder="请选择" @change="getBedCode">
                        <el-option
                          v-for="item in bedNameListData"
                          :key="item.bedId"
                          :label="item.bedCode"
                          :value="item.bedId"
                        ></el-option>
                      </el-select>
                    </l-formt-title>
                  </div>
                  <div class="float-left">
                    <el-button
                      type="primary"
                      style="border-radius: 2px;"
                      @click="changeBedConfirm"
                    >确认转床</el-button>
                    <el-button type="primary" plain @click="changeBedDialogVisible = false">取 消</el-button>
                  </div>
                </div>
                <div v-if="changeBedTip" class="color15 tip">05床有患者，请选择空床！</div>
              </div> -->
            </div>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LeftBar from "../../components/nursingLeftBar";
import {turnApply,emptyBed,changeBed} from "../../../../api/ipnw/nursing";
import { getPatintInfo, queryBed } from "@/api/cis/admApplication/index";
import { getWardByDept } from "@/api/ipnw/leaveHos";
export default {
  name: "transferBed", // 转科转床
  components: {
    LeftBar
  },
  data() {
    return {
      illnessAreaVal:'',//目标病区
      illnessAreaList:[],
      statusArr: {
        '1':'已登记',
        '2':'登记',
        '3':'预撤床',
        '4':'撤床',
        '5':'挂账',
        '6':"转科",
        '9':"作废"
      },
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      toolBoxs: ["templateQuote"],
      // 患者列表查询条件
      patientsSearchForm: {},
      patientInfo:{
        bedCode:"",
        patientName:"",
        patientGender:"",
        patientAge:"",
        outDept:'',
        wardCode:'',
        outBedId:'',
        outBedCode:'',
      },
      ruleForm:{
        targetDept:'',
        bedId:'',
        targetBedId:'',
        targetBedCode:'',
        targetWardCode:'',
      },
      tlm_isLoading: false,
      tlm_noMore: false,
      transferType: 3, // 转科或转床
      changeBedTip: false, // 床位是否可用
      activeName: "first", // 选项卡
      bedNameListData: [],
      keyWord: "", // 搜索关键词
      time_type: "1", // 时间筛选条件
      dateRange: "", // 时间段
      start_date: "", // 筛选开始时间
      end_date: "", // 筛选结束时间
      outInRecord: [], // 家床记录
      outInTableList:[
        {prop: "recordStatus",label: "状态",width: "120",fixed:true},
        {prop: "inpCode",label: "住院号",width: "180",fixed:true},
        {prop: "mrCode",label: "病案号",width: "180"},
        {prop: "patientName",label: "患者",width: "180"},
        {prop: "birthDate",label: "出生日期",width: "180"},
        {prop: "admissionSdeptId",label: "当前所在科室",width: "180"},
        {prop: "admissionWdeptId",label: "当前所在病区",width: "180"},
        {prop: "bedCode",label: "床号",width: "180"},
        {prop: "wdeptAdmissionTime",label: "登记时间",width: "180"},
        {prop: "admissionSdeptId",label: "登记科室",width: "180"},
        {prop: "admissionWdeptId",label: "登记病区",width: "180"},
        {prop: "admissionDiag",label: "登记诊断",width: "180"},
        {prop: "admissionSituation",label: "登记病情",width: "180"},
        {prop: "status",label: "撤床科室",width: "180"},
        {prop: "status",label: "撤床病区",width: "180"},
      ],//家床记录表表头
      transferRecord: [], // 转科记录
      transferTableList:[
        {prop: "recordStatus",label: "状态",width: "120",fixed:true},
        {prop: "inpCode",label: "住院号",width: "180",fixed:true},
        {prop: "mrCode",label: "病案号",width: "180"},
        {prop: "patientName",label: "患者",width: "180"},
        {prop: "birthDate",label: "出生日期",width: "180"},
        {prop: "outDeptCode",label: "原科室",width: "180"},
        {prop: "outWardCode",label: "原病区",width: "180"},
        {propo: "outBedNo",label: "原床号",width: "180"},
        {prop: "opdate",label: "转出时间",width: "180"},
        {prop: "opname",label: "转出人",width: "180"},
        {prop: "targerDeptCode",label: "目标科室",width: "180"},
        {prop: "targetWardCode",label: "目标病区",width: "180"},
        {prop: "targetBedNo",label: "目标床位",width: "180"},
        {prop: "auditordate",label: "接收时间",width: "180"},
        {prop: "auditorName",label: "接收人",width: "180"},
      ],//转科记录表表头
      bedRecord: [] ,// 转床记录
      changeBedTableList:[
        {prop: "status",label: "状态",width: "120",fixed:true},
        {prop: "status",label: "住院号",width: "180",fixed:true},
        {prop: "status",label: "病案号",width: "180"},
        {prop: "status",label: "患者",width: "180"},
        {prop: "status",label: "出生日期",width: "180"},
        {prop: "status",label: "当前所在科室",width: "180"},
        {prop: "status",label: "当前所在病区",width: "180"},
        {prop: "status",label: "原床号",width: "180"},
        {prop: "status",label: "转床时间",width: "180"},
        {prop: "status",label: "目标床位",width: "180"},
        {prop: "status",label: "接收时间",width: "180"},
      ],//转床记录表表头
    };
  },
  computed : {
  ...mapGetters(["receivePatientData"])
  },
  methods: {
    //当选择时间类型，时间范围，关键词搜索框发生改变时，清空表格数据
    conditionChange(){
      this.clearTableData();
    },
    // //转床时，根据bedId（30587）,获取对应的床位号（01+01）
    // getBedCode(selVal){
    //   this.bedNameListData.forEach((item)=>{
    //     if(selVal===item.bedId){
    //       this.ruleForm.targetBedId=item.bedId;
    //       this.ruleForm.targetBedCode=item.bedCode;
    //       this.ruleForm.wardCode=item.wardCode;
    //     }
    //   })
    // },
    //重置搜索条件
    clearCondition(){
      this.time_type= ""; // 时间筛选条件
      this.dateRange= ""; // 时间段
      this.keyWord='';
      this.start_date=""; // 筛选开始时间
      this.end_date= ""; // 筛选结束时间
    },
    //清空表格数据
    clearTableData(){
      this.outInRecord=[];
      this.transferRecord=[];
      this.bedRecord=[];
    },
    //切换tab选项卡，清空表格数据
    handleClick(tab,eve) {
      this.clearCondition();
    },
    search(form) {
      // 查询方法
      this.patientsSearchForm = form;
      this.$refs.patients.search(form);
    },
    readCard() {
      // 读卡方法
    },
    // //确认转床
    // async changeBedConfirm(){
    //     try{
    //     let params={
    //       inpCode:this.receivePatientData.inpCode,
    //       targetBedId:this.ruleForm.targetBedId,
    //       targetBedCode:this.ruleForm.targetBedCode,
    //       wardCode:this.ruleForm.wardCode,
    //       outBedId:this.patientInfo.outBedId,
    //       outBedCode:this.patientInfo.outBedCode,
    //     }
    //     let {code,data,msg}=await changeBed(params);
    //     if(code===1){
    //     }
    //   }catch(e){
    //     this.$message.error(e);
    //   }
    // },
    toolBoxMessage(moduleName, data) {
      if (moduleName != "PreviousPrescriptions") {
        return;
      }
    },
    loadNext() {
      // console.log("加载下一页");
      this.fetchList();
    },
    fetchList() {
      try {
        // await request
        this.tlm_isLoading = false;
      } catch (e) {
        this.tlm_isLoading = false;
      }
    },
     // 查询所有病区 返回第一个
    async selectIllnessArea(val) {
      this.illnessAreaList=[];
      this.ruleForm.targetWardCode='';
      let res = await getWardByDept({
        deptId: this.ruleForm.targetDept,
      });
      if(res.code===1){
        this.illnessAreaList=res.data;
      }
    },
    //确认转科
    async changeSectionConfirm() {
      if(this.ruleForm.targetDept===''){
        this.$message.warning("请选择目标科室!");
        return;
      }
      if(this.ruleForm.targetWardCode===''){
        this.$message.warning("请选择目标病区!");
        return;
      }
      try{
        let params={
          inpCode:this.receivePatientData.inpCode,
          outDept:this.receivePatientData.outDeptCode,
          targetDept:this.ruleForm.targetDept,
          targetWardCode:this.ruleForm.targetWardCode
        }
        // let {code,data,msg}=await changeDept(params);
      }catch(e){
        this.$message.error(e);
      }
    },
    messageHandler() {
      // console.log("切换选项卡");
    },
     //转床操作 根据左侧选中患者所在病区id获取当前病区的其他床位
    // getBedList(id) {
    //   this.$set(this.ruleForm, "bedId", "");
    //   emptyBed({
    //     wardCode: id,
    //     useStatus :0
    //   })
    //     .then(res => {
    //       this.bedNameListData = [];
    //       if (res.code === 1) {
    //         this.bedNameListData = res.data;
    //       } else {
    //         this.$message.error(res.msg);
    //       }
    //     })
    //     .catch(err => {
    //       this.$message.error(err);
    //     });
    // },
    //监听选中左侧的患者，并获取患者对应的床号，病人姓名，性别，年龄，当前所在科室，和当前所在病区
    changePatientData(patientData){
      this.clearCondition();
      this.clearTableData();
      this.ruleForm={
        targetDept:'',
        bedId:'',
        targetBedId:'',
        targetBedCode:'',
        targetWardCode:'',
      };
      this.patientInfo={
        bedCode:patientData.bedCode,
        patientName:patientData.patientName,
        patientGender:patientData.patientGender,
        patientAge:patientData.patientAge,
        outDept:patientData.outDeptCode,//患者当前所在科室
        wardCode:patientData.wardId,//患者当前所在病区
        outBedId:patientData.bedId,//患者当前所在床位ID（30587）
        outBedCode:patientData.bedCode//患者当前所在病区（01+01）
      }
    },
    //根据标签页 判断获取家床记录，转科记录，转床记录
    async inOutHospital(){
      this.isLoading = true;
        try{
          if(this.activeName=='first'){
            this.outInRecord=[];
            let params={
              turnType:"5,3",
              inpCode:this.keyWord!="" ? this.keyWord : this.receivePatientData.inpCode,
              timeType:this.time_type,
              startTime:this.dateRange[0].toString(),
              endTime:this.dateRange[1].toString(),
            };
            turnApply(params).then(res=>{
              if(res.code==1){
                res.data.forEach(item => {
                  let obj={
                    recordStatus:item.recordStatus,
                    inpCode:item.inpCode,
                    mrCode:item.mrCode,
                    patientName:item.patientName,
                    birthDate:item.birthDate,
                    inpSdeptId:item.inpSdeptId,
                    wardId:item.wardId,
                    bedCode:item.bedCode,
                    wdeptAdmissionTime:item.wdeptAdmissionTime,
                    admissionSdeptId:item.admissionSdeptId,
                    admissionWdeptId:item.admissionWdeptId,
                    admissionDiag:item.admissionDiag,
                    admissionSituation:item.admissionSituation
                  }
                  this.outInRecord.push(obj);
                });
              }
            })
          }else if(this.activeName=='second'){
            this.transferRecord=[];
            let params={
              turnType:"0,2",
              inpCode:this.receivePatientData.inpCode,
              timeType:this.time_type,
              startTime:this.dateRange[0].toString(),
              endTime:this.dateRange[1].toString(),
            };
            turnApply(params).then(res=>{
              if(res.code==1){
                 res.data.forEach(item => {
                  let obj={
                    recordStatus:item.recordStatus,
                    inpCode:this.keyWord!="" ? this.keyWord : this.receivePatientData.inpCode,
                    mrCode:item.mrCode,
                    patientName:item.patientName,
                    birthDate:item.birthDate,
                    outDeptCode:item.outDeptCode,
                    outWardCode:item.outWardCode,
                    outBedNo:item.outBedNo,
                    opdate:item.opdate,
                    opname:item.opname,
                    targerDeptCode:item.targerDeptCode,
                    targetWardCode:item.targetWardCode,
                    targetBedNo:item.targetBedNo,
                    auditordate:item.auditordate,
                    auditorName:item.auditorName,
                  }
                  this.transferRecord.push(obj);
                });
              }
            })
          }else if(this.activeName=='third'){
            this.bedRecord=[];
            let params={
              turnType:"4",
              inpCode:this.receivePatientData.inpCode,
              timeType:"1",
              startTime:this.dateRange[0].toString(),
              endTime:this.dateRange[1].toString(),
            };
            turnApply(params).then(res=>{
              if(res.code==1){
                  res.data.forEach(item => {
                  let obj={
                    recordStatus:item.recordStatus,
                    inpCode:this.keyWord!="" ? this.keyWord : this.receivePatientData.inpCode,
                    mrCode:item.mrCode,
                    patientName:item.patientName,
                    birthDate:item.birthDate,
                    admissionSdeptId:item.admissionSdeptId,
                    admissionWdeptId:item.admissionWdeptId,
                    outBedNo:item.outBedNo,
                    opdate:item.opdate,
                    targerBedNo:item.targetBedNo,
                    auditordate:item.auditordate
                  }
                  this.bedRecord.push(obj);
                });
              }
            })
          }
      }catch (e) {
        this.$message.error("网络错误");
      }
      this.isLoading = false;
    },
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        this.changePatientData(val);
      },
      immediate: true,
      deep: true
    },
    //监听用户操作转科还是转床，如果是转床请求患者所在病区对应的床位
    transferType(newVal,oldVal){
        if(newVal===6){
          this.getBedList(this.patientInfo.wardCode);
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.color1 {
  color: $l-color-primary1;
}
.color2 {
  color: $l-color-fontcolor-2;
}
.color3 {
  color: $l-color-fontcolor-3;
}
.color6 {
  color: $l-color-border-6;
}
.color15 {
  color: $l-color-bgcolor-15;
}
.reset {
  margin-left: 10px;
  border-radius: 2px;
  color: $l-color-primary1;
  border-color: $l-color-primary1;
  background: $l-color-white;
}
.tip {
  line-height: 32px;
  width: 100%;
}
/deep/ .el-input--medium .el-input__inner {
  height: 36px;
}
/deep/ .el-tabs__nav-wrap::after {
  display: none;
}
// /deep/ .el-radio__input.is-checked + .el-radio__label {
//   color: #2e323a;
// }
/deep/ .el-radio__label {
  padding-left: 5px;
}
// /deep/ .el-radio__input.is-checked .el-radio__inner {
//   border-color: #2e323a;
//   background: #2e323a;
// }
// /deep/ .el-radio {
//   color: #949da3;
//   margin-right: 20px;
// }
/deep/ .el-range-editor--medium.el-input__inner {
  border: none;
}
.selectTime-box /deep/ .el-input--medium .el-input__inner {
  border: none;
  padding-left: 10px;
  padding-right: 10px;
}
/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}
.change-section {
  .base-info {
    line-height: 64px;
    background-color: $l-color-bgcolor-18;
    span {
      font-weight: bold;
      color: $l-color-fontcolor-3;
      margin-right: 10px;
      font-size: 16px;
    }
  }
}
.top-content {
  float: left;
  width: 100%;
  line-height: 36px;
  .label {
    font-size: 14px;

    font-weight: 400;
    color: $l-color-fontcolor-4;
    line-height: 20px;
    margin-right: 20px;
    margin-top: 10px;
  }
  label {
    margin-top: 12px;
  }
  & > div {
    overflow: hidden;
  }
  .selectTime-box {
    border: 1px solid $l-color-bgcolor-11;
    border-radius: 2px;
    margin-left: 10px;
    color: $l-color-fontcolor-3;
    position: relative;
    padding-right: 20px;
    .label {
      color: $l-color-fontcolor-4;
      margin-left: 10px;
      margin-right: 10px;
      padding-right: 10px;
      border-right: 1px solid $l-color-bgcolor-11;
    }
    .date-icon {
      position: absolute;
      top: 8px;
      right: 10px;
      font-size: 20px;
      color: $l-color-fontcolor-4;
    }
    .iconfont {
      color: $l-color-fontcolor-4;
    }
  }
}
// .content{
//   /*height: calc(100% - 80px);*/
// }
.table-content {
  height: calc(100% - 60px);
}
</style>
