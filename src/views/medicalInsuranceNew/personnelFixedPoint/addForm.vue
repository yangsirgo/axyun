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
                <template v-if="item.prop === 'fixmedinsType'">
                  <el-select
                    v-model="form[item.prop]"
                    :placeholder="item.label"
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
                <template v-else-if="item.prop === 'fixmedinsCode'">
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
                      v-for="item in fixMedinsInfoList"
                      :key="item.fixmedins_code"
                      :label="item.fixmedins_name"
                      :value="item.fixmedins_code"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'bizAppyType'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                  >
                    <el-option
                      v-for="item in bizAppyTypeList"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'agnterCertType'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                  >
                    <el-option
                      v-for="item in agnterCertTypeList"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'agnterRlts'">
                  <el-select
                    v-model="form[item.prop]"
                    clearable
                    :disabled="item.disabled"
                  >
                    <el-option
                      v-for="item in agnterRltsList"
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
} from "@/views/medicalInsuranceNew/common/personnelFixedPoint.js";
import service from "@/api/medicalInsuranceNew/personnelFixedPoint.js";
import healthInsuranceService from "@/api/healthInsurance/index.js";
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
      fixmedinsTypeOptions: [],
      fixMedinsInfoList: [],
      bizAppyTypeList: [],
      agnterCertTypeList: [],
      agnterRltsList: [],
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
              fixmedins_code: val.fixmedinsCode,
              fixmedins_name: val.fixmedinsName,
            },
          ];
          this.$nextTick(() => {
            this.$refs.SZReadCard.cardData = val.idenNum;
            this.$refs.SZReadCard.searchEnter();
          });
        } else {
          this.form = {
            begndatetime: "",
            fixmedinsCode: "",
            fixmedinsName: "",
          };
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
                fixmedins_name: fixmedinsName
              }
            ];
            this.form.fixmedinsCode = fixmedinsCode;
            this.form.fixmedinsName = fixmedinsName;
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDictNew("fixmedins_type").then((res) => {
      this.fixmedinsTypeOptions = res;
      this.form.fixmedinsType = "1";
    });
    this.getDictNew("biz_appy_type").then((res) => {
      this.bizAppyTypeList = res;
    });
    this.getDictNew("psn_cert_type").then((res) => {
      this.agnterCertTypeList = res;
    });
    this.getDictNew("agnter_rlts").then((res) => {
      this.agnterRltsList = res;
    });
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
    fixmedinsTypeChange(val) {
      if (!val) {
        return;
      }
      this.fixMedinsInfoList = [];
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
            let res = await service.specHosRecord(params);
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
    remoteMethod(query, fixmedinsCode) {
      if (!query && !fixmedinsCode) {
        return;
      }
      this.fixMedinsInfo(query, fixmedinsCode);
    },
    async fixMedinsInfo(fixmedinsName, fixmedinsCode) {
      try {
        let params = {
          fixmedinsType: this.form.fixmedinsType,
          fixmedinsName,
          fixmedinsCode,
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