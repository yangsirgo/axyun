<template>
  <div class="salaryCheck height100">
    <el-row class="formArea" :gutter="10">
      <el-col
        class="formItem"
        :span="item.span"
        v-for="(item, index) in salaryCheckInfoForm"
        :key="index"
      >
        <LFormtTitle
          :label="item.label"
          :required="item.required"
          :disabled="item.disabled"
        >
          <template v-if="item.type === 'input'">
            <el-input
              :placeholder="item.label"
              v-model="form[item.prop]"
              :disabled="item.disabled"
              clearable
            ></el-input>
          </template>
          <template v-else-if="item.type === 'datetime'">
            <el-date-picker
              v-model="form[item.prop]"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              clearable
              :disabled="item.disabled"
              :placeholder="item.label"
            >
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'select'">
            <template v-if="item.prop === 'insutype'">
              <el-select
                v-model="form[item.prop]"
                :placeholder="item.label"
                :disabled="item.disabled"
                clearable
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
            <template v-else-if="item.prop === 'fixmedinsType'">
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
            <template v-else-if="item.prop === 'fixmedins_code'">
              <el-select
                v-model="form[item.prop]"
                :placeholder="item.label"
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
            <template v-else-if="item.prop === 'med_type'">
              <el-select
                v-model="form[item.prop]"
                :placeholder="item.label"
                clearable
                :disabled="item.disabled"
              >
                <el-option
                  v-for="(item, index) in medicareTypeList"
                  :key="index"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="item.prop === 'dise_type'">
              <el-select
                v-model="form[item.prop]"
                :placeholder="item.label"
                :disabled="item.disabled"
                @change="diseTypeChange"
              >
                <el-option
                  v-for="(item, index) in diseTypeOptions"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="item.prop === 'dise_codg'">
              <!-- 特慢病 -->
              <el-select
                v-if="form.dise_type === '1'"
                clearable
                filterable
                v-model="form[item.prop]"
                :placeholder="item.label"
                :disabled="item.disabled"
                @change="
                  selectChange(
                    form[item.prop],
                    item.name,
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
              <!-- 结算病种 -->
              <el-select
                v-else-if="form.dise_type === '2'"
                clearable
                filterable
                v-model="form[item.prop]"
                :placeholder="item.label"
                :disabled="item.disabled"
                @change="
                  selectChange(
                    form[item.prop],
                    item.name,
                    'payperDiseOptions',
                    'abzjsbzmldm',
                    'abzjsbzmc'
                  )
                "
              >
                <el-option
                  v-for="item in payperDiseOptions"
                  :key="item.abzjsbzmldm"
                  :label="item.abzjsbzmc"
                  :value="item.abzjsbzmldm"
                >
                </el-option>
              </el-select>
              <!-- 日间手术病种 -->
              <el-select
                v-else-if="form.dise_type === '3'"
                clearable
                filterable
                v-model="form[item.prop]"
                :placeholder="item.label"
                :disabled="item.disabled"
                @change="
                  selectChange(
                    form[item.prop],
                    item.name,
                    'daySurgeryFindOptions',
                    'rjssbzmldm',
                    'rjssbzmc'
                  )
                "
              >
                <el-option
                  v-for="(item, index) in daySurgeryFindOptions"
                  :key="index"
                  :label="item.rjssbzmc"
                  :value="item.rjssbzmldm"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.prop === 'oprn_oprt_code'">
              <el-select
                v-model="form[item.prop]"
                clearable
                :placeholder="item.label"
                :disabled="item.disabled"
                filterable
                remote
                :remote-method="
                  (query) => {
                    return remoteMethodOpr(query, 'oprnOprtOptionsInit');
                  }
                "
                reserve-keyword
                default-first-option
                @focus="remoteMethodOpr(form[item.prop], 'oprnOprtOptionsInit')"
                @change="
                  selectChange(
                    form[item.prop],
                    item.name,
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
            <template v-else-if="item.prop === 'matn_type'">
              <el-select
                v-model="form[item.prop]"
                clearable
                :placeholder="item.label"
                :disabled="item.disabled"
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
            <template v-else-if="item.prop === 'birctrl_type'">
              <el-select
                clearable
                v-model="form[item.prop]"
                :placeholder="item.label"
                :disabled="item.disabled"
              >
                <el-option
                  v-for="item in birctrlTypeOptions"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                >
                </el-option>
              </el-select>
            </template>
          </template>
        </LFormtTitle>
      </el-col>
      <el-col class="formItem" :span="8">
        <el-button type="primary" @click="personEnjoyCheck" style="float: right"
          >检查</el-button
        >
      </el-col>
    </el-row>
    <div class="table-cont" v-loading="loading">
      <el-table :data="tableData" border width="100%" height="100%">
        <el-table-column
          v-for="(item, index) in salaryCheckInfoColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="item.hasOwnProperty('code')">{{
              transformNew(item.code, scope.row[item.prop])
            }}</span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import getDictInfoNew from "../common/getDictInfoNew.js";
