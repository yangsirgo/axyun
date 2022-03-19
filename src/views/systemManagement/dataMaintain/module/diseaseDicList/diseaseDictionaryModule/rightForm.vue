<template>
  <div class="position-relative height100" v-loading="formLoading">
    <l-card-title style="margin-left: 8px; padding: 8px 0">
      <span slot="left">疾病信息</span>
    </l-card-title>
    <!--医嘱大类搜索项-->
    <div class="utils-cls">
      <el-form :model="utilsFilter" :rules="Rules" ref="ruleForm" label-width="0" class="big-ruleForm">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="category" class="width50 fl">
              <l-formt-title label="类别" :required="true">
                <l-value-domain code="CWM" :disabled="true" :value.sync="utilsFilter.category" placeholder="请选择"></l-value-domain>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="recordStatus">
              <el-switch class="margin-left-10" style="vertical-align: 12px;" v-model="utilsFilter.recordStatus"
                active-text="激活" active-value="0" inactive-text="禁用" inactive-value="1"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="diseaseCode">
              <l-formt-title label="疾病编码" :required="true">
                <el-input size="medium" v-model="utilsFilter.diseaseCode"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="icd10Encoding">
              <l-formt-title label="ICD编码" :required="true">
                <el-input size="medium" v-model="utilsFilter.icd10Encoding"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="" prop="dictionaryName">
              <l-formt-title label="疾病名称" :required="true">
                <el-input size="medium" v-model="utilsFilter.dictionaryName"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="namePy">
              <l-formt-title label="拼音">
                <el-input size="medium" v-model="utilsFilter.namePy"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="nameWb">
              <l-formt-title label="五笔码">
                <el-input v-model="utilsFilter.nameWb" placeholder="请输入内容" style="width: 100%"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="genderRestrictions">
              <l-formt-title label="性别限制">
                <el-select v-model="utilsFilter.genderRestrictions" placeholder="请选择性别限制" style="width: 100%">
                  <el-option label="不限" value="0">
                  </el-option>
                  <el-option label="男" value="1">
                  </el-option>
                  <el-option label="女" value="2">
                  </el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="diseaseReportCard">
              <l-formt-title label="疾病报卡">
                <!-- <el-input size="medium" v-model="utilsFilter.diseaseReportCard"></el-input> -->
                <l-value-domain :code="diseaseReportCardCode" :value.sync="utilsFilter.diseaseReportCard"  class="select-container""
                  :placeholder="$t('base.placeholder')"></l-value-domain>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="diseaseSuborder">
              <l-formt-title label="疾病版本">
                <el-input size="medium" v-model="utilsFilter.diseaseSuborder"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="diseaseEdition">
              <l-formt-title label="疾病亚目">
                <el-input size="medium" v-model="utilsFilter.diseaseEdition"></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="" prop="chronicDiseaseIdent">
              <el-radio v-model="utilsFilter.chronicDiseaseIdent" label="1">慢性病标识</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3">
            <span>备注</span>
          </el-col>
          <el-col :span="21">
            <el-form-item label="" prop="remarks">
              <el-input type="textarea" v-model="utilsFilter.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="position: absolute;right: 10px;bottom: 10px;">
      <el-button type="primary" :loading="saveBtnLoading" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
  import {
    icdSaveOrUpdate,
    getDiagInfoById
  } from "@/api/systemManagement/dataMaintain/diseaseDicList.js";

  export default {
    name: "rightForm",
    props: ["currentRow"],
    components: {},
    data() {
      return {
        diseaseReportCardCode:'DiseaseReportCard',
        formLoading: false,
        saveBtnLoading: false,
        utilsFilter: {
          category: "1",
          recordStatus: "",
          diseaseCode: "",
          icd10Encoding: "",
          dictionaryName: "",
          namePy: "",
          nameWb: "",
          genderRestrictions: "0",
          diseaseReportCard: "",
          diseaseSuborder: "",
          diseaseEdition: "",
          chronicDiseaseIdent: "",
          remarks: ""
        },
        Rules: {
          category: [{
            required: true,
            message: "类别不能为空",
            trigger: "blur"
          }],
          diseaseCode: [{
            required: true,
            message: "疾病编码不能为空",
            trigger: "blur"
          }],
          icd10Encoding: [{
            required: true,
            message: "ICD编码不能为空",
            trigger: "blur"
          }],
          dictionaryName: [{
            required: true,
            message: "疾病名称不能为空",
            trigger: "blur"
          }],
          namePy: [{
            required: false,
            message: "拼音码不能为空",
            trigger: "blur"
          }]
        },
        editDataVersion: null
      };
    },
    created() {},
    mounted() {},
    methods: {
      //表单的error 信息
      showErrorMsg(errorObj) {
        let self = this;
        for (let key in errorObj) {
          setTimeout(function() {
            if (document.getElementsByClassName("el-message").length === 0) {
              //message 弹窗一次错误
              self.$message.error(errorObj[key][0]);
            }
          }, 0);
        }
      },
      save() {
        this.$refs["ruleForm"].validate(async (valid, error) => {
          if (valid) {
            try {
              let data = {
                ...this.utilsFilter,
                orgId: "66",
                ...{
                  icd10DictionaryId: this.currentRow.icd10DictionaryId,
                  dataVersion: this.currentRow.icd10DictionaryId ?
                    this.editDataVersion :
                    null
                }
              };
              let ajaxData = {
                icd10DictionaryVO: data,
                isWesternMedicine: "F"
              };
              let result = await icdSaveOrUpdate(ajaxData);
              if (result.code === 1) {
                this.$message.success(result.msg || "保存成功");
                this.saveBtnLoading = false;
                this.resetForm();
                this.$emit("loadTable");
              } else {
                this.saveBtnLoading = false;
                this.$message.error(result.msg || "保存失败");
              }
            } catch (e) {
              this.saveBtnLoading = false;
              this.$message.error("保存失败");
            }
          } else {
            this.showErrorMsg(error);
            return false;
          }
        });
      },
      async getDiagInfoById() {
        this.formLoading = true;
        let ajaxData = {
          isWesternMedicine: "F",
          id: this.currentRow.icd10DictionaryId
        };
        try {
          let {
            data,
            msg,
            code
          } = await getDiagInfoById(ajaxData);
          if (code === 1) {
            for (let key in this.utilsFilter) {
              this.utilsFilter[key] = data.icd10DictionaryVO[key];
            }

            this.editDataVersion = data.icd10DictionaryVO.dataVersion;
          } else {
            this.$message.error(msg || "获取详情失败！");
          }
          this.formLoading = false;
        } catch (error) {
          this.formLoading = false;
          this.$message.error("获取详情失败！");
        }
      },
      resetForm() {
        this.$refs["ruleForm"].resetFields();
      }
    },
    watch: {
      currentRow: {
        deep: true,
        handler(val) {
          if (Object.keys(val).length > 0) {
            this.getDiagInfoById();
          }
        }
      }
    },
    computed: {}
  };
</script>

<style scoped lang="scss">
  .utils-cls {
    padding: 0 10px;
  }
</style>
