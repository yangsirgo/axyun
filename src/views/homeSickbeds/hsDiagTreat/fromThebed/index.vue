<template>
  <div class="fromThebed">
    <div class="fromThebed-box">
      <el-timeline>
        <el-timeline-item :icon="wrapData.leaveDiagnosisStatus ? iconStyle:''" :color="wrapData.leaveDiagnosisStatus ? colorStyle:''">
          <el-card class="fromThebed-card">
            <h4>
              <span>书写撤床诊断</span>
              <el-button v-if="!wrapData.leaveDiagnosisStatus" @click="tableFun3">去处理</el-button>
            </h4>
            <div class="passMes" v-if="!wrapData.leaveDiagnosisStatus">
              <span class="messageStyle"><i class="el-icon-info" style="color: red;"></i>还未下撤床诊断,不能撤床！</span>
            </div>
          </el-card>
        </el-timeline-item>

        <el-timeline-item :icon="wrapData.hasStopOrder ? iconStyle:''" :color="wrapData.hasStopOrder ? colorStyle:''">
          <el-card class="fromThebed-card">
            <h4>
              <span>开撤床医嘱</span>
              <el-button v-if="!wrapData.hasStopOrder" @click="tableFun">去处理</el-button>
            </h4>
            <div class="passMes" v-if="!wrapData.hasStopOrder">
              <span class="messageStyle"><i class="el-icon-info" style="color: red;"></i>还未开撤床医嘱</span>
            </div>
          </el-card>
        </el-timeline-item>

        <el-timeline-item :icon="wrapData.noStopOrderCount == 0 ? iconStyle:''" :color="wrapData.noStopOrderCount == 0 ? colorStyle:''">
          <el-card class="fromThebed-card">
            <h4> <span>停止全部医嘱</span>
              <el-button v-if="wrapData.noStopOrderCount != 0" @click="tableFun4">去处理</el-button>
            </h4>
            <div class="passMes" v-if="wrapData.noStopOrderCount != 0">
              <span class="messageStyle"><i class="el-icon-info" style="color: red;"></i>还有{{wrapData.noStopOrderCount}}条长期医嘱未停止</span>
            </div>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :icon="wrapData.noSendDrugCount == 0 ? iconStyle:''" :color="wrapData.noSendDrugCount == 0 ? colorStyle:''">
          <el-card class="fromThebed-card">
            <h4>
              <span>完成全部药品发药</span>
              <!-- <el-button @click="tableFun5" v-if="wrapData.noSendDrugCount != 0">去处理</el-button> -->
            </h4>
            <div v-if="wrapData.noSendDrugCount != 0">
              <span class="messageStyle"><i class="el-icon-info" style="color: red;"></i>还有{{wrapData.noSendDrugCount}}条药品未发药</span>
              <p>
                <span class="messageStyle"><i class="el-icon-info" style="color: #000000;"></i>还有{{wrapData.sendDrugRefuseCount}}条药品申请拒绝</span>
              </p>
              <div style="max-height: 150px;overflow: auto;">
                <p v-for="(item,index) in wrapData.drugRefuseResaonVoList" :key="index">
                  <span class="messageStyle"><i class="el-icon-info" style="color: #000000;">{{item.orderItemName}}</i></span>
                </p>
              </div>

            </div>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :icon="wrapData.noRefundDrugCount == 0 ? iconStyle:''" :color="wrapData.noRefundDrugCount == 0 ? colorStyle:''">
          <el-card class="fromThebed-card">
            <h4>
              <span>完成全部药品退药</span>
              <!-- <el-button @click="tableFun6" v-if="wrapData.noRefundDrugCount != 0">去处理</el-button> -->
            </h4>
            <div class="passMes" v-if="wrapData.noRefundDrugCount != 0">
              <span class="messageStyle"><i class="el-icon-info" style="color: red;"></i>还有{{wrapData.noRefundDrugCount}}条药品未退药</span>

            </div>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :icon="wrapData.noComfirmExecCount == 0 ? iconStyle:''" :color="wrapData.noComfirmExecCount == 0 ? colorStyle:''">
          <el-card class="fromThebed-card">
            <h4>
              <span>完成所有医嘱执行</span>
              <el-button @click="tableFun7" v-if="wrapData.noComfirmExecCount != 0">去处理</el-button>
            </h4>
            <div class="passMes" v-if="wrapData.noComfirmExecCount != 0">
              <span class="messageStyle"><i class="el-icon-info" style="color: red;"></i>还有{{wrapData.noComfirmExecCount}}条医嘱未执行(请进入医嘱执行页面操作！！)</span>
            </div>
          </el-card>
        </el-timeline-item>

        <el-timeline-item :icon="disabledStyle  == false ? iconStyle:'' " :color="disabledStyle  == false ? colorStyle:'' ">
          <el-card class="fromThebed-card">
            <div>撤床</div>
            <el-col style="padding: 4px;">
              <el-col :span="8" style="margin-right: 5px;">
                <l-formt-title label="撤床时间">
                  <el-date-picker v-model="value1" type="datetime" :disabled="cancelSaveStateStyle" @change="value1Fun" value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker>
                </l-formt-title>
              </el-col>
              <el-col :span="4" style="margin-right: 5px;">
                <l-formt-title label="转归">
                  <l-value-domain :code="OutcomeCode" :value.sync="leaveCheck.dischargeSituationCode" @change="OutcomeCodeFun"
                    class="select-container" :disabled="cancelSaveStateStyle" :placeholder="$t('base.placeholder')"></l-value-domain>
                </l-formt-title>
              </el-col>
            </el-col>
            <el-col style="padding: 4px;">
              <el-col :span="8" style="margin-right: 5px;" v-if="cancelSaveStateStyle">
                <l-formt-title label="操作时间">
                  <el-date-picker v-model="ruleForm.domTime" type="datetime" :disabled="true" value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker>
                </l-formt-title>
              </el-col>
              <el-col :span="4" style="margin-right: 5px;" v-if="cancelSaveStateStyle">
                <l-formt-title label="操作人">
                  <el-input value="李想" v-model="ruleForm.doctorName" :disabled="true"></el-input>
                </l-formt-title>
              </el-col>
            </el-col>

          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div class="btnStyle">
        <el-button @click="fromTesTBedFun" v-if="!cancelSaveStateStyle">撤床检测</el-button>
        <el-button type="primary" :disabled="disabledStyle" v-if="!cancelSaveStateStyle" @click="saveDataFun">确认撤床</el-button>
        <el-button type="primary" @click="cancelSaveDataFun" v-if="cancelSaveStateStyle">取消撤床</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    leaveCheck,
    leave,
    cancelOutWard
  } from '@/api/homeSickbeds/hsPatientManagement/hsPatientManagement';
  import {
    mapActions,
    mapGetters
  } from "vuex";
  export default {
    data() {
      return {
        ruleForm: {
          doctorName: "",
          domTime: new Date()
        },

        value1: new Date(), //撤床时间
        // treatEndByName:'',//操作人
        iconStyle: 'el-icon-check',
        colorStyle: '#F05A23',
        OutcomeCode: 'OutcomeCode',
        disabledStyle: false,
        leaveCheck: {
          patientId: "",
          preStopTime: '',
          treatNo: '',
          dischargeSituationCode: "",
          dischargeSituationName: '',
        },
        wrapData: {
          leaveDiagnosisStatus: '',
          noStopOrderCount: '',
          noSendDrugCount: '',
          noComfirmExecCount: '',
          hasStopOrder: "",
          noRefundDrugCount: '',
          drugRefuseResaonVoList:'',
          sendDrugRefuseCount:'',
        },
        cancelOutWardObj: {
          finAdId: '',
          inpCode: '',
        },
        cancelSaveState: '', //检查出院状态
        cancelSaveStateStyle: false,
        timmer: ''
      };
    },
    created() {

    },
    methods: {
      ...mapActions({
        changeTheRefreshLeftLIst: "homeSickbeds/changeTheRefreshLeftLIst"
      }),
      tableFun() {
        this.$emit('toolBoxsChange', [
              "drugInfo",
              "adviceTemplate",
              "Hotkey"], "orderCard");
      },
      tableFun2() {
        this.$emit('toolBoxsChange', ["adviceTemplate", "Hotkey"], "returnMedicine");
      },
      tableFun3() {
        this.$emit('toolBoxsChange', ["AuxiliaryDiagnosis",
          // "patientFullAngle",
          "InspectionResults",
          "CheckResult",
          "HistoricalDiagnosis",
          "commonDiag",
          "diagTemplate",
          // "PreviousPrescriptions",
          "Hotkey"
        ], "diagnosisCard");
      },
      tableFun4() {
        this.$emit('toolBoxsChange', [], "overViewAll");
      },
      tableFun5() { //发药
        this.$router.push('/hsDiagTreat/bedMedicine');
      },
      tableFun6() { //退药
        this.$router.push('/hsDiagTreat/bedWithdrawal');
      },
      tableFun7() { //医嘱执行
        let url = window.location.href;
        url = url.split("/");
        console.log(url);
        for (let i = 0; i < url.length; i++) {
          if (url[i] == 'hsDiagTreat') {
            this.$router.push('/hsDiagTreat/hsWillperform');
            break;
          }
          if (url[i] == 'cisOne') {
            this.$router.push('/cisOne/hsWillperform');
            break;
          }
        }
      },
      value1Fun(){
        if(!this.value1){
            this.value1 = '';
        }
      },
      saveDataFun() {
        this.value1 = this.value1 || '';
        this.leaveCheck.dischargeSituationCode = this.leaveCheck.dischargeSituationCode || '';
        if(this.value1.length == '0'){
          this.$message.error("撤床时间不能为空");
          return false;
        }
        if(this.leaveCheck.dischargeSituationCode.length == '0'){
          this.$message.error("转归不能为空");
          return false;
        }
        this.saveData(this.leaveCheck);
      },
      cancelSaveDataFun() {
        this.cancelOutWard(this.cancelOutWardObj);
      },
      OutcomeCodeFun(a, b) {
        console.log(a, b);
        this.leaveCheck.dischargeSituationCode = a;
        this.leaveCheck.dischargeSituationName = b.name;
      },
      // 取消撤床
      async cancelOutWard(data) {
        try {
          let res = await cancelOutWard(data);
          if (res.code == '1') {
            console.log(res, "撤销打印数据");
            this.cancelSaveStateStyle = false;
            this.fromTesTBed(this.leaveCheck);
            this.cancelSaveState = ""; //该患者不是
            // 刷新左侧列表

            this.$message.success(res.msg || "取消撤床成功");
          } else {
            this.$message.error(res.msg || "取消撤床失败");
          }
        } catch (error) {}
        this.changeTheRefreshLeftLIst(new Date())
      },
      async saveData(data) {

        try {
          data.preStopTime = this.value1;
          let res = await leave(data);
          if (res.code == '1') {
            console.log(res, "撤销打印数据");
            this.$message.success(res.msg || "撤床成功");
            this.cancelSaveStateStyle = true;
            // 刷新左侧列表
            this.wrapData = {
              leaveDiagnosisStatus: true,
              noStopOrderCount: 0,
              noSendDrugCount: 0,
              noComfirmExecCount: 0,
              hasStopOrder: true,
              noRefundDrugCount: 0,
            }
          } else {
            this.$message.error(res.msg || "撤床失败");
          }
        } catch (error) {}
        this.changeTheRefreshLeftLIst(new Date())
      },

      fromTesTBedFun() {
        this.fromTesTBed(this.leaveCheck);
      },
      async fromTesTBed(data) {
        try {
          let res = await leaveCheck(data);
          if (res.code == '1') {
            // this.$message.success("成功");
            console.log(res, "撤销打印数据");
            if (res.data.leaveDiagnosisStatus && res.data.hasStopOrder && res.data.noStopOrderCount == '0' && res.data
              .noSendDrugCount == "0" && res.data.noComfirmExecCount == "0" && res.data.noRefundDrugCount == '0') {
              this.disabledStyle = false;
            } else {

              this.disabledStyle = true;
            }
            this.wrapData.leaveDiagnosisStatus = res.data.leaveDiagnosisStatus;
            this.wrapData.noStopOrderCount = res.data.noStopOrderCount;
            this.wrapData.noSendDrugCount = res.data.noSendDrugCount;
            this.wrapData.noComfirmExecCount = res.data.noComfirmExecCount;
            this.wrapData.hasStopOrder = res.data.hasStopOrder;
            this.wrapData.noRefundDrugCount = res.data.noRefundDrugCount;
            this.wrapData.drugRefuseResaonVoList = res.data.drugRefuseResaonVoList;
            this.wrapData.sendDrugRefuseCount = res.data.sendDrugRefuseCount;
            this.cancelSaveStateStyle = false;
            if (this.cancelSaveState == '3') { //撤床
              this.cancelSaveStateStyle = true;
              this.wrapData = {
                leaveDiagnosisStatus: true,
                noStopOrderCount: 0,
                noSendDrugCount: 0,
                noComfirmExecCount: 0,
                hasStopOrder: true,
                noRefundDrugCount: 0,
              }
            }
          } else {
            this.$message.error(res.msg || "撤销检查失败");
          }
        } catch (error) {}
      },
    },
    computed: {
      ...mapGetters("homeSickbeds", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        immediate: true,
        deep: true,
        handler(a) {
          console.log(this.receivePatientData, "左侧传出数据");
          if (this.receivePatientData.patientId && this.receivePatientData.treatNo) {
            this.leaveCheck.patientId = this.receivePatientData.patientId;
            this.leaveCheck.treatNo = this.receivePatientData.treatNo;
            this.leaveCheck.dischargeSituationCode = this.receivePatientData.treatResultCode;
            this.leaveCheck.dischargeSituationName = this.receivePatientData.treatResultContent;
            this.cancelOutWardObj.finAdId = this.receivePatientData.finSettleId;
            this.cancelOutWardObj.inpCode = this.receivePatientData.treatNo;
            this.cancelSaveState = this.receivePatientData.status;
            this.ruleForm.doctorName = this.receivePatientData.treatEndByName; //操作人
            //  || this.receivePatientData.doctorName
            this.value1 = this.receivePatientData.treatEndTime || new Date();//撤床时间
            this.ruleForm.domTime = this.receivePatientData.treatEndByTime || new Date(); //操作时间
            this.fromTesTBed(this.leaveCheck);
            //this.$message.info("请操作撤床检测,检测是否可以撤床");
          } else {
            this.$message.error("请选择患者！！！")
          }
        }
      },
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    }
  };
