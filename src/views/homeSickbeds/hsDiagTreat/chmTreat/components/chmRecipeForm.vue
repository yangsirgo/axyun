<template>
  <el-card class="Rp-bottom-card height100">
    <div class="wrapper height100">
      <div class="RpCls height100">
        <div class="height100">
          <el-form
            :model="currentChuFangRow"
            :rules="chmRules"
            ref="chmForm"
            label-width="100px"
            class="demo-ruleForm"
          >
           <!-- currentChuFangRow.useQty {{ currentChuFangRow.useQty }} -->
            <el-form-item
              label
              prop="useQty"
            >              
            <!-- currentChuFangRow.useQty {{ currentChuFangRow.useQty }} -->
              <l-formt-title
                label="用药剂数"
                :required="true"
              >

                <el-input-number
                  v-axShotcut
                  :shotindex="1"
                  :shotready="shotreadyHandler(currentChuFangRow.useQty, 'useQty')"
                  v-selectInner
                  class="onceDosageInput"
                  v-model="currentChuFangRow.useQty"
                  @change="computerTotal"
                  ref="useQty"
                  step-strictly
                  :min="1"
                  :max="50"
                  :controls="false"
                ></el-input-number>
              </l-formt-title>
            </el-form-item>

            <el-form-item
              label
              label-width
              prop="useWay"
            >
              <l-formt-title
                label="用法"
                :required="true"
              >
                <l-value-domain
                  code="usage"
                  v-axShotcut
                  :shotindex="2"
                  :shotready="shotreadyHandler(currentChuFangRow.useWay, 'useWay')"
                  clearable
                  :value.sync="currentChuFangRow.useWay"
                  @change="useWayChange"
                  class="select-container"
                />
              </l-formt-title>
            </el-form-item>

            <el-form-item
              label
              prop="volumeAfterDecoct"
            >
              <l-formt-title label="每贴水煎至">
                <el-input-number
                  v-selectInner
                  ref="onceDosage"
                  class="onceDosageInput"
                  v-model="currentChuFangRow.volumeAfterDecoct"
                  :precision="2"
                  step-strictly
                  :step="0.01"
                  :min="0"
                  :controls="false"
                ></el-input-number>
                <span style="position: relative; left: -28px">ML</span>
              </l-formt-title>
            </el-form-item>

            <el-form-item
              label
              prop="freqCode"
            >
              <l-formt-title
                label="用药频次"
                :required="true"
              >
                <cis-value-domain
                  v-axShotcut
                  :shotindex="3"
                  :shotready="shotreadyHandler(currentChuFangRow.freqCode, 'freqCode')"
                  :remoteParams="remoteParams"
                  remoteUrl="/frequency/pageList"
                  :value.sync="currentChuFangRow.freqCode"
                  placeholder="请选择频次"
                  remoteShowKey="frequencyName"
                  remoteValueKey="frequencyCode"
                  @change="handleFreq"
                ></cis-value-domain>
              </l-formt-title>
            </el-form-item>

            <el-form-item
              label
              label-width
              prop="useDemand"
            >
              <l-formt-title label="服用要求">
                <l-value-domain
                  code="useMethod"
                  :value.sync="currentChuFangRow.useDemand"
                  class="select-container"
                  @change="useDemandChange"
                />
              </l-formt-title>
            </el-form-item>

            <el-form-item
              label
              label-width
              prop="decoctType"
            >
              <l-formt-title
                label="制药方法"
                :required="true"
              >
                <l-value-domain
                  v-axShotcut
                  :shotindex="4"
                  :shotready="shotreadyHandler(currentChuFangRow.decoctType, 'decoctType')"
                  @ended.native="submitForm('ruleForm')"
                  code="productionMethod"
                  clearable
                  @change="productionMethodChange"
                  :value.sync="currentChuFangRow.decoctType"
                  class="select-container"
                />
              </l-formt-title>
            </el-form-item>

            <!--<el-form-item label prop="decoctionStatus" class="skinTest">-->
            <!--<el-checkbox v-model="chmForm.decoctionStatus" true-label="1" false-label="0">代煎</el-checkbox>-->
            <!--</el-form-item>-->
            <!-- <el-form-item label prop="pockets">
              <l-formt-title label="袋数/每剂">
                <el-input-number
                  :min="0"
                  :controls="false"
                  v-model="chmForm.pockets"></el-input-number>
              </l-formt-title>
            </el-form-item> -->

            <el-form-item
              label
              prop="remarks"
              class="lastWidth"
            >
              <l-formt-title label="备注">
                <el-input
                  v-selectInner
                  class="onceDosageInput"
                  v-model="currentChuFangRow.remarks"
                ></el-input>

              </l-formt-title>
            </el-form-item>
            <!-- 表单失去焦点的容器 -->
            <input
              type="text"
              ref="referenceNull"
              class="referenceNull"
            >
            <!--<el-form-item label prop="fryingFee">-->
            <!--<l-formt-title label="代煎费" disabled>-->
            <!--<el-input v-model="chmForm.fryingFee" :disabled="true"></el-input>-->
            <!--</l-formt-title>-->
            <!--</el-form-item>-->
            <!-- <el-button type="primary" @click="submitForm('ruleForm')" class="button" :loading="saveBtnLoading" v-hotKey="{ func: 'func_save' }">保
              存
            </el-button> -->
          </el-form>
        </div>
        <div class="mask" v-if="showMask()"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { temporaryAdvice, submitApply } from "@/api/cis/resident/chm";
