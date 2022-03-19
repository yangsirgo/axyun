<template>
  <el-card class="Rp-bottom-card">
    <div class="wrapper">
      <div class="RpCls">
        <div style="margin-top: 10px">
          <el-form
            :model="chmForm"
            :rules="chmRules"
            ref="chmForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label prop="chmAgent">
              <l-formt-title label="用药贴数" :required="true">
                <el-input-number
                  ref="onceDosage"
                  class="onceDosageInput"
                  v-model="chmForm.chmAgent"
                  :precision="4"
                  step-strictly
                  :min="1"
                  :controls="false"
                ></el-input-number>
              </l-formt-title>
            </el-form-item>
            <!--<el-form-item label prop="chmFrying">-->
            <!--<l-formt-title label="用法" :required="true">-->
            <!--<l-value-domain-->
            <!--code="MedicationRouteCode"-->
            <!--remoteShowKey="name"-->
            <!--remoteValueKey="code"-->
            <!--:value.sync="chmForm.chmFrying"-->
            <!--placeholder="请选择"-->
            <!--&gt;</l-value-domain>-->
            <!--</l-formt-title>-->
            <!--</el-form-item>-->

            <el-form-item label label-width prop="chmFrying">
              <l-formt-title label="用法" :required="true">
                <l-value-domain
                  code="usage"
                  :value.sync="chmForm.chmFrying"
                  class="select-container"
                />
              </l-formt-title>
            </el-form-item>

            <el-form-item label prop="remainder">
              <l-formt-title label="每贴水煎至" :required="true">
                <el-input-number
                  ref="onceDosage"
                  class="onceDosageInput"
                  v-model="chmForm.remainder"
                  :precision="4"
                  step-strictly
                  :step="1"
                  :min="1"
                  :controls="false"
                ></el-input-number>
                ML
              </l-formt-title>
            </el-form-item>

            <!--<el-form-item-->
            <!--label-->
            <!--prop="flowRate"-->
            <!--class="flowRate"-->
            <!--&gt;-->
            <!--<l-formt-title label="使用方法">-->
            <!--<el-input-->
            <!--size="medium"-->
            <!--v-model="chmForm.uses"-->
            <!--step-strictly-->
            <!--:controls="false"-->
            <!--&gt;</el-input>-->
            <!--</l-formt-title>-->
            <!--</el-form-item>-->

            <el-form-item label label-width prop="uses">
              <l-formt-title label="使用方法" :required="true">
                <l-value-domain
                  code="useMethod"
                  :value.sync="chmForm.uses"
                  class="select-container"
                />
              </l-formt-title>
            </el-form-item>

            <el-form-item label prop="decoctionStatus" class="skinTest">
              <el-checkbox
                v-model="chmForm.decoctionStatus"
                true-label="1"
                false-label="0"
                >代煎</el-checkbox
              >
            </el-form-item>
            <el-form-item label prop="decoctionCount">
              <l-formt-title label="袋数/每贴">
                <el-input v-model="chmForm.decoctionCount"></el-input>
              </l-formt-title>
            </el-form-item>

            <el-form-item label prop="entrust">
              <l-formt-title label="备注">
                <el-input
                  class="onceDosageInput"
                  v-model="chmForm.entrust"
                  :precision="4"
                  step-strictly
                  :controls="false"
                ></el-input>
              </l-formt-title>
            </el-form-item>
            <el-form-item label prop="fryingFee">
              <l-formt-title label="代煎费" disabled>
                <el-input
                  v-model="chmForm.fryingFee"
                  :disabled="true"
                ></el-input>
              </l-formt-title>
            </el-form-item>
            <el-form-item class="fr" style="text-align: right">
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
                class="button"
                v-hotKey="{ func: 'func_save' }"
                >保 存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { temporaryAdvice, submitApply } from "@/api/cis/resident/chm";
import { mapGetters, mapActions } from "vuex";

let startDoctorTime = ""; // 开始日期 的锚点 变量

