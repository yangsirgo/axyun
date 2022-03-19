<template>
  <div class="create-temp" style="width: 100%; height: 100%">
    <el-row>
      <el-col :span="12">
        <span class="form-control">模版编码</span>
        {{ prefix }}
        <el-input
          maxlength="50"
          placeholder="模版编码不超过100字！"
          v-model="templatePO.templateCode"
          disabled
          style="width: 252px"
        ></el-input>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <span class="form-control">模版名称</span>
        <el-input
          maxlength="100"
          placeholder="模版名称不超过100字！"
          v-model="templatePO.templateName"
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span class="form-control" style="margin-left: 1em">编辑器</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabled || docTypeFlag"
          style="width: 280px"
          code="EditorType"
          @change="changeEditorHandle"
          :value.sync="templatePO.editor"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
      <el-col
        :span="12"
        style="text-align: right"
        v-show="!(templatePO.editor === '02')"
      >
        <span class="form-control">基础模版</span>
        <l-value-domain-emr
          type="noselect"
          style="width: 280px"
          :disabled="disabledFlag || vDisabled || templatePO.editor === '02'"
          clearable
          filterable
          :value.sync="templatePO.basicCode"
          remoteUrl="/basicTemplate/list"
          remoteShowKey="basicTemplateName"
          remoteValueKey="basicTemplateCode"
          :isFilterNull="true"
          :remoteParams="basicRemoteParams"
          :localFilterKeys="basicCodeLocalFilterKeys"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
      <el-col
        :span="12"
        style="text-align: right"
        v-show="templatePO.editor === '02'"
      >
        <span>文书模式</span>
        <l-value-domain-emr
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
          code="CareMrMode"
          :value.sync="templatePO.mrModelCd"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span class="form-control">医护标识</span>
        <l-value-domain-emr
          :disabled="disabledFlag || vDisabled || dnFlagAbled"
          style="width: 280px"
          code="EmployeeMark"
          :value.sync="templatePO.dnFlag"
          placeholder="请选择"
          remoteShowKey="name"
          remoteValueKey="code"
          @change="changeDnFlag"
        ></l-value-domain-emr>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <span class="form-control">文书类型</span>
        <l-value-domain-emr
          style="width: 280px"
          clearable
          filterable
          :disabled="disabledFlag || vDisabled"
          remoteUrl="/type/getTypeSelectByCondition"
          :remoteParams="typeRemoteParams"
          remoteShowKey="name"
          remoteValueKey="code"
          :value.sync="templatePO.typeCode"
          placeholder="请选择"
          @change="changeTypeCode"
        ></l-value-domain-emr>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span>初诊复诊</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabledForFirstOrNo"
          style="width: 280px"
          code="FirstOrNo"
          :value.sync="templatePO.isFirstVisit"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <span>就诊类型</span>
        <l-value-domain-emr
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
          code="MedicalRecordType"
          :value.sync="templatePO.visitType"
          placeholder="请选择"
          @change="initFirstVisit"
        ></l-value-domain-emr>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="11">
        <span>适用病种</span>
        <l-value-domain-emr
          type="noselect"
          style="width: 280px"
          :disabled="disabledFlag || vDisabled"
          clearable
          filterable
          :value.sync="templatePO.diseaseId"
          remoteUrl="/diseases/params"
          remoteShowKey="diseasesName"
          remoteValueKey="diseasesId"
          :remoteParams="diseaseParams"
          :localFilterKeys="['diseasesName']"
          placeholder="请选择病种"
        ></l-value-domain-emr>
      </el-col>
      <el-col :span="13" style="text-align: right">
        <span>是否设置默认模板</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabledForFirstOrNo"
          style="width: 280px"
          code="YesOrNo"
          :value.sync="templatePO.isDefault"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span>适用性别</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
          code="GENDER_CODE"
          :value.sync="templatePO.sex"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <span>适用年龄</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabled"
          style="width: 90px"
          code="ageCharacter"
          :value.sync="templatePO.ageCharacter"
          placeholder="请选择"
          @change="changeAgeCharacter"
        ></l-value-domain-emr>
        <el-input
          v-if="templatePO.ageCharacter == '4'"
          v-model.number="templatePO.ageParam1"
          maxlength="3"
          :disabled="disabledFlag || vDisabled"
          style="width: 100px; display: inline-block"
          @change="checkNumber(templatePO.ageParam1)"
        ></el-input>
        <el-input
          v-if="templatePO.ageCharacter == '4'"
          v-model.number="templatePO.ageParam2"
          maxlength="3"
          :disabled="disabledFlag || vDisabled"
          style="width: 100px"
          @change="checkNumber(templatePO.ageParam2)"
        ></el-input>
        <el-input
          v-if="templatePO.ageCharacter != '4'"
          v-model.number="templatePO.ageParam1"
          :disabled="disabledFlag || vDisabled"
          maxlength="3"
          style="width: 204px"
          @change="checkNumber(templatePO.ageParam1)"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span class="form-control">所属级别</span>
        <!-- <l-value-domain-emr
          :disabled="vDisabled"
          style="width: 280px"
          code="LevelType"
          :value.sync="templatePO.scopeLevel"
          placeholder="请选择"
          @change="changeOwner"
        ></l-value-domain-emr> -->
        <!-- <l-value-domain
          :disabled="vDisabled"
          style="width: 280px"
          code="AllLevelType"
          :value.sync="templatePO.scopeLevel"
          placeholder="请选择"
          @change="changeOwner"
        ></l-value-domain> -->
        <el-select
          :disabled="disabledFlag || vDisabled"
          v-model="templatePO.scopeLevel"
          @change="changeOwner"
          placeholder="请选择"
          style="width: 280px"
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
      <el-col :span="12" style="text-align: right">
        <span class="form-control">所属名称</span>
        <el-select
          v-model="ownerId"
          filterable
          clearable
          collapse-tags
          multiple
          :disabled="nOwnNameDisabled || disabledFlag || vDisabled"
          placeholder="请选择"
          @change="ownerChange"
          style="width: 280px"
        >
          <el-option
            v-for="item in nOwnNameOpt"
            :key="item.id"
            :label="item.orgNm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="11">
        <span>审签等级</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
          code="AuditType"
          :value.sync="templatePO.signLevel"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
      <el-col :span="13" style="text-align: right">
        <span>默认病程时间类型</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
          code="DefaultDiseaseTimeType"
          :value.sync="templatePO.courseDtType"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="11">
        <span>书写次数</span>
        <l-value-domain-emr
          clearable
          :disabled="true"
          style="width: 280px"
          code="WriteTime"
          :value.sync="templatePO.writeNum"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
      <el-col :span="13" style="text-align: right">
        <span>病程选项</span>
        <l-value-domain-emr
          clearable
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
          code="CourseOptions"
          :value.sync="templatePO.courseOption"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="11">
        <span>打印选项</span>
        <el-select
          v-model="templatePO.printOption"
          clearable
          :disabled="disabledFlag || vDisabled"
          placeholder="请选择"
          style="width: 280px"
        >
          <el-option
            v-for="item in nPrintOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="13" style="text-align: right">
        <span style="margin-left: 1em">拼音码</span>
        <el-input
          v-model="templatePO.inputCode1"
          :disabled="true"
          readonly
          style="width: 280px"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span style="margin-left: 1em">助记码</span>
        <el-input
          maxlength="100"
          placeholder="助记码不超过100字！"
          v-model="templatePO.inputCode3"
          :disabled="disabledFlag || vDisabled"
          style="width: 280px"
        ></el-input>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <span>五笔码</span>
        <el-input
          v-model="templatePO.inputCode2"
          :disabled="true"
          readonly
          style="width: 280px"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span style="margin-left: 1em">版本号</span>
        <el-input
          v-model="templatePO.templateVersion"
          :disabled="true"
          style="width: 280px"
        ></el-input>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <span style="margin-left: 1em">顺序号</span>
        <el-input
          maxlength="100"
          placeholder="顺序号不超过100字！"
          :disabled="disabledFlag"
          v-model="templatePO.number"
          style="width: 280px"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="12">
        <span class="form-control">模板状态</span>
        <l-value-domain-emr
          :disabled="true"
          style="width: 280px"
          code="modelStatus"
          :value.sync="templatePO.templateStatus"
          placeholder="请选择"
        ></l-value-domain-emr>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px; height: 50px">
      <el-col>
        <span style="margin-left: 2em">描述</span>
        <el-input
          maxlength="200"
          placeholder="描述不超过200字！"
          type="textarea"
          v-model="templatePO.description"
          :disabled="disabledFlag || vDisabled"
          style="width: 720px; vertical-align: top"
        ></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { getDeptList } from "@/api/admin/role";
