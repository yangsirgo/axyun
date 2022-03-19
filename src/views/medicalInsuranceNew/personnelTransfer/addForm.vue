<template>
  <div class="add-form height100">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <div style="width: 50%; margin-bottom: 8px">
        <SZReadCard
          ref="SZReadCard"
          @cardInfo="cardInfoHandler"
          @patientInsurenceData="patientInsurenceData"
          :SZReadCardDisabled="SZReadCardDisabled"
        ></SZReadCard>
      </div>
      <el-row :gutter="10">
        <el-col
          :span="item.span"
          v-for="(item, index) in formList"
          :key="index"
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
              <template v-else-if="item.type === 'date'">
                <el-date-picker
                  v-model="form[item.prop]"
                  type="date"
                  format="yyyy-MM-dd"
                  clearable
                  :disabled="item.disabled"
                >
                </el-date-picker>
              </template>
              <template v-else-if="item.type === 'select'">
                <template v-if="item.prop === 'insutype'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                    @change="
                      selectChange(
                        form[item.prop],
                        item.name,
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
                <template v-else-if="item.prop === 'insuOptins'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                  >
                    <el-option
                      v-for="(item, index) in insutypeList"
                      :key="index"
                      :label="item.insuOptinsName"
                      :value="item.insuplcAdmdvs"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'diagCode'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    filterable
                    :disabled="item.disabled"
                    @change="
                      selectChange(
                        form[item.prop],
                        item.name,
                        'diagList',
                        'zddm',
                        'zdmc'
                      )
                    "
                  >
                    <el-option
                      v-for="(item, index) in diagList"
                      :key="index"
                      :label="item.zdmc"
                      :value="item.zddm"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'fixmedinsType'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                    @change="fixmedinsTypeChange"
                  >
                    <el-option
                      v-for="(item, index) in fixmedinsTypeOptions"
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'reflinMedinsNo'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                    filterable
                    remote
                    :remote-method="
                      (query) => {
                        return remoteMethod(query);
                      }
                    "
                    reserve-keyword
                    default-first-option
                    @change="
                      selectChange(
                        form[item.prop],
                        item.name,
                        'fixMedinsInfoList',
                        'fixmedins_code',
                        'fixmedins_name'
                      )
                    "
                  >
                    <el-option
                      v-for="(item, index) in fixMedinsInfoList"
                      :key="index"
                      :label="item.fixmedins_name"
                      :value="item.fixmedins_code"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'hospAgreReflFlag'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                  >
                    <el-option
                      v-for="(item, index) in hospAgreReflFlagList"
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'reflType'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                  >
                    <el-option
                      v-for="(item, index) in reflTypeList"
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'mdtrtareaAdmdvs'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                    filterable
                    remote
                    :remote-method="poolareaNoFilteMethod"
                  >
                    <el-option
                      v-for="(item, index) in mdtrtareaAdmdvsList"
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
              </template>
            </LFormtTitle>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import SZReadCard from "../components/SZReadCard.vue";
import {
  formList,
  rules,
} from "@/views/medicalInsuranceNew/common/personnelTransfer.js";
import service from "@/api/medicalInsuranceNew/personnelTransfer.js";
import healthInsuranceService from "@/api/healthInsurance/index.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";
import { deepClone } from "@/utils";

export default {
  name: "addForm",
  mixins: [getDictInfoNew],
  components: {
    SZReadCard,
  },
  props: {
    formEdit: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {},
      SZReadCardDisabled: false,
      insutypeList: [],
      diagList: [],
      fixmedinsTypeOptions: [],
      fixMedinsInfoList: [],
      hospAgreReflFlagList: [],
      reflTypeList: [],
      mdtrtareaAdmdvsList: [],
      cardInfo: {},
    };
  },
  computed: {
    formList() {
      return formList;
    },
    rules() {
      return rules;
    },
  },
  watch: {
    formEdit: {
      handler(val) {
        this.SZReadCardDisabled = false;
        if (JSON.stringify(val) !== "{}") {
          this.SZReadCardDisabled = true;
          this.form = {
            ...val,
            reflinMedinsNoInit: val.reflinMedinsNo,
          };
          this.fixMedinsInfoList = [
            {
              fixmedins_code: val.reflinMedinsNo,
              fixmedins_name: val.reflinMedinsName,
            },
          ];
          this.poolareaNoFilteMethod(val.mdtrtareaAdmdvs);
          this.$nextTick(() => {
            this.$refs.SZReadCard.cardData = val.idenNum;
            this.$refs.SZReadCard.searchEnter();
          });
        } else {
          this.form = {
            hospIdeDatetime: "",
            begndatetime: "",
            reflinMedinsNo: "",
            reflinMedinsName: "",
          };
          this.form.hospIdeDatetime = new Date();
          this.form.begndatetime = new Date();
          this.getDictNew("yb_area").then((res) => {
            this.mdtrtareaAdmdvsList = deepClone(res.slice(0, 200));
          });
          // 获取当前机构
          this.getDictNew("0000").then((res) => {
            let fixmedinsCode = "";
            let fixmedinsName = "";
            for (let i in res) {
              if (res[i].dictCode == "0016") {
                fixmedinsCode = res[i].remark;
              } else if (res[i].dictCode == "0007") {
                fixmedinsName = res[i].remark;
              }
            }
            this.fixMedinsInfoList = [
              {
                fixmedins_code: fixmedinsCode,
                fixmedins_name: fixmedinsName,
              },
            ];
            this.form.reflinMedinsNo = fixmedinsCode;
            this.form.reflinMedinsName = fixmedinsName;
          });
        }
      },
      immediate: true,
      deep: true,
    },
    "form.reflinMedinsNo": {
      handler(val) {
        this.form.reflinMedinsNoInit = val;
      },
    },
  },
  created() {
    this.getDictNew("fixmedins_type").then((res) => {
      this.fixmedinsTypeOptions = res;
      this.form.fixmedinsType = "1";
    });
    this.getDictNew("hosp_agre_refl_flag").then((res) => {
      this.hospAgreReflFlagList = res;
    });
    this.getDictNew("refl_fil_type").then((res) => {
      this.reflTypeList = res;
    });

    this.diseandDiagFindFuc();
  },
  methods: {
    cardInfoHandler(data) {
      this.cardInfo = data;
    },
    patientInsurenceData(data) {
      this.insutypeList = [];
      if (data.hasOwnProperty("siPatientDto")) {
        // 基本信息
        this.form = {
          ...this.form,
          ...data.siPatientDto,
          psnName: data.siPatientDto.patientName,
          psnNo: data.siPatientDto.patientCode,
        };

        let insutypeList = data.siPatientInsuranceInfoDtos;
        this.getDictNew("insutype").then((res) => {
          let list = res;
          this.getDictNew("yb_area").then((res1) => {
            let list1 = res1;
            let arr = [];
            for (let i in insutypeList) {
              // let dateTimes =
              //   insutypeList[i].hasOwnProperty("endDate")
              //     ? new Date(insutypeList[i].endDate).getTime()
              //     : 0;
              // let dateTimeNows = new Date(
              //   this.dayjs(new Date()).format('YYYY-MM-DD')
              // ).getTime();
              // if (
              //   !insutypeList[i].hasOwnProperty("endDate") ||
              //   !insutypeList[i].endDate ||
              //   dateTimes - dateTimeNows > 0
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
                for (let j in list1) {
                  if (list1[j].dictCode == insutypeList[i].insuplcAdmdvs) {
                    obj.insuOptinsName = list1[j].dictName;
                    break;
                  }
                }
                arr.push(obj);
              // }
            }
            this.insutypeList = arr;
          });
        });
      }
    },
    selectChange(val, name, options, dictCode, dictName) {
      let optionsList = this[options];
      for (let i in optionsList) {
        if (val == optionsList[i][dictCode]) {
          this.form[name] = optionsList[i][dictName];
          if (name === "insutypeName") {
            this.form.insuOptins = optionsList[i].insuplcAdmdvs;
            this.form.insuOptinsName = optionsList[i].insuOptinsName || "";
          }
          break;
        }
      }
    },
    fixmedinsTypeChange(val) {
      if (!val) {
        return;
      }
      this.fixMedinsInfoList = [];
    },
    remoteMethod(query) {
      if (!query) {
        return;
      }
      this.fixMedinsInfo(query);
    },
    poolareaNoFilteMethod(val) {
      if (!val) {
        this.getDictNew("yb_area").then((res) => {
          this.mdtrtareaAdmdvsList = deepClone(res.slice(0, 200));
        });
        return;
      }
      this.getDictNew("yb_area").then((res) => {
        let poolareaNoList = res;
        let arr = [];
        for (let i in poolareaNoList) {
          let item = poolareaNoList[i];
          let vals = val.toUpperCase();
          if (
            item.dictName.indexOf(vals) > -1 ||
            item.dictCode == vals ||
            item.pyCode.indexOf(vals) > -1
          ) {
            arr.push({ ...item });
          }
        }
        this.mdtrtareaAdmdvsList = arr;
      });
    },
    // 新增备案
    async addFuc() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.$showLoading();
          try {
            let params = {
              ...this.form,
              idenNum: this.cardInfo.certNo,
            };
            let res = await service.changeHosRecord(params);
            if (res.code === 1) {
              this.$message.success("保存成功！");
              this.$emit("addCloseFuc");
            }
          } catch (error) {
          } finally {
            this.$hideLoading();
          }
        }
      });
    },
    async diseandDiagFindFuc() {
      await this.diseandDiagFind((data) => {
        this.diagList = data;
      });
    },
    async fixMedinsInfo(fixmedinsName) {
      try {
        let params = {
          fixmedinsType: this.form.fixmedinsType,
          fixmedinsName,
        };
        let res = await healthInsuranceService.fixMedinsInfo(params);
        if (res.code === 1) {
          this.fixMedinsInfoList = res.data.medinsinfo;
        }
      } catch (error) {}
    },
  },
};
</script>
<style lang="scss">
.add-form {
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
</style> 