import { mapGetters, mapActions } from "vuex";
import CisValueDomain from "@/views/cis/components/CisValueDomain.vue";
import directives from "@/components/adviceCommon/adviceDirectives.js";

export default {
  name: "chmBottomForm",
  components: {
    CisValueDomain
  },
  directives: {
    ...directives
  },
  props: ["currentChuFangRow"],
  data() {
    return {

      saveBtnLoading: false,
      remoteParams: {
        pageSize: 50,
        status: "1"
      },
      chmRules: {
        useQty: [
          {
            required: true,
            message: "请输入用药贴数",
            trigger: ["blur", "change"]
          }
        ],
        useWay: [
          {
            required: true,
            message: "请选择用法",
            trigger: ["blur", "change"]
          }
        ],
        // volumeAfterDecoct: [
        //   {required: true, message: "请输入每贴水煎至", trigger: "blur"}
        // ],
        freqCode: [
          {
            required: true,
            message: "请输入用药频次",
            trigger: ["blur", "change"]
          }
        ],
        useDemand: [
          {
            required: false,
            message: "请选择服用要求",
            trigger: ["blur", "change"]
          }
        ],
        decoctType: [
          {
            required: true,
            message: "请选择制药方法",
            trigger: ["blur", "change"]
          }
        ]
      },
      herFryingAmount: 0
    };
  },
  computed: {
    // 获取患者信息
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.reset();
          }, 50);
        });
      }
    }
  },
  methods: {
    showMask (){
       //提交 3
      //暂存 1
      //
      //新增 0
      let { status } = this.currentChuFangRow;
      let hideFlag = status == undefined || status == 0 || status == 1; 
      return !hideFlag;
    },
    shotreadyHandler(value, name) {
      // if (value) {
      //   return true;
      // } else {
      //   return false;
      // }
      // this.$nextTick(()=>{
      //   this.$refs["chmForm"].validate((valid) => {});
      // });

      return !!value;
    },
    computerTotal(value) {
      value = typeof value === "undefined" ? 0 : value;
      this.$nextTick(() => {
        // let herFryingAmount = Number(document.getElementById("herFryingAmount").innerText);
        // let single = Number(document.getElementById("herRpSingleAmount").innerText);
        // document.getElementById("herTotalAmount").innerText = (single * Number(value) + herFryingAmount).rewToFixed(2);
        this.$emit("computerAmt", value);
      });
    },
    productionMethodChange(value, item) {
      console.log(value);
      console.log(item);
      let total = 0;
    },
    useDemandChange (value, item){
      // console.log(value, item);
      this.$set(this.currentChuFangRow, "useDemandName", item.name);
    },
    handleFreq(value, item) {
      // console.log(value, item);
      this.$set(this.currentChuFangRow, "freqTimes", item.frequencyTimes);
      this.$set(this.currentChuFangRow, "freqName", item.frequencyName);
      this.$set(this.currentChuFangRow, "freqId", item.id);
    },
    useWayChange (value, item){
      // console.log(value, item);
      this.$set(this.currentChuFangRow, "useWayName", item.name);
    },
    validateCurForm (){
      return new Promise((resolve, reject)=>{
        this.$refs["chmForm"].validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
          }
        })
      });
    },
    async submitForm() {
      // console.log(this.saveBtnLoading);
      // debugger
      if (!this.receivePatientData.id) {
        this.$message.info("请选择患者！");
        return;
      }

      let currentChuFangRow = this.currentChuFangRow;

      // if (
      //   currentChuFangRow.status != "0" 
      // ) {
      //   this.$message.info("只有新增处方和暂存状态的医嘱可以保存！");
      //   return;
      // }

      // if (!currentChuFangRow.no) {
      //   this.$message.info("请新增处方！");
      //   return;
      // }

      if (this.saveBtnLoading) return;
      this.saveBtnLoading = true;
      // eslint-disable-next-line consistent-return
      return new Promise(async (resolve, reject)=>{

        try {
          await this.validateCurForm();

          this.$emit(
            "saveChmTable",
            this.chmForm,
            (data) => {
              this.saveBtnLoading = false;
              this.reset();
              resolve(data);
            },
            () => {
              this.saveBtnLoading = false;
              reject(false);
            }
          );
        } catch (error) {
          this.saveBtnLoading = false;
          reject(false);
          return;
        }

        // this.$refs["chmForm"].validate(valid => {
        //   if (valid) {
            // this.$emit(
            //   "saveChmTable",
            //   this.chmForm,
            //   (data) => {
            //     this.saveBtnLoading = false;
            //     this.reset();
            //     resolve(data);
            //   },
            //   () => {
            //     this.saveBtnLoading = false;
            //     reject(false);
            //   }
            // );
          // } else {

          // }
        // });
      });
    },
    focusOnceDosageInput (){
      this.$nextTick(()=>{
        this.$refs.useQty.focus();
      })
    },
    reset() {
      this.$nextTick(() => {
        this.$refs["chmForm"].clearValidate();
        this.$refs["chmForm"].resetFields();
        this.saveBtnLoading = false;

        // 聚焦用药剂数
        this.$refs.referenceNull.focus();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.Rp-bottom-card {
  width: 100%;
  height: 100%;
  /*padding: 0 10px 0 10px;*/
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  /*padding: 20px;*/
  border: 0 !important;
  overflow: unset !important;
  padding: 16px 0px 16px 8px;

  /deep/ .el-card__body {
    overflow-x: auto;
  }

  .wrapper {
    width: 100%;
  }

  .demo-ruleForm {
    font-size: 0;
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
    position: relative;
    background-color: #fff;

    .RpClsTitle {
      font-size: 14px;

      font-weight: bold;
      color: rgba(148, 157, 163, 1);
      line-height: 60px;
    }

    /deep/ .el-form-item {
      // margin-bottom: 20px;
      // margin-right: 20px;
      display: inline-block;
      width: 30%;
      margin-right: 10px;
    }
    /deep/ .lastWidth {
      width: 91.5%;
    }
    /deep/ .el-form-item__content {
      width: 100%;
      margin-left: 0 !important;
      line-height: 0;
      margin-top: 0px;
      // width: 240px;
      margin-right: 8px;
    }

    .onceDosageInput {
      /deep/ .el-input__inner {
        padding-right: 30px;
      }
    }
  }
}

.button {
  position: absolute;
  right: 0;
  bottom: 0;
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

.referenceNull {
  position: absolute;
  clip: rect(0 0 0 0);
}

.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  opacity: 0.03;
  background-color: black;
}
</style>
