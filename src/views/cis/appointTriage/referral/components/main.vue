<template>
  <div class="referral-main width100 height100">
    <div class="referral-content width100 height-button-main">
      <el-steps :active="activeStep" align-center>
        <el-step
          v-for="(item, index) in stepList"
          :title="item"
          :key="index"
          :icon="
            index <= activeStep - 1
              ? 'iconfont icon-dianziyizhujiaohu'
              : 'iconfont icon-dianziyizhujiaohu1'
          "
        ></el-step>
      </el-steps>
      <l-card-title>
        <span slot="left">转诊信息</span>
      </l-card-title>
      <el-form ref="referralForm" :model="referralForm" :rules="rules">
        <el-row class="referral-item" :gutter="20">
          <el-col :span="5">
            <l-formt-title label="患者姓名" :disabled="true">
              <el-input v-model="referralForm.patientName" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="性别" :disabled="true">
              <el-input v-model="referralForm.patientSex" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="年龄" :disabled="true">
              <el-input v-model="referralForm.patientAge" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="9">
            <l-formt-title label="身份证" :disabled="true">
              <el-input v-model="referralForm.patientIdCard" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row class="referral-item" :gutter="20">
          <el-col :span="5">
            <el-form-item prop="patientTelephone">
              <l-formt-title label="联系方式">
                <el-input v-model="referralForm.patientTelephone"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="patientCardTypeCode">
              <LFormtTitle label="卡类型">
                <l-value-domain
                  code="MARK_TYPE_CODE"
                  :value.sync="referralForm.patientCardTypeCode"
                  placeholder="请选择"
                  @change="identificationTypeChange"
                ></l-value-domain>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="patientCardNo">
              <l-formt-title label="卡号">
                <el-input v-model="referralForm.patientCardNo"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="patientAddr">
              <l-formt-title label="家庭住址">
                <el-input v-model="referralForm.patientAddr"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="referral-item" :gutter="20">
          <el-col :span="5">
            <el-form-item prop="patientGoHos">
              <l-formt-title label="转诊单位">
                <el-select v-model="referralForm.patientGoHos" placeholder="请选择">
                  <el-option
                    v-for="item in hospitalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="patientReferralDate">
              <l-formt-title label="转诊日期">
                <el-date-picker
                  v-model="referralForm.patientReferralDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="patientGoDepCode">
              <l-formt-title label="转诊科室">
                <l-value-domain
                  clearable
                  remoteUrl="/appointment/doctorSchedule/getDept"
                  :value.sync="referralForm.patientGoDepCode"
                  remoteShowKey="deptName"
                  remoteValueKey="deptId"
                  placeholder="请选择"
                  @change="getDeptId"
                />
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="patientGoDocCode">
              <l-formt-title label="转诊医生">
                <el-select
                  v-model="referralForm.patientGoDocCode"
                  @change="docChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in doctorList"
                    :key="item.uid"
                    :label="item.uname"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="referral-item">
          <el-form-item prop="patientConditionDescribe">
            <p class="textarea-title">病情描述</p>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入患者病情描述"
              v-model="referralForm.patientConditionDescribe"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row class="referral-item">
          <el-form-item prop="patientReferralReason">
            <p class="textarea-title">转诊原因</p>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入转诊原因"
              v-model="referralForm.patientReferralReason"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="referral-bottom height-button-bottom">
      <el-button
        v-hotKey="{ func: 'func_submit' }"
        type="primary"
        :disabled="disabledBtn"
        @click="handleSubmitReferral"
      >提交转诊</el-button>
      <!-- <el-button
        v-hotKey="{ func: 'func_add1' }"
        type="primary"
        @click="handleAddReferral"
        plain
        >新增转诊</el-button
      >-->
      <el-button
        v-hotKey="{ func: 'func_delete' }"
        type="primary"
        @click="handleCancelReferral"
        plain
      >撤销转诊</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getDeptDoctorList } from "@/api/ipnw/etHospital.js";
