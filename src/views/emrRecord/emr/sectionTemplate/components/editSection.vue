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
            :disabled="vDisabled"
            maxlength="100"
            placeholder="片语名称最多不超过100字！"
            style="width: 298px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span class="form-control" style="margin-left: 0em">片语类型</span>
          <l-value-domain
            clearable
            filterable
            ref="typeCode"
            style="width: 298px"
            :disabled="vDisabled"
            remoteUrl="/paragraphType/list"
            :remoteParams="typeRemoteParams"
            remoteShowKey="paragraphTypeName"
            remoteValueKey="paragraphTypeCode"
            :value.sync="myTemplate.typeCode"
            placeholder="请选择"
            @change="changeParagraphType"
          ></l-value-domain>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 1em" class="form-control">编辑器</span>
          <l-value-domain
            clearable
            :disabled="
              !editorTypeFlag ||
              vDisabled ||
              myTemplate.sectionTemplateId !== ''
            "
            style="width: 298px"
            code="PhraseEditorType"
            :value.sync="myTemplate.editor"
            placeholder="请选择"
            @change="changeEditor"
          ></l-value-domain>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 0em">医护标识</span>
          <l-value-domain
            :disabled="vDisabled"
            style="width: 298px"
            clearable
            @clear="clearHandler"
            filterable
            code="EmployeeMark"
            :value.sync="myTemplate.dnFlag"
            placeholder="请选择"
            @change="changeDnFlag"
          ></l-value-domain>
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 0em">就诊类型</span>
          <l-value-domain
            ref="visitType"
            clearable
            filterable
            :disabled="vDisabled"
            style="width: 298px"
            code="MedicalRecordType"
            :value.sync="myTemplate.visitType"
            placeholder="请选择"
          ></l-value-domain>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 0em">适用病种</span>
          <l-value-domain
            type="noselect"
            style="width: 298px"
            clearable
            filterable
            :value.sync="myTemplate.diseaseId"
            remoteUrl="/diseases/params"
            remoteShowKey="diseasesName"
            remoteValueKey="diseasesId"
            :remoteParams="diseaseParams"
            :localFilterKeys="['diseasesName']"
            placeholder="请选择病种"
          ></l-value-domain>
          <!--              <el-select-->
          <!--                style="width: 298px;"-->
          <!--                v-model="myTemplate.diseaseId"-->
          <!--                filterable-->
          <!--                remote-->
          <!--                reserve-keyword-->
          <!--                placeholder="请输入关键词"-->
          <!--                :remote-method="remoteMethod"-->
          <!--                :loading="loading"-->
          <!--              >-->
          <!--                <el-option-->
          <!--                  v-for="item in diseaseOpt"-->
          <!--                  :key="item.icd10Encoding"-->
          <!--                  :label="item.dictionaryName"-->
          <!--                  :value="item.icd10Encoding"-->
          <!--                >-->
          <!--                </el-option>-->
          <!--              </el-select>-->
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 0em" class="form-control">所属级别</span>
          <l-value-domain
            ref="scopeLevel"
            clearable
            :disabled="vDisabled || disableFlag"
            style="width: 298px"
            code="LevelType"
            :value.sync="myTemplate.scopeLevel"
            placeholder="请选择"
            @change="changeOwner"
          ></l-value-domain>
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
            :disabled="vDisabled || disableFlag"
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
            :disabled="vDisabled"
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
            v-model="myTemplate.number"
            :disabled="vDisabled"
            maxlength="100"
            placeholder="顺序号不超过100字！"
            style="width: 298px"
          ></el-input>
        </el-col>

        <el-col :span="12">
          <span style="margin-left: 0em">模板状态</span>
          <l-value-domain
            disabled
            style="width: 298px"
            code="ModelStatus"
            :value.sync="myTemplate.sectionTemplateStatus"
            placeholder="请选择"
          ></l-value-domain>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px; height: 50px">
        <el-col :span="24">
          <span style="margin-left: 2em">描述</span>
          <el-input
            maxlength="200"
            type="textarea"
            style="width: 680px; vertical-align: top"
            :disabled="vDisabled"
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
            style="width: 680px; vertical-align: top"
            maxlength="200"
            placeholder="内容不超过200字！"
            v-model="myTemplate.sectionTemplateContent"
          />
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editModel" type="primary" @click="submitForm"
        >确定</el-button
      >
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
  getParagraphTypeOpt,
  getTypeByCode,
  getIcd10DictionaryByKey,
} from "@/api/emrRecord/emr/paragraphType";
import { getOrgDeptList } from "@/api/emrRecord/admin/user";

