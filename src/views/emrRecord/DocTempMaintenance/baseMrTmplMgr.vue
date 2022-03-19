<template>
  <div class="hd-container height100" ref="page">
    <flow-menu>
      <el-card class="left">
        <div style="margin: 10px; overflow-y: auto; height: 100%">
          <el-tree
            :data="tree1"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="expandedKey"
            @node-click="handleNodeClick1"
          ></el-tree>
        </div>
      </el-card>
      <el-card class="right" id="rightCard">
        <div class="height100">
          <div style="padding: 10px 20px">
            <div class="search-con clearfix">
              <div class="search-main float-left">
                <div class="common-width margin-top-10">
                  <l-formt-title label="关键字">
                    <el-input
                      style="width: 160px"
                      class="my-input"
                      v-model="key"
                    ></el-input
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="模板编码">
                    <el-input
                      style="width: 160px"
                      v-model="basicTemplateCode"
                    ></el-input
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="适用病种">
                    <l-value-domain-emr
                      type="noselect"
                      style="width: 160px"
                      clearable
                      filterable
                      :value.sync="diseaseId"
                      remoteUrl="/diseases/params"
                      remoteShowKey="diseasesName"
                      remoteValueKey="diseasesId"
                      :remoteParams="diseaseParams"
                      :localFilterKeys="['diseasesName']"
                      placeholder="请选择病种"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="文书类型">
                    <l-value-domain-emr
                      clearable
                      filterable
                      style="width: 160px"
                      :value.sync="typeCode"
                      remoteUrl="/type/getTypeSelectByCondition"
                      remoteShowKey="name"
                      remoteValueKey="code"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="模板状态">
                    <l-value-domain-emr
                      clearable
                      style="width: 160px"
                      code="ModelStatus"
                      :value.sync="basicTemplateStatus"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="纸张类型">
                    <el-select
                      v-model="paperType"
                      clearable
                      placeholder="请选择"
                      style="width: 160px"
                    >
                      <el-option
                        v-for="item in paperTypeOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option> </el-select
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="文书类型组">
                    <l-value-domain-emr
                      clearable
                      filterable
                      style="width: 160px"
                      :value.sync="typeGroupCode"
                      remoteUrl="/typeGroup/list"
                      remoteShowKey="typeGroupName"
                      remoteValueKey="typeGroupCode"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="就诊类型">
                    <l-value-domain-emr
                      clearable
                      style="width: 160px"
                      code="MedicalRecordType"
                      :value.sync="visitType"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="医护标识">
                    <l-value-domain-emr
                      clearable
                      style="width: 160px"
                      code="EmployeeMark"
                      :value.sync="dnFlag"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10 special-item">
                  <l-formt-title>
                    <el-checkbox v-model="level0">全院</el-checkbox>
                    <el-checkbox v-model="level1">科室</el-checkbox>
                    <l-value-domain
                      multiple
                      collapse-tags
                      clearable
                      filterable
                      :localFilterKeys="deptLocalFilterKeys"
                      style="width: 210px"
                      :value.sync="deptVal"
                      remoteUrl="/wadmin/hos/dept"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder="请选择所属科室"
                      @change="changeDept"
                    ></l-value-domain>
                    <el-checkbox v-model="level2" @click="choosePerson"
                      >个人
                    </el-checkbox></l-formt-title
                  >
                </div>
              </div>
              <div class="float-right margin-top-10">
                <el-button
                  class="el-button--primary"
                  style="width: 68px; height: 30px"
                  @click="btnQuery"
                  >查询
                </el-button>
                <el-button
                  class="el-button--default"
                  style="width: 68px; height: 30px"
                  @click="clearCondition"
                  >重置
                </el-button>
              </div>
            </div>
          </div>
          <div
            style="
              padding: 10px 20px;
              border-top: 1px solid #dcdfe6;
              height: calc(100% - 160px);
            "
          >
            <div class="clearfix">
              <div class="float-right">
                <el-button @click="create" icon="el-icon-plus">新建</el-button>
                <el-button icon="el-icon-edit-outline" @click="openV"
                  >打开
                </el-button>
                <el-button icon="el-icon-remove-outline" @click="handleRemove"
                  >删除
                </el-button>
                <el-button icon="el-icon-setting" @click="showProp"
                  >属性
                </el-button>
                <el-button icon="el-icon-check" @click="enable">启用</el-button>
                <el-button icon="el-icon-close" @click="disable"
                  >停用
                </el-button>
                <el-button icon="el-icon-copy" @click="copy">复制</el-button>
              </div>
            </div>
            <div class="" style="height: calc(100% - 40px); margin-top: 10px">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                :layout="layout"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  class="my-table"
                  :data="tempTable"
                  v-loading="tlm_isLoading"
                  ref="tempTable"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="dblclickOpen"
                  @row-click="selectRow"
                  border
                  height="100%"
                  style="width: 100%"
                >
                  <el-table-column
                    fixed
                    type="selection"
                    width="40px"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    :index="indexMethod"
                    label="序号"
                    width="60px"
                  ></el-table-column>
                  <el-table-column
                    prop="basicTemplateCode"
                    label="模板编码"
                    width="150px"
                  ></el-table-column>
                  <el-table-column
                    prop="basicTemplateName"
                    label="模板名称"
                    width="200px"
                  ></el-table-column>
                  <el-table-column
                    prop="diseaseId"
                    label="适用病种"
                    width="150px"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="
                          scope.row.diseaseId != null &&
                          scope.row.diseaseId != ''
                        "
                        tableName="md_diseases"
                        :conditionMap="{ diseases_id: scope.row.diseaseId }"
                        columns="diseases_name"
                        v-tableTransformEmr
                      ></span
                    ></template>
                  </el-table-column>
                  <el-table-column label="文书类型" width="150px">
                    <template slot-scope="scope">
                      <span
                        v-if="
                          scope.row.typeCode != null && scope.row.typeCode != ''
                        "
                        tableName="mr_type"
                        :conditionMap="{ type_code: scope.row.typeCode }"
                        columns="type_name"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="医护标识" width="100px">
                    <template slot-scope="scope">
                      <span
                        v-if="
                          scope.row.dnFlag != null && scope.row.dnFlag != ''
                        "
                        :val="scope.row.dnFlag"
                        code="EmployeeMark"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="模板状态" width="100px">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.basicTemplateStatus"
                        code="ModelStatus"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="scopeLevel"
                    label="所属级别"
                    width="100px"
                  >
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.scopeLevel"
                        code="LevelType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ownerId"
                    label="所属名称"
                    width="180px"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.scopeLevel === '0'"
                        tableName="sys_org"
                        :conditionMap="{ id: scope.row.ownerId }"
                        columns="org_nm"
                        v-tableTransformEmr
                      ></span>
                      <span
                        v-else-if="scope.row.scopeLevel === '1'"
                        tableName="sys_org"
                        :conditionMap="{ id: scope.row.ownerId }"
                        columns="org_nm"
                        v-tableTransformEmr
                      ></span>
                      <span
                        v-else-if="scope.row.scopeLevel === '2'"
                        tableName="sys_user"
                        :conditionMap="{ id: scope.row.ownerId }"
                        columns="name"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="signLevel"
                    label="纸张类型"
                    width="100px"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="visitType"
                    label="门诊/住院"
                    width="100px"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="
                          scope.row.visitType != null &&
                          scope.row.visitType != ''
                        "
                        :val="scope.row.visitType"
                        code="MedicalRecordType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="description"
                    label="描述"
                  ></el-table-column>
                </el-table>
              </l-table>
            </div>
          </div>
          <el-dialog
            title="新建基础模板"
            :visible.sync="dialogVisible"
            @close="dialogClose"
            width="880px"
          >
            <div style="margin: 15px 40px 15px 40px">
              <el-row>
                <el-col :span="12">
                  <span class="neccesarry-control">模版编码</span>
                  {{ prefix }}
                  <el-input
                    v-model="myTemplate.tCode"
                    disabled
                    style="width: 270px"
                    @change="handleChangeTCode"
                  ></el-input>
                </el-col>
                <el-col :span="12">
                  <span class="neccesarry-control">模版名称</span>
                  <el-input
                    v-model="myTemplate.nTempName"
                    :disabled="disabledFlag || vDisabled"
                    style="width: 298px"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px">
                <el-col :span="12">
                  <span>就诊类型</span>
                  <l-value-domain-emr
                    clearable
                    filterable
                    :disabled="disabledFlag || vDisabled"
                    style="width: 298px"
                    code="MedicalRecordType"
                    :value.sync="myTemplate.nAdmType"
                    placeholder="请选择"
                    @change="changeVisitType"
                  ></l-value-domain-emr>
                </el-col>
                <el-col :span="12">
                  <span>适用病种</span>
                  <l-value-domain-emr
                    type="noselect"
                    style="width: 298px"
                    clearable
                    filterable
                    :disabled="disabledFlag"
                    :value.sync="myTemplate.nAppDis"
                    remoteUrl="/diseases/params"
                    remoteShowKey="diseasesName"
                    remoteValueKey="diseasesId"
                    :remoteParams="diseaseParams"
                    :localFilterKeys="['diseasesName']"
                    placeholder="请选择病种"
                  ></l-value-domain-emr>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px">
                <el-col :span="12">
                  <span class="neccesarry-control">文书类型</span>
                  <l-value-domain-emr
                    clearable
                    filterable
                    style="width: 298px"
                    :disabled="disabledFlag || vDisabled"
                    remoteUrl="/type/getTypeSelectByCondition"
                    :remoteParams="typeRemoteParams"
                    remoteShowKey="name"
                    remoteValueKey="code"
                    :value.sync="myTemplate.nInsType"
                    placeholder="请选择"
                    @change="changeTypeCode"
                  ></l-value-domain-emr>
                </el-col>
                <el-col :span="12">
                  <span>医护标识</span>
                  <l-value-domain-emr
                    clearable
                    :disabled="disabledFlag || vDisabled"
                    style="width: 298px"
                    code="EmployeeMark"
                    :value.sync="myTemplate.nDnFlag"
                    placeholder="请选择"
                    @change="changeDnFlag"
                  ></l-value-domain-emr>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px">
                <el-col :span="12">
                  <span class="neccesarry-control">所属级别</span>
                  <el-select
                    style="width: 298px"
                    v-model="myTemplate.scopeLevel"
                    @change="changeOwner"
                    :disabled="disabledFlag || vDisabled"
                    placeholder="请选择"
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
                <el-col :span="12">
                  <span>所属名称</span>
                  <el-select
                    v-model="myTemplate.nOwnName"
                    multiple
                    clearable
                    collapse-tags
                    filterable
                    :disabled="nOwnNameDisabled || (disabledFlag || vDisabled)"
                    placeholder="请选择"
                    style="width: 298px"
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
                <el-col :span="12">
                  <span>纸张类型</span>
                  <el-select
                    :disabled="disabledFlag"
                    v-model="myTemplate.nPaperType"
                    clearable
                    placeholder="请选择"
                    style="width: 298px"
                  >
                    <el-option
                      v-for="item in paperTypeOpt"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <span style="margin-left: 1em">拼音码</span>
                  <el-input
                    v-model="myTemplate.nPinYinCode"
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
                    v-model="myTemplate.nMemCode"
                    :disabled="disabledFlag || vDisabled"
                    style="width: 298px"
                  ></el-input>
                </el-col>
                <el-col :span="12">
                  <span style="margin-left: 1em">五笔码</span>
                  <el-input
                    v-model="myTemplate.nWuBiCode"
                    :disabled="disabledFlag || vDisabled"
                    readonly
                    style="width: 298px"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px">
                <el-col :span="12">
                  <span style="margin-left: 1em">顺序号</span>
                  <el-input
                    v-model="myTemplate.nNumber"
                    :disabled="disabledFlag || vDisabled"
                    style="width: 298px"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 12px; height: 50px">
                <el-col style>
                  <span style="margin-left: 2em">描述</span>
                  <el-input
                    type="textarea"
                    v-model="myTemplate.nDescription"
                    :disabled="disabledFlag || vDisabled"
                    style="width: 740px; vertical-align: top"
                  ></el-input>
                </el-col>
              </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button
                v-if="editModel"
                type="primary"
                @click="handleDetermine"
                >确定
              </el-button>
              <el-button v-if="editModel" @click="handleCancel">取消</el-button>
              <el-button
                v-if="viewModel"
                @click="handleCancel"
                style="margin-right: 18px"
                >关闭
              </el-button>
            </div>
          </el-dialog>
        </div>
        <el-card
          class="height-bottom"
          :style="{ bottom: bottom }"
          v-loading="templateLoading"
        >
          <div class="top">
            <l-card-title>
              <span slot="left">{{ editTemplate }}</span>
            </l-card-title>
            <el-button size="mini" class="btn-position" @click="handleClick"
              >关闭
            </el-button>
          </div>
          <div class="axEditor-demo">
            <div
              class="tool-right"
              :style="open ? ' width: 300px;' : ' width: 50px;'"
            >
              <tools
                boxName="StructureTree"
                :refrehTree.sync="refrehTree"
                :modules="modules"
                :treeData="treeData"
                :recordName="recordName"
                :open.sync="open"
                :editor="axeditor"
              />
            </div>
            <div
              class="editor-left"
              :style="open ? ' margin-right: 300px;' : ' margin-right: 50px;'"
            >
              <l-editor
                v-if="showEditorFlag"
                ref="axEditor"
                @save="saveContent"
                @ready="editorReady"
                :configs="editorConfigs"
                :defaultMsg="defaultMsg"
              >
              </l-editor>
            </div>
          </div>
        </el-card>
      </el-card>
    </flow-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Tools from "@/views/public/tools/emrTools";