import {
  applyReferral,
  applyReferralCancel,
  getByPatientId
} from "@/api/cis/visit/visit";
export default {
  data() {
    return {
      activeStep: 0,
      deptId: "",
      stepList: ["申请", "审核", "转出", "接诊"],
      disabledBtn: false,
      applyId: "",
      referralForm: {
        // 患者id
        patientId: "",
        //患者姓名
        patientName: "",
        //患者性别
        patientSex: "",
        // 患者性别编码
        patientSexCode: "",
        //患者年龄
        patientAge: "",
        //患者身份证号
        patientIdCard: "",
        //患者联系电话
        patientTelephone: "",
        /* 患者家庭住址--详细地址 */
        patientAddr: "",
        /* 患者卡类型 */
        patientCardType: "",
        // 患者卡类型编码
        patientCardTypeCode: "",
        /* 患者卡号 */
        patientCardNo: "",
        /* 患者转诊医院编码 */
        patientGoHosCode: "",
        /* 患者转诊医院 */
        patientGoHos: "",
        /* 患者转诊科室代码 */
        patientGoDepCode: "",
        /* 患者转诊科室 */
        patientGoDep: "",
        /* 患者转诊接诊医生代码 */
        patientGoDocCode: "",
        /* 患者转诊接诊医生 */
        patientGoDoc: "",
        /* 患者转诊日期 */
        patientReferralDate: "",
        /* 患者病情描述 */
        patientConditionDescribe: "",
        /* 患者转诊原因 */
        patientReferralReason: ""
      },
      genderOptions: [
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        },
        {
          value: "3",
          label: "其他"
        }
      ],
      cardTypeOptions: [
        {
          value: 0,
          label: "医保卡"
        }
      ],
      hospitalOptions: [
        // {
        //   value: 0,
        //   label: "上海市第九人民医院"
        // }
      ],
      doctorList: [],
      rules: {}
    };
  },
  methods: {
    getDeptId(val, item) {
      console.log(val, "deptId", this.deptId);
      if (val) {
        this.referralForm.patientGoDep = item.deptName;
      }
      this.referralForm.patientGoDoc = "";
      this.referralForm.patientGoDocCode = "";
      this.getDoctor(val);
    },
    docChange(val) {
      if (val) {
        this.referralForm.patientGoDoc = this.doctorList.find(item => {
          return val === item.uid;
        }).uname;
      }
    },
    identificationTypeChange(val, item) {
      if (val) {
        this.referralForm.patientCardType = item.name;
      } else {
        this.referralForm.patientCardType = "";
      }
    },
    getDoctor(id) {
      this.doctorList.length = 0;
      if (!id) {
        // 科室没有的情况  清除科室名称
        this.referralForm.patientGoDep = "";
        return;
      }
      getDeptDoctorList(id)
        .then(res => {
          if (res.code === 1) {
            this.doctorList = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 新增转诊
    // handleAddReferral() {
    //   Object.keys(this.referralForm).forEach(
    //     key => this.referralForm[key] = ""
    //   );
    //   let data = Object.assign(
    //     {},
    //     {
    //       patientId: "",
    //       patientName: "",
    //       patientSexCode: "",
    //       patientSex: "",
    //       patientAge: "",
    //       patientIdCard: "",
    //       patientTelephone: "",
    //       patientAddrProvinceCode: "",
    //       patientAddrProvince: "",
    //       patientAddrCityCode: "",
    //       patientAddrCity: "",
    //       patientAddrAreaCode: "",
    //       patientAddrArea: "",
    //       patientAddr: "",
    //       patientCardTypeCode: "",
    //       patientCardType: "",
    //       patientCardNo: "",
    //       patientGoOrgCode: "",
    //       patientGoOrg: "",
    //       patientGoDepCode: "",
    //       patientGoDocCode: "",
    //       patientGoDoc: "",
    //       patientReferralDate: "",
    //       patientConditionDescribe: "",
    //       patientReferralReason: "",
    //       patientReferralStatus: ""
    //     },
    //     this.receivePatientData
    //   );

    //   applyReferral(data)
    //     .then(resData => {
    //       console.log(resData, "resData");
    //     })
    //     .catch(error => {
    //       console.log(error, "error");
    //     });
    // },
    // 撤销转诊
    handleCancelReferral() {
      // 判断是否选中患者
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择患者");
      }
      if (!this.applyId) return;
      let data = {
        applyId: this.applyId
      };
      applyReferralCancel(data, true)
        .then(resData => {
          console.log(resData, "撤销");
          if (resData.code === 1) {
            this.$message.success("转诊撤销成功");
            this.disabledBtn = false;
            this.$refs["referralForm"].resetFields();
          }
        })
        .catch(error => {
          console.log(error.msg);
        });
    },
    // 提交转诊
    handleSubmitReferral() {
      // 判断是否选中患者
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择患者");
        return;
      }

      let data = Object.assign(this.referralForm, {
        patientReferralStatus: "0"
      });

      applyReferral(data, true)
        .then(resData => {
          console.log(resData, "resData");
          if (resData.data && resData.code === 1) {
            this.$message.success("提交转诊成功");
            this.applyId = resData.data.applyId;
            this.disabledBtn = true;
          } else {
            this.$message.error(resData.msg || "提交转诊失败");
          }
        })
        .catch(error => {
          console.log(error, "error");
        });
    },
    getGenderLabel(val) {
      let genderItem = this.genderOptions.find(item => item.value === val);
      return genderItem ? genderItem : "";
    },
    getAge(strBirthday) {
      let returnAge;
      let [birthYear, birthMonth, birthDay] = strBirthday.split("-");
      let d = new Date();
      let nowYear = d.getFullYear();
      let nowMonth = d.getMonth() + 1;
      let nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0;
      } else {
        let ageDiff = nowYear - birthYear;
        if (ageDiff > 0) {
          if (nowMonth === birthMonth) {
            let dayDiff = nowDay - birthDay;
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            let monthDiff = nowMonth - birthMonth;
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1;
        }
      }
      return returnAge;
    },
    resetReferralFormData() {
      this.referralForm.patientId = "";
      this.referralForm.patientName = "";
      this.referralForm.patientSex = "";
      this.referralForm.patientSexCode = "";
      this.referralForm.patientAge = "";
      this.referralForm.patientIdCard = "";
      this.referralForm.patientTelephone = "";
      this.referralForm.patientAddr = "";
      this.referralForm.patientCardType = "";
      this.referralForm.patientCardNo = "";
      this.referralForm.patientGoHosCode = "";
      this.referralForm.patientGoHos = "";
      this.referralForm.patientGoDepCode = "";
      this.referralForm.patientGoDep = "";
      this.referralForm.patientGoDocCode = "";
      this.referralForm.patientGoDoc = "";
      this.referralForm.patientReferralDate = "";
      this.referralForm.patientConditionDescribe = "";
      this.referralForm.patientReferralReason = "";
    },
    getReferralFormByPatientId(id, value) {
      let data = {
        patientId: id
      };
      getByPatientId(data)
        .then(resData => {
          if (resData.code === 1 && resData.data) {
            Object.assign(this.referralForm, resData.data);
            this.referralForm.patientGoDepCode = +this.referralForm
              .patientGoDepCode;
            this.getDoctor(this.referralForm.patientGoDepCode);
            this.disabledBtn = true;
            this.applyId = resData.data.applyId;
          } else {
            this.disabledBtn = false;
            this.applyId = "";
            this.referralForm.patientName = value.patientName;
            this.referralForm.patientAge = value.birthDate
              ? this.getAge(value.birthDate.substring(0, 10))
              : "";
            this.referralForm.patientSex = this.getGenderLabel(
              value.patientGender
            )
              ? this.getGenderLabel(value.patientGender).label
              : "";
            this.referralForm.patientSexCode = this.getGenderLabel(
              value.patientGender
            )
              ? this.getGenderLabel(value.patientGender).value
              : "";
            this.referralForm.patientId = value.patientId;
            this.referralForm.patientIdCard = value.identificationNum;
            this.referralForm.patientAddr = value.patientAddr;
            this.referralForm.patientTelephone = value.phoneNum;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.resetReferralFormData();

        this.getReferralFormByPatientId(value.patientId, value);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.referral-main {
  position: relative;

  /deep/ .el-step__title.is-process {
    font-weight: 400;
  }
  /deep/ .el-step__title.is-success {
    color: $l-color-primary;
  }
  /deep/ .el-step__head.is-success {
    color: $l-color-primary;
    border-color: $l-color-primary;
  }
}
.referral-content {
  padding: 20px;
  background: #fff;

  /deep/ .el-step__icon-inner.iconfont {
    font-size: 20px;
  }
  /deep/ .el-step__title.is-finish {
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-step__title.is-process {
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-step__title.is-wait {
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-step__head.is-process {
    color: $l-color-primary;
  }
  /deep/ .el-step__head.is-finish .el-step__line {
    background-color: $l-color-primary;
  }
}
.referral-bottom {
  padding: 20px;
  text-align: right;
  background: #fff;
  border-top: 1px solid $l-color-border-3;
  border-radius: 0 0 4px 4px;
}
.referral-item {
  margin-bottom: 20px;
}
.textarea-title {
  margin-bottom: 10px;
}
</style>
