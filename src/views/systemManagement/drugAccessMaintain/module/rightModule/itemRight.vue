<template>
  <div class="height100">
    <el-form :model="dInfoForm" :rules="itemRules" ref="itemRuleForm" label-width="0" class="itemRuleForm">
      <div class="utilCls">
        <div class="marginBT5">
          <el-form-item label="" prop="checkedRange">
            <l-formt-title label="限制范围" :required="true">
              <!--<l-value-domain-->
                <!--code="VisitingCategoryCode"-->
                <!--clearable-->
                <!--multiple-->
                <!--:value.sync="dInfoForm.checkedRange"-->
                <!--placeholder="请选择使用范围"-->
                <!--@change="handleCheckedRangesChange"-->
              <!--&gt;</l-value-domain>-->
              <!-- AntimicrobialRanges -->
              <l-value-domain
                clearable
                code="AdviceMedicationRange"
                placeholder="请选择使用范围"
                style="width: 100%"
                :value.sync="dInfoForm.checkedRange"/>
            </l-formt-title>
          </el-form-item>
        </div>
        <div class="marginBT5">
          <el-form-item label="" prop="title">
            <l-formt-title label="医师职称" :required="true">
              <l-value-domain
                clearable
                code="doctorProfessionalTitle"
                placeholder="请输入内容"
                style="width: 100%"
                :value.sync="dInfoForm.title"/>
            </l-formt-title>
          </el-form-item>
        </div>
        <div class="marginBT5">
          <el-form-item label="" prop="level">
            <l-formt-title label="抗菌药品级别" class=" pr5" :required="true">
              <l-value-domain
                clearable
                code="AntimicrobialLevel"
                placeholder="请输入内容"
                style="width: 100%"
                :value.sync="dInfoForm.level"/>
            </l-formt-title>
          </el-form-item>
        </div>
        <div class="marginBT5">
          <el-form-item label="" prop="way">
            <l-formt-title label="审核路径" :required="true">
              <l-value-domain
                clearable
                code="AntimicrobialReviewPath"
                placeholder="请输入内容"
                style="width: 100%"
                :value.sync="dInfoForm.way"/>
            </l-formt-title>
          </el-form-item>
        </div>
        <div class="marginBT5">
          <el-form-item label="" prop="status" class="width50 fl">
            <l-formt-title label="使用状态" :required="true">
              <el-switch
                class="width30 displayInline"
                style="vertical-align: 3px; padding-left: 20px"
                v-model="dInfoForm.status"
                active-text="激活"
                active-value="0"
                inactive-text="禁用"
                inactive-value="1">
              </el-switch>
            </l-formt-title>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div style="position: absolute;right: 20px;bottom: 20px;">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>

</template>

