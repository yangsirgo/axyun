<template>
  <el-card class="Rp-bottom-card height100">
    <div class="wrapper height100">
      <div class="RpCls height100">
        <div class="height100">
          <el-form :model="chmForm" :rules="chmRules" ref="chmForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label prop="useQty">
              <l-formt-title label="用药剂数" :required="true">
                <el-input-number v-axShotcut :shotindex="1000" :shotready="shotreadyHandler(chmForm.useQty, 'useQty')" v-selectInner class="onceDosageInput" v-model="chmForm.useQty" @change="computerTotal"
                  ref="useQty"
                  step-strictly :min="1" :max="50" :controls="false"></el-input-number>
              </l-formt-title>
            </el-form-item>

            <el-form-item label label-width prop="useage">
              <l-formt-title label="用法" :required="true">
                <l-value-domain code="usage"
                  v-axShotcut 
                  :shotindex="1001" 
                  :shotready="shotreadyHandler(chmForm.useage, 'useage')" 
                  clearable 
                  :value.sync="chmForm.useage" 
                  remoteShowKey="name"
                  :remoteParams="remoteParams"
                  remoteValueKey="code"
                  class="select-container" />
              </l-formt-title>
            </el-form-item>

            <el-form-item label prop="panFriedQuantity">
              <l-formt-title label="每贴水煎至">
                <!-- <el-input-number v-selectInner ref="onceDosage" class="onceDosageInput" 
                  v-model="chmForm.panFriedQuantity" 
                  :precision="0"
                  step-strictly 
                  :step="100" 
                  :min="100"
                  :max="200"
                  @change="changeUnmer" 
                  :controls="false"></el-input-number>
                <span style="position: relative; left: -28px">ML</span> -->
                <l-value-domain 
                  style="width: calc(100% - 30px);"
                  code="decoctionCount"
                  clearable 
                  :value.sync="chmForm.panFriedQuantity" 
                  remoteShowKey="name"
                  remoteValueKey="code"
                  class="select-container" />
                <span>ML</span>
              </l-formt-title>
            </el-form-item>


            <el-form-item label prop="frequencyCode">
              <l-formt-title label="用药频次" :required="true">
                <cis-value-domain  
                  clearable
                  v-axShotcut 
                  :shotindex="1003" 
                  :shotready="shotreadyHandler(chmForm.frequencyCode, 'frequencyCode')" 
                  :remoteParams="remoteParams" 
                  remoteUrl="/frequency/pageList" 
                  :value.sync="chmForm.frequencyCode"
                  placeholder="请选择频次" 
                   @keydown.enter.native="submitFrequency('ruleForm')" 
                  remoteShowKey="frequencyName" 
                  remoteValueKey="frequencyCode" 
                  @change="handleFreq"></cis-value-domain>
              </l-formt-title>
            </el-form-item>

            <el-form-item label label-width prop="useMethod">
              <l-formt-title label="服用要求">
                <l-value-domain clearable code="useMethod" :value.sync="chmForm.useMethod" class="select-container" />
              </l-formt-title>
            </el-form-item>

            <el-form-item label label-width prop="pharmaMethods" v-if="selectGroup.dosageValue!='2401'">
              <l-formt-title label="制药方法" :required="true">
                <l-value-domain  v-axShotcut :shotindex="1004" :shotready="shotreadyHandler(chmForm.pharmaMethods, 'pharmaMethods')" @keydown.enter.native="submitFormPharmaMethods('ruleForm')" code="productionMethod" clearable @change="productionMethodChange" :value.sync="chmForm.pharmaMethods"
                  class="select-container" />
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

            <el-form-item label prop="remarks" class="lastWidth">
              <l-formt-title label="备注">
                <el-input v-selectInner class="onceDosageInput" v-model="chmForm.remarks"></el-input>

              </l-formt-title>
            </el-form-item>
            <!-- 表单失去焦点的容器 -->
            <input type="text"  ref="referenceNull" class="referenceNull">
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
      </div>
    </div>
  </el-card>
</template>

