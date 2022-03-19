<template>
  <el-dialog
    title="特殊字符维护"
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="dialogClose"
    width="880px"
  >
    <el-form
      :model="myTemplate"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <div style="margin: 15px 40px 15px 40px">
        <el-row>
          <el-col :span="12">
            <span class="form-control">符号编码</span>
            <el-form-item prop="speCharCode" size="mini" class="myFormItem">
              <el-input
                v-model="myTemplate.speCharCode"
                disabled
                style="width: 298px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span class="form-control">符号名称</span>
            <el-form-item prop="speCharName" size="mini" class="myFormItem">
              <el-input
                v-model="myTemplate.speCharName"
                :disabled="disabledFlag || vDisabled"
                style="width: 298px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px">
          <el-col :span="12">
            <span style="margin-left: 2em" class="form-control">符号</span>
            <el-form-item prop="speCharContent" size="mini" class="myFormItem">
              <el-input
                v-model="myTemplate.speCharContent"
                :disabled="disabledFlag || vDisabled"
                style="width: 298px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span>医护标识</span>
            <l-value-domain-emr
              :disabled="disabledFlag || vDisabled"
              style="width: 298px"
              code="EmployeeMark"
              :value.sync="myTemplate.dnFlag"
              clearable
              placeholder="请选择"
            ></l-value-domain-emr>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px">
          <el-col :span="12">
            <span class="form-control">所属级别</span>
            <el-form-item prop="scopeLevel" class="myFormItem">
              <el-select
                :disabled="disabledFlag || vDisabled"
                v-model="myTemplate.scopeLevel"
                @change="changeOwner"
                placeholder="请选择"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in orgOptions"
                  :key="item._id"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span class="form-control">所属名称</span>
            <el-form-item prop="ownerId" class="myFormItem">
              <el-select
                multiple
                collapse-tags
                filterable
                v-model="ownerId"
                clearable
                :disabled="disabledFlag || vDisabled || ownerIdFlag"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in ownNameOpt"
                  :key="item.id"
                  :label="item.orgNm"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px">
          <el-col :span="12">
            <span>是否显示</span>
            <l-value-domain-emr
              ref="visible"
              clearable
              :disabled="disabledFlag || vDisabled"
              style="width: 298px"
              code="speCharVisible"
              :value.sync="myTemplate.visible"
              placeholder="请选择"
            ></l-value-domain-emr>
          </el-col>
          <el-col :span="12">
            <span>符号类型</span>
            <l-value-domain-emr
              ref="speCharType"
              clearable
              :disabled="disabledFlag || vDisabled"
              style="width: 298px"
              code="speCharType"
              :value.sync="myTemplate.speCharType"
              placeholder="请选择"
            ></l-value-domain-emr>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px">
          <el-col :span="12">
            <span style="margin-left: 1em">拼音码</span>
            <el-input
              v-model="myTemplate.inputCode1"
              :disabled="disabledFlag || vDisabled"
              readonly
              style="width: 298px"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <span style="margin-left: 1em">五笔码</span>
            <el-input
              v-model="myTemplate.inputCode2"
              :disabled="disabledFlag || vDisabled"
              readonly
              style="width: 298px"
            ></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px">
          <el-col :span="12">
            <span style="margin-left: 1em">助记码</span>
            <el-input
              v-model="myTemplate.inputCode3"
              :disabled="disabledFlag || vDisabled"
              style="width: 298px"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <span style="margin-left: 1em">顺序号</span>
            <el-input
              v-model="myTemplate.number"
              :disabled="disabledFlag || vDisabled"
              style="width: 298px"
            ></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px; height: 50px">
          <el-col :span="24">
            <span style="margin-left: 2em; vertical-align: top">描述</span>
            <el-input
              type="textarea"
              :disabled="disabledFlag || vDisabled"
              v-model="myTemplate.description"
              style="width: 700px"
            />
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!vDisabled" type="primary" @click="submitForm"
        >确定</el-button
      >
      <el-button v-if="!vDisabled" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getUId, getUN } from "@/utils/crypto";
import { getPamars } from "@/utils/auth";

import { getDeptList } from "@/api/admin/role";
import hmm from "@/api/hmm/base.js";
import { save, update, getCd } from "@/api/emrRecord/emr/specialSymbol";

import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

