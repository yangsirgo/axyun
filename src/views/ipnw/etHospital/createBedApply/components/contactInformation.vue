<template>
  <div class="width100 wrapper">
    <el-form ref="recordForm" :model="recordForm" :rules="rules">
      <el-col>
        <l-card-title><span slot="left">患者基本信息</span></l-card-title>
      </el-col>
      <el-row>
        <div class="clearfix img-cont">
          <div class="float-left img-right">
            <img :src="recordForm.headImg" alt="" />
          </div>

          <div class="float-left img-left">
            <el-row :gutter="8" class="margin-bottom-20">
              <el-col :span="6" class="width1024-50">
                <el-form-item prop="inpCode">
                  <l-formt-title label="家庭病床号" disabled>
                    <el-input
                      disabled
                      v-model="recordForm.inpCode"
                      style="width: 100%"
                      placeholder="请输入家庭病床号"
                      @input="inputChange($event)"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="width1024-50">
                <el-form-item prop="patientName">
                  <l-formt-title label="姓名" required>
                    <el-input
                      v-model="recordForm.patientName"
                      style="width: 100%"
                      placeholder="请输入姓名"
                      @input="inputChange($event)"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="width1024-50">
                <el-form-item prop="patientGender">
                  <LFormtTitle label="性别" required>
                    <!-- :disabled="disableEditing" -->
                    <l-value-domain
                      code="GENDER_CODE"
                      :value.sync="recordForm.patientGender"
                      class="select-container"
                      @input="inputChange($event)"
                      :placeholder="$t('base.placeholder')"
                      key="key20"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>

              <el-col :span="6" class="width1024-33 paddingLeft">
                <el-form-item prop="patientBirthday">
                  <LFormtTitle label="出生日期" required>
                    <el-date-picker
                      v-model="recordForm.patientBirthday"
                      type="date"
                      style="width: 100%"
                      placeholder="选择日期"
                      @input="inputChange($event)"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="birthPickerOption"
                    ></el-date-picker>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="width1024-33 paddingLeft">
                <el-form-item prop="nationCode" required>
                  <LFormtTitle label="民族" required>
                    <l-value-domain
                      code="NATIONAL_NAME_CODE"
                      :value.sync="recordForm.nationCode"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key1"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8" class="margin-bottom-20 width1024-100">
              <el-col :span="6" class="width1024-33">
                <el-form-item prop="nativePlaceCode">
                  <LFormtTitle label="籍贯">
                    <!-- <l-value-domain
                      type="cascader"
                      code="AdministrativDivision"
                      :value.sync="recordForm.nativePlaceCode"
                      class="select-container"
                      remoteValueKey="id"
                      remoteShowKey="label"
                      :multiple="false"
                      :relation="true"
                      :placeholder="$t('base.placeholder')"
                      key="key24"
                    ></l-value-domain> -->
                    <el-input
                      v-model="recordForm.nativePlaceCode"
                      style="width: 100%"
                      placeholder="请输入籍贯"
                      @input="inputChange($event)"
                    ></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="width1024-33">
                <el-form-item prop="bloodType">
                  <LFormtTitle label="血型" required>
                    <l-value-domain
                      code="BLOOD_TYPE_CODE"
                      :value.sync="recordForm.bloodType"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key23"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="width1024-33">
                <el-form-item prop="maritalStatus">
                  <LFormtTitle label="婚姻状况" required>
                    <l-value-domain
                      code="MARITAL_STATUS_CODE"
                      :value.sync="recordForm.maritalStatus"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key21"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="width1024-33 paddingLeft">
                <el-form-item prop="careerCode">
                  <LFormtTitle label="职业">
                    <l-value-domain
                      code="OCCUPATIONAL_CLASSIFICATION_CODE"
                      :value.sync="recordForm.careerCode"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key1"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="width1024-50">
                <el-form-item prop="workUnit">
                  <l-formt-title label="工作单位">
                    <el-input
                      v-model="recordForm.workUnit"
                      style="width: 100%"
                      placeholder="请输入"
                      @input="inputChange($event)"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8" class="margin-bottom-20 width1024-100">
              <el-col :span="6">
                <el-form-item prop="identificationType">
                  <l-formt-title label="证件类型">
                    <l-value-domain
                      required
                      code="MARK_TYPE_CODE"
                      :value.sync="recordForm.identificationType"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="identificationNum">
                  <l-formt-title label="证件号码">
                    <el-input
                      required
                      maxlength="20"
                      v-model="recordForm.identificationNum"
                      placeholder="请输入内容"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>

              <el-col :span="6" class="width1024-33">
                <el-form-item prop="settlementType">
                  <LFormtTitle label="结算类型" required>
                    <l-value-domain
                      code="settlementType"
                      :value.sync="recordForm.settlementType"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key21"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="width1024-50">
                <el-form-item prop="miNum">
                  <l-formt-title disabled label="医保号">
                    <el-input
                      disabled
                      v-model="recordForm.miNum"
                      maxlength="30"
                      style="width: 100%"
                      placeholder="请输入医保号"
                      @input="inputChange($event)"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8" class="margin-bottom-20 width1024-100">
              <el-col :span="6" class="width1024-33 paddingLeft">
                <el-form-item prop="mobileNum"  :rules="rules.archPhoneAdd">
                  <LFormtTitle label="电话" required>
                    <el-input
                      v-model="recordForm.mobileNum"
                      placeholder="请输入"
                      @input="inputChange($event)"
                    ></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item prop="addrCode">
                  <LFormtTitle label="联系地址" required>
                    <l-value-domain
                      type="cascader"
                      code="AdministrativDivision"
                      :value.sync="recordForm.addrCode"
                      class="select-container"
                      remoteValueKey="id"
                      remoteShowKey="label"
                      :multiple="false"
                      :relation="true"
                      :placeholder="$t('base.placeholder')"
                      @change="contactChange"
                      key="key3"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="familyAddress">
                  <LFormtTitle label="联系具体地址" required>
                    <el-input
                      maxlength="30"
                      v-model="recordForm.familyAddress"
                      style="width: 100%"
                      placeholder="请输入"
                    ></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-col :gutter="8" class="margin-bottom-20 width1024-100">
          <el-col class="fontSize-style"
            >联系人信息
            <span style="color: #f05a23"> *</span>
          </el-col>
          <div
            v-for="(item, index) in recordForm.archGuarantorList"
            :key="index"
            class="paddingStyleAddBox"
          >
            <el-row :gutter="8" class="margin-bottom-20">
              <el-col :span="6">
                <LDoubleInput widthRatio="105px">
                  <template slot="left">
                    <el-form-item
                      :prop="'archGuarantorList.' + index + '.relationShip'"
                      :rules="rules.relationShip"
                    >
                      <l-value-domain
                        code="RELATION_CODE"
                        :value.sync="item.relationShip"
                        :isFilterable="false"
                        class="select-container"
                        :placeholder="$t('base.placeholder')"
                        key="'key14'+index"
                        @change="concatChange(item, index, 'archGuarantorList')"
                      ></l-value-domain>
                    </el-form-item>
                  </template>
                  <template slot="right">
                    <el-form-item
                      :prop="'archGuarantorList.' + index + '.contacts'"
                      :rules="rules.fiduciaryName"
                      required
                    >
                      <el-input
                        v-model="item.contacts"
                        maxlength="18"
                        style="width: 100%"
                        placeholder="请输入"
                        @input="inputChange($event)"
                      ></el-input>
                    </el-form-item>
                  </template>
                </LDoubleInput>
              </el-col>

              <el-col :span="6">
                <el-form-item
                  :prop="'archGuarantorList.' + index + '.contactsPhone'"
                  :rules="rules.archPhone"
                >
                  <LFormtTitle label="联系人电话" required>
                    <el-input
                      v-model="item.contactsPhone"
                      maxlength="16"
                      minlength="11"
                      style="width: 100%"
                      placeholder="请输入"
                      @input="inputChange($event)"
                    ></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col
                :span="1"
                class="paddingStyle"
                v-if="recordForm.archGuarantorList.length > 1"
              >
                <span
                  @click="deleteContact(item, index)"
                  class="el-icon-delete iconFont-style"
                ></span>
              </el-col>
              <el-col
                :span="1"
                class="paddingStyle paddingStyleAdd"
                v-if="index == recordForm.archGuarantorList.length - 1"
              >
                <span
                  @click="addArchGuarantorList"
                  class="el-icon-plus iconFont-style"
                ></span>
              </el-col>
            </el-row>
          </div>
          <el-col :span="1" class="paddingStyle" v-if="deleteContactStyle">
            <span
              @click="addArchGuarantorList"
              class="el-icon-plus iconFont-style"
            ></span>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <div class="readonlyCls" v-if="readonly"></div>
    <!-- pStatus {{ pStatus }} -->
    <!-- v-if="recordFormobj.status == '2'" -->
  </div>
