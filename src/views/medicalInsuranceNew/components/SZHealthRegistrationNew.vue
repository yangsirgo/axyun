<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :append-to-body="true"
    top="5vh"
    :before-close="cancel"
  >
    <div class="dialogContent">
      <div class="top-cont">
        <div class="title">个人医保信息</div>
        <SZReadCard
          ref="SZReadCard"
          @cardInfo="cardInfoHandler"
          @patientInsurenceData="patientInsurenceData"
          :showPopover="false"
          v-show="type === 'add'"
        ></SZReadCard>
      </div>
      <div class="sePatieentInfo-cont">
        <SZPatientInfo
          :colNum="4"
          :siPatientDto="siPatientDto"
          :tableData="tableData"
          style="flex: 1"
        ></SZPatientInfo>
      </div>
      <div class="register-cont">
        <div class="title">医保登记信息</div>
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-row :gutter="10">
            <el-col
              v-for="(item, index) in formList"
              :key="index"
              :span="item.span"
              style="margin-bottom: 3px"
            >
              <el-form-item :prop="item.prop">
                <LFormtTitle
                  :label="item.label"
                  :required="item.required"
                  :disabled="item.disabled"
                >
                  <template v-if="item.type === 'input'">
                    <el-input
                      v-model="form[item.prop]"
                      :disabled="item.disabled"
                      clearable
                    ></el-input>
                  </template>
                  <template v-else-if="item.type === 'textArea'">
                    <el-input
                      type="textarea"
                      v-model="form[item.prop]"
                      clearable
                      :disabled="item.disabled"
                      :autosize="{
                        minRows: item.minRows || 0,
                        maxRows: item.maxRows || Infinity,
                      }"
                      :minlength="item.minlength || 0"
                      :maxlength="item.maxlength || Infinity"
                    ></el-input>
                  </template>
                  <template v-else-if="item.type === 'select'">
                    <template v-if="item.prop === 'medicalTypeCode'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        @change="
                          selectChange(
                            form[item.prop],
                            'medicalTypeName',
                            'medicalTypeList',
                            'dictCode',
                            'dictName'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in medicalTypeList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'insuranceTypeCode'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        @change="
                          selectChange(
                            form[item.prop],
                            'insuranceTypeName',
                            'insutypeList',
                            'dictCode',
                            'dictName'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in insutypeList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'matnTypeCode'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        @change="
                          selectChange(
                            form[item.prop],
                            'matnTypeName',
                            'matnTypeList',
                            'dictCode',
                            'dictName'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in matnTypeList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'birctrlType'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        @change="
                          selectChange(
                            form[item.prop],
                            'birctrlTypeName',
                            'birctrlTypeList',
                            'dictCode',
                            'dictName'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in birctrlTypeList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'latechbFlag'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                      >
                        <el-option
                          v-for="(item, index) in latechbFlagList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'pretFlag'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                      >
                        <el-option
                          v-for="(item, index) in pretFlagList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'copFlag'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                      >
                        <el-option
                          v-for="(item, index) in copFlagList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'dischargeStatusCode'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        @change="
                          selectChange(
                            form[item.prop],
                            'dischargeStatusName',
                            'dischargeStatusList',
                            'dictCode',
                            'dictName'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in dischargeStatusList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'singleDiseaseCode'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        filterable
                        remote
                        :remote-method="
                          (query) => {
                            return remoteMethodDis(
                              query,
                              'payperDiseOptionsInit'
                            );
                          }
                        "
                        reserve-keyword
                        default-first-option
                        @focus="
                          remoteMethodDis(
                            form[item.prop],
                            'payperDiseOptionsInit'
                          )
                        "
                        @change="
                          selectChange(
                            form[item.prop],
                            'singleDiseaseName',
                            'payperDiseOptions',
                            'abzjsbzmldm',
                            'abzjsbzmc'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in payperDiseOptions"
                          :key="index"
                          :label="item.abzjsbzmc"
                          :value="item.abzjsbzmldm"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'oprnOprtCode'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        filterable
                        remote
                        :remote-method="
                          (query) => {
                            return remoteMethodOpr(
                              query,
                              'oprnOprtOptionsInit'
                            );
                          }
                        "
                        reserve-keyword
                        default-first-option
                        @focus="
                          remoteMethodOpr(
                            form[item.prop],
                            'oprnOprtOptionsInit'
                          )
                        "
                        @change="
                          selectChange(
                            form[item.prop],
                            'oprnOprtName',
                            'oprnOprtOptionsInit',
                            'ssczdm',
                            'ssczmc'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in oprnOprtOptions"
                          :key="index"
                          :label="item.ssczmc"
                          :value="item.ssczdm"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'daysrgDiseListCode'">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        @change="
                          selectChange(
                            form[item.prop],
                            'daysrgDiseListName',
                            'daysrgDiseList',
                            'rjssbzmldm',
                            'rjssbzmc'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in daysrgDiseList"
                          :key="index"
                          :label="item.rjssbzmc"
                          :value="item.rjssbzmldm"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template
                      v-else-if="
                        item.prop.indexOf('DiagCode') > -1 ||
                        item.list.indexOf('DiagList') > -1
                      "
                    >
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                        filterable
                        remote
                        :remote-method="
                          (query) => {
                            return remoteMethod(query, item.list);
                          }
                        "
                        reserve-keyword
                        default-first-option
                        @focus="remoteMethod(form[item.prop], item.list)"
                        @change="
                          selectChange(
                            form[item.prop],
                            item.name,
                            item.list,
                            'zddm',
                            'zdmc'
                          )
                        "
                      >
                        <el-option
                          v-for="(item, index) in diagListObj[item.list]"
                          :key="index"
                          :label="item.zdmc"
                          :value="item.zddm"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop.indexOf('TwFlag') > -1">
                      <el-select
                        v-model="form[item.prop]"
                        clearable
                        :disabled="item.disabled"
                      >
                        <el-option
                          v-for="(item, index) in diagTwFlagList"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </template>
                  <template v-else-if="item.type === 'date'">
                    <el-date-picker
                      v-model="form[item.prop]"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      clearable
                      :disabled="item.disabled"
                    >
                    </el-date-picker>
                  </template>
                  <template v-else-if="item.type === 'inputNumber'">
                    <el-input-number
                      v-model="form[item.prop]"
                      controls-position="right"
                      :disabled="item.disabled"
                      :min="item.min"
                      :max="item.max"
                      :step="1"
                      step-strictly
                    ></el-input-number>
                  </template>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">{{
        type === "add" ? "登记新建" : "登记修改"
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import SZReadCard from "@/views/medicalInsuranceNew/components/SZReadCard.vue";
import SZPatientInfo from "@/views/medicalInsuranceNew/components/SZPatientInfo.vue";
import {
  formList,
  rules,
} from "@/views/medicalInsuranceNew/common/SzhealthRegistrationNew.js";
import { deepClone } from "@/utils";

import healthInsuranceService from "@/api/healthInsurance/index.js";
import appointment from "@/api/appointment/appointment";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

export default {
  name: "SzhealthRegistrationNew",
  mixins: [getDictInfoNew],
  components: {
    SZReadCard,
    SZPatientInfo,
  },
  props: {
    formEdit: {
      type: Object,
      default() {
        return {};
      },
    },
    finAdId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "add",
    },
    identifyInfo: {
      type: Object,
      default() {
        return {
          identificationType: "",
          identificationNum: "",
        };
      },
    },
  },
  data() {
    return {
      cardInfo: {},
      // 基本信息
      siPatientDto: {},
      // 身份信息
      siPatientIdentifyDtos: [],
      // 参保信息
      siPatientInsuranceInfoDtos: [],
      // 医保登记form
      form: {},
      medicalTypeList: [],
      insutypeList: [],
      matnTypeList: [],
      birctrlTypeList: [],
      latechbFlagList: [],
      pretFlagList: [],
      copFlagList: [],
      dischargeStatusList: [],
      payperDiseOptions: [],
      payperDiseOptionsInit: [],
      oprnOprtOptions: [],
      oprnOprtOptionsInit: [],
      daysrgDiseList: [],
      diagList: [],
      diagTwFlagList: [
        {
          dictCode: "1",
          dictName: "西医",
        },
      ],
      diagListObj: {
        mainDiagList: [],
        firstDiagList: [],
        secondDiagList: [],
        dischargeDiagList: [],
        discharge1DiagList: [],
        discharge2DiagList: [],
      },
    };
  },
  computed: {
    tableData() {
      return {
        siPatientIdentifyDtos: this.siPatientIdentifyDtos,
        siPatientInsuranceInfoDtos: this.siPatientInsuranceInfoDtos,
      };
    },
    formList() {
      return formList;
    },
    rules() {
      return rules;
    },
  },
  watch: {
    type: {
      async handler(val) {
        await this.getRegInfo();
        if (val == "add") {
          // 初始化表单
          this.form.medicalTypeCode = "71";
          this.selectChange(
            this.form.medicalTypeCode,
            "medicalTypeName",
            "medicalTypeList",
            "dictCode",
            "dictName"
          );
          this.form.mainDiagTwFlag = "1";
          // this.form.firstDiagTwFlag = "1";
          // this.form.secondDiagTwFlag = "1";
          // 如果界面有身份证号码，带过来
          if (
            this.identifyInfo.identificationType == "1" &&
            this.identifyInfo.identificationNum
          ) {
            this.$nextTick(() => {
              this.$refs.SZReadCard.cardData =
                this.identifyInfo.identificationNum;
              this.$refs.SZReadCard.searchEnter();
            });
          }
        }
        await this.operationFindFuc();
        await this.getPayperDiseFuc();
        await this.daySurgeryFindFuc();
        await this.diseandDiagFindFuc();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDictNew("med_type").then((res) => {
      this.medicalTypeList = res;
    });
    this.getDictNew("matn_type").then((res) => {
      this.matnTypeList = res;
    });
    this.getDictNew("birctrl_type").then((res) => {
      this.birctrlTypeList = res;
    });
    this.getDictNew("latechb_flag").then((res) => {
      this.latechbFlagList = res;
    });
    this.getDictNew("pret_flag").then((res) => {
      this.pretFlagList = res;
    });
    this.getDictNew("cop_flag").then((res) => {
      this.copFlagList = res;
    });
    this.getDictNew("dscg_way").then((res) => {
      this.dischargeStatusList = res;
    });
  },
  methods: {
    //获取患者医保信息
    async getRegInfo() {
      try {
        let res = await appointment.YBRegInfo({
          finAdId: this.finAdId,
          medicareType: "02",
        });
        if (res.code == 1) {
          this.form = res.data.siRegDto || {};
          this.cardInfo = res.data.siReadCardDataDto || {};
          this.patientInsurenceData({
            siPatientDto: res.data.siPatientDto || {},
            siPatientIdentifyDtos: res.data.siPatientIdentifyDtos || [],
            siPatientInsuranceInfoDtos:
              res.data.siPatientInsuranceInfoDtos || [],
          });
        }
      } catch (error) {}
    },
    cardInfoHandler(data) {
      this.cardInfo = data;
    },
    patientInsurenceData(data) {
      if (data.hasOwnProperty("siPatientDto")) {
        this.siPatientDto = {};
        this.siPatientIdentifyDtos = [];
        this.siPatientInsuranceInfoDtos = [];
        this.siPatientDto = data.siPatientDto;
        // 身份信息
        this.siPatientIdentifyDtos = data.siPatientIdentifyDtos;
        // 参保信息
        this.siPatientInsuranceInfoDtos = data.siPatientInsuranceInfoDtos;
        let insutypeList = data.siPatientInsuranceInfoDtos;
        this.getDictNew("insutype").then((res) => {
          let arr = [];
          let list = res;
          for (let i in insutypeList) {
            // let dateTimes =
            //   insutypeList[i].hasOwnProperty("endDate") &&
            //   insutypeList[i].endDate.indexOf(" ") > -1
            //     ? new Date(insutypeList[i].endDate).getTime()
            //     : 0;
            // let dateTimeNows = new Date(
            //   new Date().format("YYYY-MM-DD")
            // ).getTime();
            // if (
            //   !insutypeList[i].hasOwnProperty("endDate") ||
            //   !insutypeList[i].endDate ||
            //   dateTimeNows - dateTimes > 0
            // ) {
              let obj = {
                ...insutypeList[i],
                dictCode: insutypeList[i].insuranceType,
              };
              for (let j in list) {
                if (list[j].dictCode == insutypeList[i].insuranceType) {
                  obj.dictName = list[j].dictName;
                  break;
                }
              }
              arr.push(obj);
            // }
          }
          this.insutypeList = arr;
          for (let j in insutypeList) {
            if (
              insutypeList[j].insuranceType == "390" ||
              insutypeList[j].insuranceType == "310" ||
              insutypeList[j].insuranceType == "380" ||
              insutypeList[j].insuranceType == "39001" ||
              insutypeList[j].insuranceType == "31001"
            ) {
              this.form.insuranceTypeCode = insutypeList[j].insuranceType;
              this.selectChange(
                this.form.insuranceTypeCode,
                "insuranceTypeName",
                "insutypeList",
                "dictCode",
                "dictName"
              );
              break;
            }
          }
        });
      }
    },
    //医保住院登记-新建
    async addYBReg() {
      console.log("this.form", this.form);
      let res = await appointment.postYBReg({
        siRegDto: this.form, //登记信息
        siReadCardDataDto: {
          ...this.cardInfo,
          siCardNum: this.cardInfo.certNo,
          cardType: this.cardInfo.cardType,
        }, //读卡信息信息
        siPatientDto: this.siPatientDto, //患者信息
        siPatientInsuranceInfoDtos: this.siPatientInsuranceInfoDtos, // 参保信息
        siPatientIdentifyDtos: this.siPatientIdentifyDtos, // 身份信息
        medicareType: "02",
      });
      return res;
    },
    //医保住院登记-修改
    async changeYBReg() {
      let res = await appointment.putYBReg({
        siRegDto: this.form, //登记信息
        siReadCardDataDto: {
          ...this.cardInfo,
          siCardNum: this.cardInfo.certNo,
          cardType: this.cardInfo.cardType,
        }, //读卡信息信息
        siPatientDto: this.siPatientDto, //患者信息
        siPatientInsuranceInfoDtos: this.siPatientInsuranceInfoDtos, // 参保信息
        siPatientIdentifyDtos: this.siPatientIdentifyDtos, // 身份信息
        medicareType: "02",
      });
      return res;
    },
    cancel() {
      this.$emit("cancel");
    },
    async sure() {
      // 日间手术病种存在，手术操作非空校验
      if (this.form.daysrgDiseListCode && !this.form.oprnOprtCode) {
        this.$message.warning("请选择手术操作再进行保存！");
        return;
      }
      // 诊断存在，中西医诊断标志非空校验
      /* if (this.form.firstDiagCode && !this.form.firstDiagTwFlag) {
        this.$message.warning("请选择第一副诊断中西医标志再进行保存！");
        return;
      }
      if (this.form.secondDiagCode && !this.form.secondDiagTwFlag) {
        this.$message.warning("请选择第二副诊断中西医标志再进行保存！");
        return;
      } */
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.$showLoading();
          try {
            if (this.type == "add") {
              let res = await this.addYBReg();
              if (res.code == 1) {
                this.$emit("sure");
                this.$message.success("新建登记成功");
              }
            }
            if (this.type == "change") {
              let res = await this.changeYBReg();
              if (res.code == 1) {
                this.$emit("sure");
                this.$message.success("修改登记成功");
              }
            }
          } catch (error) {
          } finally {
            this.$hideLoading();
          }
        }
      });
    },
    remoteMethod(query, listName) {
      let list = deepClone(this.diagList);
      if (!query) {
        this.diagListObj[listName] = list.slice(0, 200);
        return;
      }
      let arr = list.filter((item) => {
        return (
          (item.zdmc && item.zdmc.indexOf(query) > -1) ||
          (item.zddm && item.zddm.indexOf(query) > -1) ||
          (item.pycode && item.pycode.indexOf(query) > -1)
        );
      });
      // debugger
      this.diagListObj[listName] = arr;
    },
    remoteMethodOpr(query, listName) {
      let list = deepClone(this.oprnOprtOptionsInit);
      if (!query) {
        this.oprnOprtOptions = list.slice(0, 200);
        return;
      }
      let arr = list.filter((item) => {
        return (
          (item.ssczmc && item.ssczmc.indexOf(query) > -1) ||
          (item.pycode && item.pycode.indexOf(query) > -1)
        );
      });
      this.oprnOprtOptions = arr;
    },
    remoteMethodDis(query, listName) {
      let list = deepClone(this.payperDiseOptionsInit);
      if (!query) {
        this.payperDiseOptions = list.slice(0, 200);
        return;
      }
      let arr = list.filter((item) => {
        return (
          (item.mmmtbzmc && item.mmmtbzmc.indexOf(query) > -1) ||
          (item.pycode && item.pycode.indexOf(query) > -1)
        );
      });
      this.payperDiseOptions = arr;
    },
    selectChange(val, name, options, dictCode, dictName) {
      let optionsList = this[options];
      // 如果选择了诊断，相应的诊断标志选西医
      if (name.indexOf("DiagName") > -1) {
        optionsList = this.diagListObj[options];
        this.form[name.split("DiagName")[0] + "DiagTwFlag"] = "1";
      } else if (name.indexOf("dischargeDiag") > -1) {
        optionsList = this.diagListObj[options];
        this.form[name.split("Name")[0] + "TwFlag"] = "1";
      }
      for (let i in optionsList) {
        if (val == optionsList[i][dictCode]) {
          this.form[name] = optionsList[i][dictName];
          break;
        }
      }
      // 结算病种与日间手术病种二选一
      if (options === "oprnOprtOptions") {
        this.form.singleDiseaseCode = "";
        this.form.singleDiseaseName = "";
      }
      if (options === "payperDiseOptions") {
        this.form.oprnOprtCode = "";
        this.form.oprnOprtName = "";
      }
    },
    async getPayperDiseFuc() {
      this.getPayperDise((data) => {
        this.payperDiseOptionsInit = data;
        if (this.form.singleDiseaseName) {
          this.remoteMethodDis(
            this.form.singleDiseaseName,
            "payperDiseOptionsInit"
          );
        } else {
          this.payperDiseOptions = deepClone(data).slice(0, 200);
        }
      });
    },
    async operationFindFuc() {
      await this.operationFind((data) => {
        this.oprnOprtOptionsInit = data;
        if (this.form.oprnOprtName) {
          this.remoteMethodOpr(this.form.oprnOprtName, "oprnOprtOptionsInit");
        } else {
          this.oprnOprtOptions = deepClone(data).slice(0, 200);
        }
      });
    },
    async daySurgeryFindFuc() {
      await this.daySurgeryFind((data) => {
        this.daysrgDiseList = data;
      });
    },
    async diseandDiagFindFuc() {
      this.diseandDiagFind(async (data) => {
        console.log("this.diagList", data.length);
        this.diagList = data;
        if (this.form.mainDiagCode) {
          await this.remoteMethod(this.form.mainDiagCode, "mainDiagList");
        } else if (this.form.mainDiagName) {
          await this.remoteMethod(this.form.mainDiagName, "mainDiagList");
        } else {
          this.diagListObj.mainDiagList = deepClone(data).slice(0, 200);
        }
        if (this.form.firstDiagCode) {
          await this.remoteMethod(this.form.firstDiagCode, "firstDiagList");
        } else if (this.form.firstDiagName) {
          await this.remoteMethod(this.form.firstDiagName, "firstDiagList");
        } else {
          this.diagListObj.firstDiagList = deepClone(data).slice(0, 200);
        }
         if (this.form.secondDiagCode) {
          await this.remoteMethod(this.form.secondDiagCode, "secondDiagList");
        } else if (this.form.secondDiagName) {
          await this.remoteMethod(this.form.secondDiagName, "secondDiagList");
        } else {
          this.diagListObj.secondDiagList = deepClone(data).slice(0, 200);
        }
        if (this.form.dischargeDiagCode) {
          await this.remoteMethod(
            this.form.dischargeDiagCode,
            "dischargeDiagList"
          );
        } else if (this.form.dischargeDiagName) {
          await this.remoteMethod(
            this.form.dischargeDiagName,
            "dischargeDiagList"
          );
        } else {
          this.diagListObj.dischargeDiagList = deepClone(data).slice(0, 200);
        }
        if (this.form.dischargeDiag1Code) {
          await this.remoteMethod(
            this.form.dischargeDiag1Code,
            "discharge1DiagList"
          );
        } else if (this.form.dischargeDiag1Name) {
          await this.remoteMethod(
            this.form.dischargeDiag1Name,
            "discharge1DiagList"
          );
        } else {
          this.diagListObj.discharge1DiagList = deepClone(data).slice(0, 200);
        }
        if (this.form.dischargeDiag2Code) {
          await this.remoteMethod(
            this.form.dischargeDiag2Code,
            "discharge2DiagList"
          );
        } else if (this.form.dischargeDiag2Name) {
          await this.remoteMethod(
            this.form.dischargeDiag2Name,
            "discharge2DiagList"
          );
        } else {
          this.diagListObj.discharge2DiagList = deepClone(data).slice(0, 200);
        }
        /* this.diagList.forEach(item => {
          if(item.zddm == "BWP050") {
            console.log("找到的诊断obj：", item)
          }
        }) */
      });
    },
  },
};
</script>
<style lang="scss">
.dialogContent {
  padding: 8px;
  height: 630px;
  overflow-y: auto;
  .top-cont {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    height: 32px;
    line-height: 32px;
    font-size: 18px;
    font-weight: bold;
  }
  .sePatieentInfo-cont {
    height: 202px;
  }
  .register-cont {
    .l-input-title:after {
      content: "" !important;
      width: 1px !important;
      height: 14px !important;
      font-size: 14px !important;
      padding-left: 4px !important;
      vertical-align: middle !important;
      font-weight: bolder !important;
      color: transparent !important;
    }
    .required .l-input-title:after {
      content: "*" !important;
      width: 7px !important;
      color: #f05a23 !important;
    }
  }
}
</style>