</script>

<style scoped lang="scss">
  .fromThebed {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    // 更改样式不揍样式是
    /deep/ .el-timeline-item__node--normal {
      width: 25px;
      height: 25px;
      left: -8px;
      // border: 3px solid rgb(240, 90, 35);
    }

    /deep/ .el-timeline-item__icon {
      // border: 2px solid #FFFFFF;
      // border-radius: 50%;
    }

    /deep/ .el-timeline-item {
      padding-bottom: 5px;
    }

    .fromThebed-card h4 {
      margin-top: 0px;
      margin-bottom: 0px;
    }

    // 更改不走样式

    .fromThebed-box {
      width: 60%;
      height: 100%;
    }

    .fromThebed-card {
      padding: 8px;

      h4 span {
        display: inline-block;
        margin-right: 30px;
        width: 120px;
      }
    }

    .passMes {
      display: flex;
      align-items: center;
      justify-content: flex-start;

    }

    .passMes span:first-child {
      // width: 200px;
    }

    .passMes span {
      display: block;
      padding: 5px;
      margin-right: 15px;
    }

    .btnStyle {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .passStyle {
      display: block;
      padding: 8px;
      background: greenyellow;
      border-radius: 5px;
      width: 60px;
      margin-right: 30px;
    }

    .NopassStyle {
      display: block;
      padding: 8px;
      background: #f05a23;
      border-radius: 5px;
      width: 60px;
      margin-right: 30px;

    }
  }
</style>
