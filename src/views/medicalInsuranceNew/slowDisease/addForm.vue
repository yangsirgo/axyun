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
        <el-col :span="8" v-for="(item, index) in formList" :key="index">
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
                ></el-input>
              </template>
              <template v-else-if="item.type === 'date'">
                <el-date-picker
                  v-model="form[item.prop]"
                  type="date"
                  format="yyyy-MM-dd"
                  :disabled="item.disabled"
                >
                </el-date-picker>
              </template>
              <template v-else-if="item.type === 'select'">
                <template v-if="item.prop === 'insutype'">
                  <el-select
                    v-model="form[item.prop]"
                    :disabled="item.disabled"
                    @change="insuranceTypeChange"
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
                <template v-else-if="item.prop === 'opspDiseCode'">
                  <el-select
                    clearable
                    v-model="form[item.prop]"
                    placeholder="请选择"
                    filterable
                    @change="
                      selectChange(
                        form[item.prop],
                        'opspDiseName',
                        'outpSpecialOptions',
                        'mmmtbzmldm',
                        'mmmtbzmc'
                      )
                    "
                  >
                    <el-option
                      v-for="(item, index) in outpSpecialOptions"
                      :key="index"
                      :label="item.mmmtbzmc"
                      :value="item.mmmtbzmldm"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'fixmedinsType'">
                  <el-select
                    clearable
                    v-model="form[item.prop]"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixmedinsTypeList"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'ideFixmedinsNo'">
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
                        'ideFixmedinsName',
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
                <template v-else-if="item.prop === 'diagDrCodg'">
                  <el-select
                    clearable
                    v-model="form[item.prop]"
                    placeholder="请选择"
                    @change="
                      selectChange(
                        form[item.prop],
                        'diagDrName',
                        'roleData',
                        'dictCode',
                        'dictName'
                      )
                    "
                  >
                    <el-option
                      v-for="item in roleData"
                      :key="item.dictCode"
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
} from "@/views/medicalInsuranceNew/common/slowDisease.js";
import service from "@/api/medicalInsuranceNew/slowDisease.js";
import healthInsuranceService from "@/api/healthInsurance/index.js";
import { queryUsers } from "@/api/admin/user.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

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
      fixmedinsTypeList: [],
      fixMedinsInfoList: [],
      roleData: [],
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
          };
          this.fixMedinsInfoList = [
            {
              fixmedins_code: val.ideFixmedinsNo,
              fixmedins_name: val.ideFixmedinsName,
            },
          ];
          this.$nextTick(() => {
            this.$refs.SZReadCard.cardData = val.idenNum;
            this.$refs.SZReadCard.searchEnter();
          });
        } else {
          this.form = {
            hospIdeDatetime: "",
            begndatetime: "",
            ideFixmedinsNo: "",
            ideFixmedinsName: "",
          };
          this.form.hospIdeDatetime = new Date();
          this.form.begndatetime = new Date();
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
            this.form.ideFixmedinsNo = fixmedinsCode;
            this.form.ideFixmedinsName = fixmedinsName;
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDictNew("fixmedins_type").then((res) => {
      this.fixmedinsTypeList = res;
      this.form.fixmedinsType = "1";
    });
    this.getRoles();
    this.getOutpSpecial();
  },
  methods: {
    async getRoles() {
      let roleData = [];
      try {
        let { code, data } = await queryUsers({
          pageSize: 210,
          page: 1,
          orderBy: "updated_at desc",
        });
        if (code === 1) {
          for (let i in data) {
            if (data[i].workType == "1") {
              roleData.push({
                ...data[i],
                dictCode: data[i].userNo,
                dictName: data[i].name,
              });
            }
          }
          this.roleData = roleData;
        }
      } catch (error) {}
    },
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
    insuranceTypeChange(val) {
      let insutypeList = this.insutypeList;
      for (let i in insutypeList) {
        if (val == insutypeList[i].dictCode) {
          this.form.insutypeName = insutypeList[i].dictName;
          this.form.insuOptins = insutypeList[i].insuplcAdmdvs;
          this.form.insuOptinsName = insutypeList[i].insuOptinsName || "";
        }
      }
    },
    selectChange(val, name, options, dictCode, dictName) {
      let optionsList = this[options];
      for (let i in optionsList) {
        if (val == optionsList[i][dictCode]) {
          this.form[name] = optionsList[i][dictName];
          break;
        }
      }
    },
    remoteMethod(query) {
      if (!query) {
        return;
      }
      this.fixMedinsInfo(query);
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
            let res = await service.opspDiseRecord(params);
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