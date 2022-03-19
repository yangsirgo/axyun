<template>
  <div class="height100 saveTemplate">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <div class="shareLevel">
        <el-form-item
          label=""
          prop="shareLevelValue"
          style="display: inline-block"
        >
          <span>共享等级</span>
          <el-radio-group
            v-model="form.shareLevelValue"
            @change="setOffice()"
          >
            <el-radio
              v-for="item in form.shareLevel"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label=""
          class="shareOffice"
          style="display: inline-block"
        >
          <el-select
            v-model="form.officeValue"
            placeholder="请选择"
            :disabled="true"
            style="width: 100%"
          >
            <el-option
              v-for="item in form.office"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item
        label=""
        prop="range"
      >
        <span>
          使用范围
        </span>
        <el-checkbox-group
          v-model="form.range"
          style="display: inline-block"
        >
          <el-checkbox label="1">门诊</el-checkbox>
          <el-checkbox label="2">住院</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label=""
        prop="name"
      >
        <l-formt-title
          class="form-item"
          label="模板名称"
        >
          <el-input
            v-model="form.name"
            auto-complete="off"
            placeholder="请填写模板名称"
          ></el-input>
        </l-formt-title>
      </el-form-item>
    </el-form>
    <!-- <div class="dialog-footer"> -->
    <!--<el-button type="primary" @click="submitForm('form')" icon="el-icon-plus">保 存</el-button>-->
    <!-- <el-button type="primary" @click="submitForm('form')" v-hotKey="{func: 'func_save'}">保 存</el-button> -->
    <!--<el-button @click="resetForm('form')" icon="el-icon-refresh">清 空</el-button>-->
    <!-- </div> -->
  </div>
</template>

<script>
import {
  getOrder,
  getPageItemList,
  submitOrders,
  bunching,
  unbunching,
  batchRemoveOrders,
  saveOrdersMould,
  getAdviceItem,
  getRecipeCode
} from "@/api/cis/order/order";
import { saveAdviceFormwork } from "@/api/cis/resident/residentAdviceFormwork";
import { mapActions, mapGetters } from "vuex";
import { localGet } from "@/utils/auth.js";