<script>
  import {
    saveAntibacterialAuth,
    getAntibacterialAuth
  } from '@/api/systemManagement/drugAccessMaintain/antibacterialAuth'
  import {getDatas, getArrayList} from '@/api/wconf/wparam'

  export default {
    name: "itemRight",
    components: {},
    data() {
      return {
        id: "",
        singles:{},
        dInfoForm: {
          checkedRange: "",
          title: "",
          status: "0",
          level: "",
          way: ""
        },
        currentRow: {},
        itemRules: {
          checkedRange: [{required: true, message: '限制范围不能为空', trigger: 'change'}],
          title: [{required: true, message: '医师职称不能为空', trigger: 'change'}],
          level: [{required: true, message: '抗菌药品级别不能为空', trigger: 'change'}],
          way: [{required: true, message: '审核路径不能为空', trigger: 'change'}]
        }
      };
    },
    created() {
      console.info("created");
    },
    mounted() {
      let singlesParam = [
        {"code":"AntimicrobialRanges"},
        {"code":"doctorProfessionalTitle"},
        {"code":"AntimicrobialLevel"},
        {"code":"AntimicrobialReviewPath"}
      ];
      getArrayList(singlesParam)
        .then(res => {
          if (res.code === 1) {
            let data = res.data;
            if(null != data.AntimicrobialRanges){
              this.singles["AntimicrobialRanges"] = this.getMapKey(data.AntimicrobialRanges);
            }
            if(null != data.doctorProfessionalTitle){
              this.singles["doctorProfessionalTitle"] = this.getMapKey(data.doctorProfessionalTitle);
            }
            if(null != data.AntimicrobialLevel){
              this.singles["AntimicrobialLevel"] = this.getMapKey(data.AntimicrobialLevel);
            }
            if(null != data.AntimicrobialReviewPath){
              this.singles["AntimicrobialReviewPath"] = this.getMapKey(data.AntimicrobialReviewPath);
            }
            console.log("this.singles", this.singles)
          }
        })
      console.info("mounted");
    },
    methods: {
      getMapKey(data){
        let resultMap = {};
        if(null != data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let row = data[i];
            resultMap[row.code] = row.name;
          }
        }
        return resultMap;
      },
      identificationTypeChange(val, item) {
        console.log(val, item);
        // if (val) {
        //   // this.referralForm.patientCardType = item.name;
        // } else {
        //   // this.referralForm.patientCardType = "";
        // }
      },
      init() {
        // this.$set(this.fromData, 'tableData', this.fromData.tableData)
      },
      changeBigDA() {
        // this.dInfoForm.sonDoctorAdvice = null;
        // this.remoteSonParams = {...this.remoteSonParams, ...{parentId: this.dInfoForm.bigDoctorAdvice}};
      },
      changeBigLei() {
        // this.dInfoForm.bigDoctorAdvice = null;
        // this.remoteParams = {...this.remoteParams, ...{parentId: this.dInfoForm.bigDoctorAdvice}};
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleCheckedRangesChange(value) {
        console.log(value);
      },
      handleCheckedCatChange(value) {
        console.log(value);
      },

      resetForm() {
        this.$nextTick(() => {
          this.$refs["itemRuleForm"] && this.$refs["itemRuleForm"].resetFields();
        })
      },
      //表单的error 信息
      showErrorMsg(errorObj) {
        let self = this;
        for (let key in errorObj) {
          setTimeout(function () {
            if (document.getElementsByClassName('el-message').length === 0) {//message 弹窗一次错误
              self.$message.error(errorObj[key][0]);
            }
          }, 0)
        }
      },
      save() {
        console.log("this.dInfoForm", this.dInfoForm);
        let Flag = false;


        this.$refs["itemRuleForm"].validate((valid, error) => {
          if (valid) {
            Flag = true;
          } else {
            this.showErrorMsg(error)
            Flag = false;
            return false;
          }
        });


        if (!Flag) {
          return;
        }
        let antibacterialAuthPO = {
          rangesId: this.dInfoForm.checkedRange,
          ranges: this.singles.AntimicrobialRanges[this.dInfoForm.checkedRange],
          doctorTitleId: this.dInfoForm.title,
          doctorTitle: this.singles.doctorProfessionalTitle[this.dInfoForm.title],
          levelId: this.dInfoForm.level,
          level: this.singles.AntimicrobialLevel[this.dInfoForm.level],
          reviewPathId: this.dInfoForm.way,
          reviewPath: this.singles.AntimicrobialReviewPath[this.dInfoForm.way],
          status: this.dInfoForm.status
        };
        if(null != this.id && this.id != ""){
          antibacterialAuthPO.id = this.id;
        }
        console.log("antibacterialAuthPO", antibacterialAuthPO);
        saveAntibacterialAuth(antibacterialAuthPO).then(res=>{
          if (res.code === 1) {
            this.resetForm();
            this.id = null;
            this.$message("保存成功");
            this.$emit("save");


          }
          else{
            this.$message.error("保存失败，重复数据");
          }
        }).catch(res=>{
          this.$message.error(res.msg)
        })
        // alert('save 接口');
        // console.log(this.currentRow);
        // setTimeout(() => {
        //   this.resetForm();
        // }, 1000)
      },

      loadData(row) {
        // this.resetForm();
        // if (Object.keys(row).length !== 0) {
        //   this.currentRow = row;
        //   this.$nextTick(() => {
        //     for (let key in this.dInfoForm) {
        //       this.dInfoForm[key] = row[key];
        //     }
        //   })
        // }
        this.id = row.id;
        let obj = {
          id: this.id
        }
        getAntibacterialAuth(obj).then(res => {
          if(res.code === 1){
            console.log("data", res.data);
            let resData = {};
            if(typeof(res.data) != 'undefined')
            {
              resData = res.data;
            }

            this.dInfoForm.checkedRange = resData.rangesId;
            this.dInfoForm.title = resData.doctorTitleId;
            this.dInfoForm.level = resData.levelId;
            this.dInfoForm.way = resData.reviewPathId;
            this.dInfoForm.status = resData.status;
          }
          else{
            this.$message.error("未能查询到该数据");
          }
        })
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .utilCls {
    font-size: 0;

    .rangeCls {
      vertical-align: 10px;
    }

    .height36 {
      line-height: 36px;
      height: 36px;
      padding: 0 10px;
    }
  }

  .wrapper {
    /deep/ .el-tab-pane {
      height: calc(100% - 62px);
      position: relative;
    }

    /deep/ .el-tabs__header {
      margin: 0 0 10px;
    }

    .mainTable {
      /deep/ .cell {
        padding: 0;
      }
    }

  }

  .marginRL5 {
    margin: 0 5px
  }

  .marginBT5 {
    margin: 25px 15px;
  }

  .paddingRL5 {
    padding: 0 5px
  }

  .pr5 {
    padding-right: 5px;
  }

  .pl10 {
    padding-left: 10px;
  }

  .displayInline {
    display: inline-block;
  }

  .fontSize16 {
    font-size: 16px;
  }

  .width50 {
    width: 50%;
  }

  .width30 {
    width: 30%;
  }


  .pd10 {
    padding: 10px;
  }

  .activeColor {
    color: #0000cc;
  }

  .overflowHidden {
    overflow: hidden;
  }

  /deep/ .el-form-item__content {
    height: 36px;
  }
</style>
