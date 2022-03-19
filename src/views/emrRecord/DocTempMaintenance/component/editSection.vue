<template>
  <el-dialog
    :title="
      myTemplate.sectionTemplateId === '' ? '新建片语模板' : '修改片语模板'
    "
    :visible.sync="dialogVisible"
    :show="isShow"
    append-to-body
    @close="dialogClose"
    width="880px"
  >
    <div class="edit-section" style="margin: 15px 60px">
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span class="form-control" style="margin-left: 0em">片语编码</span>
          {{ prefix }}
          <el-input
            v-model="myTemplate.sectionTemplateCode"
            disabled
            maxlength="50"
            placeholder="片语编码最多不超过50字！"
            style="width: 269px"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span class="form-control" style="margin-left: 0em">片语名称</span>
          <el-input
            v-model="myTemplate.sectionTemplateName"
            :disabled="disabledFlag || vDisabled"
            maxlength="100"
            placeholder="片语名称最多不超过100字！"
            style="width: 298px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span class="form-control" style="margin-left: 0em">片语类型</span>
          <l-value-domain-emr
            clearable
            filterable
            ref="typeCode"
            style="width: 298px"
            :disabled="disabledFlag || vDisabled"
            remoteUrl="/paragraphType/list"
            :remoteParams="typeRemoteParams"
            remoteShowKey="paragraphTypeName"
            remoteValueKey="paragraphTypeCode"
            :value.sync="myTemplate.typeCode"
            placeholder="请选择"
            @change="changeParagraphType"
          ></l-value-domain-emr>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 1em" class="form-control">编辑器</span>
          <l-value-domain-emr
            clearable
            :disabled="
              disabledFlag || vDisabled || myTemplate.sectionTemplateId !== ''
            "
            style="width: 298px"
            code="PhraseEditorType"
            :value.sync="myTemplate.editor"
            placeholder="请选择"
            @change="changeEditor"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 0em">医护标识</span>
          <l-value-domain-emr
            :disabled="disabledFlag || vDisabled || dnFlagAble"
            style="width: 298px"
            clearable
            @clear="clearHandler"
            filterable
            code="EmployeeMark"
            :value.sync="myTemplate.dnFlag"
            placeholder="请选择"
            @change="changeDnFlag"
          ></l-value-domain-emr>
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 0em">就诊类型</span>
          <l-value-domain-emr
            ref="visitType"
            clearable
            filterable
            :disabled="disabledFlag || vDisabled || visitTypeAble"
            style="width: 298px"
            code="MedicalRecordType"
            :value.sync="myTemplate.visitType"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 0em">适用病种</span>
          <l-value-domain-emr
            type="noselect"
            style="width: 298px"
            :disabled="disabledFlag || vDisabled"
            clearable
            filterable
            :value.sync="myTemplate.diseaseId"
            remoteUrl="/diseases/params"
            remoteShowKey="diseasesName"
            remoteValueKey="diseasesId"
            :remoteParams="diseaseParams"
            :localFilterKeys="['diseasesName']"
            placeholder="请选择病种"
          ></l-value-domain-emr>
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 0em" class="form-control">所属级别</span>
          <el-select
            placeholder="请选择"
            clearable
            style="width: 298px"
            :disabled="disabledFlag || vDisabled || disFlag"
            v-model="myTemplate.scopeLevel"
            @change="changeOwner"
          >
            <el-option
              v-for="item in orgOptions"
              :key="item._id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 0em" class="form-control">所属名称</span>
          <el-select
            v-model="ownerId"
            multiple
            collapse-tags
            filterable
            clearable
            :disabled="nOwnNameDisabled || disabledFlag || vDisabled || disFlag"
            placeholder="请选择"
            style="width: 298px"
          >
            <el-option
              v-for="item in ownNameOpt"
              :key="item.id"
              :label="item.orgNm"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 1em">拼音码</span>
          <el-input
            v-model="myTemplate.inputCode1"
            disabled
            readonly
            style="width: 298px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 1em">五笔码</span>
          <el-input
            v-model="myTemplate.inputCode2"
            disabled
            readonly
            style="width: 298px"
          ></el-input>
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 1em">助记码</span>
          <el-input
            v-model="myTemplate.inputCode3"
            :disabled="disabledFlag || vDisabled"
            style="width: 298px"
            maxlength="100"
            placeholder="助记码不超过100字！"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 1em">顺序号</span>
          <el-input
            :disabled="disabledFlag"
            v-model="myTemplate.number"
            maxlength="100"
            placeholder="顺序号不超过100字！"
            style="width: 298px"
          ></el-input>
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 0em">模板状态</span>
          <l-value-domain-emr
            disabled
            style="width: 298px"
            code="ModelStatus"
            :value.sync="myTemplate.sectionTemplateStatus"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px; height: 50px">
        <el-col :span="24">
          <span style="margin-left: 2em">描述</span>
          <el-input
            maxlength="200"
            type="textarea"
            style="width: 680px; vertical-align: top"
            :disabled="disabledFlag || vDisabled"
            placeholder="描述最多不超过200字！"
            v-model="myTemplate.description"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px; height: 50px" v-show="contentDisabled">
        <el-col :span="24">
          <span style="margin-left: 2em">内容</span>
          <el-input
            type="textarea"
            :disabled="disabledFlag || vDisabled"
            style="width: 680px; vertical-align: top"
            maxlength="200"
            placeholder="内容不超过200字！"
            v-model="myTemplate.sectionTemplateContent"
          />
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确定</el-button>
      <el-button v-if="editModel" @click="handleCancel">取消</el-button>
      <el-button
        v-if="viewModel"
        @click="handleCancel"
        style="margin-right: 18px"
        >关闭</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { getUId, getUN } from "@/utils/crypto";
