<template>
  <div class="add-form height100">
    <el-form :model="form" :rules="rules" ref="ruleForm">
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
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="item.disabled"
                  @change="forceUpdate"
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
              <template v-else-if="item.type === 'select'">
                <template v-if="item.prop === 'hospDept'">
                  <el-select
                    v-model="form[item.prop]"
                    :disabled="item.disabled"
                    filterable
                    @change="
                      selectChange(
                        form[item.prop],
                        'hospDeptName',
                        'hospDeptList',
                        'orgCode',
                        'orgNm'
                      )
                    "
                  >
                    <el-option
                      v-for="(item, index) in hospDeptList"
                      :key="index"
                      :label="item.orgNm"
                      :value="item.orgCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'caty'">
                  <el-select
                    v-model="form[item.prop]"
                    :disabled="item.disabled"
                    filterable
                  >
                    <el-option
                      v-for="(item, index) in catyList"
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'poolareaNo'">
                  <el-select
                    v-model="form[item.prop]"
                    :disabled="item.disabled"
                    filterable
                    remote
                    :remote-method="poolareaNoFilteMethod"
                  >
                    <el-option
                      v-for="(item, index) in poolareaNoList"
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
import {
  formList,
  rules,
} from "@/views/medicalInsuranceNew/common/departInfo.js";
import service from "@/api/medicalInsuranceNew/departInfo.js";
import healthInsuranceService from "@/api/healthInsurance/index.js";
import { queryUsers } from "@/api/admin/user.js";
import userService from "@/api/appointmentNew/rediagSetting.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";
import { deepClone } from "@/utils";

export default {
  name: "addForm",
  mixins: [getDictInfoNew],
  components: {},
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
      catyList: [],
      hospDeptList: [],
      poolareaNoList: [],
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
            hospDept: val.hospDeptCodg,
          };
          this.poolareaNoFilteMethod(val.poolareaNo);
        } else {
          this.form = {
            deptEstbdat: ""
          }
          let date = this.dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.form.deptEstbdat = date;
          this.$nextTick(() => {
            this.$forceUpdate();
          });
          this.getDictNew("yb_area").then((res) => {
            this.poolareaNoList = deepClone(res.slice(0, 200));
            this.form.poolareaNo = "440300";
            this.poolareaNoFilteMethod(this.form.poolareaNo);
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  async mounted() {
    this.getDictNew("caty").then((res) => {
      this.catyList = res;
    });
    this.getDeptList();
  },
  methods: {
    selectChange(val, name, options, dictCode, dictName) {
      this.forceUpdate();
      if (name === "hospDeptName") {
        this.form.hospDeptCodg = val;
      }
      let optionsList = this[options];
      for (let i in optionsList) {
        if (val == optionsList[i][dictCode]) {
          this.form[name] = optionsList[i][dictName];
          break;
        }
      }
    },
    forceUpdate() {
      this.$forceUpdate();
    },
    poolareaNoFilteMethod(val) {
      if (!val) {
        this.getDictNew("yb_area").then((res) => {
          this.poolareaNoList = deepClone(res.slice(0, 200));
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
        this.poolareaNoList = arr;
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
              // hospDeptCodg: this.form.hospDept
            };
            let res = {};
            if (JSON.stringify(this.formEdit) !== "{}") {
              res = await service.sdeptInfoUpdate(params);
            } else {
              res = await service.sdeptInfoUpload(params);
            }
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
    async getDeptList() {
      try {
        let res = await userService.getDeptList();
        if (res.code === 1) {
          this.hospDeptList = res.data;
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