export default {
  name: "chmBottomForm",
  props: ["tableList", "advicePO"],
  data() {
    return {
      chmRules: {
        chmAgent: [
          { required: true, message: "请输入用药贴数", trigger: "blur" }
        ],
        chmFrying: [{ required: true, message: "请选择用法", trigger: "blur" }],
        remainder: [
          { required: true, message: "请输入每贴水煎至", trigger: "blur" }
        ],
        uses: [{ required: true, message: "请选择使用方法", trigger: "blur" }]
      },
      chmForm: {
        uses: "",
        frequency: "",
        chmAgent: "",
        decoctionStatus: "",
        remainder: "",
        decoctionCount: "",
        chmFrying: "",
        entrust: "",
        fryingFee: "",
        drugs: [],
        inpCode: "",
        patientId: "",
        bedNo: "",
        originId: "0",
        wardId: "",
        openSource: "0"
      },
      drugList: [],
      onceDosageControl: {
        step: 0.0001,
        min: 0
      }
    };
  },
  computed: {
    // 获取患者信息
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.aOrE = "1";
        this.chmForm = {};
        if (val && val.patientId) {
          //            this.reLoadData();
        }
      }
    },

    advicePO: {
      deep: true,
      immediate: true,
      handler(val) {
        this.chmForm = this.advicePO;
      }
    }
    //      reloadDataFlag() {
    //        this.reLoadData();
    //      }
  },
  methods: {
    //保存
    submitForm() {
      this.$emit("initChmTable");

      if (this.assemblyData()) {
        this.$set(this.chmForm, "originId", "0");
        this.$set(this.chmForm, "openSource", "0");
        console.log("chmForm:", this.chmForm);

        this.$refs["chmForm"].validate(valid => {
          if (valid) {
            temporaryAdvice(this.chmForm).then(res => {
              if (res.code === 1) {
                this.chmForm = {};
                this.$emit("initChmTable");
                this.$message.success("保存成功");
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        });
      }
      //        temporaryAdvice(this.chmForm).then((res) => {
      //          if (res.code === 1) {
      //          this.chmForm = {};
      //            this.$message.success("保存成功");
      //        } else {
      //          this.$message.error(res.msg);
      //        }
      //      }).catch((error)=>{
      //          this.$message.error(err);
      //      })
    },
    submitApply() {
      if (this.assemblyData()) {
        this.$refs["chmForm"].validate(valid => {
          if (valid) {
            submitApply(this.chmForm)
              .then(res => {
                if (res.code === 1) {
                  this.chmForm = {};
                  this.$emit("initChmTable");

                  this.$message.success("提交成功");
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(error => {
                this.$message.error(err);
              });
          }
        });
      }
    },
    assemblyData() {
      let drugs = [];
      let index = 0;
      console.log("yytttrrveewwq:", this.tableList);
      for (let i = 0; i < this.tableList.length; i++) {
        for (let j = 1; j <= 4; j++) {
          let name = "name" + j;
          let BasicDosage = "BasicDosage" + j;
          let BasicDosageUnit = "BasicDosageUnit" + j;
          let basicDosage = "basicDosage" + j;
          let basicDocAgeUnit = "basicDocAgeUnit" + j;
          let code = "code" + j;
          let execDeptName = "execDeptName" + j;
          let manageType = "manageType" + j;
          let formCode = "formCode" + j;
          let execDeptCode = "execDeptCode" + j;
          let fryingRemark = "fryingRemark" + j;
          let adviceId = "adviceId" + j;
          let versionData = "versionData" + j;
          console.log("tableList:", this.tableList[i][name]);
          if (this.tableList[i][name] != "") {
            this.$set(drugs, index, {
              name: ""
            });
            this.$set(drugs[index], "name", this.tableList[i][name]);

            this.$set(
              drugs[index],
              "BasicDosage",
              this.tableList[i][basicDosage]
            );
            this.$set(
              drugs[index],
              "BasicDosageUnit",
              this.tableList[i][basicDocAgeUnit]
            );
            this.$set(drugs[index], "code", this.tableList[i][code]);
            this.$set(
              drugs[index],
              "execDeptName",
              this.tableList[i][execDeptName]
            );
            this.$set(
              drugs[index],
              "manageType",
              this.tableList[i][manageType]
            );
            this.$set(
              drugs[index],
              "execDeptCode",
              this.tableList[i][execDeptCode]
            );

            this.$set(drugs[index], "formCode", this.tableList[i][formCode]);

            this.$set(
              drugs[index],
              "fryingRemark",
              this.tableList[i][fryingRemark]
            );
            this.$set(drugs[index], "adviceId", this.tableList[i][adviceId]);
            this.$set(
              drugs[index],
              "versionData",
              this.tableList[i][versionData]
            );

            console.log("drugs:", drugs);
            index = index + 1;
          }
        }
        if (drugs == null || drugs == "" || drugs.length == 0) {
          this.$message.warning("请填写药品！");
          return false;
        }
        this.chmForm.drugs = drugs;
        this.chmForm.inpCode = this.receivePatientData.inpCode;
        this.chmForm.patientId = this.receivePatientData.patientId;
        this.chmForm.bedNo = this.receivePatientData.bedCode;
        this.chmForm.wardId = this.receivePatientData.wardId;
      }
      return true;
    },
    reset() {
      this.$refs["chmForm"].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.Rp-bottom-card {
  width: 100%;
  height: 100%;
  padding: 0 10px 0 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  /*padding: 20px;*/
  border: 0 !important;
  overflow: unset !important;

  /deep/ .el-card__body {
    overflow-x: auto;
  }

  .wrapper {
    width: 100%;
  }

  .demo-ruleForm {
    /*white-space: nowrap;*/
  }

  .display-list {
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    white-space: nowrap;

    .display-list-item {
      line-height: 42px;
      display: inline-block;
      margin-top: 6px;

      .title {
        font-size: 14px;

        font-weight: 400;
        color: rgba(148, 157, 163, 1);
        line-height: 20px;
      }

      .value {
        padding-left: 10px;
        font-size: 14px;

        font-weight: 400;
        color: rgba(46, 50, 58, 1);
        line-height: 20px;
      }
    }

    .display-list-item + .display-list-item {
      margin-left: 60px;
    }
  }

  .RpCls {
    .RpClsTitle {
      font-size: 14px;

      font-weight: bold;
      color: rgba(148, 157, 163, 1);
      line-height: 60px;
    }

    /deep/ .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;
      display: inline-block;
    }

    /deep/ .el-form-item__content {
      margin-left: 0 !important;
      line-height: 0;
      margin-top: 10px;
      width: 200px;
    }

    .onceDosageInput {
      /deep/ .el-input__inner {
        padding-right: 30px;
      }
    }
  }
}

.button {
  vertical-align: 12px;
}

.date-picker {
  /deep/ .el-form-item__content {
    width: 278px !important;
  }

  /deep/ .el-input__suffix {
    right: 1px !important;
  }
}

.skinTest {
  /deep/ .el-form-item__content {
    width: 50px !important;

    /deep/ .el-checkbox {
      vertical-align: 12px;
    }
  }
}
</style>
