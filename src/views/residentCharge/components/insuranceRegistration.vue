<template>
  <div class="insuranceRegistration">
    <div class="top width100">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="searchData" placeholder="请读取医保卡、身份证、就诊卡">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" class="duka-button"><i class="iconfont iconduka"></i>读卡</el-button>
        </el-col>
      </el-row>
    </div>
    <el-form ref="insuranceForm" :model="insuranceForm" :rules="rules">
      <div class="base-info">
        <l-card-title>
          <template slot="left">基本信息</template>
        </l-card-title>
        <div class="base-info-cont">
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="5">
              <LFormtTitle label="个人编号" disabled>
                <el-form-item label="" label-width="" prop="personalNo">
                  <el-input v-model="insuranceForm.personalNo" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="社保卡号" disabled>
                <el-form-item label="" label-width="" prop="SINCardNo">
                  <el-input v-model="insuranceForm.SINCardNo" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="身份证号" disabled>
                <el-form-item label="" label-width="" prop="identificationNum">
                  <el-input v-model="insuranceForm.identificationNum" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="年度" disabled>
                <el-form-item label="" label-width="" prop="year">
                  <el-input v-model="insuranceForm.year" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="5">
              <LFormtTitle label="患者姓名" disabled>
                <el-form-item label="" label-width="" prop="patientName">
                  <el-input v-model="insuranceForm.patientName" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="患者性别" disabled>
                <el-form-item label="" label-width="" prop="patientGender">
                  <el-input v-model="insuranceForm.patientGender" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="3">
              <LFormtTitle label="年龄" disabled>
                <el-form-item label="" label-width="" prop="patientAge">
                  <el-input v-model="insuranceForm.patientAge" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="3">
              <LFormtTitle label="民族" disabled>
                <el-form-item label="" label-width="" prop="nationCode">
                  <el-input v-model="insuranceForm.nationCode" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="出生日期" disabled>
                <el-form-item label="" label-width="" prop="birth">
                  <el-input v-model="insuranceForm.birth" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="5">
              <LFormtTitle label="统筹区" disabled>
                <el-form-item label="" label-width="" prop="planWhole">
                  <el-input v-model="insuranceForm.planWhole" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="医疗待遇" disabled>
                <el-form-item label="" label-width="" prop="medicalTreatment">
                  <el-input v-model="insuranceForm.medicalTreatment" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="10">
              <LFormtTitle label="单位名称" disabled>
                <el-form-item label="" label-width="" prop="organizationName">
                  <el-input v-model="insuranceForm.organizationName" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <el-form-item label="异地医保" label-width="" prop="otherPlaceInsurance">
                <el-radio v-model="insuranceForm.otherPlaceInsurance" label="0">是</el-radio>
                <el-radio v-model="insuranceForm.otherPlaceInsurance" label="1">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="5">
              <LFormtTitle label="参保状态" disabled>
                <el-form-item label="" label-width="" prop="insuredState">
                  <el-input v-model="insuranceForm.insuredState" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="在院状态" disabled>
                <el-form-item label="" label-width="" prop="inpatientStatus">
                  <el-input v-model="insuranceForm.inpatientStatus" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="本年住院次数" disabled>
                <el-form-item label="" label-width="" prop="admissionNum">
                  <el-input v-model="insuranceForm.admissionNum" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="上次出院日期" disabled>
                <el-form-item label="" label-width="" prop="dischargeDate">
                  <el-input v-model="insuranceForm.dischargeDate" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="5">
              <el-form-item label="门诊统筹" label-width="" prop="visitPlanWhole">
                <el-radio v-model="insuranceForm.visitPlanWhole" label="0">享受</el-radio>
                <el-radio v-model="insuranceForm.visitPlanWhole" label="1">不享受</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="定点名称" disabled>
                <el-form-item label="" label-width="" prop="pointName">
                  <el-input v-model="insuranceForm.pointName" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="生育参保状态" disabled>
                <el-form-item label="" label-width="" prop="birthInsuranceStatus">
                  <el-input v-model="insuranceForm.birthInsuranceStatus" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="7">
              <LFormtTitle label="常居住地" disabled>
                <el-form-item label="" label-width="" prop="oftenLive">
                  <el-input v-model="insuranceForm.oftenLive" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
        <l-card-title>
          <template slot="left">金额信息</template>
        </l-card-title>
        <div class="money-info-cont1">
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="本年医疗费累计" disabled>
                <el-form-item label="" label-width="" prop="a1">
                  <el-input v-model="insuranceForm.a1" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="本年账户支出累计" disabled>
                <el-form-item label="" label-width="" prop="a2">
                  <el-input v-model="insuranceForm.a2" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="本年统筹支出累计" disabled>
                <el-form-item label="" label-width="" prop="a3">
                  <el-input v-model="insuranceForm.a3" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="本年救助金支出累计" disabled>
                <el-form-item label="" label-width="" prop="a4">
                  <el-input v-model="insuranceForm.a4" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="本年公务员补助累计" disabled>
                <el-form-item label="" label-width="" prop="b1">
                  <el-input v-model="insuranceForm.b1" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="本年大病补充支出累计" disabled>
                <el-form-item label="" label-width="" prop="b2">
                  <el-input v-model="insuranceForm.b2" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="进入统筹费用累计" disabled>
                <el-form-item label="" label-width="" prop="b3">
                  <el-input v-model="insuranceForm.b3" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="基本统筹起付标准累计" disabled>
                <el-form-item label="" label-width="" prop="b4">
                  <el-input v-model="insuranceForm.b4" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="进入救助金费用累计" disabled>
                <el-form-item label="" label-width="" prop="c1">
                  <el-input v-model="insuranceForm.c1" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="大病补充起付标准累计" disabled>
                <el-form-item label="" label-width="" prop="c2">
                  <el-input v-model="insuranceForm.c2" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="进入公补费用累计" disabled>
                <el-form-item label="" label-width="" prop="c3">
                  <el-input v-model="insuranceForm.c3" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="本年慢病起付线累计" disabled>
                <el-form-item label="" label-width="" prop="c4">
                  <el-input v-model="insuranceForm.c4" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="进入大病补充费用累计" disabled>
                <el-form-item label="" label-width="" prop="d1">
                  <el-input v-model="insuranceForm.d1" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="离休奖励基金剩余金额" disabled>
                <el-form-item label="" label-width="" prop="d2">
                  <el-input v-model="insuranceForm.d2" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="本年慢病可使用限额" disabled>
                <el-form-item label="" label-width="" prop="d3">
                  <el-input v-model="insuranceForm.d3" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
        <l-card-title>
          <template slot="left">金额信息</template>
        </l-card-title>
        <div class="money-info-cont2">
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="就诊流水号" disabled>
                <el-form-item label="" label-width="" prop="serialNo">
                  <el-input v-model="insuranceForm.serialNo" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="登记时间" disabled>
                <el-form-item label="" label-width="" prop="registerDate">
                  <el-input v-model="insuranceForm.registerDate" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="经办人" disabled>
                <el-form-item label="" label-width="" prop="agent">
                  <el-input v-model="insuranceForm.agent" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="起付线" disabled>
                <el-form-item label="" label-width="" prop="startingLine">
                  <el-input v-model="insuranceForm.startingLine" style="line-height: 34px;" disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="医疗类别" labelWidth="76">
                <el-form-item label="" label-width="" prop="medicalCategory">
                  <el-select v-model="insuranceForm.medicalCategory" style="line-height: 34px;width:100%">
                    <el-option label="" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="医保账户余额" disabled>
                <el-form-item label="" label-width="" prop="insuranceAccountBalance">
                  <el-input v-model="insuranceForm.insuranceAccountBalance" style="line-height: 34px;"
                            disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账户使用" label-width="" prop="accountUse">
                <el-radio v-model="insuranceForm.accountUse" label="0">使用</el-radio>
                <el-radio v-model="insuranceForm.accountUse" label="1">不使用</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="恶性肿瘤" label-width="" prop="cancer">
                <el-radio v-model="insuranceForm.cancer" label="0">是</el-radio>
                <el-radio v-model="insuranceForm.cancer" label="1">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="诊断疾病编码">
                <el-form-item label="" label-width="" prop="diagnosticCode">
                  <el-select v-model="insuranceForm.diagnosticCode" style="line-height: 34px;width:100%">
                    <el-option label="" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="诊断疾病名称" disabled>
                <el-form-item label="" label-width="" prop="diagnosticName">
                  <el-input v-model="insuranceForm.diagnosticName" style="line-height: 34px;"
                            disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手术治疗" label-width="" prop="isOperation">
                <el-radio v-model="insuranceForm.isOperation" label="0">是</el-radio>
                <el-radio v-model="insuranceForm.isOperation" label="1">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="第一副诊断">
                <el-form-item label="" label-width="" prop="firstDiagnostic">
                  <el-select v-model="insuranceForm.firstDiagnostic" style="line-height: 34px;width:100%">
                    <el-option label="" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="副诊断名称" disabled>
                <el-form-item label="" label-width="" prop="firstDiagnosticName">
                  <el-input v-model="insuranceForm.firstDiagnosticName" style="line-height: 34px;"
                            disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="胎儿数量">
                <el-form-item label="" label-width="" prop="infantNum">
                  <el-input-number v-model="insuranceForm.infantNum" controls-position="right" :min="0"
                                   style="line-height: 34px;"></el-input-number>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <LFormtTitle label="第二副诊断">
                <el-form-item label="" label-width="" prop="secondDiagnostic">
                  <el-select v-model="insuranceForm.secondDiagnostic" style="line-height: 34px;width:100%">
                    <el-option label="" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="副诊断名称" disabled>
                <el-form-item label="" label-width="" prop="secondDiagnosticName">
                  <el-input v-model="insuranceForm.secondDiagnosticName" style="line-height: 34px;"
                            disabled></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="分娩时间">
                <el-form-item label="" label-width="" prop="deliveryDate">
                  <el-date-picker
                    v-model="insuranceForm.deliveryDate"
                    type="datetime"
                    style="line-height: 34px;"
                    placeholder="">
                  </el-date-picker>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="buttons clearfix">
        <el-button class="plain-button float-right" style="margin-left: 10px" @click="reset">清屏</el-button>
        <el-button class="primary-button float-right" @click="register">完成医保登记</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "insuranceRegistration",
    data() {
      return {
        searchData: '',
        insuranceForm: {},
        //校验规则
        rules: {
          diagnosticCode: [{required: true, message: '请选择诊断疾病编码', trigger: 'change'}],
          medicalCategory: [{required: true, message: '请选择医疗类别', trigger: 'change'}],
          accountUse: [{required: true, message: '请选择账户使用', trigger: 'change'}]
        }
      }
    },
    methods: {
      //搜索
      async search() {
        this.$showLoading();
        try {
          //获取数据接口
          let res = {
            personalNo: '123456',//个人编号
            SINCardNo: '456',//社保卡号
            identificationNum: '123456',//身份证号
            year: '',//年度
            patientName: '夏立燕',
            patientGender: 0,
            patientAge: '63岁',
            nationCode: '1',
            birth: '1999-05-25',
            planWhole: '',//统筹区
            medicalTreatment: '',//医疗待遇
            organizationName: '',//单位名称
            otherPlaceInsurance: '',//异地医保
            insuredState: '',//参保状态
            inpatientStatus: '',//在院状态
            admissionNum: '',//本年住院次数
            visitPlanWhole: '',//门诊统筹
            pointName: '',//定点名称
            birthInsuranceStatus: '',//生育参保状态
            oftenLive: '',//常居住地
            a1: '',
            a2: '',
            a3: '',
            a4: '',
            b1: '',
            b2: '',
            b3: '',
            b4: '',
            c1: '',
            c2: '',
            c3: '',
            c4: '',
            d1: '',
            d2: '',
            d3: '',
            serialNo: '',//就诊流水号
            registerDate: '',//登记时间
            agent: '',//经办人
            startingLine: '',//起付线
            medicalCategory: '',//医疗类别
            insuranceAccountBalance: '',//医保账户余额
            accountUse: 0,//账户使用
            cancer: '',//恶性肿瘤
            diagnosticCode: '',//诊断疾病编码
            diagnosticName: '',//诊断疾病名称
            isOperation: '',//手术治疗
            firstDiagnostic: '',//第一副诊断
            firstDiagnosticName: '',//第一副诊断名称
            infantNum: 0,//胎儿数量
            secondDiagnostic: '',//第二副诊断
            secondDiagnosticName: '',//第二副诊断名称
            deliveryDate: ''//分娩时间
          };
          this.insuranceForm = {...res};
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //完成登记
      register() {
        this.$refs['insuranceForm'].validate((valid) => {
          if (valid) {
            this.$showLoading();
            try {
              //医保登记接口
              // let res = await register(this.insuranceForm);
              this.$hideLoading();
              this.reset();
              this.$emit('changeDialog', false, false);
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "标准错误提示");
            }
          } else {
            this.$message.error(error.msg || "标准错误提示");
          }
        });
      },
      //清屏
      reset() {
        this.$refs['insuranceForm'].resetFields();
      }
    }
  }
</script>

<style scoped lang="scss">
  .insuranceRegistration {
    max-height: 700px;
    padding-bottom: 20px;
    overflow-y: auto;

    .top {
      padding: 20px;
      background: $l-color-bgcolor-14;
      border-radius: 2px;

      .duka-button {
        width: calc(100% - 40px);
        height: 38px;
        margin-left: 20px;
        border: none;
        border-radius: 2px;
        float: left;

        i {
          display: inline-block;
          margin-right: 10px;
        }
      }
    }

    .base-info {
      padding: 20px;
    }

    .buttons {
      padding: 20px 20px 0 0;
      border-top: 1px solid $l-color-bgcolor-11;
    }

    .primary-button {
      /*width: 80px;*/
      height: 36px;
      padding: 0 12px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;
      
      font-weight: 400;
      color: $l-color-white;
      border: none;
    }

    .plain-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      background: $l-color-white;
      border-radius: 2px;
      font-size: $l-font-size;
      
      font-weight: 400;
      color: $l-color-primary;
      border: 1px solid $l-color-primary;
    }
  }
</style>
