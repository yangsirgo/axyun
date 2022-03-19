<template>
  <el-dialog
    title="申请审核"
    :visible.sync="dialogVisible"
    :show="isShow"
    append-to-body
    @close="dialogClose"
    width="900px"
  >
    <el-form
      :model="myTemplate"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <div class="edit-section">
        <el-row class="form-item-top">
          <el-col :span="12">
            <el-form-item
              prop="enNo"
              :label="params.visitType === '04' ? '住院号' : '就诊号'"
              size="mini"
            >
              <el-input
                v-model="myTemplate.enNo"
                :disabled="true"
                style="width: 268px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="mini" label="病人信息">
              <span style="margin-left: 0em"
                >姓名：{{ myTemplate.patientNm }}</span
              >
              <span style="margin-left: 1em">性别：</span>
              <span
                :val="myTemplate.sex"
                code="GENDER_CODE"
                v-codeTransformEmr
              ></span>
              <span style="margin-left: 1em"
                >年龄：{{ myTemplate.age }}</span
              ></el-form-item
            >
          </el-col>
        </el-row>

        <el-row class="form-item-top">
          <el-col :span="12">
            <el-form-item prop="appPerson" label="文书名称" size="mini">
              <el-input
                v-model="myTemplate.mrNm"
                :disabled="true"
                style="width: 268px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="position: relative" class="form-item-top">
          <el-col :span="24">
            <el-form-item label="申请原因" size="mini" prop="appReason">
              <l-value-domain-emr
                disabled
                code="RecordMaintenanceApplyReason"
                :value.sync="myTemplate.appReason"
                placeholder="请选择申请原因"
              ></l-value-domain-emr>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-item-top">
          <el-col :span="24">
            <el-form-item prop="chkStatus" label="审批状态" size="mini">
              <el-radio-group v-model="myTemplate.chkStatus">
                <el-radio :label="'3'">同意</el-radio>
                <el-radio :label="'4'">拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="position: relative" class="form-item-top">
          <el-col :span="24">
            <el-form-item label="审批意见" size="mini" prop="chkAdv">
              <el-input
                type="textarea"
                style="width: 680px; top: 0; height: 50px"
                v-model="myTemplate.chkAdv"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="position: relative" class="form-item-top">
          <el-col :span="24">
            <el-form-item label="备注" size="mini" prop="remark">
              <el-input
                type="textarea"
                style="width: 680px; top: 0; height: 50px"
                v-model="myTemplate.remark"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editModel" type="primary" @click="handleDetermine"
        >确定</el-button
      >
      <el-button v-if="editModel" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { approve } from "@/api/emrRecord/emr/maintainApply";

export default {
  name: "",
  components: {},
  props: {
    params: Object,
    temple: Object,
    //模板内容
    innerHtml: String,
    isShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    temple(obj) {
      // console.log("myTemplate ====", obj);
      this.myTemplate = { ...obj };
      this.myTemplate.chkStatus = "4";
    },
    isShow() {
      this.dialogVisible = this.isShow;
    }
  },
  data() {
    return {
      editModel: true,
      dialogVisible: false,
      myTemplate: {},
      rules: {
        chkStatus: [
          { required: true, message: "请输入审批状态", trigger: "blur" }
        ],
        chkAdv: [{ required: true, message: "请输入审批意见", trigger: "blur" }]
      }
    };
  },
  methods: {
    //确定
    handleDetermine() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.determine();
        } else {
          return false;
        }
      });
    },
    determine() {
      let msg =
        this.myTemplate.chkStatus == "3"
          ? "确定【通过】该审批？"
          : "确定【拒绝】该审批？";
      this.$confirm(msg, "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.updateState();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCancel() {
      this.dialogClose();
    },
    //对话框关闭
    dialogClose() {
      this.$emit("update:isShow", false);
    },
    updateState() {
      console.log("updateState=====", this.myTemplate);
      approve(this.myTemplate)
        .then(resData => {
          let data = resData.data;
          if (resData.code === 1) {
            this.$message.success("审核成功！");
            this.dialogClose();
            this.$emit("handle-save", resData.data);
          } else {
            this.$message.error(resData.msg || "更新接口报错");
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error.msg || "更新接口报错");
        });
      this.dialogClose();
    }
  }
};
</script>

<style lang='scss' scoped>
.edit-section {
  margin: 15px 20px 0px 20px;
  /*font-size: 14px;*/
  line-height: 28px;
  .form-item-top {
    margin-top: 10px;
  }
  .form-item {
    width: 298px;
    display: inline-block;
  }
}
</style>
