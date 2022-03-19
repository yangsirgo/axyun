<template>
  <div class="height100" style="padding: 0px 15px;">
    <el-form :model="dInfoForm" :rules="itemRules" ref="itemRuleForm" label-width="0" class="overflowHidden itemRuleForm">
      <l-card-title class="title">
        <span slot="left">申请单属性维护</span>
      </l-card-title>
      <div class="float-left width100 content" style="margin-bottom:10px">
        <el-row style="margin-bottom:15px" :gutter="20">
          <el-col :span="24">
            <el-form-item prop="groupName" required>
              <LFormtTitle class="float-left"  label="组套名称" :required="true" style="width: 100%;">
                <el-input
                  :disabled="readonly"
                  placeholder="组套名称"
                  v-model="dInfoForm.groupName"
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:15px" :gutter="20">
          <el-col :span="12">
            <el-form-item prop="itemName" required>
              <LFormtTitle class="float-left" :required="true" label="目录名称" style="width: 100%;">
                <el-input
                  :disabled="readonly"
                  style="width:calc(100% - 45px)"
                  placeholder="目录名称"
                  v-model="dInfoForm.itemName"
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="no" label="">
              <LFormtTitle class="float-left"  label="检查类型 " style="width: 100%;">
                <el-select :disabled="readonly" v-model="dInfoForm.checkType"  placeholder="检查类型">
                  <el-option
                    key="0"
                    label="CT"
                    :value="0">
                  </el-option>
                  <el-option
                    key="1"
                    label="B超"
                    :value="1">
                  </el-option>
                </el-select>
              </LFormtTitle>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:15px">
          <el-col :span="12">
            <el-form-item prop="symptomDescription1">
              <div class="more-selected">
                <LFormtTitle  label="检查方法">
                  <el-select :disabled="readonly" v-model="dInfoForm.checkWay" placeholder="请选择检查方法">
                    <el-option
                      key="0"
                      label="有"
                      :value="0">
                    </el-option>
                    <el-option
                      key="1"
                      label="无"
                      :value="1">
                    </el-option>
                  </el-select>
                </LFormtTitle>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <LFormtTitle label="性别限制">
              <el-select :disabled="readonly" v-model="dInfoForm.sexLimit" placeholder="请选择性别限制">
                <el-option
                  key="0"
                  label="平扫"
                  :value="0">
                </el-option>
              </el-select>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:15px">
          <el-col :span="12">
            <el-form-item prop="checkTarget">
              <div class="more-selected">
                <LFormtTitle  label="检查部位">
                  <el-select :disabled="readonly" v-model="dInfoForm.checkTarget" placeholder="请选择检查部位">
                    <el-option
                      key="0"
                      label="头"
                      :value="0">
                    </el-option>
                    <el-option
                      key="1"
                      label="脚"
                      :value="1">
                    </el-option>
                  </el-select>
                </LFormtTitle>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sample">
            <LFormtTitle label="标本">
              <el-select :disabled="readonly"  v-model="dInfoForm.sample" placeholder="请选择标本">
                <el-option
                  key="0"
                  label="标本1"
                  :value="0">
                </el-option>
              </el-select>
            </LFormtTitle>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:15px">
          <el-col :span="12">
            <el-form-item prop="address">
              <div class="more-selected">
                <LFormtTitle  label="检查地点">
                  <el-input
                    :disabled="readonly"
                    style="width:calc(100% - 45px)"
                    placeholder="检查地点"
                    v-model="dInfoForm.address"
                  ></el-input>
                </LFormtTitle>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="outerUnit">
            <LFormtTitle label="外送单位">
              <el-select :disabled="readonly"  v-model="dInfoForm.outerUnit" placeholder="请选择外送单位">
                <el-option
                  key="0"
                  label="外送单位1"
                  :value="0">
                </el-option>
              </el-select>
            </LFormtTitle>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:15px">
          <el-col :span="12">
            <el-form-item prop="printSample">
              <LFormtTitle label="打印模板">
                <el-select :disabled="readonly" v-model="dInfoForm.printSample" placeholder="请选择打印模板">
                  <el-option
                    key="0"
                    label="打印模板1"
                    :value="0">
                  </el-option>
                </el-select>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="order">
              <div class="more-selected">
                <LFormtTitle  label="排序">
                  <el-input
                    :disabled="readonly"
                    style="width:calc(100% - 45px)"
                    placeholder="排序"
                    v-model="dInfoForm.order"
                  ></el-input>
                </LFormtTitle>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div  style="height: 260px;margin-bottom:15px">
      <edit-table ref="editTable" class="height100" :readonly="readonly"></edit-table>
    </div>
    <div style="height: 150px;margin-bottom:15px">
      <display-table class="height100"></display-table>
    </div>
    <div style="position: absolute;right: 20px;bottom: 20px;">
      <el-button type="primary" @click="save" :disabled="readonly">保存</el-button>
    </div>
  </div>

</template>

<script>
  import {
    saveAntibacterialAuth,
    getAntibacterialAuth
  } from '@/api/systemManagement/drugAccessMaintain/antibacterialAuth'
  import {getDatas, getArrayList} from '@/api/wconf/wparam'
  import editTable from "./editTable.vue"
  import displayTable from "./displayTable.vue"

  export default {
    name: "itemRight",
    components: { editTable, displayTable },
    data() {
      return {
        id: "",
        singles:{},
        dInfoForm: {
          groupName: "",
          itemName: "",
          checkType: 0,
          checkWay:0,
          sexLimit: 0,
          checkTarget:'',
          sample:'',
          address:'',
          outerUnit:'',
          printSample:'',
          order:''
        },
        readonly:true,
        currentRow: {},
        itemRules: {
          groupName : [{trigger: 'blur', required: true, message: '名称不能为空'}],
          itemName : [{trigger: 'blur', required: true, message: '目录名称不能为空'}]
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
      setEditable (){
        this.readonly = false;
      },
      setReadonly (){
        this.readonly = true;
      },
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
          this.$refs.editTable && this.$refs.editTable.reset ();
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
            let resData = res.data;
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