export default {
  props: {
    template: Object,
    isShow: {
      type: Boolean,
      default: false
    },
    disabledFlag: {
      type: Boolean,
      default: false
    }
  },
  mixins: [commonMixins],
  computed: {
    // 是否可编辑
    vDisabled() {
      if (this.template.enabled == "1") {
        return true;
      }
      return false;
    }
  },
  watch: {
    template(obj) {
      if (Object.keys(obj).length > 0 && obj.speCharId !== "") {
        this.myTemplate = { ...obj };
        if (this.disabledFlag) {
          this.swithHandler(
            this.roleRevereMap[this.myTemplate.scopeLevel],
            this.dictListForCode
          );
        } else {
          this.swithHandler(
            this.getCurrRoleCodeHandler(),
            this.dictListForCode
          );
        }
      } else {
        for (let key in this.myTemplate) {
          this.myTemplate[key] = "";
        }
        this.myTemplate.enabled = "0";

        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);

        getCd()
          .then(res => {
            this.myTemplate.speCharCode = res.data;
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
          });
      }
      this.changeOwner();
    },
    isShow() {
      this.dialogVisible = this.isShow;
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.ownerId.length === 0) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    };

    return {
      myTemplate: {
        dataVersion: "",
        deletedStatus: "",
        description: "",
        dnFlag: "",
        enabled: "0",
        hosCode: "",
        hosId: "",
        inputCode1: "",
        inputCode2: "",
        inputCode3: "",
        number: "",
        orgCode: "",
        orgId: "",
        ownerId: "",
        scopeLevel: "",
        speCharCode: "",
        speCharContent: "",
        speCharId: "",
        speCharName: "",
        visible: "",
        speCharType: ""
      },
      ownNameOpt: [],
      ownNameOptCopy: [],
      diseaseOpt: [],
      ownerId: [],
      ownerIdFlag: false,
      remoteParams: { pageSize: 10 },
      dialogVisible: this.isShow,
      rules: {
        speCharCode: [
          { required: true, message: "请输入编码", trigger: "blur" }
        ],
        speCharName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        speCharContent: [
          { required: true, message: "请输入字符", trigger: "blur" }
        ],
        ownerId: [
          {
            required: true,
            validator: validatePass,
            message: "请选择",
            trigger: "blur"
          }
        ],
        scopeLevel: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      orgOptions: [],
      dictListForCode: []
    };
  },
  async created() {
    this.getDeptListRequest();
    await this.handlerOrgList();
  },
  methods: {
    async handlerOrgList() {
      try {
        const { code, data, msg } = await hmm.getDictListForCode(
          "AllLevelType"
        );
        this.dictListForCode = data;
        const adminStr = this.getCurrRoleCodeHandler();
        if (code === 1 && data) {
          this.swithHandler(adminStr, data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    swithHandler(adminStr, data) {
      switch (adminStr) {
        case "tenant":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("9");
          });
          break;
        case "org":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("0");
          });
          break;
        case "dept":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("1");
          });
          break;
        case "other":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("2");
          });
          break;
        default:
          break;
      }
    },
    //对话框关闭
    dialogClose() {
      this.$refs.ruleForm.clearValidate();
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
      let obj = {
        ownerId: this.ownerId.join(",")
      };
      let uId = this.myTemplate.speCharId;
      this.myTemplate = { ...this.myTemplate, ...obj };
      if (uId == "" || uId == null || uId == undefined) {
        //new
        save(this.myTemplate)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-save", res.data);
              this.dialogClose();
            } else {
              this.$message.error("操作失败1：" + res.msg);
              return;
            }
          })
          .catch(res => {
            this.$message.error("操作失败：");
          });
      } else {
        update(this.myTemplate)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-update", this.myTemplate);
              this.dialogClose();
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
          });
      }
    },
    handleCancel() {
      this.dialogClose();
    },
    getDeptListRequest() {
      getDeptList().then(res => {
        if (res.code === 1) {
          this.ownNameOptCopy = res.data;
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    //根据所属级别变更所属名称可选项
    changeOwner(e) {
      let orgMsg = JSON.parse(getPamars());
      this.ownerId = [];
      const scopeLevel = this.myTemplate.scopeLevel;
      switch (scopeLevel) {
        case "0":
          let hosName = orgMsg.hosName;

          this.ownNameOpt = [{ id: this.myTemplate.ownerId, orgNm: hosName }];
          this.ownerId = [this.myTemplate.ownerId];

          break;
        case "1":
          this.ownNameOpt = this.ownNameOptCopy;

          if (!e) {
            this.ownerId = this.myTemplate.ownerId
              .split(",")
              .map(item => Number(item));
          } else {
            this.ownerId = [this.ownNameOpt[0].id];
          }

          break;
        case "2":
          this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.ownerId = [getUId()];
          break;
        case "9":
          this.ownNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerId = [orgMsg.orgId];
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style type="scss" scoped>
.myFormItem {
  width: 298px;
  display: inline-block;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
/deep/.el-form-item__content {
  margin-left: 0px !important;
}
.form-control {
  position: relative;
  /*margin-left: 2em;*/
  width: 100px;
}
.form-control:before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  top: 2px;
  left: -6px;
}
</style>
