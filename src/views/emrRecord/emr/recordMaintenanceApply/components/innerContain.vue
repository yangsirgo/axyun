<template>
  <el-dialog
    title="病历维护申请"
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="dialogClose"
    width="880px"
  >
    <el-form
      :model="applyData"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <div class="edit-section">
        <el-row class="form-item-top">
          <el-col :span="12">
            <el-form-item
              prop="enId"
              size="mini"
              :label="this.params.visitType == '04' ? '住院号' : '就诊号'"
            >
              <el-input v-model="applyData.enNo" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="mini" label="病人信息">
              <span style="margin-left: 0em"
                >姓名：{{ applyData.patientNm }}</span
              >
              <span style="margin-left: 1em">性别：</span>
              <span
                :val="patientInfo.sexCd"
                code="GENDER_CODE"
                v-codeTransformEmr
              ></span>
              <span style="margin-left: 1em"
                >年龄：{{ patientInfo.patientAge }}</span
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-item-top">
          <el-col :span="12">
            <el-form-item label="文书名称" size="mini" prop="comm">
              <el-input disabled v-model="applyData.mrNm" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-item-top">
          <el-col :span="12">
            <el-form-item label="申请时间" size="mini" prop="expiredTime">
              <el-input-number
                v-model.number="applyData.expiredTime"
                :disabled="vDisabled"
                :min="1"
                :max="100000"
                label="描述文字"
              ></el-input-number>
              <el-select
                :disabled="vDisabled"
                v-model="unit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option
                  v-for="item in unitOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-item-top">
          <el-col :span="12">
            <el-form-item label="申请原因" size="mini" prop="appReason">
              <l-value-domain-emr
                :disabled="vDisabled"
                code="RecordMaintenanceApplyReason"
                :value.sync="applyData.appReason"
                placeholder="请选择申请原因"
              ></l-value-domain-emr>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        审批相关-->
        <el-row
          class="form-item-top"
          v-if="applyData.chkStatus == '3' || applyData.chkStatus == '4'"
        >
          <el-col :span="24">
            <el-form-item prop="chkStatus" label="审批状态" size="mini">
              <el-radio-group v-model="applyData.chkStatus" disabled>
                <el-radio :label="'3'">同意</el-radio>
                <el-radio :label="'4'">拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          style="position: relative; height: 50px"
          class="form-item-top"
          v-if="applyData.chkStatus == '3' || applyData.chkStatus == '4'"
        >
          <el-col :span="24">
            <el-form-item label="审批意见" size="mini" prop="chkAdv">
              <el-input
                disabled
                type="textarea"
                style="width: 680px; top: 0; height: 50px"
                v-model="applyData.chkAdv"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="position: relative" class="form-item-top">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" size="mini">
              <el-input
                type="textarea"
                :disabled="vDisabled"
                style="width: 680px; top: 0; height: 50px"
                v-model="applyData.remark"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!vDisabled" type="primary" @click="submitForm"
        >确定
      </el-button>
      <el-button v-if="!vDisabled" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getPamars } from "@/utils/auth";

import { apply, updateById } from "@/api/emrRecord/emr/maintainApply";

import { getPatientInfoByEnNo } from "@/api/emrRecord/cis/patientList";

export default {
  props: {
    params: Object,
    template: Object,
    isShow: {
      type: Boolean,
      default: false
    },
    isHome: String
  },
  computed: {
    // 是否可编辑
    vDisabled() {
      // 只有新增状态可以编辑
      if (
        (this.applyData.chkStatus === "0" ||
          this.applyData.chkStatus === "2") &&
        this.params.listType == "1"
      ) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    template(obj) {
      console.log("template", obj);
      if (Object.keys(obj).length > 0) {
        console.log("new", obj);
        // 新增
        this.unit = "1";
        this.applyData = { ...obj };
        this.applyData.mrNm = obj.nm;
        this.applyData.enNo = obj.enNo || obj.enId;
        this.applyData.chkStatus = obj.chkStatus || "0";
        this.getPatinetInfo();
      }
    },
    isShow() {
      this.dialogVisible = this.isShow;
    }
  },
  data() {
    return {
      unit: "1",
      unitOptions: [{ value: "1", label: "小时" }, { value: "2", label: "天" }],
      listData: [],
      borrowDetailSaveDTOs: [],
      applyData: {
        mrMtAppId: "",
        enNo: "",
        patientNm: "",
        sexCd: "",
        age: "",
        appReason: "",
        chkStatus: "0",
        mrId: "",
        mrNm: "",
        remark: "",
        expiredTime: ""
      },
      typeRemoteParams: {
        hosId: JSON.parse(getPamars()).hosId
      },
      patientInfo: {},
      ownNameOpt: [],
      diseaseOpt: [],
      ownerId: [],
      remoteParams: { pageSize: 10 },
      dialogVisible: this.isShow,
      rules: {
        appReason: [
          { required: true, message: "请输入申请原因", trigger: "blur" }
        ],
        expiredTime: [
          { required: true, message: "请输入申请时长", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getPatinetInfo() {
      let params = {
        patientId: this.applyData.patientId,
        enNo: this.applyData.enNo,
        isHome: this.isHome
        // hosId: this.routerParams.hospitalId,
        // orgId: this.routerParams.orgId
      };
      getPatientInfoByEnNo(params)
        .then(res => {
          if (res.code === 1) {
            this.patientInfo = {
              patientId: res.data.paId,
              patientName: res.data.nm,
              visitCode: res.data.visitingNumber,
              visitingTime: res.data.visitingTime,
              triageStatus: res.data.triageStatus,
              patientGender: res.data.sexCd,
              patientAge: res.data.age,
              ...res.data
            };
            return;
          }
          this.$message.warning("获取患者信息失败");
        })
        .catch(error => {
          this.$message.warning("获取患者信息失败");
        });
    },

    //对话框关闭
    dialogClose() {
      this.$refs.ruleForm.clearValidate();
      // resetFields
      this.$emit("update:isShow", false);
    },

    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.handleDetermine();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //确定
    handleDetermine() {
      if (this.unit === "2") {
        this.applyData.expiredTime = parseInt(this.applyData.expiredTime) * 24;
      }
      console.log("this.applyData====", this.applyData);
      if (this.applyData.mrMtAppId && this.applyData.mrMtAppId !== "") {
        updateById(this.applyData.mrMtAppId, this.applyData)
          .then(res => {
            if (res.code === 1) {
              // console.log("res====", res)
              this.$message.success("更新病历维护申请成功！");
              this.$emit("handle-app-save");
            } else {
              this.$message.error("操作失败：" + res.msg);
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      } else {
        apply(this.applyData)
          .then(res => {
            if (res.code === 1) {
              // console.log("res====", res)
              this.$message.success("新增病历维护申请成功！");
              this.$emit("handle-app-save");
            } else {
              this.$message.error("操作失败：" + res.msg);
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      }
      this.dialogClose();
    },
    handleCancel() {
      this.dialogClose();
    }
  }
};
</script>

<style type="scss" scoped>
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