import { getPamars } from "@/utils/auth";

import {
  getTypeByCode,
  getIcd10DictionaryByKey
} from "@/api/emrRecord/emr/paragraphType";
import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";

import { getDeptList } from "@/api/admin/role";
import hmm from "@/api/hmm/base.js";

import { save, update } from "@/api/emrRecord/emr/sectionTemplate";
import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

export default {
  props: {
    template: Object,
    //模板内容
    innerHtml: String,
    selectorStr: String,
    isShow: {
      type: Boolean,
      default: false
    },
    //是否保存模板内容
    saveContent: {
      type: Boolean,
      default: false
    },
    templateStatus: {
      type: String,
      default: "0"
    },
    scopeLevel: {
      type: String,
      default: ""
    },
    // 编辑器,默认给myTemplate.editor的值
    editorTypeFlag: {
      type: Boolean,
      default: false
    },
    // 默认新建
    isNewBuilt: {
      type: Boolean,
      default: true
    },
    disabledFlag: {
      type: Boolean,
      default: false
    }
  },
  mixins: [commonMixins],
  computed: {
    vDisabled() {
      if (
        this.template != null &&
        this.template != undefined &&
        this.template.sectionTemplateId != null &&
        this.template.sectionTemplateId != undefined &&
        this.template.sectionTemplateId != "" &&
        this.template.sectionTemplateStatus != null &&
        this.template.sectionTemplateStatus != undefined &&
        (this.template.sectionTemplateStatus == 1 ||
          this.template.sectionTemplateStatus == 2)
      ) {
        return true;
      }
      return false;
    },
    editModel() {
      return !this.vDisabled;
    },
    viewModel() {
      return this.vDisabled;
    },
    disFlag() {
      // let path = this.$route.path;
      // if (
      //   path === "/outMr/outMrWrt" ||
      //   path === "/inMr/inMrWrt/inMrWrtRecord"
      // ) {
      //   return true;
      // }

      return false;
    }
  },
  watch: {
    template(obj) {
      console.log(obj, "obj");
      //复制
      if (Object.keys(obj).length > 0 && obj.sectionTemplateId) {
        this.myTemplate = { ...obj };
        this.myTemplate.sectionTemplateStatus = this.myTemplate.sectionTemplateStatus.toString();
      } else {
        this.myTemplate = {
          sectionTemplateId: "",
          sectionTemplateCode: "",
          sectionTemplateName: "",
          sectionTemplateContent: this.selectorStr || "",
          editor: "01",
          typeCode: "",
          dnFlag: "",
          visitType: "",
          diseaseId: "",
          scopeLevel: "",
          ownerId: "",
          inputCode1: "",
          inputCode2: "",
          inputCode3: "",
          number: "",
          description: "",
          dataVersion: "",
          sectionTemplateStatus: "",
          ...obj
        };

        if (this.$route.path === "/cisOne/cisThree") {
          this.myTemplate.editor = "01";
        }

        this.myTemplate.sectionTemplateStatus = this.templateStatus;
        this.myTemplate.scopeLevel = this.scopeLevel;
      }

      if (this.myTemplate.sectionTemplateId && this.disabledFlag) {
        this.swithHandler(
          this.roleRevereMap[this.myTemplate.scopeLevel],
          this.dictListForCode
        );
      } else {
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      }

      // this.changeOwner();

      this.changeEditor();
      this.typeRemoteParams = {};
    },
    isShow() {
      this.dialogVisible = this.isShow;
    },
    "myTemplate.typeCode": {
      handler(val) {
        if (val) {
          let data = { typeCode: val };
          getTypeByCode(data).then(res => {
            if (res.code === 1) {
              this.$set(this.myTemplate, "dnFlag", res.data.dnFlag || "");
              this.$set(this.myTemplate, "visitType", res.data.visitType || "");

              this.dnFlagAble = res.data.dnFlag ? true : false;
              this.visitTypeAble = res.data.visitType ? true : false;
            } else {
              this.$message("获取片语类型失败");
              return;
            }
          });
        }
      }
    }
  },
  data() {
    return {
      diseaseParams: {
        deletedStatus: "0",
        enabled: "1"
      },
      ownerId: [],
      prefix: "ST_",
      loading: false,
      contentDisabled: false,
      myTemplate: {
        sectionTemplateId: "",
        sectionTemplateCode: "",
        sectionTemplateName: "",
        sectionTemplateContent: "",
        editor: "01",
        typeCode: "",
        dnFlag: "",
        visitType: "",
        diseaseId: "",
        scopeLevel: "",
        ownerId: "",
        inputCode1: "",
        inputCode2: "",
        inputCode3: "",
        number: "",
        description: "",
        dataVersion: "",
        sectionTemplateStatus: ""
      },
      dnFlagAble: false,
      visitTypeAble: false,
      ownNameOpt: [],
      ownNameOptCopy: [],
      diseaseOpt: [],
      typeRemoteParams: {},
      dialogVisible: this.isShow,
      orgOptions: [],
      dictListForCode: [],
      isDicDeptAdmin: false,
      nOwnNameDisabled: false
    };
  },
  async created() {
    this.getDeptListRequest();
    await this.handlerOrgList();
    getParamsByKey({
      key: ['deptDictionaryAdminRoles']
    }).then(resp => {
      const curRoleId = JSON.parse(window.localStorage.getItem('role')).roleCode
      const rolesList = resp.data.deptDictionaryAdminRoles.split(',')
      this.isDicDeptAdmin = rolesList.includes(curRoleId)
    })
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
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then(resData => {
        if (resData.code === 1 && resData.data) {
          this.diseaseOpt = resData.data;
        } else {
          this.$message("接口查询失败！");
          return;
        }
      });
    },
    //对话框关闭
    dialogClose() {
      this.$emit("update:isShow", false);
    },
    //确定
    submitForm() {
      if (
        this.myTemplate.sectionTemplateCode == "" ||
        !this.myTemplate.sectionTemplateCode
      ) {
        this.$message.error("片语编码不可为空");
        return;
      }
      if (
        this.myTemplate.sectionTemplateName == "" ||
        !this.myTemplate.sectionTemplateName
      ) {
        this.$message.error("片语名称不可为空");
        return;
      }
      if (this.myTemplate.typeCode == "" || !this.myTemplate.typeCode) {
        this.$message.error("片语类型不可为空");
        return;
      }
      if (
        this.myTemplate.scopeLevel == "" ||
        !this.myTemplate.scopeLevel ||
        this.ownerId.length === 0
      ) {
        this.$message.error("所属级别、所属名称不可为空");
        return;
      }
      if (this.myTemplate.editor == "" || !this.myTemplate.editor) {
        this.$message.error("编辑器不可为空");
        return;
      }

      let obj = {
        ownerId: this.ownerId.join(",")
      };
      let uId = this.myTemplate.sectionTemplateId;
      if (this.saveContent) {
        this.myTemplate.content = this.innerHtml;
      }
      if (this.myTemplate.diseaseId == null) {
        this.myTemplate.diseaseId = "";
      }
      let data = { ...this.myTemplate, ...obj };

      data.sectionTemplateCode = this.prefix + data.sectionTemplateCode;

      if (uId == "" || uId == null || uId == undefined) {
        save(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-save", res.data);
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
      } else {
        update(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-update", this.myTemplate);
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
      this.dialogClose();
    },
    handleCancel() {
      this.dialogClose();
    },
    changeEditor() {
      if (this.myTemplate.editor == "01") {
        this.contentDisabled = false;
      } else {
        this.contentDisabled = true;
      }
    },
    getDeptListRequest() {
      getDeptList().then(res => {
        const { code, data, msg } = res;
        if (code === 1) {
          this.ownNameOptCopy = data;
        } else {
          this.$message.error(msg || "请求数据失败");
          return;
        }
      });
    },
    //根据所属级别变更所属名称可选项
    changeOwner(sLevel = "") {
      this.nOwnNameDisabled = false;
      let orgMsg = JSON.parse(getPamars());

      // let scopeLevel = this.myTemplate.scopeLevel;
      let scopeLevel = sLevel
        ? sLevel
        : !this.isNewBuilt
        ? this.myTemplate.scopeLevel
        : this.roleMap[this.getCurrRoleCodeHandler()];

      switch (scopeLevel) {
        case "0":
          // 全院
          let hosId = orgMsg.hosId;
          let hosName = orgMsg.hosName;
          this.ownNameOpt = [{ id: hosId, orgNm: hosName }];
          this.ownerId = this.ownNameOpt[0].id.split(",");
          break;
        case "1":
          this.ownNameOpt = this.ownNameOptCopy;

          // 科室
          if (!this.isNewBuilt && this.template.scopeLevel === "1") {
            // 非新建状态
            this.ownerId = this.myTemplate.ownerId
              .split(",")
              .map(item => Number(item));
          } else {
            // 新建
            this.ownerId = [this.ownNameOpt[0].id];
          }
          if (this.isDicDeptAdmin) {
            this.nOwnNameDisabled = true
            const deptId = JSON.parse(window.localStorage.getItem('role')).deptId
            this.ownerId = [this.ownNameOpt.find(item => item.id === deptId).id]
          }
          break;
        case "2":
          // 个人
          this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.ownerId = [getUId()];
          break;
        case "9":
          // 选择租户的情况
          this.ownNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerId = [orgMsg.orgId];
          break;
        default:
          break;
      }
    },
    //片语类型下拉事件
    changeParagraphType() {},
    //医护标识下拉事件
    changeDnFlag() {},
    // 医护标识的清空事件
    clearHandler() {
      this.typeRemoteParams = {};
    }
  }
};
</script>

<style scoped lang="scss">
.edit-section {
  .form-control {
    position: relative;
    width: 100px;
  }

  .form-control:before {
    content: "*";
    color: #f56c6c;
    position: absolute;
    top: 2px;
    left: -6px;
  }
}
</style>