import FlowMenu from "@/components/FlowMenu";
import { getTree } from "@/api/emrRecord/emr/template";
import { getIcd10DictionaryByKey } from "@/api/emrRecord/emr/paragraphType";
import {
  getBasicTemplateList,
  getPage,
  save,
  update,
  remove,
  setEnable,
  setDisable,
  getDetail,
  getContent,
  saveContent,
  copy,
  getNextSeq
} from "@/api/emrRecord/emr/basicTemplate";
import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";
import { getTypes, getTypeByCode } from "@/api/emrRecord/emr/type";
import { getTypeGroups } from "@/api/emrRecord/emr/typeGroup";
import { getDeptList } from "@/api/admin/role";
import hmm from "@/api/hmm/base.js";
import { getHosTree } from "@/api/admin/user.js";
import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

import { getPamars } from "@/utils/auth";
import { listToTree } from "@/utils/util";
import { getUId, getUN } from "@/utils/crypto";

export default {
  name: "basicTemplateManager",
  components: {
    Tools,
    FlowMenu
  },
  data() {
    return {
      diseaseParams: {
        deletedStatus: "0",
        enabled: "1"
      },
      deptLocalFilterKeys: ["orgNm"],
      localFilterKeys: ["diseasesName"],
      prefix: "BT_",
      bottom: "-100%",
      templateLoading: false,
      tlm_isLoading: false,
      myTemplate: {
        tCode: "",
        nTempName: "",
        nAdmType: "",
        nAppDis: "",
        nInsType: "",
        nDnFlag: "",
        scopeLevel: "",
        nOwnName: [],
        nPaperType: "",
        nPinYinCode: "",
        nMemCode: "",
        nWuBiCode: "",
        nNumber: "",
        nDescription: "",
        uBasicTemplateId: "",
        uDataVersion: ""
      },
      tCode: "",
      open: false,
      defaultMsg: "",
      expandedKey: [],
      viewModel: false,
      editModel: true,
      valEditorModel: "design",
      showEditorFlag: false,
      editorConfigs: {
        editorModel: "design",
        defaultModel: "design",
        refreshPrescriptionMethod: this.refreshPrescription,
        refreshDiagnoseMethod: this.refreshDiagnose,
        tabToolbars: [
          {
            id: "edit",
            name: "编辑",
            widgets: [
              [
                {
                  id: "save",
                  name: "保存"
                },
                {
                  id: "undo",
                  name: "撤销"
                },
                {
                  id: "redo",
                  name: "恢复"
                },
                {
                  id: "drafts",
                  name: "草稿箱"
                }
              ],
              /* [{
                     id: 'copy',
                     name: '复制'
                   },
                     {
                       id: 'cut',
                       name: '剪切'
                     },
                     {
                       id: 'paste',
                       name: '粘贴'
                     }
                   ],*/
              [
                {
                  type: "select",
                  iconOnly: true,
                  id: "fontfamily",
                  name: "字体格式"
                },
                {
                  type: "select",
                  iconOnly: true,
                  id: "fontsize",
                  name: "字号"
                },
                {
                  iconOnly: true,
                  hasBorder: true,
                  id: "removeformat",
                  name: "清除样式"
                },
                {
                  iconOnly: true,
                  hasBorder: true,
                  id: "formatmatch",
                  name: "格式刷"
                },
                {
                  iconOnly: true,
                  hasBorder: true,
                  id: "autotypeset",
                  name: "自动格式化"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "sizeplus",
                  name: "增大字号"
                },
                {
                  iconOnly: true,
                  id: "sizeminus",
                  name: "缩小字号"
                },
                {
                  iconOnly: true,
                  id: "fontborder",
                  name: "字体边框"
                },
                {
                  iconOnly: true,
                  id: "superscript",
                  name: "上标"
                },
                {
                  iconOnly: true,
                  id: "subscript",
                  name: "下标"
                },
                {
                  iconOnly: true,
                  id: "bold",
                  name: "加粗"
                },
                {
                  iconOnly: true,
                  id: "italic",
                  name: "倾斜"
                },
                {
                  iconOnly: true,
                  id: "underline",
                  name: "下划线"
                },
                {
                  iconOnly: true,
                  id: "strikethrough",
                  name: "删除线"
                },
                {
                  iconOnly: true,
                  id: "forecolor",
                  name: "文字颜色"
                },
                {
                  iconOnly: true,
                  id: "backcolor",
                  name: "背景颜色"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "justifyleft",
                  name: "向左对齐"
                },
                {
                  iconOnly: true,
                  id: "justifycenter",
                  name: "居中对齐"
                },
                {
                  iconOnly: true,
                  id: "justifyright",
                  name: "向右对齐"
                },
                {
                  iconOnly: true,
                  id: "justifyjustify",
                  name: "两端对齐"
                },
                {
                  iconOnly: true,
                  id: "blockquote",
                  name: "引用"
                },
                {
                  iconOnly: true,
                  id: "indent",
                  name: "首行缩进"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "insertorderedlist",
                  name: "有序列表"
                },
                {
                  iconOnly: true,
                  id: "insertunorderedlist",
                  name: "无序列表"
                },
                {
                  iconOnly: true,
                  id: "rowspacingtop",
                  name: "段前距"
                },
                {
                  iconOnly: true,
                  id: "rowspacingbottom",
                  name: "段后距"
                },
                {
                  iconOnly: true,
                  id: "lineheight",
                  name: "行间距"
                }
              ] /* ,
        [{
          id: 'structureTree',
          name: '文档结构树'
        }] */
            ]
          },
          {
            id: "insert",
            name: "插入",
            widgets: [
              [
                {
                  id: "spechars",
                  name: "特殊字符"
                }
              ],
              [
                {
                  id: "link",
                  name: "添加链接"
                },
                {
                  id: "unlink",
                  name: "取消链接"
                }
              ],
              [
                {
                  id: "insertimage",
                  name: "图片"
                },
                {
                  id: "insertvideo",
                  name: "视频"
                },
                {
                  id: "barcode",
                  name: "条形码"
                },
                {
                  id: "qrcode",
                  name: "二维码"
                }
              ],
              [
                {
                  id: "medical",
                  name: "医学表达式"
                }
              ]
            ]
          },
          {
            id: "table",
            name: "表格",
            widgets: [
              [
                {
                  id: "inserttable",
                  name: "插入表格"
                },
                {
                  id: "deletetable",
                  name: "删除表格"
                }
              ],
              [
                {
                  id: "insertrow",
                  iconOnly: true,
                  name: "插入行"
                },
                {
                  id: "insertcol",
                  iconOnly: true,
                  name: "插入列"
                },
                {
                  id: "breakLine"
                },
                {
                  id: "deleterow",
                  iconOnly: true,
                  name: "删除行"
                },
                {
                  id: "deletecol",
                  iconOnly: true,
                  name: "删除列"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "mergecells",
                  name: "合并单元格"
                },
                {
                  iconOnly: true,
                  id: "mergedown",
                  name: "向下合并单元格"
                },
                {
                  iconOnly: true,
                  id: "mergeright",
                  name: "向右合并单元格"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "splittocells",
                  name: "拆分单元格"
                },
                {
                  iconOnly: true,
                  id: "splittocols",
                  name: "单元格拆分成列"
                },
                {
                  iconOnly: true,
                  id: "splittorows",
                  name: "单元格拆分成行"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "tablelowerframeline",
                  name: "下框线"
                },
                {
                  iconOnly: true,
                  id: "tableupperframeline",
                  name: "上框线"
                },
                {
                  iconOnly: true,
                  id: "tableleftframeline",
                  name: "左框线"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "tablerightframeline",
                  name: "右框线"
                },
                {
                  iconOnly: true,
                  id: "tablenoborder",
                  name: "无框线"
                },
                {
                  iconOnly: true,
                  id: "tableallborder",
                  name: "全框线"
                }
              ],
              [
                {
                  // iconOnly: true,
                  id: "tb-hide",
                  name: "隐藏表格线"
                },
                {
                  // iconOnly: true,
                  id: "tb-solid",
                  name: "表格线设为实线"
                },
                {
                  // iconOnly: true,
                  id: "tb-dotted",
                  name: "表格线设为虚线"
                }
              ]
            ]
          },
          {
            id: "structure",
            name: "结构化",
            widgets: [
              [
                // {
                //   id: "macro",
                //   name: "基本元素"
                // },
                {
                  id: "text",
                  name: "文本元素"
                },
                {
                  id: "tagelement",
                  name: "标签元素"
                },
                {
                  id: "numberelement",
                  name: "数字元素"
                },
                {
                  id: "select",
                  name: "单选下拉元素"
                },
                {
                  id: "selectmulti",
                  name: "多选下拉元素"
                },
                {
                  id: "datedomain",
                  name: "日期元素"
                },
                {
                  id: "haveornot",
                  name: "有无元素"
                }
              ],
              [
                {
                  id: "radio",
                  name: "单选元素"
                },
                {
                  id: "checkbox",
                  name: "复选元素"
                }
              ],
              [
                {
                  id: "paragraphele",
                  name: "段落元素"
                },
                {
                  id: "parasetter",
                  name: "段落设置"
                }
              ],
              [
                {
                  id: "combine",
                  name: "组合元素"
                }
              ],
              [
                {
                  id: "diagnose",
                  name: "诊断元素"
                },
                {
                  id: "prescription",
                  name: "处方元素"
                }
              ],
              [
                {
                  id: "signature",
                  name: "签名元素"
                }
              ]
            ]
          },
          {
            id: "viewcheck",
            name: "视图审阅",
            widgets: [
              [
                {
                  id: "source",
                  name: "源码模式"
                },
                {
                  id: "mark",
                  name: "留痕模式"
                },
                {
                  id: "design",
                  name: "设计模式"
                },
                {
                  id: "edit",
                  name: "编辑模式"
                },
                {
                  id: "pure",
                  name: "清洁浏览"
                },
                {
                  id: "dirty",
                  name: "非清洁浏览"
                },
                {
                  id: "secret",
                  name: "保密浏览"
                }
              ],
              [
                {
                  id: "note",
                  name: "批注"
                }
              ]
            ]
          },
          {
            id: "tool",
            name: "工具",
            widgets: [
              [
                {
                  id: "pagemargin",
                  name: "页边距"
                } /* ,
          {
            id: 'paperdirect',
            name: '纸张方向'
          } */,
                {
                  id: "papersize",
                  name: "纸张大小"
                }
              ],
              [
                {
                  id: "pageheader",
                  name: "页眉"
                },
                {
                  id: "pagefooter",
                  name: "页脚"
                } /* ,
          {
            id: 'pages',
            name: '页码'
          } */
              ],
              [
                {
                  id: "continueprint",
                  name: "续打"
                },
                {
                  id: "print",
                  name: "打印文档"
                }
              ],
              [
                {
                  id: "printpreview",
                  iconOnly: false,
                  name: "打印预览"
                }
              ],
              [
                {
                  id: "searchreplace",
                  name: "查找替换"
                }
              ],
              [
                {
                  id: "numcount",
                  name: "字数统计"
                }
              ],
              [
                {
                  id: "medicalformula",
                  name: "医学公式"
                }
              ]
            ]
          }
        ]
      },
      modules: [
        "StructureTree",
        "Phrase",
        "ElementLibrary",
        "Macros",
        "MedicalExpression",
        "SpecialSymbol"
      ],
      refrehTree: false,
      recordName: "",
      treeData: "",
      editTemplate: "",
      tree1: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      //标记码
      key: "",
      //适用病种
      diseaseId: "",
      paperType: "",
      paperTypeOpt: "",
      //模板编码
      basicTemplateCode: "",
      //文书类型
      typeCode: "",
      //医护标识
      dnFlag: "",
      //文书类型组
      typeGroupCode: "",
      //模板状态
      basicTemplateStatus: "",
      visitType: "",
      deptVal: [],
      level0: false,
      level1: false,
      level2: false,
      persId: "",
      hosId: "",
      //模板表格
      tempTable: [],
      layout: "total,prev,pager,next,jumper",
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      //对话框可见
      dialogVisible: false,
      //新增区
      //模板编码
      nTemplateCode: "",
      //模板名称
      nTempName: "",
      //编辑器
      editor: "",
      //文书类型
      nInsType: "",
      //医护标识
      nDnFlag: "",
      //就诊类型
      nAdmType: "",
      //所属名称
      nOwnName: [],
      nOwnId: "",
      nOwnNameOpt: [],
      ownNameOptCopy: [],
      nPaperType: "",
      //适用病种
      nAppDis: "",
      //拼音码
      nPinYinCode: "",
      //五笔码
      nWuBiCode: "",
      //助记码
      nMemCode: "",
      //顺序号
      nNumber: "",
      //描述
      nDescription: "",
      selection: [],
      uDataVersion: "",
      uBasicTemplateId: "",
      axeditor: null,
      openId: "",
      editReadOnly: false,
      vDisabled: false,
      vDisabledByVisitType: false,
      typeRemoteParams: {},
      basicRemoteParams: { basicTemplateStatus: "1" },
      loading: false,
      diseaseOpt: [],
      isNewBuilt: true,
      orgOptions: [],
      disabledFlag: false,
      dictListForCode: [],
      orgIdByAdmin: "",
      isDicDeptAdmin: false,
      nOwnNameDisabled: false
    };
  },
  mixins: [commonMixins],
  watch: {
    "myTemplate.tCode": {
      handler: function(val) {
        this.nTemplateCode = this.prefix + val;
      }
    }
  },
  created() {
    this.getHosIdHandler();
    this.getManageTree();
    this.query();
    this.getDeptListRequest();
    this.handlerOrgList();
  },
  methods: {
    getHosIdHandler() {
      getHosTree(false).then(res => {
        const { code, data, msg } = res;
        if (code === 1) {
          let id = data.data.id || "";
          this.orgIdByAdmin = parseFloat(id);
        } else {
          this.orgIdByAdmin = "";
        }
      });
    },
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
          this.$message.error("接口报错！");
          return;
        }
      });
    },
    //编辑器初始化完成
    editorReady(instance) {
      this.axeditor = instance;
      if (this.axeditor != null) {
        this.refrehTree = true;
        if (this.valEditorModel === "2") {
          this.axeditor.execCommand("setmodel", { modelType: "dirty" });
        }
      }
    },
    getTreeData() {
      this.treeData = listToTree(
        this.$refs.axEditor.execCommand("structuretree"),
        "id",
        "pId"
      ).list;
      if (this.treeData.length > 0) {
        this.treeData = this.treeData[0].children;
      }
    },
    //刷新处方
    refreshPrescription() {
      this.$message({
        type: "success",
        message: "处方已刷新！"
      });
      // 弹窗配置结束后，返回处方信息，拼接成html代码串（或自定义样式，可将样式写在行内，也可将样式写在style标签内传入），传入编辑区
      var str =
        '<div class="prescription"><table cellspacing="0" cellpadding="0"><tr><td width="20"><span class="cirleNum">1</span></td><td width="230">葡萄糖注射液</td><td width="160" align="right">5% 500.0ml/袋</td><td width="100" align="right">1.0袋</td><td width="20" class="topCombine"></td><td width="150" rowspan="3">静滴 qdx1天</td></tr><tr><td></td><td>丹参注射液</td><td align="right">10ml/支</td><td align="right">1.0袋</td><td class="middleCombine"></td></tr><tr><td></td><td>乳糖酸阿奇霉素注射液</td><td align="right">0.125g 2.5ml/支</td><td align="right">1.0支</td><td class="bottomCombine"></td></tr><tr><td><span class="cirleNum">2</span></td><td>葡萄糖氯化钠注射液</td><td align="right">5% 500.0ml/袋</td><td align="right">1.0袋</td><td class="topCombine"></td><td rowspan="2">静滴 qdx1天</td></tr><tr><td></td><td>注射用头孢曲松钠粉针剂</td><td align="right">2g/瓶</td><td align="right">2.0瓶</td><td class="bottomCombine"></td></tr><tr><td><span class="cirleNum">3</span></td><td>23价肺炎球菌多糖疫苗(进口)</td><td align="right">0.5ml/支</td><td align="right">1.0支</td><td class="singleCombine"></td><td>肌注 alwaysx1天</td></tr><tr><td width="20"><span class="cirleNum">4</span></td><td width="231">三金片(薄衣片)</td><td colspan="4">3.5gx72片/盒x1盒</td></tr><tr><td></td><td align="right">用法：</td><td colspan="4">10.5g tidx1天 口服</td></tr><tr><td><span class="cirleNum">5</span></td><td>云南白药胶囊</td><td colspan="4">0.25gx16粒/盒x1盒</td></tr><tr><td></td><td align="right">用法：</td><td colspan="4">0.25g qidx1天 口服</td></tr></table></div>';
      this.execCommand("showprescription", str);
    },
    handleClick(tab, event) {
      let modifyFLag = this.axeditor.execCommand("ismodified");
      if (modifyFLag) {
        this.$confirm("当前基础模板存在修改，是否保存?", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(() => {
            this.saveContent(this.axeditor.getContent()).then(res => {
              if (res === true) {
                this.query();
                this.hiddenTemplate();
              }
            });
          })
          .catch(() => {
            this.hiddenTemplate();
            // this.query();
            this.defaultMsg = "";
          });
      } else {
        this.hiddenTemplate();
      }
    },
    getManageTree() {
      getTree().then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.AddExpandItem(item);
          });
          this.tree1 = res.data;
        } else {
          this.$message.error("请求数据失败");
          return;
        }
      });
    },
    AddExpandItem(item) {
      if (item.exts.level == "0") {
        this.expandedKey.push(item.id);
        if (item.children != null && item.children != undefined) {
          item.children.forEach(data => {
            this.AddExpandItem(data);
          });
        }
      }
    },
    choosePerson() {
      this.persId = getUId();
    },
    handleNodeClick1(data) {
      if (this.bottom === "0") {
        this.handleClick();
      }
      if (data.id.startsWith("T_")) {
        this.clearCondition();
        this.typeCode = data.id;
      } else {
        this.clearCondition();
        this.typeGroupCode = data.id;
      }
      this.query();
    },
    handleChangeTCode() {
      if (this.myTemplate.tCode === "") {
        this.$message.error("模版编码不可为空!");
        return;
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
    changeOwner(sLevel) {
      this.nOwnNameDisabled = false
      const orgMsg = JSON.parse(getPamars());
      const scopeLevel = sLevel
        ? sLevel
        : !this.isNewBuilt
        ? this.myTemplate.scopeLevel
        : this.roleMap[this.getCurrRoleCodeHandler()];
      switch (scopeLevel) {
        // 机构
        case "0":
          let hosId = this.orgIdByAdmin;
          let hosName = orgMsg.hosName;

          this.nOwnNameOpt = [{ id: hosId, orgNm: hosName }];
          this.myTemplate.nOwnName = [hosId];
          break;
        // 科室
        case "1":
          this.nOwnNameOpt = this.ownNameOptCopy;
          if (this.isNewBuilt) {
            // 新建
            this.myTemplate.nOwnName = [this.nOwnNameOpt[0].id];
          }
          if (this.isDicDeptAdmin) {
            this.nOwnNameDisabled = true
            const deptId = JSON.parse(window.localStorage.getItem('role')).deptId
            this.myTemplate.nOwnName = [this.nOwnNameOpt.find(item => item.id === deptId).id]
          }
          
          break;
        case "2":
          this.nOwnNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.myTemplate.nOwnName = [getUId()];
          break;
        case "9":
          // 选择租户的情况
          this.nOwnNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.myTemplate.nOwnName = [orgMsg.orgId];
          break;
        default:
          break;
      }
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.query();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    btnQuery() {
      this.pageParams.pageNo = 1;
      this.query();
    },
    //查询
    query() {
      if (this.level1 == false) {
        this.deptVal = [];
      }
      if (this.level2 === true) {
        this.persId = getUId();
      }
      let data = {
        key: this.key,
        basicTemplateCode: this.basicTemplateCode,
        diseaseId: this.diseaseId,
        typeCode: this.typeCode,
        dnFlag: this.dnFlag,
        typeGroupCode: this.typeGroupCode,
        basicTemplateStatus: this.basicTemplateStatus,
        visitType: this.visitType,
        level0: this.level0 === true ? 0 : null,
        level1: this.level1 === true ? 1 : null,
        deptIds: this.level1 === true ? this.deptVal.toString() : "",
        level2: this.level2 === true ? 2 : null,
        persId: this.persId,
        ...this.pageParams
      };
      this.tlm_isLoading = true;
      getPage(data)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tempTable = res.data;
          } else {
            this.$message.error("获取数据失败");
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
        });
    },
    //重置查询条件
    clearCondition() {
      this.key = "";
      this.basicTemplateCode = "";
      this.diseaseId = "";
      this.typeCode = "";
      this.typeGroupCode = "";
      this.basicTemplateStatus = "";
      this.paperType = "";
      this.deptVal = [];
      this.level0 = false;
      this.level1 = false;
      this.level2 = false;
      this.visitType = "";
      this.dnFlag = "";
    },
    clearAdd() {
      //初始化文本框
      this.nTemplateCode = "";

      this.myTemplate = {
        tCode: "",
        nTempName: "",
        nAdmType: "",
        nAppDis: "",
        nInsType: "",
        nDnFlag: "",
        scopeLevel: "",
        nOwnName: [],
        nPaperType: "",
        nPinYinCode: "",
        nMemCode: "",
        nWuBiCode: "",
        nNumber: "",
        nDescription: "",
        uBasicTemplateId: "",
        uDataVersion: ""
      };

      this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      //所属名称
      this.changeOwner();

      this.viewModel = false;
      this.editModel = true;
    },
    //新建
    create() {
      this.clearAdd();
      this.disabledFlag = false;
      this.isNewBuilt = true;

      getNextSeq().then(res => {
        if (res.code === 1) {
          this.myTemplate.tCode = res.data;
          getParamsByKey({
            key: ['deptDictionaryAdminRoles']
          }).then(resp => {
            const curRoleId = JSON.parse(window.localStorage.getItem('role')).roleCode
            const rolesList = resp.data.deptDictionaryAdminRoles.split(',')
            this.isDicDeptAdmin = rolesList.includes(curRoleId)
            this.dialogVisible = true;
          })
        } else {
          this.$message.error("获取基础模板流水号错误！");
        }
      });
    },
    dblclickOpen(row, column, event) {
      this.$refs.tempTable.clearSelection();
      this.$refs.tempTable.toggleRowSelection(row, true);
      this.openV();
    },
    selectRow(row, column, event) {
      this.$refs.tempTable.toggleRowSelection(row);
    },
    //打开
    openV() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }

      this.editTemplate = this.selection[0].basicTemplateName;

      this.showEditorFlag = true;
      this.showTemplate();
      this.showContent(this.selection[0].basicTemplateId, this.editTemplate);
    },
    showTemplate() {
      this.bottom = "0";
    },
    hiddenTemplate() {
      this.bottom = "-100%";
    },
    //展示病历模板内容
    showContent(templateId, templateName) {
      this.templateLoading = true;
      let data = { id: templateId };
      getContent(data)
        .then(res => {
          if (res.code === 1) {
            this.myTemplate.uDataVersion = res.data.dataVersion;
            let content = res.data.content;
            if (content == undefined) {
              content = "";
            }
            //工具栏
            this.recordName = templateName;
            this.valEditorModel = res.data.model;

            if (this.axeditor != null) {
              this.refrehTree = true;
              if (this.valEditorModel === "2") {
                if (this.axeditor.options.editorModel !== "dirty") {
                  this.axeditor.execCommand("setmodel", { modelType: "dirty" });
                }
              } else {
                this.axeditor.execCommand("setmodel", { modelType: "design" });
              }
            }

            this.defaultMsg = content;
            this.openId = res.data.id;
          } else {
            this.$message.error("打开失败!");
          }
          this.templateLoading = false;
        })
        .catch(err => {
          this.templateLoading = false;
        });
    },

    saveContent(content) {
      let data = {
        id: this.openId,
        content: content,
        dataVersion: this.myTemplate.uDataVersion
      };
      return saveContent(data).then(res => {
        if (res.code === 1 && res.data) {
          this.defaultMsg = content;
          this.myTemplate.uDataVersion = res.data.dataVersion;
          this.$message.success("保存成功");
          return true;
        } else {
          this.$message.error("打开失败!");
          return false;
        }
      });
    },
    paramsArrHandler(arr = []) {
      let list = [];
      list = arr.map(item => {
        return {
          id: item.basicTemplateId,
          code: item.basicTemplateCode,
          scopeLevel: item.scopeLevel,
          ownerId: item.ownerId,
          oprRoleLevel: item.oprRoleLevel
        };
      });
      return list;
    },
    //属性
    async showProp() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }
      this.isNewBuilt = false;

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      this.disabledFlag = !flag;

      if (this.disabledFlag) {
        this.swithHandler(
          this.roleRevereMap[this.selection[0].scopeLevel],
          this.dictListForCode
        );
      } else {
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      }

      let data = {};
      getDetail(this.selection[0].basicTemplateId, data).then(res => {
        if (res.code === 1) {
          this.nTemplateCode = res.data.basicTemplateCode;
          this.myTemplate.tCode = this.nTemplateCode.replace(this.prefix, "");
          this.myTemplate.nTempName = res.data.basicTemplateName;
          this.myTemplate.nInsType = res.data.typeCode;
          this.myTemplate.nDnFlag = res.data.dnFlag;
          this.myTemplate.nAdmType = res.data.visitType;
          this.myTemplate.scopeLevel = res.data.scopeLevel;

          //所属范围为全院时因为取不到真正的hosId,
          if (this.myTemplate.scopeLevel === "0") {
            this.myTemplate.nOwnName = this.orgIdByAdmin;
          } else if (this.myTemplate.scopeLevel === "1") {
            this.myTemplate.nOwnName = res.data.ownerId
              .split(",")
              .map(id => Number(id));
          } else {
            this.myTemplate.nOwnName = res.data.ownerId.split(",");
          }

          this.changeOwner();

          this.myTemplate.nAppDis = res.data.diseaseId;
          this.myTemplate.nPinYinCode = res.data.inputCode1;
          this.myTemplate.nWuBiCode = res.data.inputCode2;
          this.myTemplate.nMemCode = res.data.inputCode3;
          this.myTemplate.nNumber = res.data.number;
          this.myTemplate.nDescription = res.data.description;
          this.myTemplate.uBasicTemplateId = res.data.basicTemplateId;
          this.myTemplate.uDataVersion = res.data.dataVersion;
          this.myTemplate.nPaperType = res.data.paperType;
          this.dialogVisible = true;
          if (res.data.basicTemplateStatus != "0") {
            this.vDisabled = true;
            this.viewModel = true;
            this.editModel = false;
          } else {
            this.viewModel = false;
            this.editModel = true;
          }
        } else {
          this.$message.error("获取明细失败!");
        }
      });
    },
    //启用
    async enable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.basicTemplateStatus;
        if (status == "1") {
          this.$message.error(
            index.basicTemplateName + "已启用，不能再次启用!"
          );
          return;
        } else if (status != "0" && status != "2") {
          this.$message.error(index.basicTemplateName + "状态不正确不能启用!");
          return;
        }
        let data = {
          basicTemplateId: index.basicTemplateId,
          basicTemplateStatus: index.basicTemplateStatus,
          dataVersion: index.dataVersion
        };
        arr.push(data);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) return;

      setEnable(arr)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              message: "启用成功!",
              type: "success"
            });
            this.query();
          } else {
            this.$message.error("启用失败!" + res.msg);
          }
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: res.msg
          });
        });
    },
    //停用
    async disable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.basicTemplateStatus;
        if (status == "2") {
          this.$message.error(
            index.basicTemplateName + "已停用，不能再次停用!"
          );
          return;
        } else if (status != "1") {
          this.$message.error(
            index.basicTemplateName + "状态不正确，不能停用!"
          );
          return;
        }
        let data = {
          basicTemplateId: index.basicTemplateId,
          basicTemplateStatus: index.basicTemplateStatus,
          dataVersion: index.dataVersion
        };
        arr.push(data);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) return;

      setDisable(arr)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              message: "停用成功!",
              type: "success"
            });
            this.query();
          } else {
            this.$message.error("停用失败!" + res.msg);
          }
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: res.msg
          });
        });
    },
    //对话框关闭
    dialogClose() {
      this.vDisabled = false;
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    async handleRemove() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];

      for (let item of this.selection) {
        if (item.basicTemplateStatus != "0") {
          this.$message.error(
            item.basicTemplateName + "不是新建状态，不能删除！"
          );
          return;
        }
        arr.push(item.basicTemplateId);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) return;

      this.handleDelete(arr);
    },
    handleDelete(arr) {
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete(arr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除
    delete(delArr) {
      remove(delArr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "删除成功!",
            type: "success"
          });
          this.clearCondition();
          this.query();
        } else {
          this.$message.error("删除失败!");
        }
      });
    },

    //确定
    handleDetermine() {
      if (this.myTemplate.nTempName === "") {
        this.$message.error("模板名称不可为空!");
        return;
      }
      if (this.myTemplate.nInsType === "") {
        this.$message.error("文书类型不可为空!");
        return;
      }
      let data = {
        basicTemplateCode: this.nTemplateCode,
        basicTemplateName: this.myTemplate.nTempName,
        typeCode: this.myTemplate.nInsType,
        dnFlag: this.myTemplate.nDnFlag,
        visitType: this.myTemplate.nAdmType,
        scopeLevel: this.myTemplate.scopeLevel,
        ownerId: this.myTemplate.nOwnName.join(","),
        paperType: this.myTemplate.nPaperType,
        diseaseId:
          this.myTemplate.nAppDis == null ? "" : this.myTemplate.nAppDis,
        inputCode1: this.myTemplate.nPinYinCode,
        inputCode2: this.myTemplate.nWuBiCode,
        inputCode3: this.myTemplate.nMemCode,
        number: this.myTemplate.nNumber,
        description: this.myTemplate.nDescription,
        basicTemplateId: this.myTemplate.uBasicTemplateId,
        dataVersion: this.myTemplate.uDataVersion
      };

      if (this.myTemplate.uBasicTemplateId == "") {
        save(data)
          .then(res => {
            if (res.code === 1) {
              this.dialogVisible = false;
              this.$message.success("操作成功");
              this.clearCondition();
              let data1 = {
                ...this.pageParams
              };
              getPage(data1).then(res => {
                if (res.code === 1) {
                  this.tempTable = res.data;
                  this.setSelectRow(data);
                  this.openV();
                  this.init();
                } else {
                  this.$message.error("获取数据失败");
                }
              });
            } else {
              this.$message.error("操作失败!" + res.msg);
            }
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
          });
      } else {
        update(data.basicTemplateId, data)
          .then(res => {
            if (res.code === 1) {
              this.dialogVisible = false;
              this.$message.success("操作成功");
              this.clearCondition();
              this.query();
              this.init();
            } else {
              this.$message.error("操作失败：" + res.msg);
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
    setSelectRow(data) {
      this.tempTable.forEach((item, index) => {
        if (item.basicTemplateCode == data.basicTemplateCode) {
          this.$refs.tempTable.clearSelection();

          this.$refs.tempTable.toggleRowSelection(this.tempTable[index], true);
        }
      });
    },
    //取消
    handleCancel() {
      this.init();
      this.dialogVisible = false;
    },
    init() {
      this.nTemplateCode = "";
      this.myTemplate.nTempName = "";
      this.myTemplate.nInsType = "";
      this.myTemplate.nDnFlag = "";
      this.myTemplate.nAdmType = "";
      this.myTemplate.scopeLevel = "0";

      this.myTemplate.nPaperType = "";
      this.myTemplate.nAppDis = "";
      this.myTemplate.nPinYinCode = "";
      this.myTemplate.nWuBiCode = "";
      this.myTemplate.nMemCode = "";
      this.myTemplate.nNumber = "";
      this.myTemplate.nDescription = "";
      this.myTemplate.uBasicTemplateId = "";
      this.myTemplate.uDataVersion = "";
    },

    // 就诊类别下拉事件
    changeVisitType() {
      this.typeRemoteParams = {
        visitType: this.myTemplate.nAdmType,
        dnFlag: this.myTemplate.nDnFlag
      };
    },
    //文书类型下拉事件
    changeTypeCode() {
      if (this.myTemplate.nInsType != "") {
        let data = { typeCode: this.myTemplate.nInsType };
        getTypeByCode(data).then(res => {
          if (res.code === 1) {
            this.myTemplate.nDnFlag = res.data.dnFlag;
            this.myTemplate.nAdmType = res.data.visitType;
          } else {
            this.$message.error("获取文书类型失败");
          }
        });
      } else {
        this.myTemplate.nDnFlag = "";
        this.myTemplate.nAdmType = "";
      }
    },
    //医护标识下拉事件
    changeDnFlag() {
      this.myTemplate.nInsType = "";
      this.typeRemoteParams = {
        visitType: this.myTemplate.nAdmType,
        dnFlag: this.myTemplate.nDnFlag
      };
    },
    //复制模板
    copy() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        arr.push(index.basicTemplateId);
      }
      copy(arr).then(res => {
        if (res.code === 1) {
          this.$message.success("操作成功");
          this.clearCondition();
          this.query();
        } else {
          this.$message.error("复制失败");
        }
      });
    },
    changeDept() {
      if (this.deptVal.length > 0) {
        if (this.level1 == false) {
          this.level1 = true;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["role"]),
    vDisabledForFirstOrNo: function() {
      return this.vDisabled || this.vDisabledByVisitType;
    }
  }
};
</script>

<style scoped lang="scss">
.hd-container {
  overflow: hidden;

  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }

  .el-tabs {
    height: 100%;
  }

  .left {
    height: 100%;
    width: 246px;
    float: left;
    background-color: #ffffff;
  }

  .right {
    height: 100%;
    margin-left: 254px;
    background-color: #ffffff;
    position: relative;

    .search-con {
      width: 100%;

      .search-main {
        width: calc(100% - 160px);
      }
    }

    .common-width {
      margin-right: 10px;
      display: inline-block;
      width: 240px;
    }

    .special-item {
      width: 460px;
    }

    .height-bottom {
      background: #ffffff;
      position: absolute;
      left: 0px;
      z-index: 100;
      width: 100%;
      height: 100%;
      transition: all 0.5s;

      .top {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        position: relative;

        .btn-position {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }
    }
  }

  .axEditor-demo {
    width: 100%;
    height: calc(100% - 60px);

    .editor-left {
      height: 100%;
      margin-right: 320px;
    }

    .tool-right {
      float: right;
      width: 300px;
      height: 100%;
    }
  }
  .neccesarry-control:before {
    content: "*";
    color: #f56c6c;
    /*position: absolute;*/
    top: 2px;
    left: -8px;
  }
  .margin-top-10 {
    margin-top: 10px;
  }
}
</style>
