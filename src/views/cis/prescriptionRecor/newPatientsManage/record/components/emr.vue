<template>
  <div class="height100 wrapper">
    <el-card class="top-card">
      <el-tabs tab-position="left" v-model="activeName" class="contleft">
        <el-tab-pane label="非结构化病历" name="first">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item v-for="(item, index ) in formList"
                          :label="item.label"
                          :rules="item.rules"
                          :prop="item.prop"
                          :key="index"
            >
              <template v-if="item.type === 'textarea'">
                <el-input type="textarea" v-model="ruleForm[item.prop]"></el-input>
              </template>
              <template v-if="item.type === 'tag'">
                <el-tag
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag.diagName}}
                </el-tag>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="电子病历" name="second">
          <l-emr v-if="activeName=='second'"></l-emr>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card  class="bottom">
      <div>
        <el-form :model="diagnosticForm" ref="diagnosticForm">
          <el-form-item v-for="(item, index ) in diagnosticList"
                        :label="item.label"
                        :rules="item.rules"
                        :prop="item.prop"
                        :key="index"
          >
            <template v-if="item.type === 'select'">
              <el-select v-model="diagnosticForm[item.cwFlag]" placeholder="请选择">
                <el-option label="中药" value="0"></el-option>
                <el-option label="西药" value="1"></el-option>
              </el-select>
            </template>
            <template v-if="item.type === 'input'">
              <el-input v-if="item.prop === 'diagCode'" v-model.number="diagnosticForm[item.prop]"></el-input>
              <el-input v-else v-model="diagnosticForm[item.prop]"></el-input>
            </template>

            <template v-if="item.type === 'radio'">
              <el-checkbox v-model="diagnosticForm[item.prop]" true-label="1" false-label="0">主诊断</el-checkbox>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitDiagnosticForm('diagnosticForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {getInquiryRecord,saveInquiryRecord} from "@/api/cis/visit/visit";
  import { getDiaByPatientCode,addDiag,deleteOneDiag } from "@/api/common/diagnosis";
  import { getUId, getUN } from "@/utils/crypto";
  export default {
    name: "emr",
    data() {
      return {
        visitCode: '',
        activeName: 'first',

        formList: [{
          label: '主诉:',
          rules: [{required: true, message: '请输入主诉', trigger: 'blur'}],
          prop: 'chiefComplaint',
          type: 'textarea'
        }, {
          label: '现病史:',
          prop: 'presentIllness',
          rules: [{required: true, message: '请输入主诉', trigger: 'blur'}],
          type: 'textarea'
        }, {
          label: '既往史:',
          prop: 'pastHistory',
          rules: [{required: true, message: '请输入主诉', trigger: 'blur'}],
          type: 'textarea'
        }, {
          label: '体格检查:',
          prop: 'physicalExam',
          rules: [{required: true, message: '请输入体格检查', trigger: 'blur'}],
          type: 'textarea'
        }, {
          label: '辅助检查:',
          prop: 'otherExam',
          rules: [{required: true, message: '请输入辅助检查', trigger: 'blur'}],
          type: 'textarea'
        }, {
          label: '过敏史:',
          prop: 'allergicHistory',
          rules: [{required: true, message: '请输入过敏史', trigger: 'blur'}],
          type: 'textarea'
        }, {
          label: '门诊诊断:',
          prop: 'zena',
          type: 'tag'
        }],
        ruleForm: {
          id: '',
          chiefComplaint: '',
          presentIllness: '',
          pastHistory: '',
          physicalExam: '',
          otherExam: '',
          allergicHistory: '',
          dataVersion: 0,
          diagDoctorId: '',
          diagDoctorName: '',
          deptId: '',
          deptName: ''
        },
        diagnosticForm: {
          cwFlag: '0',
          diagCode: '',
          diagName: '',
          diagMain: '0',
          diagIcd: '',
          status: '1'
        },
        diagnosticList: [{
          label: '诊断类型:',
          rules: [{required: true, message: '请输入诊断类型', trigger: 'change'}],
          prop: 'cwFlag',
          type: 'select'
        },{
          label: '诊断编码：',
          rules: [{required: true, message: '请输入诊断编码', trigger: 'blur'}, { type: 'number', message: '必须为数字值'}],
          prop: 'diagCode',
          type: 'input'
        },{
          label: '诊断名称：',
          rules: [{required: true, message: '请输入诊断名称', trigger: 'blur'}],
          prop: 'diagName',
          type: 'input'
        },{
          label: '',
          prop: 'diagMain',
          type: 'radio'
        },{
          label: '诊断描述：',
          rules: [{required: true, message: '请输入诊断描述', trigger: 'blur'}],
          prop: 'diagIcd',
          type: 'input'
        }],
        dynamicTags: []
      }
    },
    methods: {
      handleClose () {
        console.log("发送ajax");
        // 成功后的回调
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      submitDiagnosticForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addDiagMes();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveInquiryRecord();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getInquiryRecord(){
        getInquiryRecord(this.visitCode).then(res => {
          this.ruleForm.id = res.data.id;
          this.ruleForm.chiefComplaint = res.data.chiefComplaint;
          this.ruleForm.presentIllness = res.data.presentIllness;
          this.ruleForm.pastHistory = res.data.pastHistory;
          this.ruleForm.physicalExam = res.data.physicalExam;
          this.ruleForm.otherExam = res.data.otherExam;
          this.ruleForm.allergicHistory = res.data.allergicHistory;
          this.ruleForm.dataVersion = res.data.dataVersion == null ? 0 : res.data.dataVersion;
        }).catch(() => {

        })
      },
      getPatDialog(){
        let params = {
          visitCode: this.visitCode
        }
        getDiaByPatientCode(params).then(res => {
          this.dynamicTags = res.data;
        }).catch(() => {
          this.$message({
            type: "error",
            message: "查询电子病历失败!"
          });
        })
      },
      saveInquiryRecord(){
        this.ruleForm.visitCode = this.visitCode;
        saveInquiryRecord(this.ruleForm).then(res => {
          if(res.data === 1){
            this.getInquiryRecord();
            this.$message({
              type: "success",
              message: "保存电子病历成功!"
            });
          }else{
            this.$message({
              type: "error",
              message: "保存电子病历失败!"
            });
          }
        }).catch(() => {
          this.$message({
            type: "error",
            message: "保存电子病历失败!"
          });
        })
      },
      addDiagMes(){
        if(this.diagnosticForm.hasOwnProperty('undefined')){
          delete this.diagnosticForm.undefined;
        }
        this.diagnosticForm.visitCode = this.visitCode;
        // this.diagnosticForm.diagCode = this.diagnosticForm.diagCode + "";
        this.diagnosticForm.diagDoctorId = getUId();
        this.diagnosticForm.diagDoctorName = getUN();
        this.diagnosticForm.deptId = this.$store.state.user.role.deptId;
        this.diagnosticForm.deptName = this.$store.state.user.role.deptName;
        addDiag(this.diagnosticForm).then(res => {
          if(res.code === 1){
            // this.getInquiryRecord();
            this.getPatDialog();
            this.$message({
              type: "success",
              message: "保存诊断成功!"
            });
          }else{
            this.$message({
              type: "error",
              message: "保存诊断失败!"
            });
          }
        }).catch(()=>{
          this.$message({
            type: "error",
            message: "保存诊断失败!"
          });
        })
      }
    },
    components: {
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        handler(n) {
          this.visitCode = n.visitCode;
          this.getInquiryRecord();
          this.getPatDialog();
          // alert(n.visitCode);
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    position: relative;
   // height: 88% !important;
    .demo-ruleForm {
      /deep/.el-form-item {
        margin-bottom: 20px;
      }
    }
    .top-card {
      height: calc(100% - 146px);
      /deep/.el-card__body {
        overflow: auto;
        height: 100%;
        // padding:20px 20px 20px 10px ;
      }
      &> /deep/.el-card__body{
        padding-left: 29px;
      }
      /deep/.el-tabs__header {
        position: absolute;
        left: 0;
        top: 5px;
      }
    }
    .contleft{
      height: 100%;
    }
    .bottom {
      overflow: auto;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height:136px;
      padding: 20px;
      /deep/.el-form-item {
        display: inline-block;
        margin-bottom: 20px;
      }
      .el-form-item {
        margin-right: 30px;
      }
      /deep/.el-form-item__content {
        display: inline-block;
      }
    }
  }
</style>