import {
  salaryCheckInfoForm,
  salaryCheckInfoColumns,
} from "../common/patientHealthInfo.js";
import { deepClone } from "@/utils";
import patientHealthInfoService from "@/api/medicalInsuranceNew/patientHealthInfo.js";
import healthInsuranceService from "@/api/healthInsurance/index.js";

export default {
  name: "salaryCheck",
  props: {
    siPatientDto: {
      type: Object,
      default() {
        return {};
      },
    },
    siPatientInsuranceInfoDtos: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mixins: [getDictInfoNew],
  data() {
    return {
      // 待遇查询条件
      form: {
        fixmedinsType: "",
        fixmedins_code: "",
      },
      tableData: [],
      loading: false,
      medicareTypeList: [],
      insutypeList: [],
      fixmedinsTypeOptions: [],
      fixMedinsInfoList: [],
      oprnOprtOptions: [],
      oprnOprtOptionsInit: [],
      matnTypeList: [],
      birctrlTypeOptions: [],
      diseTypeOptions: [
        { name: "特慢病病种", value: "1" },
        { name: "结算病种", value: "2" },
        { name: "日间手术病种", value: "3" },
      ],
    };
  },
  computed: {
    salaryCheckInfoForm() {
      return salaryCheckInfoForm;
    },
    salaryCheckInfoColumns() {
      return salaryCheckInfoColumns;
    },
  },
  watch: {
    siPatientInsuranceInfoDtos: {
      handler(val) {
        if (val && val.length) {
          this.getDictNew("insutype").then((res) => {
            let list = res;
            let arr = [];
            let insutypeList = val;
            for (let i in insutypeList) {
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
            }
            this.insutypeList = arr;
          });
        }
      },
      deep: true,
      immediate: true,
    },
    siPatientDto: {
      handler(val) {
        this.form.psn_no = "";
        if (val && val.hasOwnProperty("patientCode")) {
          this.form.psn_no = val.patientCode;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getDictNew("fixmedins_type").then((res) => {
      this.fixmedinsTypeOptions = res;
      this.form.fixmedinsType = "1";
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
      this.form.fixmedins_code = fixmedinsCode;
    });
    this.getDictNew("birctrl_type").then((res) => {
      this.birctrlTypeOptions = res;
    });
    this.getDictNew("matn_type").then((res) => {
      this.matnTypeList = res;
    });
    this.getDictNew("med_type").then((res) => {
      this.medicareTypeList = res;
    });
    this.getOutpSpecial();
    this.getPayperDise();
    this.daySurgeryFind();
    this.operationFindFuc();
    this.form.dise_type = "1";
  },
  methods: {
    async personEnjoyCheck() {
      let isCheck = false;
      for (let i in this.salaryCheckInfoForm) {
        let item = this.salaryCheckInfoForm[i];
        if (item.required && !this.form[item.prop]) {
          isCheck = true;
          this.$message.warning(item.label + "必填！");
          break;
        }
      }
      if (isCheck) {
        return;
      }
      this.loading = true;
      try {
        let res = await patientHealthInfoService.personEnjoyCheck(this.form);
        if (res.code == 1) {
          this.tableData = res.data;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    selectChange(val, name, list, dictCode, dictName) {
      this.forceUpdateFuc();
      this.form[name] = "";
      let lists = this[list];
      for (let i in lists) {
        if (lists[i][dictCode] == val) {
          this.form[name] = lists[i][dictName];
          break;
        }
      }
    },
    diseTypeChange() {
      this.form.dise_codg = "";
      this.form.dise_name = "";
      this.forceUpdateFuc();
    },
    forceUpdateFuc() {
      this.$forceUpdate();
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
    async operationFindFuc() {
      await this.operationFind((data) => {
        this.oprnOprtOptionsInit = data;
        this.oprnOprtOptions = deepClone(data).slice(0, 200);
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
<style lang="scss" scoped>
.salaryCheck {
  .formArea {
    .formItem {
      height: 32px;
      margin-bottom: 8px;

      .content {
        height: 32px;
        padding: 0 8px;
        display: flex;
        align-items: center;
      }
    }
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
  .table-cont {
    margin-top: 6px;
    height: calc(100% - 166px);
  }
}
</style>