export default {
  name: "saveTemplate",
  data() {
    return {
      rules: {
        shareLevelValue: [
          {
            required: true,
            message: "请选择共享等级",
            trigger: ["blur", "change"]
          }
        ],
        name: [{ required: true, message: "请填写模板名称", trigger: "blur" }],
        range: [{ required: true, message: "请选择模板范围", trigger: "blur" }]
      },
      form: {
        shareLevel: [
          // {
          //   value: "1",
          //   label: "全院"
          // },
          {
            value: "3",
            label: "个人"
          },
          {
            value: "2",
            label: "科室"
          }
        ],
        office: [],
        name: "",
        id: 0,
        businessValue: "",
        shareLevelValue: "3",
        medicalStandardValue: "",
        range: [],
        officeValue: ""
      },
      multipleSelection: []
    };
  },
  methods: {
    ...mapActions({
      setLeaveAppLoadKey: "cis/setLeaveAppLoadKey"
    }),
    submitForm(formName) {
      let adviceFormworkDetails = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let item = {
          itemId: this.multipleSelection[i].orderItemId,
          code: this.multipleSelection[i].code,
          name: this.multipleSelection[i].name,
          itemCat: this.multipleSelection[i].orderCat,
          spec: this.multipleSelection[i].spec,
          itemType: this.multipleSelection[i].itemType,
          adviceType: this.multipleSelection[i].adviceType,
          normalDate: this.multipleSelection[i].normalDate,
          basicDosage: this.multipleSelection[i].basicDosage,
          basicDosageUnit: this.multipleSelection[i].basicDosageUnit,
          onceDosage: this.multipleSelection[i].onceDosage,
          frequency: this.multipleSelection[i].frequency,
          unit: this.multipleSelection[i].unit,
          packUnit: this.multipleSelection[i].packUnit,
          skinTest: this.multipleSelection[i].skinTest,
          isUrgent: this.multipleSelection[i].isUrgent,
          remark: this.multipleSelection[i].remark,
          itemName: this.multipleSelection[i].orderItemName,
          uses: this.multipleSelection[i].uses,
          price: this.multipleSelection[i].price,
          amt: this.multipleSelection[i].amt,
          quantity: this.multipleSelection[i].quantity,
          manageType: this.multipleSelection[i].manageType,
          formCode: this.multipleSelection[i].formCode,
          dropRate: this.multipleSelection[i].dropRate,
          administrationTimeCode: this.multipleSelection[i]
            .administrationTimeCode,
          excessReason: this.multipleSelection[i].excessReason,
          groupNo: this.multipleSelection[i].groupNo,
          executeDepartmentId: this.multipleSelection[i].execDeptId,
          execDeptName: this.multipleSelection[i].execDeptName,
          receiveDept: this.multipleSelection[i].receiveDept,
          frequencyTimes: this.multipleSelection[i].frequencyTimes,
          frequencyUnit: this.multipleSelection[i].frequencyUnit,
          unitSaleFlg: this.multipleSelection[i].unitSaleFlg,
          halfUseFlg: this.multipleSelection[i].halfUseFlg,
          dosageValue: this.multipleSelection[i].dosageValue,
          isMajor: this.multipleSelection[i].isMajor
        };
        adviceFormworkDetails.push(item);
      }
      // console.log(JSON.stringify(this.multipleSelection))
      // console.log(JSON.stringify(outpatientCisTempDetails))
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.multipleSelection.length <= 0) {
            this.$notify.error({
              title: "错误",
              message: "请选择至少一条医嘱数据"
            });
            return false;
          }
          let data = {
            adviceFormworkName: this.form.name,
            adviceFormworkType: this.form.shareLevelValue,
            templetType: this.form.shareLevelValue,
            deptId: "",
            adviceFormworkDetails: adviceFormworkDetails
          };

          // switch (this.currentTabsWrapper) {
          //   case "":
              
          //     break;
          
          //   default:
          //     break;
          // }

          console.log("&&&&&&&&&&&&&&&:" + JSON.stringify(data));
          saveAdviceFormwork(data)
            .then(res => {
              if (res.code === 1) {
                this.$notify({
                  title: "成功",
                  message: "保存模板成功",
                  type: "success"
                });
                let reloadKey =
                  +new Date() +
                  "" +
                  "CHANGEFORM?radio=" +
                  this.form.shareLevelValue;
                this.setLeaveAppLoadKey(reloadKey);
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "保存模板失败"
                });
              }
            })
            .catch(error => {
              this.$notify.error({
                title: "错误",
                message: error.msg || "保存模板失败"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setOffice() {
      if (this.form.shareLevelValue == "2") {
        let role =
          typeof localGet("role") !== "undefined"
            ? JSON.parse(localGet("role"))
            : false;
        let officeObj = {
          value: role.deptId,
          label: role.deptName
        };
        this.form.officeValue = role.deptId;
        this.form.office.push(officeObj);
        console.log(JSON.stringify(this.form.office));
        // this.form.officeValue = role.deptId;
        // this.form.office[0] = role.deptName;
      } else {
        this.form.office = [];
        this.form.officeValue = "";
      }
    }
  },
  computed: {
    ...mapGetters("residentStation", ["multipleSelections"]),
    ...mapGetters("homeSickbeds", ["currentTabsWrapper"])
  },
  watch: {
    multipleSelections: {
      handler(n) {
        console.log("multipleSelection:", n);
        this.multipleSelection = n;
      },
      deep: true, //深度监听
      immediate: true
    }
  }
};
</script>

<style scoped lang="scss">
.saveTemplate {
  padding: 20px 16px 20px 14px;
  position: relative;
  .shareLevel {
    display: flex;
    > .shareOffice {
      padding-left: 8px;
      flex: 1;
    }
  }
  .dialog-footer {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