<script>
  import {
    temporaryAdvice,
    submitApply
  } from "@/api/cis/resident/chm";
  import {
    mapGetters,
    mapActions
  } from "vuex";
  import CisValueDomain from "@/views/cis/components/CisValueDomain.vue";
  import directives from "@/components/adviceCommon/adviceDirectives.js";
  import { defaultFreq } from "@/views/cis/prescriptionRecor/newPatientsManage/order/chinaMedicinalHerb/components/variable.js";
  const herFryingAmountNum = 20;

  export default {
    name: "chmBottomForm",
    components: {
      CisValueDomain
    },
    directives:{
      ...directives
    },
    props: ['advicePO', 'currentChuFangRow', 'selectGroup'],
    data() {
      let chmForm = {
          recipeCode: "",
          useMethod: '1',// 默认 温服
          frequency: '',
          useQty: undefined,//用法
          decoctionStatus: '',
          panFriedQuantity: "200", // 默认 200ml
          pockets: undefined,
          useage: '',
          remarks: '',
          fryingFee: '',
          drugs: [],
          inpCode: '',
          patientId: '',
          bedNo: '',
          originId: '0',
          wardId: '',
          openSource: '0',
          // frequencyCode: 'BID',//默认每日两次
          pharmaMethods: '',
          // frequencyTimes: '2',
          // frequencyUnit: '天',
          ...defaultFreq
        };
      return {
        saveBtnLoading: false,
        remoteParams: {
          pageSize: 50,
          status: "1"
        },
        chmRules: {
          useQty: [{
            required: true,
            message: "请输入用药贴数",
            trigger: "blur"
          }],
          useage: [{
            required: true,
            message: "请选择用法",
            trigger: "blur"
          }],
          // panFriedQuantity: [
          //   {required: true, message: "请输入每贴水煎至", trigger: "blur"}
          // ],
          frequencyCode: [{
            required: true,
            message: "请输入用药频次",
            trigger: "blur"
          }],
          useMethod: [{
            required: false,
            message: "请选择服用要求",
            trigger: "blur"
          }],
          pharmaMethods: [{
            required: true,
            message: "请选择制药方法",
            trigger: "blur"
          }]
        },
        herFryingAmount: 0,
        chmForm
      }
    },
    computed: {
      // 获取患者信息
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        deep: true,
        immediate: true,
        handler() {
          this.$nextTick(() => {
            this.reset();
          });
        }
      },

      advicePO: {
        deep: true,
        immediate: true,
        handler(val) {
          
          this.reset();
          
          this.$nextTick(() => {
             //console.log("advicePO:::::", val);
             //debugger
            for (let key in this.chmForm) {
              if (typeof this.advicePO[key] !== "undefined") {
                this.chmForm[key] = this.advicePO[key];
              }
            }
          });
        }
      }
    },
    methods: {
      changeUnmer(value){
        console.log(value);
      },
      shotreadyHandler (value, name){
        // if (value) {
        //   return true;
        // } else {
        //   return false;
        // }
        // this.$nextTick(()=>{
        //   this.$refs["chmForm"].validate((valid) => {});
        // });
        if (name == "pharmaMethods") {
          return false;
        }

        return !!value;
      },
      computerTotal(value) {
        value = typeof value === "undefined" ? 0 : value;
        this.$nextTick(() => {
          // let herFryingAmount = Number(document.getElementById("herFryingAmount").innerText);
          // let single = Number(document.getElementById("herRpSingleAmount").innerText);
          // document.getElementById("herTotalAmount").innerText = (single * Number(value) + herFryingAmount).rewToFixed(2);
          this.$emit("computerAmt");
        });
      },
      productionMethodChange(value, item) {
        console.log(value)
        console.log(item)
        let total = 0;
        // if (value == 2 || item.name === "代煎") {
        //   // this.$message.info("暂不支持代煎");
        //   // this.chmForm.pharmaMethods = 1
        //   // value = 1
        //   // item = {code:1,name: '自煎'}
        //   this.$set(this.chmForm, 'pharmaMethods', null)
        //   // return;
        // }
        // this.chmForm.pharmaMethods = 1
        // value = 1
        // item = {code:1,name: '自煎'};
        // this.$forceUpdate()


        this.$nextTick(() => {
          try {
            document.getElementById("herFryingAmount").innerText = total.rewToFixed(4);
          } catch (error) {
            
          }
          

          let herFryingAmount = total;
          let no = Number(document.querySelector('.onceDosageInput').querySelector('.el-input__inner').value);
          let single = document.getElementById("herRpSingleAmount").innerText;
          document.getElementById("herTotalAmount").innerText = (herFryingAmount + single * no).rewToFixed(2);
        });
      },
      handleFreq(value, item) {
        this.chmForm.frequencyUnit = item.cycleUnit;
        this.chmForm.frequencyTimes = item.frequencyTimes;
      },
      submitFrequency (){
        if (this.selectGroup.dosageValue == '2401') {
          this.submitForm();
        }
      },
      submitFormPharmaMethods (){
        if (this.selectGroup.dosageValue != '2401') {
          this.submitForm();
        }
      },
      // 校验表单
      validateForm (){
        return new Promise((resolve, reject)=>{
          this.chmForm.inpCode = this.receivePatientData.inpCode;
          this.chmForm.patientId = this.receivePatientData.patientId;
          this.chmForm.visitCode = this.receivePatientData.visitCode;
          this.chmForm.bedNo = this.receivePatientData.bedCode;
          this.chmForm.wardId = this.receivePatientData.wardId;

          let currentChuFangRow = this.currentChuFangRow;
          //加入处方号
          this.chmForm.recipeCode = currentChuFangRow.recipeCode;
          try {
            this.chmForm.recipeId = currentChuFangRow.drugList[0].recipeId;
          } catch (e) {}

          this.$refs["chmForm"].validate((valid) => {
            if (valid) {
              resolve(this.chmForm)
            } else {
              reject(false);
            }
          });
        })
      },
      async submitForm() {
        console.log(this.saveBtnLoading)
        // debugger
        if (!this.receivePatientData.visitCode) {
          this.$message.info("请选择患者！");
          return;
        }

        // this.chmForm.inpCode = this.receivePatientData.inpCode;
        // this.chmForm.patientId = this.receivePatientData.patientId;
        // this.chmForm.visitCode = this.receivePatientData.visitCode;
        // this.chmForm.bedNo = this.receivePatientData.bedCode;
        // this.chmForm.wardId = this.receivePatientData.wardId;

        // let panFriedQuantity = this.chmForm.panFriedQuantity;
        // this.chmForm.panFriedQuantity = typeof panFriedQuantity == "undefined" || panFriedQuantity == "0" ? "" : panFriedQuantity;
        let currentChuFangRow = this.currentChuFangRow;

        if (currentChuFangRow.orderStatus !== "0" && currentChuFangRow.orderStatus !== "") {
          this.$message.info("只有新增处方和暂存状态的医嘱可以保存！");
          return;
        }

        if (!currentChuFangRow.recipeCode) {
          this.$message.info("请新增处方！");
          return;
        }

        if (this.saveBtnLoading) return;
        this.saveBtnLoading = true;

        //加入处方号
        // this.chmForm.recipeCode = currentChuFangRow.recipeCode;
        // try {
        //   this.chmForm.recipeId = currentChuFangRow.drugList[0].recipeId;
        // } catch (e) {}

        // let data = { ...this.chmForm, ...this.advicePO };
        // console.log(this.chmForm.pharmaMethods);
        // console.log(this.chmForm.useMethod);
        // this.$refs["chmForm"].validate((valid) => {
        //   if (valid) {
           // console.log("this.chmForm:::::::::", this.chmForm);

           try {
              let formData = await this.validateForm();
              this.$emit("saveChmTable", formData, () => {
                this.saveBtnLoading = false;
                this.setFormFieldBlur();
                this.reset();
              }, () => {
                this.saveBtnLoading = false;
              });
           } catch (error) {
             this.saveBtnLoading = false;
           }
        //   } else {
            
        //   }
        // });
      },
      setFormFieldBlur (){
        this.$nextTick(()=>{
          //使表单失去焦点
          this.$refs.referenceNull.focus();
        });
      },
      reset() {
        this.$nextTick(() => {
         // console.log("reset:::::");
          this.$refs["chmForm"].clearValidate();
          this.$refs["chmForm"].resetFields();
          this.chmForm = {
            ...this.chmForm,
            ...defaultFreq
          }
          this.saveBtnLoading = false;
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

      .display-list-item+.display-list-item {
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
     /deep/ .lastWidth{
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
</style>