import { getTypes, getTypeByCode } from "@/api/emrRecord/emr/type";
import { getIcd10DictionaryByKey } from "@/api/emrRecord/emr/paragraphType";
import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";
import hmm from "@/api/hmm/base.js";
import { getPamars, getIsTenant } from "@/utils/auth";
import { getUId, getUN } from "@/utils/crypto.js";

import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

export default {
  name: "createTemp",
  props: {
    docType: {
      type: String,
      default: "create"
    },
    isNewBuilt: {
      type: Boolean,
      default: true
    },
    disabledFlag: {
      type: Boolean,
      default: false
    },
    isDealDicDept: {
      type: Boolean,
      default: false
    }
  },
  mixins: [commonMixins],
  data() {
    return {
      diseaseParams: {
        deletedStatus: "0",
        enabled: "1"
      },
      dnFlagAbled: false,
      basicCodeLocalFilterKeys: ["basicTemplateName"],
      localFilterKeys: ["diseasesName"],

      prefix: "MT_",
      ownerId: [],
      //新增区
      templatePO: {
        templateId: "",
        templateCode: "",
        basicCode: "",
        templateName: "",
        editor: "",
        typeCode: "",
        dnFlag: "",
        visitType: "",
        scopeLevel: "",
        ownerId: "",
        signLevel: "",
        diseaseId: "",
        writeNum: "",
        courseDtType: "",
        printOption: "",
        courseOption: "",
        inputCode1: "",
        inputCode2: "",
        inputCode3: "",
        templateVersion: "0",
        dataVersion: "",
        number: "",
        description: "",
        sex: "",
        ageCharacter: "",
        ageParam1: "",
        ageParam2: "",
        isFirstVisit: "",
        isDefault: "",
        mrModelCd: ""
      },
      basicRemoteParams: { basicTemplateStatus: "1" },
      nOwnNameOpt: [],
      nOwnNameOptCopy: [],
      vDisabledByVisitType: false,
      nPrintOpt: [
        {
          label: "无限次",
          value: "1"
        }
      ],
      diseaseOpt: [],
      loading: false,
      multipleFlag: false,
      rules: {
        templateCode: [{ required: true, message: "请输入", trigger: "blur" }],
        templateName: [{ required: true, message: "请输入", trigger: "blur" }],
        typeCode: [{ required: true, message: "请输入", trigger: "blur" }],
        dnFlag: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      orgOptions: [],
      dictListForCode: [],
      isDicDeptAdmin: false,
      nOwnNameDisabled: false
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
    vDisabledForFirstOrNo: function() {
      return this.vDisabled || this.vDisabledByVisitType;
    },
    vDisabled() {
      if (
        this.templatePO.templateStatus == "2" ||
        (this.templatePO.templateStatus == "1" &&
          this.templatePO.templateId != undefined &&
          this.templatePO.templateId != null &&
          this.templatePO.templateId != "")
      ) {
        return true;
      } else if (
        this.templatePO.templateStatus == "0" &&
        this.templatePO.templateVersion > 0
      ) {
        return true;
      }
      return false;
    },
    typeRemoteParams() {
      return {
        dnFlag: this.templatePO.dnFlag,
        visitType: this.templatePO.visitType
      };
    },
    docTypeFlag() {
      // 给编辑器属性赋值
      if (!this.templatePO.editor && this.docType === "edit") {
        this.templatePO.editor = "01";
      }
      if (this.docType === "create") {
        return false;
      }
      return true;
    }
  },
  async created() {
    const path = this.$route.path;
    if (path === "/cisOne/cisThree") {
      // 病历处方下的  另存为文书模板 必须是 医生
      this.templatePO.dnFlag = "1";
      this.templatePO.visitType = "01";
      this.dnFlagAbled = true;
    }
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
    setTemplateObj(code) {
      const adminStr = this.getCurrRoleCodeHandler();

      this.templatePO.templateCode = code;
      this.templatePO.templateStatus = "0";
      this.templatePO.templateVersion = "0";
      this.templatePO.visitType = "04";
      this.templatePO.isDefault = "0";
      this.templatePO.signLevel = "01";
      if (adminStr === "tenant") {
        this.templatePO.scopeLevel = "9";
      } else if (adminStr === "org") {
        this.templatePO.scopeLevel = "0";
      } else if (adminStr === "dept") {
        this.templatePO.scopeLevel = "1";
      } else if (adminStr === "other") {
        this.templatePO.scopeLevel = "2";
      }
    },
    checkNumber(value) {
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          this.$message.error("请输入数字值");
        } else if (value >= 200 || value < 0) {
          this.$message.error("年龄必须大于0小于200");
        }
      }, 100);
    },
    initTemplateData() {
      for (let k in this.templatePO) {
        if (k === "templateVersion") {
          this.templatePO[k] = "0";
        } else {
          this.templatePO[k] = "";
        }
      }
    },
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then(resData => {
        if (resData.code === 1 && resData.data) {
          this.diseaseOpt = resData.data;
        } else {
          this.$message.error("获取接口失败!");
          return;
        }
      });
    },
    // 选择编辑器
    changeEditorHandle(data) {},
    // 选择医护标识
    changeDnFlag(val) {
      this.templatePO.typeCode = "";
      this.templatePO.mrModelCd = "2"; // 默认是表格模式
    },
    initFirstVisit() {
      this.vDisabledByVisitType = this.templatePO.visitType === "04";

      // 就诊类型变动  也要重置文书类型
      if (this.templatePO.typeCode) {
        this.templatePO.typeCode = "";
      }
    },
    // 选择文书类型
    changeTypeCode(typeCode) {
      if (typeCode != "") {
        let data = { typeCode };
        getTypeByCode(data).then(res => {
          if (res.code === 1) {
            this.templatePO.dnFlag = res.data.dnFlag;
            res.data.visitType &&
              (this.templatePO.visitType = res.data.visitType);
            this.templatePO.writeNum = res.data.writeNum;

            this.vDisabledByVisitType = this.templatePO.visitType === "04";
          } else {
            this.$message.error("获取文书类型失败");
            return;
          }
        });
      } else {
        this.templatePO.dnFlag = "";
      }
    },
    ownerChange(data) {
      console.log(data);
    },
    // 组装拼接好的数据
    mergerData() {
      this.templatePO.ownerId = this.ownerId.join(",");

      return this.templatePO;
    },
    getDeptListRequest() {
      getDeptList().then(res => {
        const { code, data, msg } = res;
        if (code === 1) {
          this.nOwnNameOptCopy = data;
        } else {
          this.$message.error(msg || "请求数据失败");
        }
      });
    },
    switchFuncHandler() {
      if (this.templatePO.sectionTemplateId && this.disabledFlag) {
        this.swithHandler(
          this.roleRevereMap[this.templatePO.scopeLevel],
          this.dictListForCode
        );
      } else {
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      }
    },
    changeOwner(valueStr = "") {
      this.nOwnNameDisabled = false
      // 全院的情况
      let orgMsg = JSON.parse(getPamars());
      let scopeLevel = this.templatePO.scopeLevel;
      switch (scopeLevel) {
        case "0":
          let hosId = orgMsg.hosId;
          let hosName = orgMsg.hosName;
          this.nOwnNameOpt = [{ id: hosId, orgNm: hosName }];
          this.ownerId = [hosId];
          break;
        case "1":
          // 选择科室的情况
          this.nOwnNameOpt = this.nOwnNameOptCopy;
          // 非新建状态
          if (!this.isNewBuilt && !valueStr) {
            this.ownerId = this.templatePO.ownerId
              .split(",")
              .map(id => Number(id));
          } else {
            // 新建
            this.ownerId = [this.nOwnNameOpt[0].id];
          }
          if (this.isDicDeptAdmin) {
            this.nOwnNameDisabled = true
            const deptId = JSON.parse(window.localStorage.getItem('role')).deptId
            this.ownerId = [this.nOwnNameOpt.find(item => item.id === deptId).id]
          }
          break;
        case "2":
          // 选择个人的情况
          this.nOwnNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.ownerId = [getUId()];
          break;
        case "9":
          // 选择租户的情况
          this.nOwnNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerId = [orgMsg.orgId];
          break;
        default:
          break;
      }
    },
    changeAgeCharacter() {
      if (this.ageCharacter != "4") {
        this.ageParam2 = null;
      }
    },
    getParamsByKey(data) {
      getParamsByKey({
        key: ['deptDictionaryAdminRoles']
      }).then(resp => {
        const curRoleId = JSON.parse(window.localStorage.getItem('role')).roleCode
        const rolesList = resp.data.deptDictionaryAdminRoles.split(',')
        this.isDicDeptAdmin = rolesList.includes(curRoleId);
        this.setTemplateObj(data);
        this.switchFuncHandler();
        this.changeOwner();
        this.initFirstVisit();
      })
    }
  },
  watch: {
    "templatePO.editor": {
      handler(val) {
        if (!val && this.docType === "edit") {
          this.templatePO.editor = "01";
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.create-temp {
  .form-control {
    position: relative;
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
