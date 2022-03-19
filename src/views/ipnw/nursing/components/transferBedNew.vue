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
        <left-bar type="hosTransferBedNew" :Multiple="false"
                  :getPatientList="getPatientList" @updatePatientList="updatePatientList"></left-bar>
      </template>
      <template #content>
        <el-card class="height100 transferBedNew-content padding20" ref="page" style="padding: 0 20px;">
          <div class="height-main-tBN">
            <l-card-title>
              <span slot="left">当前信息</span>
            </l-card-title>
            <div class="change-section">
              <div class="base-info" style="border-radius: 2px;padding-left: 20px;">
                        <span>住院科室：<span
                          v-if="patientInfo.outDept"
                          tableName="sys_org"
                          :conditionMap="{
                                        org_type: '_DEPT_',
                                        id: patientInfo.outDept || ''
                                        }"
                          columns="org_nm"
                          v-tableTransform
                        ></span></span>
                <span>病区：
                         <span
                           v-if="patientInfo.wardId"
                           tableName="sys_ward"
                           :conditionMap="{ward_code:patientInfo.wardId || ''}"
                           columns="ward_name"
                           v-tableTransform
                         ></span>
                        </span>
                <span>床位：{{patientInfo.bedCode || ''}}</span>
                <span>主管医生：{{patientInfo.manageDoctorName || ''}}</span>
                <span>责任护士：{{patientInfo.manageNurseName || ''}}</span>
                <!-- <span>{{patientInfo.patientName}}</span>
                <span :val="patientInfo.patientGender" code="GENDER_CODE" v-codeTransform></span>
                <span>{{patientInfo.patientAge}}</span> -->
              </div>
            </div>


            <l-card-title>
              <span slot="left">转移申请</span>
            </l-card-title>
            <div class="change-section">
              <div class="clearfix">
                <div style="line-height: 37px;width: 200px;margin-left:20px" class="float-left margin-right-10">
                  <el-radio-group v-model="transferType" @change="radioClick">
                    <el-radio :label="3">转科</el-radio>
                    <el-radio :label="6">转区</el-radio>
                  </el-radio-group>
                </div>
                <!-- <div class="float-left margin-right-10" style="width: 300px;">
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
                </div> -->
                <div class="float-left margin-right-10" style="width: 300px;" v-if="transferType == 3">
                  <l-formt-title label="申请科室" :required="true">
                    <l-value-domain
                      remoteUrl="/appointment/doctorSchedule/getDept"
                      :value.sync="ruleForm.targetDept"
                      remoteShowKey="deptName"
                      remoteValueKey="deptId"
                      placeholder="请选择"
                      clearable
                      @change="selectIllnessArea"
                    />
                  </l-formt-title>
                </div>
                <div class="float-left margin-right-10" style="width: 300px;">
                  <l-formt-title label="申请病区" :required="true" :disabled="transferType == 3 && ruleForm.targetDept==''">
                    <el-select v-model="ruleForm.targetWardCode" clearable
                               :disabled="transferType == 3 && ruleForm.targetDept==''">
                      <el-option
                        v-for="(item,index) in illnessAreaList"
                        :key="item.wardCode+index"
                        :label="item.wardName"
                        :value="item.wardCode">
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div class="float-left">
                  <el-button
                    type="primary"
                    style="border-radius: 2px;"
                    @click="changeSectionConfirm"
                  >申请
                  </el-button>
                  <!-- <el-button type="primary" plain @click="changeSectionDialogVisible = false">取 消</el-button> -->
                </div>
              </div>
              <!-- <div class="change-section">
                  <div class="overflow-hidden">
                  <div style="line-height: 37px;width: 200px;" class="float-left margin-right-10">
                      <el-radio-group v-model="transferType" @change="radioClick">
                      <el-radio :label="3">转科</el-radio>
                      <el-radio :label="6">转区</el-radio>
                      </el-radio-group>
                  </div>
                  <div class="float-left margin-right-10" style="width: 300px;">
                      <l-formt-title label="申请病区" :required="true">
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
                  <div class="float-left">
                      <el-button
                      type="primary"
                      style="border-radius: 2px;"
                      @click="changeBedConfirm"
                      >申请</el-button>
                  </div>
                  </div>
                  <div v-if="changeBedTip" class="color15 tip">05床有患者，请选择空床！</div>
              </div> -->
            </div>
          </div>
          <!--<div>-->
          <l-card-title>
            <span slot="left">本次住院轨迹</span>
          </l-card-title>
          <div class="change-section">
            <!--时间线-->
            <div class="timeLine" style="overflow: hidden;">
              <div class="ul_box">
                <ul class="my_timeline clearfix" ref="mytimeline" style="margin-left: 10px;"
                    v-if="timeLineList.length">
                  <li class="my_timeline_item" v-for="(item,index) in timeLineList" :key="index">
                    <!--圈圈节点-->
                    <div class="my_timeline_node"
                         :style=" {'backgroundColor':'#2b4583','width':'20px','height':'20px'}"
                         :class="{active: false}"></div>
                    <!--线-->
                    <div class="my_timeline_item_line" v-if="index!==timeLineList.length-1"></div>
                    <!--标注-->
                    <div class="my_timeline_item_content" :style="{color: '#999', fontSize: '18px'}">
                      <div>{{item.operationDate}}</div>
                      <div style="margin-top: 5px">{{item.eventName}}</div>
                      <div style="margin-top: 5px">{{item.operationName}}</div>
                    </div>
                  </li>
                </ul>
                <div class="errorMsg" v-else>该患者暂无住院轨迹</div>
              </div>
            </div>
          </div>
          <!--</div>-->
        </el-card>
        <!-- 弹窗 -->
        <el-dialog :title="transferType==3?'转科提示':'转区提示'"
                   :visible.sync="dialogVisible" width="800px">
          <div class="errorMsg">
            <div>{{errorMsg}}</div>
            <div>请先核查在进行处理！</div>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible=false">确定</el-button>
          </span>
        </el-dialog>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import LeftBar from "../../components/nursingLeftBar";
  import {changeBed, changeDept, getLogRecordList} from "@/api/ipnw/nursing";
  import {getWardByDept} from "@/api/ipnw/leaveHos";

  export default {
    name: "transferBed",
    components: {
      LeftBar
    },
    data() {
      return {
        toolBoxs: ["templateQuote"],
        transferType: 3,//转科或转床
        timeLineList: [],//住院轨迹
        illnessAreaList: [],//病区
        //患者信息
        patientInfo: {},
        //转科转床表单
        ruleForm: {
          targetDept: '',
          bedId: '',
          targetBedId: '',
          targetBedCode: '',
          targetWardCode: ''
        },
        dialogVisible: false,
        errorMsg: '',
        getPatientList: false
      };
    },
    computed: {
      ...mapGetters(["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        handler(val) {
          this.patientInfo = {};
          this.patientInfo = {
            ...val,
            outDept: val.outDeptCode || val.admissionSdeptId//患者当前所在科室
          };
          this.getLogRecordList();
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      //获取住院轨迹
      async getLogRecordList() {
        this.timeLineList = [];
        try {
          let params = {
            inpCode: this.receivePatientData.inpCode
          };
          let res = await getLogRecordList(params);
          if (res.code === 1) {
            console.log('住院轨迹', res.data);
            this.timeLineList = res.data;
          } else {
            this.$message.error(res.msg || '获取住院轨迹失败');
          }
        } catch (e) {
          this.$message.error(e.msg || '获取住院轨迹失败');
        }
      },
      //转科：查询所有病区 返回第一个
      async selectIllnessArea() {
        this.illnessAreaList = [];
        this.ruleForm.targetWardCode = '';
        let res = await getWardByDept({
          deptId: this.ruleForm.targetDept
        });
        if (res.code === 1) {
          this.illnessAreaList = res.data;
        }
      },
      //转区：查询所有病区 返回第一个
      async radioClick(val) {
        if (val == 6) {
          this.illnessAreaList = [];
          this.ruleForm.targetWardCode = '';
          let res = await getWardByDept({
            deptId: this.patientInfo.outDept
          });
          if (res.code === 1) {
            this.illnessAreaList = res.data;
          }
        }
      },
      //转科转区
      changeSectionConfirm() {
        this.$showLoading();
        this.errorMsg = '';
        if (this.transferType == 3) {
          this.changeDeptConfirm();
        } else if (this.transferType == 6) {
          this.changeWardConfirm();
        }
        this.$hideLoading();
      },
      //确认转科
      async changeDeptConfirm() {
        if (this.ruleForm.targetDept === '') {
          this.$message.warning("请选择目标科室!");
          return;
        }
        if (this.ruleForm.targetWardCode === '') {
          this.$message.warning("请选择目标病区!");
          return;
        }
        try {
          let params = {
            patientId: this.receivePatientData.patientId,
            patientName: this.receivePatientData.patientName,
            patientGender: this.receivePatientData.patientGender,
            inpCode: this.receivePatientData.inpCode,
            type: 1,
            beforeDeptId: this.patientInfo.outDept,
            beforeWardId: this.patientInfo.wardId,
            nowDeptId: this.ruleForm.targetDept,
            nowWardId: this.ruleForm.targetWardCode,
            applyPatientId: '',
            applyPatientName: '',
            bedId: this.patientInfo.bedId,
            bedCode: this.patientInfo.bedCode,
            status: '',
            doctorId: this.patientInfo.manageDoctorId,
            doctorName: this.patientInfo.manageDoctorName,
            nurseId: this.patientInfo.manageNurseId,
            nurseName: this.patientInfo.manageNurseName
          };
          let res = await changeDept(params);
          if (res.code === 1) {
            this.$message.success('转科成功');
            this.getPatientList = true;
            this.getLogRecordList();
          } else if (res.code === 0) {
            this.errorMsg = res.msg;
            this.dialogVisible = true;
            this.$message.error('转科失败');
          }
        } catch (e) {
          this.$message.error(e.msg || '转科失败');
        }
      },
      //确认转区
      async changeWardConfirm() {
        if (this.ruleForm.targetWardCode === '') {
          this.$message.warning("请选择目标病区!");
          return;
        }
        try {
          let params = {
            patientId: this.receivePatientData.patientId,
            patientName: this.receivePatientData.patientName,
            patientGender: this.receivePatientData.patientGender,
            inpCode: this.receivePatientData.inpCode,
            type: 2,
            beforeDeptId: this.patientInfo.outDept,
            beforeWardId: this.patientInfo.wardId,
            nowDeptId: this.patientInfo.outDept,
            nowWardId: this.ruleForm.targetWardCode,
            applyPatientId: '',
            applyPatientName: '',
            bedId: this.patientInfo.bedId,
            bedCode: this.patientInfo.bedCode,
            status: '',
            doctorId: this.patientInfo.manageDoctorId,
            doctorName: this.patientInfo.manageDoctorName,
            nurseId: this.patientInfo.manageNurseId,
            nurseName: this.patientInfo.manageNurseName
          };
          let res = await changeDept(params);
          if (res.code === 1) {
            this.$message.success('转区成功');
            this.getPatientList = true;
            this.getLogRecordList();
          } else if (res.code === 0) {
            this.errorMsg = res.msg;
            this.dialogVisible = true;
            this.$message.error('转区失败');
          }
        } catch (e) {
          this.$message.error(e.msg || '转区失败');
        }
      },
      //监听选中左侧的患者，并获取患者对应的床号，病人姓名，性别，年龄，当前所在科室，和当前所在病区
      changePatientData(patientData) {
        // this.clearCondition();
        // this.clearTableData();
        /*this.ruleForm = {
          targetDept: '',
          bedId: '',
          targetBedId: '',
          targetBedCode: '',
          targetWardCode: ''
        };*/
        /*console.log("patientData", patientData);
        this.patientInfo = {
          bedCode: patientData.bedCode,
          patientName: patientData.patientName,
          patientGender: patientData.patientGender,
          patientAge: patientData.patientAge,
          outDept: patientData.outDeptCode || patientData.admissionSdeptId,//患者当前所在科室
          wardCode: patientData.wardId,//患者当前所在病区
          outBedId: patientData.bedId,//患者当前所在床位ID（30587）
          outBedCode: patientData.bedCode,//患者当前所在病区（01+01）
          manageDoctorName: patientData.manageDoctorName,//患者主管医生
          manageNurseName: patientData.manageNurseName//患者主管护士
        };*/
        this.patientInfo = {
          ...patientData,
          outDept: patientData.outDeptCode || patientData.admissionSdeptId//患者当前所在科室
        }
      },
      updatePatientList(data){
        this.getPatientList = data;
      },
      messageHandler() {
        // console.log("切换选项卡");
      }
    }
  };
</script>

<style lang="scss" scoped>
  .ul_box {
    width: 100%;
    // height: 60px;
    // display: inline-block;
    // float: left;
    margin-top: 2px;
    // overflow: hidden;
  }

  .my_timeline_item {
    /*display: inline-block;*/
    float: left;
    width: 200px;
    margin-bottom: 20px;
  }

  .my_timeline_node {
    box-sizing: border-box;
    border-radius: 50%;
    // cursor: pointer;
  }

  .my_timeline_node.active {
    background-color: #fff !important;
    border: 6px solid #f68720;
  }

  .my_timeline_item_line {
    width: 100%;
    height: 11px;
    margin: -12px 0 0 18px;
    border-top: 2px solid #2b4583;
    // border-left: none;
  }

  .my_timeline_item_content {
    margin: 10px 0 0 -10px;
  }


  /*.height-main-tBN {
    height: calc(100% - 460px);
    overflow-y: auto;
  }*/

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
        margin-right: 30px;
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

  .transferBedNew-content {
    /*height: calc(100% - 80px);*/
    overflow-y: auto;
  }

  .table-content {
    height: calc(100% - 60px);
  }

  .errorMsg {
    padding: 20px;
    height: 350px;
    font-size: $l-font-size-max;
    
    font-weight: normal;
    color: $l-color-fontcolor-4;
  }
</style>
