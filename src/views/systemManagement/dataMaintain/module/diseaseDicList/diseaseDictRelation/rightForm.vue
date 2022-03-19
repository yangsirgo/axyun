<template>
  <div
    class="position-relative height100"
    v-loading="formLoading"
  >
    <l-card-title style="margin-left: 8px; padding: 8px 0">
      <span slot="left">疾病信息</span>
    </l-card-title>
    <!--医嘱大类搜索项-->
    <div class="utils-cls">
      <el-form
        :model="utilsFilter"
        :rules="Rules"
        ref="ruleForm"
        label-width="0"
        class="big-ruleForm"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label=""
              prop="category"
              class="width50 fl"
            >
              <l-formt-title
                label="类别"
                :required="true"
              >
                <l-value-domain
                  code="CWM"
                  :disabled="true"
                  :value.sync="utilsFilter.category"
                  placeholder="请选择"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label=""
              prop="status"
            >
              <el-switch
                class="margin-left-10"
                style="vertical-align: 12px;"
                v-model="utilsFilter.status"
                active-text="激活"
                active-value="0"
                inactive-text="禁用"
                inactive-value="1"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label=""
              prop="tcdCode"
            >
              <l-formt-title
                label="疾病编码"
                :required="true"
              >
                <el-input
                  size="medium"
                  v-model="utilsFilter.tcdCode"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label=""
              prop="icd10Encoding"
            >
              <l-formt-title label="标准编码（ICD）">
                <el-input
                  size="medium"
                  v-model="utilsFilter.icd10Encoding"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item
              label=""
              prop="tcdName"
            >
              <l-formt-title
                label="疾病名称"
                :required="true"
              >
                <el-input
                  size="medium"
                  v-model="utilsFilter.tcdName"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label=""
              prop="namePy"
            >
              <l-formt-title
                label="拼音"
              >
                <el-input
                  size="medium"
                  v-model="utilsFilter.namePy"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label=""
              prop="nameWb"
            >
              <l-formt-title label="五笔码">
                <el-input
                  v-model="utilsFilter.nameWb"
                  placeholder="请输入内容"
                  style="width: 100%"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label=""
              prop="genderRestrictions"
            >
              <l-formt-title label="性别限制">
                <el-select
                  v-model="utilsFilter.genderRestrictions"
                  placeholder="请选择性别限制"
                  style="width: 100%"
                >
                  <el-option
                    label="不限"
                    value="0"
                  >
                  </el-option>
                  <el-option
                    label="男"
                    value="1"
                  >
                  </el-option>
                  <el-option
                    label="女"
                    value="2"
                  >
                  </el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label=""
              prop="diseaseReportCard"
            >
              <l-formt-title label="疾病报卡">
                <el-input
                  size="medium"
                  v-model="utilsFilter.diseaseReportCard"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label=""
              prop="diseaseSuborder"
            >
              <l-formt-title label="疾病版本">
                <el-input
                  size="medium"
                  v-model="utilsFilter.diseaseSuborder"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label=""
              prop="diseaseEdition"
            >
              <l-formt-title label="疾病亚目">
                <el-input
                  size="medium"
                  v-model="utilsFilter.diseaseEdition"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item
              label=""
              prop="chronicDiseaseIdent"
            >
              <el-radio
                v-model="utilsFilter.chronicDiseaseIdent"
                label="1"
              >慢性病标识</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="height: calc(100% - 387px);">
      <relationTable
        ref="relationTable"
        :tableList="tableList"
        @handleDel="getList"
      ></relationTable>
    </div>
    <div style="position: absolute;right: 10px;bottom: 10px;">
      <el-button
        type="primary"
        :loading="saveBtnLoading"
        @click="save"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import relationTable from "@/views/systemManagement/dataMaintain/module/diseaseDicList/diseaseDictRelation/relationTable.vue";
import {
  icdSaveOrUpdate,
  getDiagInfoById
} from "@/api/systemManagement/dataMaintain/diseaseDicList.js";

export default {
  name: "rightForm",
  props: ["currentRow"],
  components: { relationTable },
  data() {
    return {
      saveBtnLoading: false,
      tableList: [],
      utilsFilter: {
        category: "2",
        status: "",
        tcdCode: "",
        icd10Encoding: "",
        tcdName: "",
        namePy: "",
        nameWb: "",
        genderRestrictions: "0",
        diseaseReportCard: "",
        diseaseSuborder: "",
        diseaseEdition: "",
        chronicDiseaseIdent: ""
      },
      Rules: {
        category: [
          {
            required: true,
            message: "类别不能为空",
            trigger: "blur"
          }
        ],
        tcdCode: [
          {
            required: true,
            message: "疾病编码不能为空",
            trigger: "blur"
          }
        ],
        tcdName: [
          {
            required: true,
            message: "疾病名称不能为空",
            trigger: "blur"
          }
        ],
        namePy: [{ required: false, message: "拼音码不能为空", trigger: "blur" }]
      },
      editDataVersion: null,
      diagId: null,
      formLoading: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    async getTableList() {
      this.formLoading = true;
      let { tcdCode, tcdName, icd10DictionaryId } = this.currentRow;
      // if (!tcdCode || !tcdName) return;

      let ajaxData = {
        id: icd10DictionaryId,
        isWesternMedicine: "D"
      };
      try {
        let result = await getDiagInfoById(ajaxData);
        let { data } = result;
        if (result.code === 1 && data.patTcmDiagVO) {
          this.tableList = data.patTcmDiagVO.patTcmSyndromeVOList;
          for (let key in this.utilsFilter) {
            if (key !== "category") {
              // 定死了 中医
              this.utilsFilter[key] = data.patTcmDiagVO[key];
            }
          }
          //对已有的数据编辑 需要的 dataversion
          this.editDataVersion = data.patTcmDiagVO.dataVersion;
          //删除table 数据 需要的 diagId
          this.diagId = data.patTcmDiagVO.id;
        } else {
          this.$message.error(result.msg || "获取关联证候列表失败");
        }
        this.formLoading = false;
      } catch (e) {
        this.$message.error("获取关联证候列表失败");
        this.formLoading = false;
      }
    },
    getList() {
      // 获取数据
    },
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
    async validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate(async valid => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
            return false;
          }
        });
      });
    },
    async save() {
      try {
        let result = await this.validateForm();
        if (!result) return;
      } catch {
        return;
      }

      try {
        let relationTableResult = await this.$refs.relationTable.validateForm();
        if (!relationTableResult) return;
      } catch {
        return;
      }

      console.log(
        "tableData的数据",
        this.$refs.relationTable.tableRuleForm.tableData
      );
      try {
        this.saveBtnLoading = true;
        let data = {
          ...this.utilsFilter,
          orgId: "66",
          ...{
            id: this.currentRow.icd10DictionaryId,
            dataVersion: this.currentRow.icd10DictionaryId
              ? this.editDataVersion
              : null
          }
        };
        data.patTcmSyndromeVOList = this.$refs.relationTable.tableRuleForm.tableData;
        let ajaxData = {
          patTcmDiagVO: data,
          isWesternMedicine: "D"
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
    },
    resetForm() {
      try {
        this.$refs["ruleForm"].resetFields();
      } catch {}

      try {
        this.$refs.relationTable.resetTable();
      } catch {}
    }
  },
  watch: {
    currentRow: {
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0 && val.icd10DictionaryId) {
          this.getTableList();
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