</template>

<script>
import { deepClone } from "@/utils/index.js";
import { telephoneReg } from "@/utils/regExpress.js";
export default {
  name: "index",
  props: {
    recordFormobj: {
      type: Object
    },
    pStatus: {},
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    // 身份证号校验
    let idNumbertest = (rule, value, callback) => {
      let testStr = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
      if (value) {
        if (testStr.test(value)) {
          callback();
        } else {
          this.$message.error("身份证号格式不正确");
        }
      } else {
        callback();
      }
    };

    //校验两位小数正整数
    let integerCheck = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        //此正则表达式验证小数位是否超过两位，小数可为1位 || 2位 || 整数
        if (!(/^\d+(\.\d{1,2})?$/.test(value) || /^\d$/.test(value))) {
          this.$message.error("输入正确的数据");
        } else {
          callback();
        }
      }
    };
    //手机号码
    let mobileNumValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("电话不为空"));
      } else if (value != parseInt(value)) {
        this.$message.error("电话应该数字");
        callback(new Error("电话应该数字"));
      } else {
        callback();
      }
    };
    //患者联系方式（手机或者座机）
    let concatPhoneAdd = (rule, value, callback) => {
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (value == "") {
        return callback(new Error("患者电话不能为空！"));
      }

      // 判断号码正确
      if (str.test(value) || telephoneReg.test(value)) {
        callback();
      } else {
        this.$message.error("患者电话有误，请重新填写");
        return callback(new Error("患者电话有误，请重新填写"));
      }
    };
    //联系方式（手机或者座机）
    let concatPhone = (rule, value, callback) => {
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (value == "") {
        return callback(new Error("联系人电话不能为空！"));
      }

      // 判断号码正确
      if (str.test(value) || telephoneReg.test(value)) {
        callback();
      } else {
        this.$message.error("联系人电话有误，请重新填写");
        return callback(new Error("联系人电话有误，请重新填写"));
      }
    };
    //姓名校验
    let patientNameValidate = (rule, value, callback) => {
      let numRule = /[0-9]/;
      if (value) {
        if (numRule.test(value)) {
          this.$message.error("姓名不允许包括数字");
          callback(new Error("姓名不允许包括数字"));
        } else {
          callback();
        }
      }
    };
    //姓名校验
    let patientNameValidateA = (rule, value, callback) => {
      let numRule = /[0-9]/;
      if (value === "" || value === undefined) {
        this.$message.error("联系人姓名不允许为空");
        callback(new Error("联系人姓名不允许为空"));
      } else {
        if (numRule.test(value)) {
          this.$message.error("姓名不允许包括数字");
          callback(new Error("姓名不允许包括数字"));
        } else {
          callback();
        }
      }
    };
    //联系人类型校验
    let relationShipValidate = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        this.$message.error("联系人关系不允许为空");
        callback(new Error("联系人关系不允许为空"));
      } else {
        callback();
      }
    };
    // 不能为空的校验
    let notNull = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        this.$message.error(rule.msg);
        callback(new Error(rule.msg));
      }
    };

    let isArrayHandler = (rule, value, callback) => {
      console.log(value, "数组校验");
      if (value && Array.isArray(value) && value.length) {
        callback();
      } else {
        this.$message.error(rule.msg);
        callback(new Error(rule.msg));
      }
    };

    return {
      birthPickerOption: {
        disabledDate(date) {
          return date.getTime() < new Date("1900-01-01 00:00:00");
        }
      },
      deleteContactStyle: false,
      //form表单
      recordForm: {
        // isHomeBed: "1",
        nativePlaceCode: "",
        bloodType: "",
        maritalStatus: "",
        nationCode: "1",
        identificationType: "",
        identificationNum: "",
        miNum: "",
        settlementType: "",
        mobileNum: "",
        addrCode: [],
        familyAddress: "",
        summaryOfIllness: "",
        createOpinions: "",
        diseaseType: "",
        createType: "",
        chargeDate2: [],
        criticalLevel: "", // 入院病情
        headImg: require("@/assets/pojehjdz.jpeg"),
        patientAge: "",
        patientBirthday: "",

        patientGender: "",
        patientId: "",
        patientName: "",
        archGuarantorList: []
      },
      // 校验规则
      rules: {
        identificationNum: [
          {
            validator: idNumbertest,
            trigger: "blur"
          }
        ],
        patientName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          },
          {
            validator: patientNameValidate,
            trigger: "blur"
          }
        ],
        patientGender: [
          {
            required: true,
            validator: notNull,
            msg: "性别不能为空",
            trigger: "blur"
          }
        ],
        bloodType: [
          {
            required: true,
            validator: notNull,
            msg: "血型不能为空",
            trigger: "blur"
          }
        ],
        maritalStatus: [
          {
            required: true,
            validator: notNull,
            msg: "婚姻状况不能为空",
            trigger: "blur"
          }
        ],
        nationCode: [
          {
            required: true,
            validator: notNull,
            msg: "民族不能为空",
            trigger: "blur"
          }
        ],

        // 结算类型
        settlementType: [
          {
            required: true,
            validator: notNull,
            msg: "结算类型不能为空",
            trigger: "blur"
          }
        ],
        mobileNum: [
          {
            required: true,
            validator: mobileNumValidate,
            msg: "电话格式不正确",
            trigger: "blur"
          }
        ],
        addrCode: [
          {
            required: true,
            validator: isArrayHandler,
            msg: "联系地址不能为空",
            trigger: "blur"
          }
        ],
        familyAddress: [
          {
            required: true,
            message: "具体联系地址不能为空",
            trigger: "blur"
          }
        ],
        patientBirthday: [
          {
            required: true,
            message: "请选择出生日期",
            trigger: "blur"
          }
        ],
        fiduciaryName: [
          {
            validator: patientNameValidateA,
            trigger: "blur"
          }
        ],
        archPhoneAdd: [
          {
            required: true,
            validator: concatPhoneAdd,
            trigger: "blur"
          }
        ],
        archPhone: [
          {
            required: true,
            validator: concatPhone,
            trigger: "blur"
          }
        ],
        relationShip: [
          {
            validator: relationShipValidate,
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  /**
   * 1、新建联系人 （addArchGuarantorList）:{1、新建多个联系人2、向联系人数组里添加一组新数据}
   * 2、删除联系人（deleteContact）:{1、删除当前联系人并在联系人数组里删除这一条数据}
   * 3、改变联系人（concatChange）:{1、当修改联系人信息时同时修改所在一组数据里面的联系人和联系电话}
   * 4、联系地址监听（contactChange）:{1、当地址数据变化时把地址code值赋给对应的省市区街道}
   * 5、清空（emptyFun）:{清空组件数据}
   * 6、抛出事件 (submit):{向父页面抛出整合后的数据包}
   * 7、重置el-input （inputChange）:{强制刷新input}
   * */
  methods: {
    //新建联系人--默认监护人
    addArchGuarantorList() {
      this.deleteContactStyle = false;
      let archGuarantorList = this.recordForm.archGuarantorList;
      archGuarantorList.push({
        patientId: "",
        relationShip: "1", //联系人与患者关系
        contacts: "", //联系人姓名
        // idCardNum: '', //联系人身份证号
        contactsPhone: "", //联系人联系方式
        recordStatus: "", //状态1-有效；0-作废

        patientType: "1", //1是监护人
        patientName: "", //姓名
        // identificationNum: '', //身份证号
        // contactsPhone: '', //手机号
        address: "", //地址数组code
        conDetail: "", //具体地址
        email: "", //邮箱
        workUnit: "", //联系人单位
        otherUnit: "" //其他单位
      });
    },
    //删除联系人
    deleteContact(item, index) {
      this.deleteContactStyle = false;
      if (item.type == "1") {
        let propsRefieds = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds.push("archGuarantorList." + index + ".idCard");
          propsRefieds.push("archGuarantorList." + index + ".contactsPhone");
        }
        this.$refs["recordForm"].clearValidate(propsRefieds);
        this.$delete(archGuarantorList, index);
        this.recordForm.archGuarantorList = [...archGuarantorList];
      } else {
        let propsRefieds1 = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds1.push("archGuarantorList." + index + ".idCard");
          propsRefieds1.push("archGuarantorList." + index + ".contactsPhone");
        }
        this.$refs["recordForm"].clearValidate(propsRefieds1);
        this.$delete(archGuarantorList, index);
        this.recordForm.archGuarantorList = [...archGuarantorList];
      }
    },
    //改变联系人
    concatChange(item, index, info) {
      if (!this.recordForm.archGuarantorList) {
        this.recordForm.archGuarantorList = [];
      }
      item.contacts = "";
      item.contactsPhone = "";
    },
    //联系地址监听
    contactChange(value, curItem) {
      if (value.length > 0 && curItem.length > 0) {
        this.recordForm.addrProvince = value[0];
        this.recordForm.addrCity = value[1];
        this.recordForm.addrDistrict = value[2];
        this.recordForm.addrStreet = value[3];
        this.recordForm.addrVillage = value[4];
      } else {
        this.$message.error("联系地址不能为空");
        // TODO: fix bug45594 不知道为什么叫默认值
        // this.recordForm.addrCode = [2595, 2623, 2625];
      }
    },
    //清空
    emptyFun() {
      // 禁止输入
      this.disableEditing = false;
      for (let obj in this.recordForm) {
        if (obj == "headImg") {
          this.recordForm[obj] = require("@/assets/pojehjdz.jpeg");
        } else {
          this.recordForm[obj] = "";
        }
      }
      this.recordForm.archGuarantorList = [];
    },
    //提交表单
    submit() {
      let obj = {};
      return new Promise((resolve, reject) => {
        this.$refs["recordForm"].validate(async valid => {
          if (valid) {
            obj = this.recordForm;
            resolve(obj);
          } else {
            reject(false);
          }
        });
      });
    },
    //element组件input无法输入问题
    inputChange(e) {
      this.$forceUpdate();
    }
  },
  watch: {
    recordFormobj: {
      handler(n) {
        console.log(n, "传输到个人信息组件的消息");
        this.recordForm = deepClone(n);
        this.recordForm.nativePlaceCode = n.hasOwnProperty("applyId") ? n.nativePlaceCode : n.houseHoldDetail;
        if (this.recordForm.archGuarantorList && this.recordForm.archGuarantorList.length == 0) {
          this.addArchGuarantorList();
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.img-cont {
  .img-left {
    width: calc(100% - 148px);
  }

  .img-right {
    width: 118px;
    height: 118px;
    border: 1px solid $l-color-bgcolor-11;
    margin-right: 10px;
    padding: 3px;

    img {
      width: 110px;
      height: 110px;
    }
  }
}
.paddingStyle {
  width: 33px;
  height: 33px;
  margin-left: 8px;
}
.fontSize-style {
  text-align: left;
  color: #949da3;
  line-height: 20px;
  height: 20px;
  font-size: 14px;
  margin-bottom: 8px;
}
.iconFont-style {
  cursor: pointer;
  width: 35px;
  height: 35px;
  background-color: #f2f4f6;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.margin-bottom-20 {
  margin-bottom: 1px;
}
.readonlyCls{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.01;
  background-color: black;
}
.wrapper {
  position: relative;
}
</style>