import { save, update } from "@/api/emrRecord/emr/sectionTemplate";

export default {
  props: {
    template: Object,
    //模板内容
    innerHtml: String,
    isShow: {
      type: Boolean,
      default: false,
    },
    //是否保存模板内容
    saveContent: {
      type: Boolean,
      default: false,
    },
    templateStatus: {
      type: String,
      default: "0",
    },
    scopeLevel: {
      type: String,
      default: "0",
    },
    // 编辑器,默认给myTemplate.editor的值
    editorTypeFlag: {
      type: Boolean,
      default: false,
    },
  },
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
    disableFlag() {
      // let path = this.$route.path;
      // if (
      //   path === "/outMr/outMrWrt" ||
      //   path === "/inMr/inMrWrt/inMrWrtRecord"
      // ) {
      //   return true;
      // }

      return false;
    },
  },
  watch: {
    template(obj) {
      console.log(obj, "obj");
      //复制
      if (
        Object.keys(obj).length > 0 &&
        obj.sectionTemplateId &&
        obj.sectionTemplateId !== ""
      ) {
        this.myTemplate = { ...obj };
        this.myTemplate.sectionTemplateStatus = this.myTemplate.sectionTemplateStatus.toString();
        console.log(this.myTemplate, "this.myTemplate");
        this.changeOwner();
        setTimeout(() => {
          if (
            obj.ownerId &&
            obj.ownerId != undefined &&
            obj.ownerId != null &&
            obj.scopeLevel != undefined &&
            obj.scopeLevel != null &&
            obj.scopeLevel != "" &&
            obj.scopeLevel === "1"
          ) {
            this.ownerId = this.myTemplate.ownerId.split(",");
            // this.myTemplate.ownerId = parseInt(obj.ownerId);
          }
        }, 200);
      } else {
        this.myTemplate = {
          sectionTemplateId: "",
          sectionTemplateCode: "",
          sectionTemplateName: "",
          sectionTemplateContent: "",
          editor: "",
          typeCode: "",
          dnFlag: "",
          visitType: "",
          diseaseId: "",
          scopeLevel: "0",
          ownerId: "",
          inputCode1: "",
          inputCode2: "",
          inputCode3: "",
          number: "",
          description: "",
          dataVersion: "",
          sectionTemplateStatus: "",
          ...obj,
        };
        this.myTemplate.sectionTemplateStatus = this.templateStatus;
        this.myTemplate.scopeLevel = this.scopeLevel;
        if (
          this.myTemplate.scopeLevel === "1" &&
          obj.ownerId != undefined &&
          obj.ownerId != null
        ) {
          this.ownerId = this.myTemplate.ownerId.split(",");
        }
        this.changeOwner();
      }
      this.typeRemoteParams = {};
    },
    isShow() {
      this.dialogVisible = this.isShow;
      // this.myTemplate.editor = this.editorType;
    },
    "myTemplate.typeCode": {
      handler(val) {
        // console.log("changeParagraphType===========");
        if (val) {
          let data = { typeCode: val };
          getTypeByCode(data).then((res) => {
            if (res.code === 1) {
              // this.$nextTick(function () {
              //   console.log(res.data.dnFlag) // => '已更新'
              //   this.myTemplate.dnFlag = res.data.dnFlag;
              // })
              this.$set(this.myTemplate, "dnFlag", res.data.dnFlag);
              // console.log("this.myTemplate.dnFlag============",this.myTemplate.dnFlag);
              this.changeDnFlag(true);
            } else {
              this.$message("获取片语类型失败");
              return;
            }
          });
        }
      },
    },
  },
  data() {
    return {
      diseaseParams: {
        deletedStatus: "0",
        enabled: "1",
      },
      ownerId: [],
      prefix: "ST_",
      dnFlag: "",
      loading: false,
      contentDisabled: false,
      myTemplate: {
        sectionTemplateId: "",
        sectionTemplateCode: "",
        sectionTemplateName: "",
        sectionTemplateContent: "",
        editor: "",
        typeCode: "",
        dnFlag: "",
        visitType: "",
        diseaseId: "",
        scopeLevel: "0",
        ownerId: "",
        inputCode1: "",
        inputCode2: "",
        inputCode3: "",
        number: "",
        description: "",
        dataVersion: "",
        sectionTemplateStatus: "",
      },
      ownNameOpt: [],
      diseaseOpt: [],
      typeRemoteParams: {},
      dialogVisible: this.isShow,
      rules: {
        // typeCode: [{ required: true, message: "请输入类型", trigger: "blur" }]
      },
    };
  },
  methods: {
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then((resData) => {
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
        ownerId: this.ownerId.join(","),
      };
      // console.log("this.ownerId=======", this.ownerId);
      // console.log("this.ownerId=======", this.ownerId.toString());
      let uId = this.myTemplate.sectionTemplateId;
      if (this.saveContent) {
        this.myTemplate.content = this.innerHtml;
      }
      if (this.myTemplate.diseaseId == null) {
        this.myTemplate.diseaseId = "";
      }
      let data = { ...this.myTemplate, ...obj };
      // console.log(data);
      // return;
      data.sectionTemplateCode = this.prefix + data.sectionTemplateCode;

      if (uId == "" || uId == null || uId == undefined) {
        save(data)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-save", res.data);
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
          })
          .catch((res) => {
            this.$message({
              type: "error",
              message: res.msg,
            });
          });
      } else {
        update(data)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-update", this.myTemplate);
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
          })
          .catch((res) => {
            this.$message({
              type: "error",
              message: res.msg,
            });
          });
      }
      this.dialogClose();
    },
    handleCancel() {
      this.dialogClose();
    },
    changeEditor() {
      if (this.myTemplate.editor == "03") {
        this.contentDisabled = true;
      } else {
        this.contentDisabled = false;
      }
    },
    //根据所属级别变更所属名称可选项
    changeOwner(e) {
      console.log("changeOwner=====", this.myTemplate.scopeLevel);
      console.log("changeOwner=====", e);
      if (this.myTemplate.scopeLevel == "0") {
        let hosId = JSON.parse(getPamars()).hosId;
        let hosName = JSON.parse(getPamars()).hosName;
        this.ownNameOpt = [{ id: hosId, orgNm: hosName }];
        this.ownerId = this.ownNameOpt[0].id.split(",");
      } else if (this.myTemplate.scopeLevel == "1") {
        getOrgDeptList({ id: getUId() }).then((res) => {
          if (res.code === 1) {
            this.ownNameOpt = res.data.map((item) => {
              item.id += "";
              return item;
            });
            if (this.myTemplate.ownerId) {
              this.ownerId = this.myTemplate.ownerId.split(",");
            } else {
              this.ownerId = [];
            }
          } else {
            this.$message("请求数据失败");
            return;
          }
        });
      } else {
        this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
        this.ownerId = this.ownNameOpt[0].id.split(",");
      }
    },
    //片语类型下拉事件
    changeParagraphType() {
      // 重复了 跟 watch
      // console.log("changeParagraphType===========");
      // if (this.myTemplate.typeCode != "") {
      //   let data = { typeCode: this.myTemplate.typeCode };
      //   getTypeByCode(data).then(res => {
      //     if (res.code === 1) {
      //       console.log(res, "rere1111111111111");
      //       this.myTemplate.dnFlag = res.data.dnFlag;
      //       // this.changeDnFlag(true);
      //     } else {
      //       this.$message("获取片语类型失败");
      //     }
      //   });
      // } else {
      //   this.myTemplate.dnFlag = "";
      // }
    },
    //医护标识下拉事件
    changeDnFlag(flag) {
      console.log("changeDnFlag=====================", flag);
      if (flag !== true) {
        this.myTemplate.typeCode = "";
      }
      if (this.myTemplate.dnFlag != "") {
        this.typeRemoteParams = { dnFlag: this.myTemplate.dnFlag };
      } else {
        this.typeRemoteParams = {};
      }
    },
    // 医护标识的清空事件
    clearHandler() {
      // console.log( "clearHandler=====================");
      this.typeRemoteParams = {};
    },
  },
};
</script>

<style scoped lang="scss">
.edit-section {
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
}
</style>
